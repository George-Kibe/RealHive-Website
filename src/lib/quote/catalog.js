/**
 * What can be quoted: the services, their choices and labels. NO PRICES here.
 *
 * This file is shipped to the browser (the quote page renders it), so it must
 * never contain prices, weeks or multipliers: those live in prices.js, which is
 * server-only. Keeping them apart is what stops visitors from reading the
 * price list or working out that pricing varies by location.
 *
 * Field shape: { key, label, type: "single" | "multi", required, options: [{ id, label, hint? }] }
 * Every option id here needs an entry in prices.js.
 */

export const BUILD_LEVELS = {
  mvp: {
    label: "MVP",
    description: "The core features, built to validate the idea with real users quickly.",
  },
  production: {
    label: "Production-grade",
    description: "Scalable architecture, automated tests, CI/CD, monitoring, security hardening and documentation.",
  },
};

export const SERVICES = [
  {
    id: "web",
    name: "Web application development",
    summary: "Websites, web apps, portals and online stores.",
    fields: [
      {
        key: "type", label: "What are you building?", type: "single", required: true,
        options: [
          { id: "website", label: "Business / marketing website" },
          { id: "webapp", label: "Web application / SaaS / portal" },
          { id: "ecommerce", label: "E-commerce store" },
        ],
      },
      {
        key: "features", label: "Features", type: "multi",
        options: [
          { id: "auth", label: "User accounts & login" },
          { id: "payments", label: "Online payments (M-Pesa, cards)" },
          { id: "admin", label: "Admin dashboard" },
          { id: "cms", label: "Blog / content management" },
          { id: "integrations", label: "Third-party integrations / APIs" },
        ],
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile application development",
    summary: "Apps for Android and iOS phones and tablets.",
    fields: [
      {
        key: "platforms", label: "Operating systems", type: "multi", required: true,
        options: [
          { id: "android", label: "Android" },
          { id: "ios", label: "iOS (iPhone & iPad)" },
        ],
      },
      {
        key: "approach", label: "How should it be built?", type: "single", required: true,
        options: [
          { id: "cross", label: "Cross-platform", hint: "One codebase for both (React Native / Flutter). Faster and more affordable." },
          { id: "native", label: "Native", hint: "Separate apps per platform (Kotlin / Swift). Best for device-heavy or performance-critical apps." },
        ],
      },
      {
        key: "features", label: "Features", type: "multi",
        options: [
          { id: "auth", label: "User accounts & login" },
          { id: "payments", label: "In-app payments (M-Pesa, cards, app stores)" },
          { id: "push", label: "Push notifications" },
          { id: "maps", label: "Maps & location" },
          { id: "chat", label: "In-app chat / messaging" },
          { id: "offline", label: "Offline mode & sync" },
        ],
      },
    ],
  },
  {
    id: "data_science",
    name: "Data science & AI",
    summary: "Dashboards, predictive models and AI features.",
    fields: [
      {
        key: "solutions", label: "What do you need?", type: "multi", required: true,
        options: [
          { id: "bi", label: "Analytics dashboards & reporting" },
          { id: "ml", label: "Predictive / machine-learning model" },
          { id: "ai", label: "AI assistant / LLM integration (chatbots, document Q&A)" },
        ],
      },
    ],
  },
  {
    id: "data_engineering",
    name: "Data engineering",
    summary: "Pipelines, ETL and data warehouses.",
    fields: [
      {
        key: "sources", label: "How many data sources?", type: "single", required: true,
        options: [
          { id: "few", label: "1–3 sources" },
          { id: "some", label: "4–10 sources" },
          { id: "many", label: "More than 10" },
        ],
      },
      {
        key: "extras", label: "Also include", type: "multi",
        options: [
          { id: "warehouse", label: "Data warehouse setup" },
          { id: "realtime", label: "Real-time / streaming data" },
        ],
      },
    ],
  },
  {
    id: "cloud",
    name: "Cloud computing consultancy",
    summary: "Migration, infrastructure and cloud reviews.",
    fields: [
      {
        key: "work", label: "What do you need?", type: "multi", required: true,
        options: [
          { id: "migration", label: "Migration to the cloud" },
          { id: "infra", label: "Infrastructure setup (CI/CD, infrastructure as code)" },
          { id: "review", label: "Security & cost optimisation review" },
        ],
      },
    ],
  },
  {
    id: "support",
    name: "Support & maintenance",
    summary: "Updates, monitoring and fixes after launch.",
    monthly: true,
    fields: [
      {
        key: "plan", label: "Plan", type: "single", required: true,
        options: [
          { id: "basic", label: "Basic: security updates & uptime monitoring" },
          { id: "standard", label: "Standard: plus bug fixes and small changes" },
          { id: "premium", label: "Premium: plus priority support and ongoing features" },
        ],
      },
    ],
  },
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
