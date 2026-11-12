'use server'

import { after } from 'next/server'
import { EMAIL_LOGO_PNG_BASE64 } from './email-logo'
import { firmNotificationEmail, LOGO_CID, visitorConfirmationEmail } from './emails'

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

// Sends through Graph. A 401 means the cached token was revoked (e.g. secret rotated),
// so drop it and retry once with a fresh one.
async function graphSendMail(creds: GraphCredentials, from: string, message: GraphMessage) {
  const post = async () =>
    fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getGraphToken(creds)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, saveToSentItems: false }),
      signal: AbortSignal.timeout(15_000),
    })

  const res = await post()
  if (res.status !== 401) return res
  await res.body?.cancel()
  cachedToken = undefined
  return post()
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

  try {
    let res = await graphSendMail(creds, MAIL_FROM, mail)
    // Graph can reject a visitor address our regex accepted. Don't lose the lead over it:
    // send again without Reply-To (the address is still in the body).
    if (res.status === 400 && mail.replyTo.length) {
      console.warn(`Contact form: Graph rejected the message, retrying without Reply-To: ${await res.text()}`)
      res = await graphSendMail(creds, MAIL_FROM, { ...mail, replyTo: [] })
    }
    if (!res.ok) throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`)
  } catch (err) {
    console.error('Contact form: failed to send email', err)
    return { status: 'error', message: GENERIC_ERROR, values }
  }

  // The firm has the lead now. The visitor's confirmation is a courtesy, sent after the
  // response so the form doesn't wait on it. A failure is only logged.
  if (email) after(async () => {
    try {
      const res = await graphSendMail(creds, MAIL_FROM, {
        subject: 'We received your request | Kottler & Kottler',
        body: { contentType: 'HTML', content: visitorConfirmationEmail({ first }) },
        toRecipients: [{ emailAddress: { address: email } }],
        // Replies reach the firm's inbox rather than the sending mailbox.
        replyTo: recipients.map((address) => ({ emailAddress: { address } })),
        attachments: [LOGO_ATTACHMENT],
      })
      if (!res.ok) throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`)
    } catch (err) {
      console.error('Contact form: failed to send confirmation email', err)
    }
  })

  return { status: 'success' }
}
