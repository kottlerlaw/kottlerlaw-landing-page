'use server'

import { after } from 'next/server'
import { EMAIL_LOGO_PNG_BASE64 } from './email-logo'
import { CONFIRMATION_SUBJECT, firmNotificationEmail, LOGO_CID, visitorConfirmationEmail } from './emails'

export type ContactField = 'first' | 'last' | 'phone' | 'email' | 'message' | 'consent'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<ContactField, string>>
  values?: Partial<Record<Exclude<ContactField, 'consent'>, string>>
}

// Same rule browsers use for <input type="email">, plus a dot in the domain.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const PHONE_RE = /^[0-9+().\-\s]{7,25}$/
const GENERIC_ERROR = 'Something went wrong sending your request. Please call us at 888-300-2266.'

function read(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

// Microsoft Graph app-only token (client credentials), cached until shortly before it expires.
let cachedToken: { value: string; expiresAt: number } | undefined

type GraphCredentials = { tenantId: string; clientId: string; clientSecret: string }

async function getGraphToken({ tenantId, clientId, clientSecret }: GraphCredentials) {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value

  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
    }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`Graph token ${res.status}: ${await res.text()}`)

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 }
  return data.access_token
}

type GraphMessage = {
  subject: string
  body: { contentType: 'HTML'; content: string }
  toRecipients: { emailAddress: { address: string } }[]
  replyTo: { emailAddress: { name?: string; address: string } }[]
  attachments: {
    '@odata.type': '#microsoft.graph.fileAttachment'
    name: string
    contentType: string
    contentBytes: string
    isInline: true
    contentId: string
  }[]
}

// The logo travels as an inline (CID) attachment, so it shows without a hosted image URL.
const LOGO_ATTACHMENT: GraphMessage['attachments'][number] = {
  '@odata.type': '#microsoft.graph.fileAttachment',
  name: 'kottler-logo.png',
  contentType: 'image/png',
  contentBytes: EMAIL_LOGO_PNG_BASE64,
  isInline: true,
  contentId: LOGO_CID,
}

const GRAPH = 'https://graph.microsoft.com/v1.0'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// One Graph request. Immutable IDs keep a message's ID the same when it moves from Drafts
// to Sent Items, which the same-thread confirmation relies on. A 401 means the cached token
// was revoked (e.g. secret rotated), so drop it and retry once with a fresh one.
async function graph(creds: GraphCredentials, method: string, path: string, body?: unknown) {
  const call = async () =>
    fetch(`${GRAPH}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${await getGraphToken(creds)}`,
        'Content-Type': 'application/json',
        Prefer: 'IdType="ImmutableId"',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    })

  const res = await call()
  if (res.status !== 401) return res
  await res.body?.cancel()
  cachedToken = undefined
  return call()
}

async function ok(res: Response, what: string) {
  if (!res.ok) throw new Error(`Graph ${what} ${res.status}: ${await res.text()}`)
  return res
}

const mailbox = (from: string) => `/users/${encodeURIComponent(from)}`
const messagePath = (from: string, id: string) => `${mailbox(from)}/messages/${encodeURIComponent(id)}`

// Sends without keeping a copy. Needs only Mail.Send.
async function sendMail(creds: GraphCredentials, from: string, message: GraphMessage) {
  return graph(creds, 'POST', `${mailbox(from)}/sendMail`, { message, saveToSentItems: false })
}

// Graph can reject a visitor address our regex accepted. Don't lose the lead over it:
// try again without Reply-To (the address is still in the body).
async function withReplyToFallback(mail: GraphMessage, attempt: (mail: GraphMessage) => Promise<Response>) {
  const res = await attempt(mail)
  if (res.status !== 400 || !mail.replyTo.length) return res
  console.warn(`Contact form: Graph rejected the message, retrying without Reply-To: ${await res.text()}`)
  return attempt({ ...mail, replyTo: [] })
}

// Sends the lead to the firm. When the app has Mail.ReadWrite, the lead goes out as a saved
// draft so it lands in Sent Items, and its ID is returned for the confirmation to reply to.
// Without that permission (or if the draft route fails) it falls back to sendMail and
// returns undefined.
async function sendLead(creds: GraphCredentials, from: string, mail: GraphMessage) {
  const draft = await withReplyToFallback(mail, (m) => graph(creds, 'POST', `${mailbox(from)}/messages`, m))
  if (draft.ok) {
    const { id } = (await draft.json()) as { id: string }
    try {
      await ok(await graph(creds, 'POST', `${messagePath(from, id)}/send`), 'send')
      return id
    } catch (err) {
      console.error('Contact form: sending the lead draft failed, falling back to sendMail', err)
      await graph(creds, 'DELETE', messagePath(from, id)).then((r) => r.body?.cancel(), () => {})
    }
  } else if (draft.status === 403) {
    console.warn('Contact form: no Mail.ReadWrite permission, so the confirmation is sent as a separate email')
    await draft.body?.cancel()
  } else {
    console.error(`Contact form: creating the lead draft failed, falling back to sendMail: ${draft.status} ${await draft.text()}`)
  }

  await ok(await withReplyToFallback(mail, (m) => sendMail(creds, from, m)), 'sendMail')
  return undefined
}

