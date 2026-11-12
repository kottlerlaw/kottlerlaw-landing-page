// HTML emails for the contact form, styled like the site (navy, gold, cream,
// Libre Caslon Display + DM Sans). Email clients ignore most CSS, so everything is
// table layout with inline styles. Every visitor-supplied value must go through esc().

export const LOGO_CID = 'kottler-logo'

const NAVY = '#101c32'
const NAVY_DARK = '#0a1425'
const INK = '#14213a'
const BODY = '#46526a'
const GOLD = '#d9a441'
const GOLD_LIGHT = '#f0cf86'
const GOLD_TEXT = '#7a520c'
const CREAM = '#f6f2e9'
const SERIF = "'Libre Caslon Display', Georgia, 'Times New Roman', serif"
const SANS = "'DM Sans', Arial, Helvetica, sans-serif"

const PHONE_DISPLAY = '888-300-2266'
const PHONE_HREF = 'tel:8883002266'

export function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0">
  <tr><td bgcolor="${GOLD}" style="border-radius:2px">
    <a href="${href}" style="display:inline-block;padding:16px 28px;font-family:${SANS};font-size:18px;font-weight:700;color:${NAVY};text-decoration:none">${label}</a>
  </td></tr>
</table>`
}

function eyebrow(text: string) {
  return `<p style="margin:0 0 12px;font-family:${SANS};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${GOLD_TEXT}">${text}</p>`
}

function heading(text: string) {
  return `<h1 style="margin:0;font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:400;color:${INK}">${text}</h1>`
}

function paragraph(html: string) {
  return `<p style="margin:18px 0 0;font-family:${SANS};font-size:17px;line-height:1.65;color:${BODY}">${html}</p>`
}

function layout({ preheader, content }: { preheader: string; content: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Libre+Caslon+Display&display=swap" rel="stylesheet">
<title>Kottler &amp; Kottler</title>
</head>
<body style="margin:0;padding:0;background:${CREAM}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CREAM}" style="background:${CREAM}">
<tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
    <tr><td bgcolor="${GOLD}" align="center" style="padding:10px 16px;font-family:${SANS};font-size:13px;font-weight:700;color:${NAVY}">
      No fee unless we win &middot; Free consultation &middot; Available 24/7 &middot; Habla Espa&ntilde;ol
    </td></tr>
    <tr><td bgcolor="${NAVY}" align="center" style="padding:32px 24px">
      <img src="cid:${LOGO_CID}" width="210" height="51" alt="Kottler &amp; Kottler Attorneys at Law" style="display:block;border:0;color:#ffffff;font-family:${SERIF};font-size:24px">
    </td></tr>
    <tr><td bgcolor="#ffffff" style="padding:40px 36px;border-top:4px solid ${GOLD}">
      ${content}
    </td></tr>
    <tr><td bgcolor="${NAVY_DARK}" style="padding:32px 36px">
      <a href="${PHONE_HREF}" style="font-family:${SERIF};font-size:28px;color:${GOLD_LIGHT};text-decoration:none">${PHONE_DISPLAY}</a>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:#d6d9e0">6420 Wilshire Boulevard, Penthouse<br>Los Angeles, CA 90048-5562<br>Fax: 213-387-2889</p>
      <p style="margin:18px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;color:#a9b0bd">Kottler &amp; Kottler. Attorney advertising. Prior results do not guarantee a similar outcome.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

export type Inquiry = { first: string; last: string; phone: string; email: string; message: string }

// Sent to the firm's inbox for every inquiry.
export function firmNotificationEmail({ first, last, phone, email, message }: Inquiry) {
  const name = `${first} ${last}`
  const telHref = `tel:${phone.replace(/[^0-9+]/g, '')}`
  const rows: [string, string][] = [
    ['Name', esc(name)],
    ['Phone', `<a href="${esc(telHref)}" style="color:${INK};font-weight:700">${esc(phone)}</a>`],
    ['Email', email ? `<a href="mailto:${esc(email)}" style="color:${INK};font-weight:700">${esc(email)}</a>` : '&mdash;'],
  ]
  const details = rows
    .map(
      ([label, value]) => `<tr>
  <td style="padding:12px 0;border-bottom:1px solid #e6e1d6;font-family:${SANS};font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GOLD_TEXT};width:90px;vertical-align:top">${label}</td>
  <td style="padding:12px 0;border-bottom:1px solid #e6e1d6;font-family:${SANS};font-size:17px;color:${INK}">${value}</td>
</tr>`,
    )
    .join('')

  return layout({
    preheader: esc(`${name} · ${phone}`),
    content: `${eyebrow('New case consultation request')}
${heading(esc(name))}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px">${details}</table>
<p style="margin:28px 0 0;font-family:${SANS};font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GOLD_TEXT}">What happened</p>
<div style="margin-top:10px;padding:18px 20px;background:${CREAM};border-left:4px solid ${GOLD};font-family:${SANS};font-size:17px;line-height:1.65;color:${INK};white-space:pre-wrap">${esc(message || '(No details provided)')}</div>
${button(esc(telHref), `Call ${esc(first)}`)}`,
  })
}

// Sent to the visitor when they leave an email address. Only their first name is echoed
// back: repeating the message would let anyone use the form to send arbitrary text to any address.
export function visitorConfirmationEmail({ first }: Pick<Inquiry, 'first'>) {
  const checks = ['Free initial consultation', 'No fee unless we win a recovery for you', 'Habla Español']
    .map(
      (t) => `<tr><td style="padding:6px 12px 6px 0;font-family:${SANS};font-size:17px;color:${GOLD};vertical-align:top">&#10003;</td><td style="padding:6px 0;font-family:${SANS};font-size:17px;color:${INK}">${esc(t)}</td></tr>`,
    )
    .join('')

  return layout({
    preheader: 'We received your request. A member of our team will contact you shortly.',
    content: `${eyebrow('Free consultation')}
${heading(`Thank you, ${esc(first)}.`)}
${paragraph('We received your request. A member of our team will contact you shortly.')}
${paragraph(`If it is urgent, call us at <a href="${PHONE_HREF}" style="color:${INK};font-weight:700;white-space:nowrap">${PHONE_DISPLAY}</a>.`)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-top:1px solid #e6e1d6;padding-top:12px">${checks}</table>
${button(PHONE_HREF, `Call ${PHONE_DISPLAY}`)}
<p style="margin:28px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;color:${BODY}">Submitting the form does not create an attorney-client relationship. You are receiving this email because this address was entered on our case consultation form. If that wasn't you, you can ignore this message.</p>`,
  })
}
