# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Marketing website for RealHive Consultants (realhiveconsultants.com). Next.js 16 App Router, React 19, Tailwind v4, MongoDB/Mongoose, deployed on Vercel. Node 24.x.

The site used to carry property listing/review APIs; those were removed. Don't reintroduce property or review code unless asked.

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build — run this to check changes compile
npm run lint    # ESLint
npm run create-admin -- you@example.com   # create/reset an admin (prompts for password)
npm run seed-blog                         # upload sample covers + upsert the 5 sample posts
```

There is no test suite.

## Layout

- `src/app/` — pages (`page.js`/`page.jsx`, each with a `loading.jsx`), `sitemap.js`, `robots.js`, `opengraph-image.js`
- `src/app/quote/` — instant quotation page (static; prices come from `/api/quote/estimate`)
- `src/app/book/` — consultation booking page (static; slots from `/api/booking/slots`). The visitor cancel page is `src/app/(account)/booking/cancel/`
- `src/app/blog/` — public blog list and `[slug]` post pages (ISR, `revalidate = 3600`)
- `src/app/(account)/` — `login`, `register`, `forgot-password` for website users (commenters); route group so it's excluded from the sitemap
- `src/app/admin/` — private dashboard: subscribers (`page.jsx`), `testimonials/`, `blog/` (list, `new`, `[id]` edit + comment moderation), and `login/`. Server components; they call `getAdmin()` and `redirect()` to `/admin/login` when it returns null
- `src/app/api/` — route handlers. Only these exist:
  - `alert/` — contact-form enquiry email
  - `subscribe/` — newsletter sign-up (Subscriber model); `subscribe/[email]/` — DELETE to unsubscribe
  - `posts/` — public GET (published); POST, and PUT/DELETE on `[id]`, admin-only. `posts/[id]/comments/` — public GET, POST needs `getSessionUser()`
  - `comments/[id]/` — DELETE by the comment's author or an admin
  - `auth/session/` — website sign-in/out (httpOnly `realhive_session` cookie)
  - `cloudinary/sign/` — signs admin upload-widget requests
  - `booking/` (book), `booking/slots/`, `booking/cancel/` (token from the visitor's email); `admin/calendar/` (settings) and `admin/bookings/[id]/cancel/`
  - `quote/estimate/` (live estimate, public shape), `quote/pdf/` (download) and `quote/email/` (email + save lead + notify team; rate-limited)
  - `testimonials/` — public GET (published only); POST, and PUT/DELETE on `[id]`, are admin-only via `getAdmin()`
  - `admin/` — `login` (sets the httpOnly session cookie) and `logout`. Admin password reset reuses `auth/forgot-password` + `auth/reset-password` via `/admin/forgot-password` (`ForgotPasswordForm` with `loginHref="/admin/login"`)
  - `auth/` — users, verify, login, refresh, profile, forgot-password, reset-password
  - `mpesa/stkpush/` — Safaricom Daraja STK push (production endpoints)
- `src/models/` — `UserModel.js`, `SubscriberModel.js`, `TestimonialModel.js`, `PostModel.js`, `CommentModel.js`, `QuoteModel.js`, `CalendarSettingsModel.js` (singleton), `BookingModel.js`
- `src/db/connectDB.js` — call `await connectDB()` in each handler before touching models
- `src/lib/` — `seo.js` (metadata), `schema.js` (JSON-LD), `emails.js` + `emailTemplates.js` (Nodemailer, Gmail SMTP), `generateTokens.js` (JWT + verification codes), `adminAuth.js` (admin session cookie, `getAdmin()`), `testimonials.js` (field allowlist, public query, revalidation), `blog.js` (post field allowlist/validation, cached public queries, `revalidateBlog()`), `session.js` (website user session, `getSessionUser()`), `slugify.js` (client-safe), `booking/` (`time.js` time-zone helpers and `slots.js` slot generation are pure/client-safe; `settings.js`, `server.js`, `actions.js` are server-only; `ics.js` builds the calendar attachment), `quote/` (client-safe: `catalog.js` services/options/labels with NO prices, `selection.js` validation, `format.js`; server-only: `prices.js`, `regions.js` income tiers, `currency.js` rates, `pricing.js`, `location.js`, `server.js`, `pdf.js`), `utils.js` (`cn`)
- `src/components/` — page sections; `ui/` holds shadcn primitives (accordion, button, dropdown-menu); `blog/` (BlogImage, Markdown, PostCard, Comments); `account/` (login/register/forgot forms); `admin/`
- `scripts/` — `create-admin.mjs`, `seed-blog.mjs`, and `seed/` (sample post content + cover PNGs)
- `src/constants/` — static content (nav, services, FAQs)

Path alias: `@/` → `src/`.

## Conventions

- **API routes**: export `POST`/`GET`/etc. as `async (request) => {}`. Errors are returned as `new NextResponse(message, { status })`; successes as `NextResponse.json({ message, success: true, ... }, { status })`. Use 422 for validation failures.
- **Models**: `mongoose.models.X || mongoose.model('X', XSchema)` to survive hot reload; enable `timestamps`. Mongoose is v9: middleware is promise-based, so hooks must not take or call `next()`. Use `returnDocument: "after"` rather than `new: true`.
- **Database errors**: `connectDB()` throws on failure (it must never `process.exit`). Data loaded for public pages should catch and fall back, as `getPublishedTestimonials()` does, so a build or page still renders without the DB.
- **Auth**: Bearer access token in the `Authorization` header, verified with `ACCESS_TOKEN_SECRET`. Access tokens 15m, refresh tokens 365d.
- **Roles**: `ROLES` in `UserModel.js` — `"User"` (default) or `"Admin"`. Compare against `ROLES.ADMIN`, never a string literal. Admins are made with `npm run create-admin`; no API may set `role`, so `PUT /api/auth/users` only accepts an allowlist of profile fields.
- **Admin**: Admin pages and any admin-only API must call `getAdmin()` from `@/lib/adminAuth` — it verifies the cookie JWT and re-reads the role from the DB. Keep `/admin` noindexed and disallowed in `robots.js`; never add it to the sitemap.
- **Client forms**: `axios` for requests, `react-toastify` for feedback (each page/section that toasts renders its own `<ToastContainer />`).
- **Sessions**: two separate cookies. `realhive_admin` (adminAuth.js, 8h, SameSite=strict) gates `/admin` and admin APIs; `realhive_session` (session.js, 30d, SameSite=lax) identifies commenters. Neither grants the other's access. `getSessionUser()` also accepts the mobile Bearer access token.
- **Blog editor**: `RichTextEditor` (TipTap v3 + `@tiptap/markdown`) loads and emits Markdown, so storage and the public renderer are unchanged; only offer Markdown-representable formatting (StarterKit's underline is disabled). Keep every `useEditor` option referentially stable (initial content via `useState`, memoised `editorProps`, `onChange` via a ref): an option changing identity triggers `setOptions`, whose view redraw drops keystrokes. Toolbar buttons `preventDefault` on mousedown to keep editor focus.
- **Testimonial photos** are Cloudinary public IDs rendered by `TestimonialAvatar` with `crop="thumb" gravity="face"`. Don't use the `{ type, source: true }` crop form with `g_face`: it adds a `c_limit` step Cloudinary rejects (400).
- **Cloudinary uploads**: always go through `CloudinaryUploadButton`, which creates the `CldUploadWidget` on first click. Mounting the widget eagerly builds a hidden iframe that steals keyboard focus ~2s after page load.
- **Blog**: Markdown via the `Markdown` component (react-markdown + remark-gfm; never enable raw HTML). Images are Cloudinary public IDs rendered with `BlogImage` (a "use client" wrapper around `CldImage`, since next-cloudinary ships without the directive). Post writes go through `pickPostFields()`; mutations call `revalidateBlog(oldSlug, newSlug)`. Comments are fetched client-side so post pages stay static.
- **Cloudinary config**: only `CLOUDINARY_URL` is set. `next.config.js` derives `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`/`_API_KEY` from it at build time; don't add those vars separately.
- **Not-found pages**: the root `loading.jsx` makes every page stream, so `notFound()` in a page yields the not-found UI with a 200 status plus `noindex` (soft 404), not an HTTP 404.
- **Bookings**: availability is wall-clock time in the calendar's time zone (Africa/Nairobi); store and compare UTC instants and convert with `zonedTimeToUtc` (handles DST). `createBooking()` only accepts a slot `computeSlots()` currently offers, and the partial unique index on `{ startsAt }` (status `confirmed`) is what prevents double-booking — keep both. Times shown to visitors must be rendered client-side in their zone (never during SSR: it causes hydration mismatches). There's no Google Calendar API integration: the team gets a pre-filled "create event" link (`googleCalendarLink()`) and adds Meet themselves.
- **Quotes**: never show exact prices — everything is a rounded-down "starting from" figure, in the visitor's currency. Location pricing must stay **invisible to visitors**: never mention country, region, tier or income on the page, PDF or visitor email; never send prices, multipliers, tiers or country data to the browser (`prices.js`, `regions.js`, `currency.js`, `pricing.js` are `server-only`; the API returns `publicQuote()` only). The country comes only from the IP header (`detectCountry()`), never the request body. Options/labels go in `catalog.js`, their prices in `prices.js` (same ids). User text going into emails must be HTML-escaped (`escapeHtml` in emails.js); PDF text goes through `makeSafe` (WinAnsi) and money uses currency codes, not symbols.
- **Testimonials**: `/services` is ISR (`revalidate = 3600`), and testimonial mutations call `revalidateTestimonialPages()`. If testimonials are shown on another page, add its path there. Writes go through `pickTestimonialFields()`, so never spread a request body into a model.
- **SEO**: every indexable page builds metadata with `buildMetadata()` from `@/lib/seo`. `sitemap.js` auto-discovers page files (excluding `api`, `admin`, `(account)`) and appends published blog posts from the DB. Don't add Review/AggregateRating or other unverifiable JSON-LD (see the header comment in `lib/schema.js`).
- **Theming**: colours are CSS tokens in `globals.css` with light and dark values; use the semantic Tailwind classes (`bg-background`, `text-foreground`, `bg-muted`, `ring-border`, `brand`) rather than raw colours so both modes work.
- **Analytics**: GA4 via `src/components/analytics/GoogleAnalytics.jsx` (Consent Mode v2 defaults set before `config`; region list in `src/lib/analytics.js`), consent banner + "Cookie settings" in `components/analytics/`. Track conversions with `trackEvent(name, params)` — no names, emails or phone numbers in params. New conversion = add it to the Event reference in `docs/SEO-PROGRESS.md`. Keep the privacy policy (`/privacy-policy`) in step with what's collected and which providers process it.
- **SEO progress**: `docs/SEO-PROGRESS.md` is the task tracker for the growth strategy — update statuses and the log as work lands.
- **Site images**: live in `public/images/` as trimmed, ~2x-display-size WebP and are used via **static imports** (real dimensions → no layout shift, blur placeholders). Always pass `sizes`, or a fixed `width` for small icons so next/image only offers 1x/2x. Use `preload` (not the deprecated `priority`) only for a page's main above-the-fold image. Images that blend with text have transparent backgrounds; artwork whose text would vanish on one theme ships `-light`/`-dark` variants, passed as `{ light, dark }` to `FramerImage` / the home `ServiceIconImage` (CSS shows one; the hidden lazy one isn't fetched). Full-scene photos keep their background and use `.fade-edges` (globals.css) instead. `next.config.js` allows `quality` 60 and 75.
- **Social links**: `SOCIALS` in constants (name, icon, href; `href: null` shows an unlinked icon). The X logo is `public/x.svg`. Official company profiles also go in `SAME_AS` in `schema.js`.
- **Navigation**: the header (`Navbar.jsx` `links`, mirrored in `NAV_LINKS`) has Blog but not Careers; Careers and Blog are in the footer (`FOOTER_LINKS` → "Our Company").
- **Redirects and security headers** live in `next.config.js`.

## Environment

See `.env.example` for every variable and where it's used. All server-only except `NEXT_PUBLIC_SITE_URL`. Never commit `.env.local`.