// Replies to the lead's Sent Items copy, so the confirmation shares its conversation in the
// firm's mailbox. The reply's body, subject and recipients are replaced entirely, so the
// visitor never sees the internal lead email.
async function replyInThread(creds: GraphCredentials, from: string, leadId: string, confirmation: GraphMessage) {
  // The lead stays a draft until it has actually gone out, which can take a few seconds.
  for (let attempt = 0; ; attempt++) {
    const res = await ok(await graph(creds, 'GET', `${messagePath(from, leadId)}?$select=isDraft`), 'get lead')
    const { isDraft } = (await res.json()) as { isDraft: boolean }
    if (!isDraft) break
    if (attempt === 10) throw new Error('Lead was still a draft after waiting')
    await sleep(2000)
  }

  const created = await ok(await graph(creds, 'POST', `${messagePath(from, leadId)}/createReply`), 'createReply')
  const { id } = (await created.json()) as { id: string }
  try {
    const { attachments, ...fields } = confirmation
    await ok(await graph(creds, 'PATCH', messagePath(from, id), { ...fields, ccRecipients: [], bccRecipients: [] }), 'update reply')

    // A reply can carry over the original's inline images. Add the logo only if it isn't there yet.
    const existing = await ok(await graph(creds, 'GET', `${messagePath(from, id)}/attachments?$select=contentId`), 'list attachments')
    const { value } = (await existing.json()) as { value: { contentId?: string }[] }
    for (const attachment of attachments) {
      if (value.some((a) => a.contentId === attachment.contentId)) continue
      await ok(await graph(creds, 'POST', `${messagePath(from, id)}/attachments`, attachment), 'add attachment')
    }

    await ok(await graph(creds, 'POST', `${messagePath(from, id)}/send`), 'send reply')
  } catch (err) {
    await graph(creds, 'DELETE', messagePath(from, id)).then((r) => r.body?.cancel(), () => {})
    throw err
  }
}

async function sendConfirmation(creds: GraphCredentials, from: string, leadId: string | undefined, confirmation: GraphMessage) {
  if (leadId) {
    try {
      await replyInThread(creds, from, leadId, confirmation)
      return
    } catch (err) {
      console.error('Contact form: same-thread confirmation failed, sending it as a separate email', err)
    }
  }
  await ok(await sendMail(creds, from, confirmation), 'sendMail')
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (read(formData, 'company')) return { status: 'success' }

  const values = {
    first: read(formData, 'first'),
    last: read(formData, 'last'),
    phone: read(formData, 'phone'),
    email: read(formData, 'email'),
    message: read(formData, 'message'),
  }
  const { first, last, phone, email, message } = values

  const errors: ContactState['errors'] = {}
  if (!first || first.length > 80) errors.first = 'Please enter your first name.'
  if (!last || last.length > 80) errors.last = 'Please enter your last name.'
  if (!PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number.'
  if (email && (!EMAIL_RE.test(email) || email.length > 200)) errors.email = 'Please enter a valid email address.'
  if (message.length > 5000) errors.message = 'Please keep your message under 5000 characters.'
  if (!formData.get('consent')) errors.consent = 'Please agree to be contacted.'
  if (Object.keys(errors).length) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors, values }
  }

  const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MAIL_FROM, CONTACT_TO } = process.env
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET || !MAIL_FROM) {
    console.error('Contact form: MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET / MAIL_FROM are not set')
    return { status: 'error', message: GENERIC_ERROR, values }
  }

  const name = `${first} ${last}`
  const creds = { tenantId: MS_TENANT_ID, clientId: MS_CLIENT_ID, clientSecret: MS_CLIENT_SECRET }
  // CONTACT_TO may list several inboxes, separated by commas.
  const recipients = (CONTACT_TO || MAIL_FROM).split(',').map((s) => s.trim()).filter(Boolean)
  const mail: GraphMessage = {
    subject: `New case consultation request from ${name}`,
    body: { contentType: 'HTML', content: firmNotificationEmail(values) },
    toRecipients: recipients.map((address) => ({ emailAddress: { address } })),
    replyTo: email ? [{ emailAddress: { name, address: email } }] : [],
    attachments: [LOGO_ATTACHMENT],
  }

  let leadId: string | undefined
  try {
    leadId = await sendLead(creds, MAIL_FROM, mail)
  } catch (err) {
    console.error('Contact form: failed to send email', err)
    return { status: 'error', message: GENERIC_ERROR, values }
  }

  // The firm has the lead now. The visitor's confirmation is a courtesy, sent after the
  // response so the form doesn't wait on it. A failure is only logged.
  if (email) after(async () => {
    try {
      await sendConfirmation(creds, MAIL_FROM, leadId, {
        subject: CONFIRMATION_SUBJECT,
        body: { contentType: 'HTML', content: visitorConfirmationEmail({ first }) },
        toRecipients: [{ emailAddress: { address: email } }],
        // Replies reach the firm's inbox rather than the sending mailbox.
        replyTo: recipients.map((address) => ({ emailAddress: { address } })),
        attachments: [LOGO_ATTACHMENT],
      })
    } catch (err) {
      console.error('Contact form: failed to send confirmation email', err)
    }
  })

  return { status: 'success' }
}
