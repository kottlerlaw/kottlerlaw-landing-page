# Kottler & Kottler

Landing page for Kottler & Kottler, a boutique, family-owned personal injury law firm in Los Angeles serving Southern California since 1968. It is a single page with a case consultation form that emails each inquiry to the firm through Microsoft 365 (Outlook), using the Microsoft Graph API.

## Design and content sources

- **Design:** the [Figma Make file](https://www.figma.com/make/FNu1Yi8zmbWh6E4vZd9bFt/Kottler---Kottler), version 3 (the default view). Its layout was modeled on [lawbrothers.com](https://lawbrothers.com/). The Figma text was never checked and may be placeholder copy, so use it for layout only.
- **Content (source of truth):** the firm's previous website, [kottlerpersonalinjuryattorney.com](https://kottlerpersonalinjuryattorney.com/). Every firm fact on the page (case results, attorneys, memberships, address, fax, phone, languages) must be traceable to it, unless the client has since changed it.
- **Client changes (Oct 2026):** no longer a Million Dollar Advocates Forum member; BBB seal added; address drops "Suite 2000" (now "Penthouse"); "Available 24/7" added back; the About photo is the firm's own conference room.
- **Practice area photos** are CC0 / public domain, found through [Openverse](https://openverse.org): car accident and dog bite from rawpixel, truck and pedestrian from StockSnap, slip-and-fall and wrongful death from the WordPress Photo Directory.
- **No attorney photos.** At the client's request, the site does not show photos of the attorneys.

### Open questions for the client

- Founding year: the site says 1968, but the previous site's FAQ says 1969.
- The contact section promises a response "within 1 hour, and always within 8 hours" (from the previous site). Confirm this is still accurate.
- Doug Kottler's previous bio was a single line. Request education and memberships if they should be listed.
- Reviews are hardcoded in `app/page.tsx`, copied word for word from Google and Yelp in Oct 2026. Update the ratings and counts there from time to time. The Yelp link is a Yelp search, because we don't have the business page URL yet.
- The BBB seal is cropped from the previous site's 2014 badge. Replace it with the current seal from the firm's BBB business profile.

### Content available for future sections

The previous site also has material that would need new sections: attorney credentials, six more case results, a grouped list of practice areas, and 25 FAQ answers. It blocks plain HTTP clients, so read it in a browser.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) with React 19
- [Tailwind CSS 4](https://tailwindcss.com)
- [Microsoft Graph](https://learn.microsoft.com/graph/api/user-sendmail) `sendMail` for the contact form, called with `fetch` (no SDK)
- [Bun](https://bun.sh) as the package manager and script runner

## Getting started

Requirements: Bun 1.4 or later.

```bash
bun install
cp .env.example .env.local   # then fill in the values below
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MS_TENANT_ID` | Yes | Directory (tenant) ID of the firm's Microsoft 365 organization. |
| `MS_CLIENT_ID` | Yes | Application (client) ID of the app registration that sends the emails. |
| `MS_CLIENT_SECRET` | Yes | Client secret **value** for that app registration (not the secret ID). |
| `MAIL_FROM` | Yes | Microsoft 365 mailbox the emails are sent from, e.g. `website@kottlerlaw.com`. |
| `CONTACT_TO` | No | Inbox that receives inquiries. Defaults to `MAIL_FROM`. |

A Microsoft 365 admin sets up the app registration once:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), go to **App registrations > New registration**. Name it (e.g. "Kottler website"), single tenant, no redirect URI.
2. On the app's **Overview** page, copy the **Application (client) ID** (`MS_CLIENT_ID`) and **Directory (tenant) ID** (`MS_TENANT_ID`).
3. Under **API permissions > Add a permission > Microsoft Graph > Application permissions**, add `Mail.Send`, then click **Grant admin consent**.
4. Under **Certificates & secrets > New client secret**, create a secret and copy its **Value** right away (`MS_CLIENT_SECRET`). It is shown only once. Note the expiry date: the form stops sending when the secret expires, so set a reminder to rotate it.
5. Limit the app to the sending mailbox. Without this, `Mail.Send` lets it send as any mailbox in the organization. In Exchange Online PowerShell:

   ```powershell
   New-ApplicationAccessPolicy -AppId <MS_CLIENT_ID> -PolicyScopeGroupId website@kottlerlaw.com -AccessRight RestrictAccess -Description "Kottler website contact form"
   ```

   Microsoft's newer alternative is [RBAC for Applications in Exchange Online](https://learn.microsoft.com/exchange/permissions-exo/application-rbac).

`.env.local` is gitignored. Never commit real credentials.

## Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server. |
| `bun run build` | Create a production build. |
| `bun run start` | Serve the production build. |
| `bun run lint` | Run ESLint. |
| `bunx tsc --noEmit` | Type-check the project. |

## Project structure

```
app/
├── page.tsx                 # Landing page sections (Server Component)
├── layout.tsx               # Root layout, fonts, metadata
├── globals.css              # Theme tokens and shared component classes
├── actions/
│   └── contact.ts           # Server Action: validates the form and sends the email
├── _components/
│   ├── LeadForm.tsx         # Case consultation form (Client Component, useActionState)
│   ├── SiteHeader.tsx       # Sticky header with mobile menu
│   └── site.tsx             # Shared constants (phone, nav) and PhoneIcon
└── assets/                  # Logo, photography, membership badges
```

`CLAUDE.md` and `AGENTS.md` hold instructions for AI coding agents working in this repo. `AGENTS.md` is maintained by `next dev`; don't edit its managed block by hand.

## Styling notes

- Tailwind CSS 4 utilities, plus a few shared classes (`.v2-btn`, `.v2-label`, `.v2-h2`, …) in `app/globals.css`. Those classes must stay inside `@layer base` or `@layer components`, or they will override Tailwind's responsive utilities.
- Fonts: DM Sans (body) and Libre Caslon Display (headings), loaded with `next/font`.
- Images are static imports rendered with `next/image`.

## Contact form

The page has two copies of the case consultation form, one in the hero and one in the contact section. Both submit to the `sendContactMessage` Server Action in `app/actions/contact.ts`, which:

- validates first name, last name, phone, optional email, message, and the consent checkbox on the server;
- returns field-level errors and keeps what the visitor entered when something goes wrong;
- silently drops submissions that fill the hidden honeypot field (`company`);
- sends the inquiry from `MAIL_FROM` to `CONTACT_TO` through Microsoft Graph, with Reply-To set to the visitor's email so staff can answer by replying.

If the Microsoft 365 credentials are missing or sending fails, the visitor is asked to call the firm and the error is logged on the server.

## Deployment

Any host that runs Next.js works, for example Vercel or a Node server running `bun run build && bun run start`. Set the environment variables above in the hosting provider's settings. The host must allow outbound HTTPS to `login.microsoftonline.com` and `graph.microsoft.com`.
