# RealHive Consultants Website

The marketing site for [RealHive Consultants](https://realhiveconsultants.com): company pages, services, portfolio, careers and a contact form, plus a small set of API routes for enquiries, newsletter sign-ups, user accounts and M-Pesa payments.

## Tech stack

- **Next.js 16** (App Router) on **React 19**, Node **24.x**
- **Tailwind CSS v4** with shadcn/ui-style components (Radix primitives)
- **MongoDB** via Mongoose
- **Nodemailer** (Gmail SMTP) for outgoing email
- **Cloudinary** (`next-cloudinary`) for blog images and transformations
- **TipTap** rich-text editor (stores Markdown) in the admin; **react-markdown** + Tailwind Typography to render posts
- **next-themes** for light/dark mode, **motion** for animation
- Deployed on **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

| Script          | What it does              |
| --------------- | ------------------------- |
| `npm run dev`   | Start the dev server      |
| `npm run build` | Production build          |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint                |
| `npm run create-admin -- <email>` | Create or reset an admin account |
| `npm run seed-blog` | Upload the sample covers to Cloudinary and create/update the 5 sample posts |

## Environment variables

Every variable is documented in [.env.example](.env.example). In short:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | JWT signing secrets |
| `SENDER_EMAIL`, `EMAIL_PASSWORD` | Gmail address and App Password for SMTP |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for SEO (production domain) |
| `CLIENT_URL` | Base URL for links in emails (password reset) |
| `CLOUDINARY_URL` | Cloudinary credentials (`cloudinary://key:secret@cloud`); needed at build time |
| `MPESA_CONSUMER_KEY`, `MPESA_SECRET_KEY`, `MPESA_PAYBILL`, `MPESA_PASSKEY` | Safaricom Daraja credentials |

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, services overview, newsletter sign-up |
| `/aboutus` | About the company and team |
| `/services` | Services, FAQs and published testimonials |
| `/portfolio` | Past projects |
| `/quote` | Instant "starting from" quote in the visitor's currency: pick services, MVP or production-grade, mobile OS etc.; download or email the PDF |
| `/book` | Book a free consultation: pick an available slot (shown in the visitor's time zone) and get a confirmation email |
| `/blog` | Blog: published AI, tech and programming posts |
| `/blog/[slug]` | A post, with comments (signed-in users can comment) |
| `/careers` | Open roles |
| `/contacts` | Contact form (sends an enquiry email) |
| `/privacy-policy` | Privacy policy |
| `/admin` | Private dashboard listing newsletter subscribers (admin login required) |
| `/login`, `/register`, `/forgot-password` | Website accounts for blog commenters (noindex) |
| `/admin/blog` | Write, edit, publish and delete posts; moderate comments (admin login required) |
| `/admin/calendar` | Consultation calendar: upcoming bookings (with a one-click Google Calendar link), working hours, call length, notice, booking window, blocked days |
| `/admin/quotes` | Quote requests visitors emailed to themselves (sales leads) |
| `/admin/testimonials` | Add, edit, publish and delete testimonials (admin login required) |
| `/admin/login` | Admin sign-in |
| `/admin/forgot-password` | Admin password reset (emailed 6-digit code), returning to `/admin/login` |

Common alternate paths (`/about`, `/contact`, `/jobs`, …) permanently redirect to these; see [next.config.js](next.config.js).

## API routes

All under `src/app/api/`.

### Alert
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/alert` | Emails a contact-form enquiry (`name`, `email`, `message`, `phoneNumber`) to the team |

### Newsletter
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/subscribe` | Adds `email` to the newsletter. `201` new, `200` re-subscribed, `409` already subscribed, `422` invalid email |
| DELETE | `/api/subscribe/[email]` | Unsubscribes by deleting the subscriber. `200` deleted, `404` not found, `422` invalid email. URL-encode the email (`encodeURIComponent`) |

### Admin
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/admin/login` | Admin sign-in (`email`, `password`). Sets an httpOnly session cookie valid for 8 hours |
| POST | `/api/admin/logout` | Clears the admin session cookie |

### Testimonials
| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/testimonials` | Published testimonials, sorted by `order`. Admins can add `?all=true` to include drafts |
| POST | `/api/testimonials` | Create a testimonial (admin) |
| PUT | `/api/testimonials/[id]` | Update any of its fields (admin) |
| DELETE | `/api/testimonials/[id]` | Delete it (admin) |

Fields: `name` and `quote` (required), `role`, `company`, `avatarPublicId` (Cloudinary public ID of the photo, uploaded from the admin panel; `""` removes it), `published` (default `false`), `order` (lower shows first). Admin routes use the dashboard session cookie and return `401` without it. Changes refresh `/services` straight away.

### Quotes
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/quote/estimate` | Live estimate for `{ selection }`: final local amounts only (no country, tier or USD) |
| POST | `/api/quote/pdf` | Returns the quotation PDF for `{ selection, contact? }`. Nothing is stored |
| POST | `/api/quote/email` | Emails the PDF to `contact.email` (name and email required), saves the request as a lead and notifies the team. `429` after 3 per email or 5 per IP in an hour |

`selection` is `{ buildLevel: "mvp" \| "production", services: { [serviceId]: { [field]: optionId \| optionId[] } } }`, using the ids in `src/lib/quote/catalog.js`.

### Consultations
| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/booking/slots` | Available slot start times (UTC ISO strings) and the call length |
| POST | `/api/booking` | Book `{ startsAt, name, email, company?, topic, timezone? }`. Only an offered slot can be booked. `409` if it's taken (also when two people book it at once), `429` after 2 upcoming bookings per email or 5 bookings per IP per day |
| POST | `/api/booking/cancel` | Cancel with `{ token }` from the visitor's confirmation email |
| GET / PUT | `/api/admin/calendar` | Read / replace the calendar settings (admin) |
| POST | `/api/admin/bookings/[id]/cancel` | Cancel a booking and email the visitor (admin) |

### Blog
| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/posts` | Published posts, newest first, without `content`. Admins can add `?all=true` to include drafts |
| POST | `/api/posts` | Create a post (admin). `slug` defaults to the title, slugified. `409` if the slug is taken |
| GET | `/api/posts/[id]` | One post with its Markdown `content`. Drafts are `404` unless you're an admin |
| PUT | `/api/posts/[id]` | Update any field (admin). Publishing the first time sets `publishedAt` |
| DELETE | `/api/posts/[id]` | Delete a post and its comments (admin) |
| GET | `/api/posts/[id]/comments` | Comments on a published post, oldest first |
| POST | `/api/posts/[id]/comments` | Add a comment, `{ "body" }` up to 2000 characters. Requires a signed-in, verified user (session cookie or mobile Bearer token) |
| DELETE | `/api/comments/[id]` | Delete a comment: its author, or an admin |
| POST | `/api/cloudinary/sign` | Signs Cloudinary uploads for the admin upload widget (admin) |

Post fields: `title`, `slug`, `excerpt`, `content` (Markdown; raw HTML is not rendered), `tags`, `coverImage: { publicId, alt }` (a Cloudinary public ID), `published`. Admin changes refresh `/blog`, the post and the sitemap straight away.

### Website session
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/session` | Sign in (`email`, `password`). Sets an httpOnly cookie valid for 30 days. `403` if the email isn't verified |
| GET | `/api/auth/session` | The signed-in user, or `null` |
| DELETE | `/api/auth/session` | Sign out |

This session is for commenting only. It never grants access to `/admin`, and the admin cookie doesn't count as a commenter session.

### Auth
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/users` | Register a user and email a verification code |
| GET | `/api/auth/users` | List users (no auth check) |
| PUT | `/api/auth/users` | Update your own `username`, `bio` or `profilePicture` (Bearer token). Other fields are ignored |
| DELETE | `/api/auth/users?id=` | Delete your own account, or any account if you are an Admin (Bearer token) |
| POST | `/api/auth/verify` | Verify an email with the 6-digit code |
| POST | `/api/auth/login` | Log in; returns access + refresh tokens |
| POST | `/api/auth/refresh` | Exchange a refresh token for a new access token |
| GET | `/api/auth/profile` | Current user's profile (Bearer token) |
| POST | `/api/auth/forgot-password` | Email a password-reset OTP |
| POST | `/api/auth/reset-password` | Reset the password with the OTP |

Access tokens last 15 minutes; refresh tokens last 365 days.

### M-Pesa
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/mpesa/stkpush` | Start an STK push payment prompt. Calls Safaricom's **production** endpoints. |

## Data models

In `src/models/`:

- **User**: email, username, hashed password (bcrypt, hashed on save), `role` (`"User"` by default, or `"Admin"`), verification and password-reset tokens.
- **Post**: title, unique slug, excerpt, Markdown content, cover image (Cloudinary public ID + alt), tags, author, `published`, `publishedAt`, timestamps.
- **Comment**: post, user, body (max 2000), timestamps.
- **Testimonial**: name, role, company, quote, `avatarPublicId` (Cloudinary photo), `published`, `order`, timestamps.
- **CalendarSettings** (one document): time zone, call length, minimum notice, booking window, weekly hours, blocked dates.
- **Booking**: reference, start/end (UTC), name, email, company, topic, visitor time zone, status (`confirmed`/`cancelled`), who cancelled and when, hashed cancel token, salted IP hash.
- **Quote**: reference, contact details and notes, country (from IP; empty if undetected), tier, build level, selection, line items, local and USD amounts (`projectFrom`/`projectFromUsd`, `monthlyFrom`/`monthlyFromUsd`), currency and exchange rate, `weeksFrom`, salted IP hash (for rate limiting), timestamps.
- **Subscriber**: newsletter email (unique, lowercased), `isActive`, `unsubscribedAt`, timestamps.

## Admin dashboard

`/admin` lists every newsletter subscriber with sign-up date and status. `/admin/testimonials` manages the testimonials shown on `/services`; the section is hidden there until at least one is published. Only users whose `role` is `"Admin"` can sign in (every account defaults to `"User"`), and the role is re-checked on every request.

There are no default credentials. Create an admin with:

```bash
npm run create-admin -- you@example.com [username]
```

It prompts for a password (hidden, at least 12 characters), then creates a verified admin in the database from `MONGODB_URI` in `.env.local`. Running it again for the same email resets that password. To use it against production, run it with the production `MONGODB_URI`. Then sign in at `/admin/login`.

`/admin/blog` lists every post with its comment count. Posts are written in a **TipTap** rich-text editor: headings, bold/italic/strikethrough, inline code and code blocks, links, lists, quotes, tables and inline images, with a **Markdown** tab for editing the source directly. The editor loads and saves Markdown, so what's stored is plain Markdown and the public pages render it unchanged. Cover and inline images upload straight to Cloudinary (folders `realhive/blog` and `realhive/blog/inline`) through a signed upload widget. Each post's edit page also lists its comments for moderation.

Forgot your admin password? Use **Forgot password?** on `/admin/login`. It's the same emailed-code reset as website users, and it returns you to the admin sign-in.

`/admin` is excluded from search engines (`noindex` and `robots.txt`).

## Analytics and SEO

Progress against the SEO and analytics strategy is tracked in [docs/SEO-PROGRESS.md](docs/SEO-PROGRESS.md), including the account setup steps.

- **Google Analytics 4** loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (redeploy after changing it), in Consent Mode v2: advertising storage is always denied; analytics is off until consent for visitors in the EEA, UK and Switzerland, who see a consent banner (location from the Vercel IP header via `/api/consent-region`), and on by default elsewhere. "Cookie settings" in the footer reopens the banner.
- **Conversion events** (`book_consultation`, `quote_emailed`, `quote_downloaded`, `contact_form_submit`, `sign_up`, `contact_click`) are sent with `trackEvent()` from `src/lib/analytics.js`; never include personal data in them.
- **Search Console / Bing** verification meta tags come from `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` (optional; a DNS-verified domain property needs neither).
- **Vercel Speed Insights** reports real-user Core Web Vitals (cookie-free).

## Quotation system

`/quote` lets visitors pick services and options and see an instant estimate in **their own currency**. Every figure is a rounded-down **"starting from"** price, never an exact one, and the PDF says it's indicative and agreed after a discovery call.

- **Anonymous location pricing.** Prices depend on the visitor's country, but nothing a visitor can see says so. The page never asks for a country or mentions location, tiers or regions, and neither do the PDF and email. All pricing happens on the server: the browser only receives final local amounts (`publicQuote()`), and the price list, tiers and country data are `server-only` modules that never reach the browser bundle. Country and tier show up only in `/admin/quotes` and the team notification email.
- **Location** comes from the hosting platform's IP geolocation header (`x-vercel-ip-country` on Vercel). Anything the browser sends about location is ignored. If the location can't be detected (rare in production, always the case locally), the quote is in USD at the upper-middle tier.
- **Prices** are in `src/lib/quote/prices.js`, in USD for high-income markets; review and adjust them there. Each World Bank income group (`src/lib/quote/regions.js`) pays a share of that: high 100%, upper-middle 55%, lower-middle 35%, low 25%. Review the income groups each July, when the World Bank updates them.
- **Currency**: amounts are converted at current rates from ExchangeRate-API's open endpoint (no key, updated daily, cached for an hour; attribution shown on the page as its terms require) and rounded down to two significant figures, e.g. KES 36,000. If rates are unavailable, amounts stay in USD. The country → currency map is in `src/lib/quote/currency.js`.
- **Build level**: production-grade costs 1.7× and takes 1.6× longer (`LEVELS` in prices.js). Support plans are monthly and unaffected.
- **Timeline**: the longest service plus 40% of the others, since work runs partly in parallel.
- **PDFs** are generated with `pdf-lib` (`src/lib/quote/pdf.js`) and emailed with Nodemailer. Emailed quotes are saved (`Quote` model, with local and USD amounts and the exchange rate) and listed in `/admin/quotes`; the team gets a copy at `QUOTES_NOTIFY_EMAIL` (default `SENDER_EMAIL`).

## Blog
| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/posts` | Published posts, newest first, without `content`. Admins can add `?all=true` to include drafts |
| POST | `/api/posts` | Create a post (admin). `slug` defaults to the title, slugified. `409` if the slug is taken |
| GET | `/api/posts/[id]` | One post with its Markdown `content`. Drafts are `404` unless you're an admin |
| PUT | `/api/posts/[id]` | Update any field (admin). Publishing the first time sets `publishedAt` |
| DELETE | `/api/posts/[id]` | Delete a post and its comments (admin) |
| GET | `/api/posts/[id]/comments` | Comments on a published post, oldest first |
| POST | `/api/posts/[id]/comments` | Add a comment, `{ "body" }` up to 2000 characters. Requires a signed-in, verified user (session cookie or mobile Bearer token) |
| DELETE | `/api/comments/[id]` | Delete a comment: its author, or an admin |
| POST | `/api/cloudinary/sign` | Signs Cloudinary uploads for the admin upload widget (admin) |

Post fields: `title`, `slug`, `excerpt`, `content` (Markdown; raw HTML is not rendered), `tags`, `coverImage: { publicId, alt }` (a Cloudinary public ID), `published`. Admin changes refresh `/blog`, the post and the sitemap straight away.

### Website session
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/session` | Sign in (`email`, `password`). Sets an httpOnly cookie valid for 30 days. `403` if the email isn't verified |
| GET | `/api/auth/session` | The signed-in user, or `null` |
| DELETE | `/api/auth/session` | Sign out |

This session is for commenting only. It never grants access to `/admin`, and the admin cookie doesn't count as a commenter session.

### Auth
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/users` | Register a user and email a verification code |
| GET | `/api/auth/users` | List users (no auth check) |
| PUT | `/api/auth/users` | Update your own `username`, `bio` or `profilePicture` (Bearer token). Other fields are ignored |
| DELETE | `/api/auth/users?id=` | Delete your own account, or any account if you are an Admin (Bearer token) |
| POST | `/api/auth/verify` | Verify an email with the 6-digit code |
| POST | `/api/auth/login` | Log in; returns access + refresh tokens |
| POST | `/api/auth/refresh` | Exchange a refresh token for a new access token |
| GET | `/api/auth/profile` | Current user's profile (Bearer token) |
| POST | `/api/auth/forgot-password` | Email a password-reset OTP |
| POST | `/api/auth/reset-password` | Reset the password with the OTP |

Access tokens last 15 minutes; refresh tokens last 365 days.

### M-Pesa
| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/mpesa/stkpush` | Start an STK push payment prompt. Calls Safaricom's **production** endpoints. |

## Data models

In `src/models/`:

- **User**: email, username, hashed password (bcrypt, hashed on save), `role` (`"User"` by default, or `"Admin"`), verification and password-reset tokens.
- **Post**: title, unique slug, excerpt, Markdown content, cover image (Cloudinary public ID + alt), tags, author, `published`, `publishedAt`, timestamps.
- **Comment**: post, user, body (max 2000), timestamps.
- **Testimonial**: name, role, company, quote, `avatarPublicId` (Cloudinary photo), `published`, `order`, timestamps.
- **Quote**: reference, contact details and notes, country (from IP; empty if undetected), tier, build level, selection, line items, local and USD amounts (`projectFrom`/`projectFromUsd`, `monthlyFrom`/`monthlyFromUsd`), currency and exchange rate, `weeksFrom`, salted IP hash (for rate limiting), timestamps.
- **Subscriber**: newsletter email (unique, lowercased), `isActive`, `unsubscribedAt`, timestamps.

## Admin dashboard

`/admin` lists every newsletter subscriber with sign-up date and status. `/admin/testimonials` manages the testimonials shown on `/services`; the section is hidden there until at least one is published. Only users whose `role` is `"Admin"` can sign in (every account defaults to `"User"`), and the role is re-checked on every request.

There are no default credentials. Create an admin with:

```bash
npm run create-admin -- you@example.com [username]
```

It prompts for a password (hidden, at least 12 characters), then creates a verified admin in the database from `MONGODB_URI` in `.env.local`. Running it again for the same email resets that password. To use it against production, run it with the production `MONGODB_URI`. Then sign in at `/admin/login`.

`/admin/blog` lists every post with its comment count. Posts are written in a **TipTap** rich-text editor: headings, bold/italic/strikethrough, inline code and code blocks, links, lists, quotes, tables and inline images, with a **Markdown** tab for editing the source directly. The editor loads and saves Markdown, so what's stored is plain Markdown and the public pages render it unchanged. Cover and inline images upload straight to Cloudinary (folders `realhive/blog` and `realhive/blog/inline`) through a signed upload widget. Each post's edit page also lists its comments for moderation.

Forgot your admin password? Use **Forgot password?** on `/admin/login`. It's the same emailed-code reset as website users, and it returns you to the admin sign-in.

`/admin` is excluded from search engines (`noindex` and `robots.txt`).

## Quotation system

`/quote` lets visitors pick services and options and see an instant estimate. Every figure is a rounded-down **"starting from"** price, never an exact one, and the PDF says it's indicative and agreed after a discovery call.

- **Prices** live in `src/lib/quote/catalog.js`, in USD for high-income markets. **They are placeholders: set your real rates there.**
- **Location**: the visitor's country comes from the hosting platform's IP geolocation header (`x-vercel-ip-country` on Vercel). It maps to a World Bank income group in `src/lib/quote/regions.js` (high, upper-middle, lower-middle, low), and each group has a price multiplier (1.0 / 0.65 / 0.45 / 0.35 by default). When the country is detected, the server always uses it, so choosing another country can't lower the price. A country picker appears only when there's no location (e.g. local dev). Review the income groups each July, when the World Bank updates them.
- **Build level**: production-grade multiplies project prices by 1.9 and timelines by 1.7 (`BUILD_LEVELS`). Support plans are monthly and unaffected.
- **Timeline**: the longest service plus 40% of the others, since work runs partly in parallel.
- The same pricing code (`src/lib/quote/pricing.js`) runs in the browser for the live estimate and on the server for the PDF, so they always agree.
- **PDFs** are generated with `pdf-lib` (`src/lib/quote/pdf.js`) and emailed with Nodemailer. Emailed quotes are saved (`Quote` model) and listed in `/admin/quotes`; the team gets a copy at `QUOTES_NOTIFY_EMAIL` (default `SENDER_EMAIL`).

## Consultation bookings

"Book Consultation" (services page, footer) goes to `/book`, which shows the company calendar's free slots in the visitor's own time zone.

- **Availability** is managed in `/admin/calendar`: working hours per weekday, call length (15–90 min), minimum notice, how many days ahead people can book, and blocked days. Defaults: Monday–Friday 09:00–17:00 Africa/Nairobi, 30-minute calls, 12 hours' notice, 30 days ahead.
- **Booking** emails the visitor a confirmation with an `.ics` calendar file and a cancel link, and emails the team (`BOOKINGS_NOTIFY_EMAIL`, falling back to `QUOTES_NOTIFY_EMAIL`, then `SENDER_EMAIL`) a **Create in Google Calendar** link: it opens Google Calendar pre-filled with the time, details and the visitor as a guest, so you just add Google Meet and save to send the invite. The same link is on each booking in `/admin/calendar`.
- **No double-booking**: a slot is booked only if it's currently offered, and a unique database index on confirmed start times stops two simultaneous bookings of one slot.
- **Cancelling**: visitors use the link in their email (the team is told); admins cancel from `/admin/calendar` (the visitor is told, with a link to rebook). A cancelled slot becomes available again.

## Blog

Posts are written in Markdown and rendered with GitHub-flavoured extras (tables, task lists). Cover images are stored in Cloudinary and delivered through `CldImage` with transformations: cropped to the layout's aspect ratio around the image's focal point (`c_fill,g_auto`), with automatic format (AVIF/WebP) and quality. Each post's social card is generated by Cloudinary too: the cover at 1200×630, darkened, with the title overlaid as text.

`/blog` and each post are statically generated and refreshed on every admin change, with an hourly fallback. Comments load in the browser, so new comments appear immediately without regenerating the page. A missing or unpublished post shows the not-found page with `noindex`. Because the site's root `loading.jsx` streams every page, the status code is 200 rather than 404, which is Next.js's soft-404 behaviour.

To load the five sample posts (covers in `scripts/seed/blog-covers/`, content in `scripts/seed/blog-posts.mjs`):

```bash
npm run seed-blog
```

It needs an admin to exist (the posts are authored by the first admin) and is safe to re-run: posts are matched by slug and updated in place.

## Project structure

```
src/
  app/          pages, API routes, sitemap/robots/OG image
  components/   page sections and shared UI (ui/ holds shadcn primitives, admin/ the dashboard's client components)
  constants/    nav links, services, FAQs and other static content
  context/      theme provider
  db/           MongoDB connection
  lib/          SEO metadata, JSON-LD, email sending and templates, JWT helpers, admin session
  models/       Mongoose models
scripts/        one-off CLI scripts (create-admin, seed-blog) and seed data
```

## Deployment

The site deploys to Vercel. Set the environment variables above in the Vercel project, with `NEXT_PUBLIC_SITE_URL=https://realhiveconsultants.com` so canonical URLs point to the production domain rather than the `.vercel.app` origin.
