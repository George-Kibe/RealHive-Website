# SEO & Analytics Progress

Tracks the [Analytics & SEO Growth Strategy](https://claude.ai/code/artifact/d62c4d7f-e79a-4c40-ae3b-d73d467e6a4e) from plan to results. Update the status column as work moves, and add a line to the log at the bottom for anything notable.

**Status:** `Done` · `In progress` · `Waiting on George` · `Not started` · `Blocked`

**Decisions so far:** mobile apps first, for UK/European buyers · GA4 with a consent banner (EU/UK/CH only) · one English site, messaging per region · no physical office (Google Business Profile as a service-area business) · no ads budget, paid SEO tool only · industries: real estate, e-commerce/retail, fintech/payments.

---

## George's to-do list (updated 2026-11-20)

Everything Claude can do is built, deployed and verified. What's left needs your accounts, your knowledge or your clients. Ordered by priority; the number in brackets is the task in the tables below.

### This week

**1. Get the new pages into Google (1.8, phase 2 gate)**
1. Open [search.google.com/search-console](https://search.google.com/search-console) and choose the `realhiveconsultants.com` property. If it asks you to verify, click **Verify** (the DNS record is already in place).
2. Left menu → **Sitemaps** → type `sitemap.xml` → **Submit**.
3. Top search bar (URL inspection) → paste `https://realhiveconsultants.com/services/mobile-app-development` → **Request indexing**.
4. Repeat step 3 for `/services/web-development`, `/services/data-engineering`, `/services/ai-automation`, `/services` and the homepage. Google limits requests per day; finish the next day if it stops you.
5. A week later: left menu → **Pages**, and check the service pages show as indexed.

**2. Bing (1.9)**
1. Open [bing.com/webmasters](https://www.bing.com/webmasters) and sign in.
2. Choose **Import from Google Search Console** → allow access → select the property → **Import**.

**3. Check GA4 records conversions (1.11, 1.12)**
1. Open [analytics.google.com](https://analytics.google.com) → **Reports → Realtime**.
2. In another tab, open realhiveconsultants.com (accept cookies if the banner shows), complete the instant quote and email it to yourself.
3. Within a minute, `quote_emailed` should appear under "Event count by event name" in Realtime.
4. **Admin → Data display → Events**: mark `book_consultation`, `quote_emailed` and `contact_form_submit` as key events (star or toggle).
5. **Admin → Data collection and modification → Data retention** → 14 months → **Save**.
6. **Admin → Product links → Search Console links → Link** → choose the property → choose the web stream → **Submit**.

**4. Change the admin password**
1. Go to realhiveconsultants.com/admin/forgot-password and enter georgekibew@gmail.com.
2. Enter the code from the email and a new password (at least 12 characters).
3. The temporary password Claude created then stops working.

**5. Publish the first two blog posts (4.1)**
1. Sign in at /admin/login → **Blog**.
2. Open "React Native vs Flutter vs Native", read it and edit anything you'd say differently.
3. Choose an **Author**, tick **Published**, **Save**.
4. Do the same for "How Much Does a Mobile App Cost in 2026?" on the same day (it links to the first).
5. Next month: "MVP or Production-Grade" and "Data Engineering vs Data Science". The month after: "AI automation for small business" and "Hiring offshore developers".

**6. Confirm the service-page claims (2.4–2.6)**
Read the four `/services/...` pages and reply "confirmed", or send corrections, for: code ownership; the fixed-price scope and short build cycles; the technology lists; UK/EU hosting and AI data handling; the AI page artwork. (Details under "For George to confirm" below.)

**7. Check the test emails arrived**
- georgekibew@gmail.com: "New enquiry from E2E Prod Test (SES…)" and "New consultation: E2E…".
- realhiveconsultants@gmail.com: "New quote request: E2E…".
If any are missing, check Spam and tell Claude.

### Soon (next 2–4 weeks)

**8. Team bios for named authors (3.6)**
For each person send: 2–3 sentences (years of experience, what they build, certifications), their LinkedIn URL, and a photo if you have a better one. Also confirm whether **Trent George** is a current team member. Claude adds them to `src/constants/team.js`.

**9. Company social links (2.3)**
Send the URLs of the company X, Facebook and YouTube profiles (and LinkedIn once it exists, step 11). They go in the footer and in Google's company data.

**10. Case study notes (3.1)**
For 3–5 projects (at least one data and one AI project), send:
1. Client name and whether it can be named (or "a Nairobi logistics company").
2. The problem they had.
3. What you built and the technology used.
4. How long it took.
5. A measurable result (time saved, sales, users, errors cut).
6. A one-line quote from the client, if possible, and 2–3 screenshots.
Claude writes the case study pages from these notes.

**11. LinkedIn company page (3.4)**
1. On LinkedIn: **For Business → Create a Company Page → Company**.
2. Name "RealHive Consultants", URL `linkedin.com/company/realhive-consultants`, website https://realhiveconsultants.com, industry "Software Development", logo and tagline.
3. Add the About text (the footer description works) and send Claude the URL.

**12. Google Business Profile (3.3)**
1. Go to [business.google.com](https://business.google.com) → **Add business**.
2. Name "RealHive Consultants", category **Software company**.
3. When asked about a location customers can visit, choose **No**, then add service areas (Nairobi, Kenya and the others you serve).
4. Add phone +254 795 288 155 and the website, then complete Google's verification (video, phone or code).
5. Add the description, services, logo and a few photos; then send your share link to happy clients and ask for a review.

**13. Testimonials (3.2)**
1. Ask 3–5 clients for 2–3 sentences about working with you, plus their name, role, company, a photo and permission to publish.
2. /admin/testimonials → **Add** → fill in, upload the photo, tick **Published** → **Save**. They appear on /services and every service page.

**14. Clutch and GoodFirms (3.5)**
1. [clutch.co](https://clutch.co) → **Get listed** → create the company profile (services, portfolio, rates), then use Clutch's review invitations to ask 2–3 clients for reviews.
2. [goodfirms.co](https://www.goodfirms.co) → **Get listed** → same, and request reviews.
3. Send Claude both profile URLs.

**15. Keyword tool (1.15)**
Free first: [ahrefs.com/webmaster-tools](https://ahrefs.com/webmaster-tools) → sign up → connect with Google Search Console. Take a paid tool (Semrush or Ahrefs) later if you want competitor research.

### Recommended setup (one-off)

**16. Make pushes deploy automatically**
Today a `git push` does **not** update the site; it needs `vercel --prod`.
1. [vercel.com](https://vercel.com) → project **realhive-consultants** → **Settings → Git**.
2. **Connect Git Repository** → GitHub → `George-Kibe/RealHive-Website`; production branch `master`.
3. From then on every push to master deploys. (Also reinstall the CLI: `npm i -g vercel`.)

**17. A send-only AWS key**
The SES key looks like an admin key; if it leaks, the whole AWS account is exposed.
1. AWS console → **IAM → Users → Create user** "realhive-ses-sender" (no console access).
2. Add an inline policy allowing `ses:SendEmail` and `ses:SendRawEmail` in eu-west-1 only.
3. **Security credentials → Create access key**.
4. In Vercel (Production) and `.env.local`, replace `AWS_SES_ADMIN_ACCESS_KEY_ID` and `AWS_SES_ADMIN_SECRET_KEY`, then redeploy.
5. Send a test (e.g. the contact form), then deactivate and delete the old key.

**18. A domain inbox, free (2.2)**
1. Namecheap → **Domain List → Manage** realhiveconsultants.com → **Email Forwarding**.
2. Add alias `info` → forward to realhiveconsultants@gmail.com.
3. Tell Claude: the site's contact email switches to info@realhiveconsultants.com (one line).

### Later / optional

- **19. Google Meet links on bookings:** follow "Google Calendar + Meet" below, then add the three `GOOGLE_*` variables in Vercel and redeploy.
- **20. Looker Studio dashboard (1.14):** after 2–4 weeks of data, Setup steps F.
- **21. Custom MAIL FROM for SES:** optional; only if emails land in spam. Needs an MX and TXT record on `mail.realhiveconsultants.com` (ask Claude first: Namecheap's email forwarding and custom MX records interact).

---

## Phase 1: Measure (weeks 1–2)

Gate to move on: **tracking verified**, meaning real visits and at least one test conversion show in GA4, and Search Console shows the site with the sitemap read.

| # | Task | Owner | Status | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| 1.1 | GA4 integration with Consent Mode v2 (ads always off; analytics off until consent in EU/UK/CH) | Claude | Done | 2026-10-03 | Loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set |
| 1.2 | Cookie consent banner, shown only in EU/UK/CH (by IP country); "Cookie settings" link in the footer | Claude | Done | 2026-10-03 | Unknown location also gets the banner, to be safe |
| 1.3 | Conversion events: `book_consultation`, `quote_emailed`, `quote_downloaded`, `contact_form_submit`, `sign_up`, `contact_click` | Claude | Done | 2026-10-03 | No personal data sent; see Event reference |
| 1.4 | Search Console and Bing verification support (meta tags from env vars) | Claude | Done | 2026-10-03 | Not needed if you verify Search Console by DNS |
| 1.5 | Vercel Speed Insights (cookie-free Core Web Vitals) | Claude | Done | 2026-10-03 | Needs enabling in the Vercel dashboard (1.10) |
| 1.6 | Privacy policy rewritten for analytics, forms, providers and rights | Claude | Done | 2026-10-03 | Review the wording before launch (1.13) |
| 1.7 | Create GA4 property and web data stream; add the Measurement ID to Vercel | George | Done | 2026-11-19 | `G-S75PPTR9CL` set in Vercel (Production + Preview); the tag is in the live pages since the 2026-11-19 deploy |
| 1.8 | Search Console: domain property, verify by DNS, submit the sitemap | George | In progress | 2026-11-20 | The google-site-verification TXT record is live on the domain. Confirm the property shows as verified and submit the sitemap (Setup steps B) |
| 1.9 | Bing Webmaster Tools: import the site from Search Console | George | Waiting on George | | Setup steps C |
| 1.10 | Enable Speed Insights in the Vercel project | George | Done | 2026-11-20 | The Speed Insights script is served on production |
| 1.11 | GA4 settings: mark key events, 14-month retention, link Search Console | George | Waiting on George | | Setup steps E, after the first events arrive |
| 1.12 | Deploy and verify: test booking/quote shows in GA4 Realtime | George + Claude | In progress | 2026-11-19 | Deployed with GA4 live. Still to do: accept cookies, make a test booking/quote, and check it in GA4 Realtime |
| 1.13 | Review the new privacy policy (`/privacy-policy`) | George | Waiting on George | | Not legal advice; adjust as needed |
| 1.14 | Looker Studio dashboard (GA4 + Search Console) | George + Claude | Not started | | Setup steps F; after 2–4 weeks of data |
| 1.15 | Pick and subscribe to one paid SEO tool for keyword research | George | Not started | | e.g. Semrush or Ahrefs; Ahrefs Webmaster Tools is free for your own site |

## Phase 2: Fix and focus (weeks 2–6)

Gate: **service pages indexed** in Search Console.

| # | Task | Owner | Status | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Remove Lorem Ipsum on `/services`; remove "Award winning" claim; fix footer email typo; remove duplicate portfolio item | Claude | Done | 2026-11-20 | All four done (checked in the code and on the live site) |
| 2.2 | Switch contact details to the `@realhiveconsultants.com` email | George + Claude | Blocked | 2026-11-20 | No mailbox on the domain yet, so the contact email stays realhiveconsultants@gmail.com (`CONTACT.email`, used everywhere incl. reply-to). Mail is already *sent* from no-reply@realhiveconsultants.com via Amazon SES. When a domain inbox exists, change `CONTACT.email` only |
| 2.3 | Add company X, Facebook, YouTube links (footer + `sameAs`) | George + Claude | Not started | | Need the profile URLs |
| 2.4 | Homepage headline and sections that name services, audience and proof | Claude drafts, George reviews | Waiting on George | 2026-11-20 | Drafted: h1 "Web, mobile, data and AI engineering for startups and growing companies", quote + consultation buttons, "Why teams work with us", service cards linking to their pages. Review the wording |
| 2.5 | `/services/mobile-app-development` page (first; UK/EU buyers) | Claude drafts, George reviews | Waiting on George | 2026-11-20 | Drafted (content in `src/constants/servicePages.js`). Review the claims under "For George to confirm" below |
| 2.6 | `/services/web-development`, `/services/data-engineering`, `/services/ai-automation` pages | Claude drafts, George reviews | Waiting on George | 2026-11-20 | Drafted, same structure. Data engineering and AI have no case study yet (phase 3.1) |
| 2.7 | Internal links: footer "Our Focus" and blog posts to service pages | Claude | Done | 2026-11-20 | Footer "Our Services", the homepage cards, the `/services` overview and "Other services" on each page link to the service pages; every blog post has a related-service box (by tag) and each service page lists related posts |
| 2.8 | Structured data: Service per page, breadcrumbs, `areaServed` = target markets | Claude | Done | 2026-11-20 | Service + BreadcrumbList on each service page (with visible breadcrumbs), ItemList on `/services`; `areaServed` already lists the target markets |
| 2.9 | Validate keyword lists with Search Console + SEO tool data | George + Claude | Not started | | |

### For George to confirm (service pages, 2.4–2.6)

The pages only use facts from the site: the portfolio projects, the quote tool's options and its "from N weeks" timelines, and the engagement models on the About page. They show no prices, because those depend on the visitor's location; the pages link to `/quote` instead. Confirm or correct these before the pages go live:

1. **Code ownership:** "You own the code, designs and accounts from day one" (homepage, mobile and web FAQs).
2. **Process:** a written scope with a fixed price after the consultation, and short build cycles with working software shown as you go.
3. **Technology lists:** especially data engineering (Airflow, dbt, Kafka, BigQuery, Snowflake, Power BI) and AI (OpenAI, Claude, Gemini, pgvector). Remove anything you wouldn't take a project in.
4. **Data handling:** UK/EU hosting on request, GDPR-aware builds, data kept in the client's own cloud accounts, and AI providers' business APIs not training on client data.
5. **Artwork:** the AI page reuses the "big data" illustration; an AI-specific image would fit better.

## Phase 3: Prove (months 2–4)

Gate: **proof on each service** (a case study and at least one testimonial per service line).

| # | Task | Owner | Status | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Case studies: mobile, web, data engineering, AI/automation (named clients) | George writes notes, Claude drafts | Not started | | |
| 3.2 | Collect and publish testimonials (admin panel) | George | Not started | | |
| 3.3 | Google Business Profile as a service-area business; ask clients for reviews | George | Not started | | |
| 3.4 | Company LinkedIn page | George | Not started | | |
| 3.5 | Clutch and GoodFirms profiles with client reviews | George | Not started | | |
| 3.6 | Team bios and named blog authors | George + Claude | Waiting on George | 2026-11-20 | Built: team in `src/constants/team.js` (About page cards with `#slug` anchors), an Author field in the post editor, byline + "Written by" box on posts, and a Person author (works for the organisation) in the BlogPosting JSON-LD. To do (George): a 2–3 sentence bio and LinkedIn for each person in `team.js`, then pick an author for each post in /admin/blog |

## Phase 4: Grow (months 3–12)

Gate: **monthly enquiries grow** from target markets.

| # | Task | Owner | Status | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Two blog posts a month, one keyword cluster each (start: app cost guide, React Native vs Flutter) | Mix | Waiting on George | 2026-11-20 | First two drafted as unpublished posts in /admin/blog: "React Native vs Flutter vs Native: How to Choose for Your App" and "How Much Does a Mobile App Cost in 2026? What Drives the Price" (both link to the mobile service page, the quote tool and booking). The cost guide gives no RealHive prices (they are location-based): it explains what drives cost, uses the quote tool's timelines and sends readers to /quote. Then drafted the next two: "MVP or Production-Grade: Which Should You Build First?" (links to the mobile and web pages) and "Data Engineering vs Data Science: Which Does Your Company Need?" (links to the data engineering and AI pages). Suggested schedule at two a month: the two mobile posts now, MVP and data next month. To do (George): review, pick an author, publish. Then the last two from the strategy's list: "Five Processes Small Businesses Can Automate With AI This Month" (AI page) and "Hiring Offshore Developers: What to Check Before You Sign" (UK/EU buyers; mobile and web pages). Six drafts in all, three months of posts at two a month. The strategy's topic list is now fully drafted; new topics should come from Search Console queries (2.9) |
| 4.2 | Use-case pages (MVP development, M-Pesa integration, AI chatbots, automation, dashboards, data pipelines) | Claude drafts | Not started | | |
| 4.3 | Industry pages: real estate, e-commerce/retail, fintech/payments | Claude drafts | Not started | | |
| 4.4 | Links and PR: tech press, expert-quote platforms, partner directories | George | Not started | | |
| 4.5 | Monthly review of the dashboard; adjust this plan | George + Claude | Not started | | |

---

## Setup steps for George (phase 1)

**A. Google Analytics 4**

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Create → Property. Name: "RealHive Consultants", time zone Nairobi, currency USD.
2. Create a **Web** data stream for `https://realhiveconsultants.com`. Leave Enhanced measurement on.
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
4. In Vercel → the project → Settings → Environment Variables, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` = that ID for Production (and Preview if you like), then **redeploy** (the ID is built into the pages).

**B. Google Search Console**

1. Go to [search.google.com/search-console](https://search.google.com/search-console) → Add property → **Domain** → `realhiveconsultants.com`.
2. Add the TXT record it shows at your DNS provider (wherever the domain's DNS is managed; on Vercel: Domains → the domain → DNS records). Click Verify (DNS can take a few minutes to hours).
3. Sitemaps → submit `https://realhiveconsultants.com/sitemap.xml`.

**C. Bing Webmaster Tools**

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters) → sign in → **Import from Google Search Console** (after B is verified). Done.

**D. Vercel Speed Insights**

1. Vercel → the project → Speed Insights tab → Enable. Data appears after visits.

**E. GA4 settings (after the first events have come in, about a day after A)**

1. Admin → Events → mark these as **key events**: `book_consultation`, `quote_emailed`, `contact_form_submit`. Optional: `quote_downloaded`, `sign_up`, `contact_click`.
2. Admin → Data settings → Data retention → **14 months**.
3. Admin → Product links → **Search Console links** → link the property from B.
4. Leave Google signals and ads links off (the site doesn't use ads; the privacy policy says so).

**F. Looker Studio dashboard (once there are 2–4 weeks of data)**

1. [lookerstudio.google.com](https://lookerstudio.google.com) → Create → Report → add GA4 and Search Console as data sources. We'll build the pages together: enquiries by country and source, service-page traffic, top searches per service.

---

### Google Calendar + Meet (automatic Meet links for bookings)

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project (e.g. "RealHive website") → **APIs & Services → Library** → enable **Google Calendar API**.
2. **OAuth consent screen**: External, app name "RealHive website", your email; add the scope `.../auth/calendar.events`; then **Publish app** (to Production). Apps left in "Testing" get refresh tokens that expire after 7 days.
3. **Credentials → Create credentials → OAuth client ID → Desktop app**. Copy the client ID and secret into `.env.local` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
4. Run `npm run google-auth`, sign in as georgekibew@gmail.com (the calendar owner), allow access (Google warns the app is unverified: Advanced → continue). Copy the printed `GOOGLE_REFRESH_TOKEN` into `.env.local`.
5. Add all three to Vercel (Production) and redeploy. `/admin/calendar` then says Google is connected.

## Event reference

| Event | Fires when | Parameters | Key event |
| --- | --- | --- | --- |
| `book_consultation` | A consultation is booked on `/book` | `call_minutes` | Yes |
| `quote_emailed` | A visitor emails themselves a quote | `services`, `build_level`, `value`, `currency` (local) | Yes |
| `quote_downloaded` | A visitor downloads the quote PDF | same as above | Optional |
| `contact_form_submit` | The contact form is sent | `form` | Yes |
| `sign_up` | Newsletter subscription | `method: newsletter` | Optional |
| `contact_click` | Click on an email, phone or WhatsApp link | `method`, `page_path` | Optional |

No event sends names, emails or phone numbers (Google's terms forbid it). Code: `src/lib/analytics.js` (`trackEvent`), `src/components/analytics/`.

## Log

| Date | Change |
| --- | --- |
| 2026-11-20 | Commits 5ad4e94 and 0ea8998 deployed to production with `vercel --prod` and verified (service pages live with Service + BreadcrumbList, real 404s, sitemap lists them, drafts private, SES email OK). Added George's to-do list. |
| 2026-11-20 | 4.1: drafted the AI automation and offshore-hiring posts with covers (six drafts in /admin/blog).  |
| 2026-11-20 | 4.1: two more drafts (MVP vs production-grade; data engineering vs data science) with covers. Four drafts now waiting in /admin/blog. |
| 2026-11-20 | 4.1: first two mobile posts drafted (unpublished) with new covers; `seed-blog` supports `draft: true` seeds (created once, never overwritten); `scripts/seed/make-blog-covers.cjs` renders covers in the house style. |
| 2026-11-20 | 3.6 built: named blog authors (team members, chosen per post in the admin editor) with byline, author box and Person JSON-LD; About page team cards from one `TEAM` list with anchors, bios and links. Contact/reply-to inbox kept at realhiveconsultants@gmail.com (no domain mailbox yet); 2.2 marked Blocked. |
| 2026-11-20 | Phase 2 build: four service pages (`/services/mobile-app-development`, `web-development`, `data-engineering`, `ai-automation`), each with its own title, description, h1, Service + BreadcrumbList JSON-LD, plain-HTML FAQs, timelines, tech, real projects and related posts; unknown slugs are a real 404; all four in the sitemap. Homepage hero rewritten with an h1 and both calls to action. `/services` now has one h1 (it had two, nested in h2s) and links to each page. Footer and blog posts link to the service pages. Contact email stays realhiveconsultants@gmail.com (no domain inbox yet). Waiting on George's review before deploy. |
| 2026-11-19 | All site email moved to Amazon SES (from no-reply@realhiveconsultants.com, replies to realhiveconsultants@gmail.com). The old MongoDB cluster no longer existed (production was returning 500s): new Atlas project and cluster `realhive-website`, re-seeded (admin, 5 posts, indexes), Vercel env updated and redeployed. GA4 confirmed live in production. |
| 2026-10-04 | Footer redesigned: "Our Services" column linked to `/services` (not `/portfolio`) until the service pages existed. |
| 2026-10-04 | Footer redesigned: company description + tagline, four columns (brand · Our Company · Our Services · Contact Us with socials), real phone/WhatsApp/email links, footer email typo fixed, location shown as Nairobi, Kenya (no street address). |
| 2026-10-03 | All 11 site emails rebuilt on one branded layout (account, contact form, quotes, bookings): removed the old real-estate wording, green theme, wrong senders and placeholders; all user input escaped. Supports 2.1 (consistent contact details). |
| 2026-10-03 | GA4 property created (`G-S75PPTR9CL`); ID added locally and verified in a local build. Waiting on the Vercel env var + redeploy. |
| 2026-10-03 | Phase 1 code shipped: GA4 + Consent Mode v2, region-based consent banner, conversion events, verification tags, Speed Insights, new privacy policy. Fixed the contact form's email field placeholder. Waiting on account setup (A–E). |
| 2026-10-03 | Strategy agreed; decisions recorded above. |
