'use server'

export type ContactField = 'first' | 'last' | 'phone' | 'email' | 'message' | 'consent'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<ContactField, string>>
  values?: Partial<Record<Exclude<ContactField, 'consent'>, string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+().\-\s]{7,25}$/
const GENERIC_ERROR = 'Something went wrong sending your request. Please call us at 888-300-2266.'

function read(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Microsoft Graph app-only token (client credentials), cached until shortly before it expires.
let cachedToken: { value: string; expiresAt: number } | undefined

async function getGraphToken(tenantId: string, clientId: string, clientSecret: string) {
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
  const rows: [string, string][] = [
    ['Name', name],
    ['Phone', phone],
    ['Email', email || '—'],
  ]
  const body = message || '(No details provided)'

  try {
    const token = await getGraphToken(MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET)
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAIL_FROM)}/sendMail`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            subject: `New case consultation request from ${name}`,
            body: {
              contentType: 'HTML',
              content: `${rows.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join('')}
<p><strong>What happened:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(body)}</p>`,
            },
            toRecipients: [{ emailAddress: { address: CONTACT_TO || MAIL_FROM } }],
            replyTo: email ? [{ emailAddress: { name, address: email } }] : [],
          },
          saveToSentItems: false,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    )
    if (!res.ok) throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`)
  } catch (err) {
    console.error('Contact form: failed to send email', err)
    return { status: 'error', message: GENERIC_ERROR, values }
  }

  return { status: 'success' }
}
