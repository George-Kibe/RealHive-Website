/**
 * The dedicated service pages (/services/<slug>): one source for each page's
 * copy, its metadata, its Service + BreadcrumbList JSON-LD, the sitemap, the
 * footer links and the "related service" box on blog posts.
 *
 * Rules for the copy (see docs/SEO-PROGRESS.md, phase 2):
 *  - Nothing invented: projects come from PROJECTS (real, shipped work) and
 *    timelines are the quote tool's own "from N weeks" minimums (prices.js).
 *  - No prices on these pages. Prices depend on the visitor's location, which
 *    must stay invisible, so the pages link to /quote for a "starting from"
 *    figure in the visitor's currency instead.
 *  - FAQ answers are plain, quotable answers (cost, timeline, process, code
 *    ownership, support), rendered in the HTML, not hidden in an accordion.
 *  - `blogTags` pick the related posts shown on the page, and the service a
 *    post links back to (serviceForTags).
 */
import serviceWeb from "../../public/images/service-web.webp";
import serviceMobile from "../../public/images/service-mobile.webp";
import serviceDataLight from "../../public/images/service-data-light.webp";
import serviceDataDark from "../../public/images/service-data-dark.webp";
import serviceBigDataLight from "../../public/images/service-bigdata-light.webp";
import serviceBigDataDark from "../../public/images/service-bigdata-dark.webp";

/** How every engagement runs; each page adds its own timeline line. */
export const PROCESS = [
  {
    title: "Free consultation",
    text: "A 30-minute video call about what you want to build, who it is for and what success looks like. No commitment.",
  },
  {
    title: "Scope and estimate",
    text: "We turn the call into a written scope with the features, milestones, timeline and price, so you know exactly what you are paying for before work starts.",
  },
  {
    title: "Build in short iterations",
    text: "We build in short cycles and show you working software as we go, so you can test it early and change direction without waste.",
  },
  {
    title: "Launch and support",
    text: "We handle the release, then keep it secure and up to date with an optional support plan, adding features as your business grows.",
  },
];

/** Working hours overlap, from Nairobi (UTC+3 all year, no daylight saving). */
export const TIME_ZONES =
  "We work from Nairobi (UTC+3), so our day overlaps with yours: 1–3 hours ahead of the UK and Europe, 1 hour behind the UAE, and the morning in North America and the afternoon in Australia overlap with ours.";

/** Engagement models, as described on the About page. */
export const ENGAGEMENT = [
  { title: "Fixed-price project", text: "An agreed scope, timeline and price. Best when you know what you need." },
  { title: "Hourly consulting", text: "Expert help when you need it: architecture reviews, audits, or unblocking your own team." },
  { title: "Long-term partnership", text: "A dedicated team that works as an extension of yours, month after month." },
];

