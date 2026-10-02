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
| `/blog` | Blog: published AI, tech and programming posts |
| `/blog/[slug]` | A post, with comments (signed-in users can comment) |
| `/careers` | Open roles |
| `/contacts` | Contact form (sends an enquiry email) |
| `/privacy-policy` | Privacy policy |
| `/admin` | Private dashboard listing newsletter subscribers (admin login required) |
| `/login`, `/register`, `/forgot-password` | Website accounts for blog commenters (noindex) |
| `/admin/blog` | Write, edit, publish and delete posts; moderate comments (admin login required) |
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

Fields: `name` and `quote` (required), `role`, `company`, `avatarUrl` (http/https), `published` (default `false`), `order` (lower shows first). Admin routes use the dashboard session cookie and return `401` without it. Changes refresh `/services` straight away.

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
- **Testimonial**: name, role, company, quote, avatar URL, `published`, `order`, timestamps.
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