export const SERVICE_PAGES = [
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    serviceType: "Mobile application development",
    metaTitle: "Mobile App Development Company",
    metaDescription:
      "iOS and Android apps built with React Native, Flutter or native code, from MVP to production. Senior engineers, UK and Europe working hours, clear pricing.",
    h1: "Mobile app development for startups and growing businesses",
    lead: [
      "We design and build iOS and Android apps that people keep using: fast, reliable and easy to understand. Start with an MVP to test your idea with real users, or build a production-grade app ready to scale.",
      "You work directly with the engineers building your app, in hours that overlap with yours, and you own the code from day one.",
    ],
    image: serviceMobile,
    imageAlt: "Illustration of a mobile app on a phone screen",
    audience: [
      { title: "Founders launching an app", text: "Get a focused MVP into the App Store and Google Play quickly, then improve it with what your first users tell you." },
      { title: "Businesses adding mobile", text: "Give your customers an app that connects to the systems you already use: your website, payments, CRM or stock." },
      { title: "Teams that need more hands", text: "Add experienced mobile engineers to your team for a launch, a rebuild or a backlog that keeps growing." },
    ],
    builds: [
      { title: "Cross-platform apps", text: "One React Native or Flutter codebase for Android and iOS: faster to build and cheaper to maintain, with a native feel." },
      { title: "Native apps", text: "Separate Kotlin and Swift apps when you need the best performance or deep access to the device." },
      { title: "Commerce and payments", text: "Product catalogues, carts and checkout with cards, M-Pesa and in-app purchases." },
      { title: "Marketplaces and bookings", text: "Apps that match two sides, like buyers and sellers or tenants and landlords, with search, profiles and messaging." },
      { title: "Connected features", text: "Accounts and login, push notifications, maps and location, chat, and offline mode that syncs when the connection returns." },
      { title: "App store launch", text: "We prepare the store listings, handle the review process and publish your app to Google Play and the App Store." },
    ],
    timeline:
      "A cross-platform MVP for Android and iOS typically takes from 7 weeks; a production-grade app, with automated tests, monitoring and security hardening, from about 12 weeks. Each feature you add extends that.",
    tech: [
      { group: "Apps", items: ["React Native", "Expo", "Flutter", "Kotlin", "Swift"] },
      { group: "Back end", items: ["Node.js", "AWS Amplify", "Firebase", "MongoDB", "PostgreSQL"] },
      { group: "Payments and services", items: ["Stripe", "M-Pesa (Daraja)", "In-app purchases", "Push notifications", "Maps"] },
    ],
    work: ["hauteCorner", "realhiveApp"],
    faqs: [
      {
        question: "How much does it cost to build a mobile app?",
        answer: "It depends on the platforms, the approach (cross-platform or native) and the features. Our quote tool gives you a starting-from estimate in your currency in about two minutes, and after a free consultation we send a fixed price for the agreed scope.",
      },
      {
        question: "How long does it take to build an app?",
        answer: "A cross-platform MVP for Android and iOS typically takes from 7 weeks, and a production-grade app from about 12 weeks. You get a detailed schedule with milestones in the scope we send after the consultation.",
      },
      {
        question: "Should I build with React Native, Flutter or native code?",
        answer: "For most business apps, cross-platform (React Native or Flutter) is the better choice: one codebase, a faster launch and lower maintenance. Native Kotlin and Swift are worth it for apps that rely heavily on the device, like advanced camera, Bluetooth or demanding graphics. We recommend one in the consultation, with the reasons.",
      },
      {
        question: "Do you work with clients in the UK and Europe?",
        answer: "Yes. Nairobi is 1–3 hours ahead of the UK and most of Europe, so most of the working day overlaps. We meet on video calls, share progress through your preferred tools and build with GDPR in mind, including hosting your data in a UK or EU region if you need it.",
      },
      {
        question: "Who owns the app and its code?",
        answer: "You do. The code, designs and store accounts are yours, and we work in a repository you can access at any time.",
      },
      {
        question: "Do you support the app after launch?",
        answer: "Yes. Our support plans cover security and OS updates, monitoring, bug fixes and new features, so the app keeps working as Android and iOS change.",
      },
    ],
    blogTags: ["Mobile", "React Native", "Flutter"],
  },
  {
    slug: "web-development",
    name: "Web Development",
    serviceType: "Web application development",
    metaTitle: "Custom Web Application Development",
    metaDescription:
      "Custom web applications, SaaS products, portals and online stores built with Next.js and React. Fast, secure and easy to manage. Get an estimate today.",
    h1: "Custom web application development",
    lead: [
      "We build fast, secure web applications, from company websites and online stores to customer portals and SaaS products. Every project is designed around your users and built to be found on Google.",
      "You work directly with senior engineers, see progress as it happens and own everything we build.",
    ],
    image: serviceWeb,
    imageAlt: "Illustration of a web application on desktop and mobile screens",
    audience: [
      { title: "Startups building a product", text: "Launch a SaaS MVP or customer portal quickly on a foundation that can grow with you." },
      { title: "Businesses selling online", text: "An online store or booking site that is fast, easy to manage and takes payments the way your customers pay." },
      { title: "Companies with manual work", text: "Replace spreadsheets and email chains with an internal tool or dashboard your team actually wants to use." },
    ],
    builds: [
      { title: "Web applications and SaaS", text: "Accounts, roles, dashboards and subscriptions: complete products, not just pages." },
      { title: "E-commerce stores", text: "Catalogues, carts and checkout with cards and M-Pesa, plus an admin to manage orders and stock." },
      { title: "Business websites", text: "Fast, search-friendly company websites with a blog or content management you can update yourself." },
      { title: "Portals and internal tools", text: "Customer portals, booking systems and admin dashboards connected to your existing systems." },
      { title: "Integrations and APIs", text: "Connect payments, CRMs, email, maps and other services, or build an API for your mobile app." },
      { title: "Redesigns and rebuilds", text: "Modernise a slow or outdated site, keeping your search rankings through the move." },
    ],
    timeline:
      "A business website typically takes from 2 weeks, an online store from 4 weeks and a web application from 6 weeks for an MVP. A production-grade build, with automated tests, monitoring and security hardening, takes about 60% longer.",
    tech: [
      { group: "Front end", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Back end", items: ["Node.js", "Express", "MongoDB", "PostgreSQL"] },
      { group: "Hosting and services", items: ["Vercel", "AWS", "Stripe", "M-Pesa (Daraja)", "Cloudinary"] },
    ],
    work: ["buenasStore", "mernbnb", "buenasConsultants"],
    faqs: [
      {
        question: "How much does a custom web application cost?",
        answer: "It depends on what you are building (a website, store or web application) and the features. Our quote tool gives you a starting-from estimate in your currency in about two minutes, and after a free consultation we send a fixed price for the agreed scope.",
      },
      {
        question: "How long does it take to build a website or web app?",
        answer: "A business website typically takes from 2 weeks, an online store from 4 weeks and a web application MVP from 6 weeks. The scope we send after the consultation includes a schedule with milestones.",
      },
      {
        question: "Will my website rank on Google?",
        answer: "We build every site with technical SEO in place: fast pages, clean URLs, titles and descriptions, structured data and a sitemap. Rankings also depend on your content and reputation, which we can advise on.",
      },
      {
        question: "Can I update the content myself?",
        answer: "Yes. We add an admin area or content management so you can edit pages, products and blog posts without a developer.",
      },
      {
        question: "Who owns the website and its code?",
        answer: "You do. The code, designs, domain and hosting accounts are yours, and we work in a repository you can access at any time.",
      },
      {
        question: "Can you take over or redesign an existing site?",
        answer: "Yes. We review the current code and hosting first, then either improve what is there or rebuild it, keeping your URLs and search rankings through the move.",
      },
    ],
    blogTags: ["Web", "React", "Next.js", "TypeScript", "Programming"],
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    serviceType: "Data engineering consulting",
    metaTitle: "Data Engineering Consulting",
    metaDescription:
      "Data pipelines, ETL, data warehouses and dashboards that turn scattered data into reliable reporting. Data engineering consulting for growing companies.",
    h1: "Data engineering consulting: pipelines, warehouses and dashboards",
    lead: [
      "When your data lives in a dozen tools and every report is a spreadsheet someone rebuilds by hand, decisions slow down. We connect your sources, clean and model the data in one warehouse, and give your team dashboards they can trust.",
      "We design for reliability first: pipelines that are monitored, tested and documented, so the numbers are right every morning.",
    ],
    image: { light: serviceBigDataLight, dark: serviceBigDataDark },
    imageAlt: "Illustration of data flowing from several sources into a data warehouse",
    audience: [
      { title: "Teams drowning in spreadsheets", text: "Replace manual exports and copy-paste reporting with data that updates itself." },
      { title: "Growing companies", text: "Bring sales, finance, product and operations data together to see the whole business in one place." },
      { title: "Products that need data features", text: "Analytics for your customers, data for a machine-learning model, or real-time updates in your app." },
    ],
    builds: [
      { title: "Data pipelines and ETL", text: "Automated pipelines that extract data from your apps, databases, APIs and files, then clean and load it on a schedule." },
      { title: "Data warehouses", text: "A central warehouse with well-modelled tables, so every report starts from the same, correct numbers." },
      { title: "Dashboards and reporting", text: "Dashboards for leadership and teams, with the metrics defined once and shared everywhere." },
      { title: "Real-time and streaming data", text: "Event streams for live dashboards, alerts and features that react within seconds." },
      { title: "Data quality and monitoring", text: "Tests, alerts and documentation that catch broken data before it reaches a report." },
      { title: "Data platform reviews", text: "An independent review of your current setup, with a prioritised plan to make it faster, cheaper and more reliable." },
    ],
    timeline:
      "Connecting 1–3 data sources typically takes from 3 weeks, 4–10 sources from 6 weeks and more than 10 from 9 weeks. Setting up a new data warehouse adds about 2 weeks.",
    tech: [
      { group: "Pipelines", items: ["Python", "SQL", "Apache Airflow", "dbt", "Apache Kafka"] },
      { group: "Warehouses and databases", items: ["BigQuery", "Snowflake", "PostgreSQL", "MongoDB"] },
      { group: "Reporting and cloud", items: ["Power BI", "Looker Studio", "AWS", "Google Cloud"] },
    ],
    work: [],
    faqs: [
      {
        question: "What does a data engineer do, and do we need one?",
        answer: "A data engineer builds the systems that collect, clean and store your data so it can be analysed. If your reports are assembled by hand, numbers disagree between teams, or data is spread across many tools, data engineering is usually the first step, before data science or AI.",
      },
      {
        question: "How much does a data pipeline or warehouse cost?",
        answer: "It depends mainly on how many sources you connect and whether you need a new warehouse or real-time data. Our quote tool gives you a starting-from estimate in your currency, and after a free consultation we send a fixed price for the agreed scope.",
      },
      {
        question: "How long does a data engineering project take?",
        answer: "Connecting 1–3 sources typically takes from 3 weeks, 4–10 sources from 6 weeks and more than 10 from 9 weeks. A new data warehouse adds about 2 weeks.",
      },
      {
        question: "Can you work with the tools we already use?",
        answer: "Yes. We start from your current databases, apps and reporting tools, and only recommend new ones when they clearly save time or money.",
      },
      {
        question: "Is our data safe with you?",
        answer: "We work with the least access we need, keep data in your own cloud accounts, encrypt it in transit and at rest, and can keep it in the region you require, such as the UK or EU.",
      },
    ],
    blogTags: ["Data", "Databases", "Data Engineering"],
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    serviceType: "AI integration and business process automation",
    metaTitle: "AI Integration & Automation Services",
    metaDescription:
      "Custom AI chatbots, document Q&A, workflow automation and AI features for your app, built on your own data with guardrails and evaluation from day one.",
    h1: "AI integration and automation for your business",
    lead: [
      "We put AI to work on the tasks that slow your team down: answering questions from your documents, handling routine enquiries and moving data between tools without anyone copying and pasting.",
      "Every AI feature we build is grounded in your own data, tested against real examples before launch and monitored after it, so it stays accurate and safe to use.",
    ],
    image: { light: serviceDataLight, dark: serviceDataDark },
    imageAlt: "Illustration of data analysis and AI models",
    audience: [
      { title: "Teams with repetitive work", text: "Automate data entry, triage, reporting and follow-ups, and give people time back for work that needs them." },
      { title: "Businesses with lots of documents", text: "Let staff or customers ask questions of your policies, manuals and contracts and get answers with sources." },
      { title: "Products adding AI features", text: "Add search, summaries, recommendations or an assistant to your app, built to be reliable in production." },
    ],
    builds: [
      { title: "AI chatbots for your website", text: "Assistants that answer customer questions from your own content, hand over to a person when needed and capture leads." },
      { title: "Document Q&A (RAG)", text: "Ask questions of your documents and get accurate answers with links to the source, using retrieval-augmented generation." },
      { title: "Workflow automation", text: "Connect your email, forms, CRM and spreadsheets so routine steps happen on their own, with AI handling the judgement calls." },
      { title: "AI features in your app", text: "Smart search, summaries, classification and recommendations, added to your existing web or mobile product." },
      { title: "Predictive models", text: "Machine-learning models that forecast demand, flag risk or score leads from your historical data." },
      { title: "Evaluation and guardrails", text: "Test suites, monitoring and safety checks so you know how well the AI performs, and catch problems early." },
    ],
    timeline:
      "An AI assistant or document Q&A system typically takes from 4 weeks, and a predictive model from 5 weeks for a first version. A production-grade build, with evaluation, monitoring and security hardening, takes about 60% longer.",
    tech: [
      { group: "Models", items: ["OpenAI", "Anthropic Claude", "Google Gemini", "Open-source models"] },
      { group: "Retrieval and data", items: ["Vector databases", "pgvector", "PostgreSQL", "Python"] },
      { group: "Automation and delivery", items: ["APIs and webhooks", "Node.js", "Next.js", "AWS"] },
    ],
    work: [],
    faqs: [
      {
        question: "Can an AI chatbot answer questions about our business accurately?",
        answer: "Yes, when it is built on your own content. We use retrieval-augmented generation (RAG), so answers come from your documents with links to the source, and the assistant says when it does not know instead of guessing.",
      },
      {
        question: "How much does AI integration cost?",
        answer: "It depends on the use case, the amount of data and how it connects to your systems. Our quote tool gives you a starting-from estimate in your currency, and after a free consultation we send a fixed price for the agreed scope.",
      },
      {
        question: "How long does it take to build an AI assistant?",
        answer: "A first version of an AI assistant or document Q&A system typically takes from 4 weeks. We test it against real questions from your team before it goes live.",
      },
      {
        question: "Is our data used to train AI models?",
        answer: "No. We use AI providers' business APIs, which do not train on your data, keep your documents in your own accounts, and can host the system in your preferred region.",
      },
      {
        question: "Which processes are worth automating first?",
        answer: "Tasks that happen often, follow clear rules and take people's time: data entry, sorting enquiries, routine replies, reports and moving data between tools. We help you pick the ones with the best return in the consultation.",
      },
    ],
    blogTags: ["AI", "LLMs", "RAG", "MLOps"],
  },
];

export const SERVICE_PAGE_BY_SLUG = Object.fromEntries(SERVICE_PAGES.map((p) => [p.slug, p]));

export const servicePath = (slug) => `/services/${slug}`;

/** The service a blog post relates to: its first tag that a page claims wins. */
export function serviceForTags(tags = []) {
  for (const tag of tags) {
    const page = SERVICE_PAGES.find((p) => p.blogTags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    if (page) return page;
  }
  return null;
}

/** Posts (newest first) that share a tag with the page. */
export function postsForService(page, posts = [], limit = 3) {
  const tags = new Set(page.blogTags.map((t) => t.toLowerCase()));
  return posts.filter((post) => post.tags?.some((t) => tags.has(t.toLowerCase()))).slice(0, limit);
}
