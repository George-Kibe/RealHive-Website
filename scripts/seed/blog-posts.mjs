/**
 * Seed blog posts for `npm run seed-blog`. Each `slug` matches a cover image in
 * ./blog-covers/<slug>.png, uploaded to Cloudinary as realhive/blog/seed/<slug>.
 * `daysAgo` staggers the publish dates so the blog list has a natural order.
 * `draft: true` creates the post unpublished, once (see seed-blog.mjs).
 */
export const SEED_POSTS = [
  {
    slug: "retrieval-augmented-generation-explained",
    title: "Retrieval-Augmented Generation, Explained for Busy Engineers",
    excerpt: "LLMs don't know your data. RAG fixes that by fetching the right context at question time. Here's how it works, and where it usually breaks.",
    tags: ["AI", "LLMs", "RAG"],
    coverAlt: "Five documents connected by lines to a central glowing node, with an arrow pointing out to the right",
    daysAgo: 2,
    content: `Large language models are trained on a snapshot of the public internet. They have never seen your contracts, your product docs or last week's support tickets, and fine-tuning them on that material is slow, expensive and goes stale the moment the data changes.

**Retrieval-augmented generation (RAG)** takes a different route: instead of teaching the model your data, you *look up* the relevant pieces at question time and hand them to the model as context.

## The pipeline in four steps

1. **Chunk.** Split your documents into passages of a few hundred tokens. Keep headings with their paragraphs so each chunk still makes sense on its own.
2. **Embed.** Run every chunk through an embedding model, which turns text into a vector: a list of numbers where similar meanings sit close together.
3. **Retrieve.** When a question comes in, embed it the same way and fetch the chunks whose vectors are nearest to it.
4. **Generate.** Put those chunks into the prompt with an instruction like *"Answer using only the context below, and say so if the answer isn't there."*

\`\`\`ts
const queryVector = await embed(question);
const chunks = await vectorStore.search(queryVector, { topK: 5 });

const answer = await llm.generate({
  system: "Answer only from the provided context. Cite the source of each claim.",
  prompt: \`Context:\\n\${chunks.map((c) => c.text).join("\\n---\\n")}\\n\\nQuestion: \${question}\`,
});
\`\`\`

## Where RAG systems actually fail

In our experience the model is rarely the weak link. Retrieval is.

- **Bad chunking.** A chunk that starts mid-table or loses its heading retrieves badly and reads worse. Chunk on document structure, not a fixed character count.
- **Vocabulary mismatch.** Users ask about "leave days"; the policy says "annual entitlement". Pure vector search helps, but combining it with keyword search (*hybrid search*) catches exact terms like product codes and names.
- **Too much context.** Stuffing twenty chunks into the prompt buries the answer. Retrieve generously, then **re-rank** and keep the best few.
- **Stale indexes.** If documents change and embeddings don't, answers drift. Re-embed on update, not on a monthly cron.

## Measure it before you tune it

Build a small evaluation set early: 30–50 real questions with known answers and the documents that contain them. Track two things separately:

| Metric | Question it answers |
| --- | --- |
| Retrieval recall | Did the right chunk make it into the top *k*? |
| Answer faithfulness | Did the answer stick to the retrieved context? |

If recall is low, no prompt will save you; fix chunking and search first. If recall is high but answers are wrong, work on the prompt and the model.

## When not to use RAG

If your data fits comfortably in the model's context window and rarely changes, just include it. If you need the model to adopt a *style* or *format* rather than know *facts*, fine-tuning or better prompting is the right tool. RAG is for large, changing knowledge that has to be cited.

Done well, RAG is the most practical way to put an LLM to work on private data, and the engineering is mostly good old search.`,
  },
  {
    slug: "typescript-patterns-for-large-codebases",
    title: "TypeScript Patterns That Make Large Codebases Calmer",
    excerpt: "Five patterns we reach for when a TypeScript codebase grows past the point where everyone can hold it in their head.",
    tags: ["Programming", "TypeScript"],
    coverAlt: "A code editor window filled with colourful lines of code and a blue TypeScript badge",
    daysAgo: 6,
    content: `TypeScript pays off most when a codebase is too big for any one person to remember. These are the patterns we come back to on client projects, because each one turns a class of runtime bug into a compile error.

## 1. Discriminated unions for state

Instead of a bag of optional fields, model each state explicitly:

\`\`\`ts
type Request<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
\`\`\`

Now \`data\` only exists when \`status === "success"\`, and the compiler enforces it. No more \`data!\` or "how can this be undefined here?".

## 2. Exhaustive checks with \`never\`

Pair unions with a \`switch\` that fails to compile when someone adds a new case and forgets to handle it:

\`\`\`ts
function assertNever(x: never): never {
  throw new Error(\`Unhandled case: \${JSON.stringify(x)}\`);
}

switch (request.status) {
  case "idle": return null;
  case "loading": return <Spinner />;
  case "success": return <View data={request.data} />;
  case "error": return <ErrorBanner message={request.error} />;
  default: return assertNever(request);
}
\`\`\`

## 3. Branded types for IDs

A \`userId\` and an \`orderId\` are both strings, so nothing stops you passing one where the other belongs. A brand makes them distinct at zero runtime cost:

\`\`\`ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

declare function getOrder(id: OrderId): Promise<Order>;
getOrder(userId); // ✗ compile error
\`\`\`

## 4. Validate at the edges, trust inside

Types disappear at runtime, so data from an API, a form or \`JSON.parse\` is really \`unknown\`. Parse it once at the boundary with a schema library such as Zod, and derive the type from the schema so the two can't drift:

\`\`\`ts
const User = z.object({ id: z.string(), email: z.string().email() });
type User = z.infer<typeof User>;

const user = User.parse(await res.json()); // throws on bad data
\`\`\`

Inside the boundary, the rest of the code can trust \`User\` completely.

## 5. \`satisfies\` for configuration objects

\`satisfies\` checks a value against a type *without* widening it, so you keep the precise literal types:

\`\`\`ts
const routes = {
  home: "/",
  blog: "/blog",
} satisfies Record<string, \`/\${string}\`>;

routes.blog; // type is "/blog", not string
\`\`\`

## The common thread

Each pattern moves knowledge out of people's heads and into the type system. That's what makes a large codebase calm: you can change something on one side of it and let the compiler tell you everything else that has to change.

Turn on \`strict\` (and ideally \`noUncheckedIndexedAccess\`), and these patterns get even more mileage.`,
  },
  {
    slug: "shipping-ai-features-evals-guardrails",
    title: "Shipping AI Features Without Breaking Production: Evals, Guardrails and Rollouts",
    excerpt: "An LLM feature that demos well can still fail quietly in production. Here's the release checklist we use to ship AI features with confidence.",
    tags: ["AI", "MLOps", "Engineering"],
    coverAlt: "A green gauge needle near the top of its range beside a checklist with four passing checks and one warning",
    daysAgo: 11,
    content: `Traditional software fails loudly: an exception, a 500, a red test. LLM features fail *quietly*. The response looks fluent and confident, and it's wrong. That changes how you have to test and release them.

Here's the checklist we work through before an AI feature reaches real users.

## 1. Write evals before you write prompts

An **eval** is a test suite for model behaviour: a set of inputs plus a way to judge the outputs. Start with 50–100 examples drawn from real usage, including the awkward ones.

Judge outputs with the cheapest method that works:

- **Exact or programmatic checks**: valid JSON, the right category, a number in range.
- **Reference comparisons**: does the answer contain the key facts from a known-good answer?
- **Model-graded rubrics**: a second model scores against written criteria. It's useful for tone and helpfulness, but spot-check it against human judgement.

Run the suite on every prompt or model change, exactly like unit tests. A prompt tweak that fixes one case often breaks three others, and without evals you won't see it.

## 2. Constrain the output

The less freedom the model has, the less can go wrong.

- Ask for **structured output** (JSON matching a schema) and validate it. Retry or fall back on failure.
- Keep the model's job narrow: classify, extract, summarise, draft. Let ordinary code make the decisions that matter.
- Never let model output flow directly into SQL, shell commands or HTML without the same validation you'd apply to user input.

## 3. Add guardrails on both sides

**Input guardrails** catch prompt injection attempts, off-topic requests and personal data that shouldn't be sent to a third-party API.
**Output guardrails** check for policy violations, leaked system prompts, or claims the feature isn't allowed to make (medical, legal, financial).

Guardrails don't need to be clever to be valuable. A keyword list and a schema check stop a surprising amount.

## 4. Design for the failure case

Assume some responses will be bad, and make that cheap for the user:

- Show sources so people can verify.
- Make AI output a **draft** the user approves, not an action taken on their behalf.
- Provide a one-click way to flag a bad answer, and pipe those flags straight into your eval set.

## 5. Roll out gradually

Ship behind a feature flag. Start with internal users, then 5% of traffic, then more, watching:

| Signal | Why it matters |
| --- | --- |
| Error and fallback rate | Schema failures, timeouts, refusals |
| Latency (p95) | LLM calls are slow; users notice |
| Cost per request | Token usage scales with traffic |
| User flags / thumbs-down | The closest proxy for quality |

## 6. Pin versions and log everything

Pin the exact model version, and log prompts, responses and eval scores (with personal data redacted). When the provider ships a new model, you'll want to rerun your evals and compare like-for-like before switching.

None of this is exotic. It's the discipline of normal software delivery (tests, validation, staged rollouts, monitoring) applied to a component that's probabilistic instead of deterministic.`,
  },
  {
    slug: "react-server-components-in-practice",
    title: "React Server Components in Practice: What Changes and What Doesn't",
    excerpt: "Server Components change where your React code runs, not how you think about UI. A practical guide to the server/client split in the Next.js App Router.",
    tags: ["Web", "React", "Next.js"],
    coverAlt: "A tree of rounded boxes, with purple server components at the top and some blue client components at the leaves",
    daysAgo: 17,
    content: `With the Next.js App Router, every component is a **Server Component** unless you say otherwise. That one default changes where code runs, what ships to the browser, and how you fetch data, but it doesn't change how you think about UI. You're still composing components.

## What Server Components are

A Server Component renders on the server (at build time or on request) and sends the *result* to the browser. Its own JavaScript never ships to the client. That means it can:

- \`await\` data directly: query a database, read a file, call an internal API with a secret.
- Import heavy libraries (Markdown parsers, syntax highlighters) without adding to the bundle.

\`\`\`jsx
// app/blog/page.jsx — a Server Component
export default async function BlogPage() {
  const posts = await db.post.findMany({ where: { published: true } });
  return <PostList posts={posts} />;
}
\`\`\`

No \`useEffect\`, no loading state, no API route just to feed your own page.

## What they can't do

Server Components don't re-render in the browser, so they can't use state, effects, event handlers or browser APIs. Anything interactive needs a **Client Component**, marked with \`"use client"\` at the top of the file:

\`\`\`jsx
"use client";
import { useState } from "react";

export function LikeButton({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(count + 1)}>♥ {count}</button>;
}
\`\`\`

## The rule of thumb: push \`"use client"\` down

\`"use client"\` marks a *boundary*: that file and everything it imports becomes client code. Put it as low in the tree as you can. Keep the page, layout and data fetching on the server, and make only the interactive leaf (the button, the form, the carousel) a Client Component.

A Server Component **can** render a Client Component and pass it props, as long as the props are serialisable (plain data, not functions or class instances). It can also pass Server Components to a Client Component as \`children\`:

\`\`\`jsx
<ClientTabs>
  <ServerRenderedArticle /> {/* still rendered on the server */}
</ClientTabs>
\`\`\`

## Common mistakes we see

- **Marking the whole page \`"use client"\`** to make one button work. You lose server data fetching and ship far more JavaScript than needed.
- **Passing secrets as props.** Everything passed to a Client Component ends up in the browser. Keep tokens and keys in server-only code.
- **Fetching in \`useEffect\` out of habit.** If the data is needed for the first render, fetch it in a Server Component instead.
- **Forgetting caching.** In the App Router you decide per route whether output is static, revalidated on a timer, or rendered per request. Make that choice deliberately.

## What doesn't change

Components, props, composition, and good component boundaries all work the same as before. Server Components just add one more question to each component you write: *does this need to run in the browser?* Most of the time, the answer is no, and your users get a faster page because of it.`,
  },
  {
    slug: "vector-databases-vs-pgvector",
    title: "Vector Databases vs. Postgres + pgvector: Choosing for Your First AI Project",
    excerpt: "Do you need a dedicated vector database, or will the Postgres you already run do the job? A practical comparison for teams shipping their first AI feature.",
    tags: ["AI", "Databases", "Architecture"],
    coverAlt: "Coloured clusters of dots on a dark background, with a white query point linked to its nearest neighbours",
    daysAgo: 24,
    content: `Every AI feature built on embeddings (semantic search, RAG, recommendations, de-duplication) needs somewhere to store vectors and find the nearest ones fast. The first architectural question is usually: *a dedicated vector database, or an extension to the database we already run?*

## What a vector store has to do

At its core, a vector store answers one query: **given this vector, return the *k* most similar vectors**, usually by cosine similarity or inner product. Doing that exactly means comparing against every row, which gets slow past a few hundred thousand vectors. So vector stores build **approximate nearest neighbour (ANN)** indexes, such as HNSW or IVF, trading a little recall for a lot of speed.

## Option 1: Postgres with pgvector

[pgvector](https://github.com/pgvector/pgvector) adds a \`vector\` column type, distance operators and ANN indexes (HNSW and IVFFlat) to PostgreSQL.

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id        bigserial PRIMARY KEY,
  tenant_id bigint NOT NULL,
  content   text NOT NULL,
  embedding vector(1536)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- 5 nearest documents for one tenant
SELECT id, content
FROM documents
WHERE tenant_id = $1
ORDER BY embedding <=> $2
LIMIT 5;
\`\`\`

**Strengths**

- One database to run, back up and secure. You probably already have it.
- Vectors live next to the data they describe, so filters, joins and transactions just work.
- Mature tooling: migrations, monitoring, managed hosting everywhere.

**Watch out for**

- Very large collections (tens of millions of vectors and up) need careful index tuning and plenty of memory.
- Heavy similarity search competes for resources with your transactional workload.

## Option 2: A dedicated vector database

Purpose-built systems (managed services and open-source engines) are designed around ANN search from the ground up.

**Strengths**

- Built to scale to very large collections, often with horizontal sharding.
- Extra search features out of the box, like hybrid keyword + vector search, metadata filtering at scale and namespaces.
- Search load is isolated from your primary database.

**Watch out for**

- Another system to operate, pay for and keep in sync. Every document now lives in two places, and the two can drift.
- Joins with your relational data happen in application code.

## How we decide

| If… | Lean towards |
| --- | --- |
| You already run Postgres and have up to a few million vectors | pgvector |
| You need transactions or joins between vectors and business data | pgvector |
| You expect tens of millions of vectors or very high query volume | Dedicated vector DB |
| Search is the product, and you need advanced retrieval features | Dedicated vector DB |

For most first AI projects, **start with pgvector**. It removes a whole system from your architecture, and the embedding and retrieval code you write is portable. If you outgrow it, migrating means re-indexing vectors, not rewriting your application.

Whichever you pick, the bigger wins usually come from upstream: good chunking, a suitable embedding model and a retrieval eval set. A perfectly tuned index can't rescue embeddings of badly split documents.`,
  },
  // ---- SEO plan 4.1: drafts for review (published from /admin/blog) ----
  {
    slug: "react-native-vs-flutter-vs-native",
    draft: true,
    title: "React Native vs Flutter vs Native: How to Choose for Your App",
    excerpt: "Cross-platform or native, React Native or Flutter? A practical comparison of the three ways to build an iOS and Android app, and how to pick the right one for your project.",
    tags: ["Mobile", "React Native", "Flutter"],
    coverAlt: "One glowing point branching into three phone outlines in blue, teal and orange",
    content: `If you are building an app for both iPhone and Android, the first technical decision is how. There are three realistic options: **React Native**, **Flutter**, or **native** apps written separately for each platform. Each can produce an excellent app. The right one depends on your product, your team and your budget, not on which is "best".

Here is how we compare them with clients before a project starts.

## The three options in one paragraph each

**React Native** (by Meta) lets you write the app in JavaScript or TypeScript with React, and renders real native interface components on each platform. One codebase serves iOS and Android. It is the natural choice if you already have a React web app or web developers, because the language, tools and much of the business logic carry over.

**Flutter** (by Google) uses the Dart language and draws every pixel of the interface with its own rendering engine. One codebase again, and the app looks identical on every device, which suits products with a strongly branded, custom design.

**Native** means two separate apps: Kotlin (usually with Jetpack Compose) for Android and Swift (usually with SwiftUI) for iOS. You get the platform's own tools, the best performance and same-day access to new operating-system features, at the cost of building and maintaining everything twice.

## Side by side

| | React Native | Flutter | Native |
| --- | --- | --- | --- |
| Codebases | One | One | Two |
| Language | JavaScript / TypeScript | Dart | Kotlin and Swift |
| Interface | Native components | Its own rendering engine | Native components |
| Time to launch on both platforms | Fast | Fast | Slowest |
| Cost to build and maintain | Lower | Lower | Highest |
| Device-heavy features (advanced camera, Bluetooth, AR) | Good, with native modules | Good, with platform channels | Best |
| Sharing code with a web app | Strong (React) | Possible, less common | None |
| Hiring | Large JavaScript pool | Growing Dart pool | Separate iOS and Android skills |

Both cross-platform frameworks can call native code when they need to, so "cross-platform" rarely means "can't do it". It means some features need a small native module alongside the shared code.

## When to choose React Native

- You have, or plan, a **React web app** and want one team and shared logic across web and mobile.
- Your app is mostly screens, forms, lists, payments and content: the shape of most business apps.
- You want to ship **small fixes quickly**. With Expo's update service, React Native apps can deliver JavaScript fixes over the air, within the app stores' rules, without waiting for a store review.

The two apps in [our portfolio](/portfolio), an e-commerce app and a property marketplace, are both React Native for these reasons.

## When to choose Flutter

- The design is **highly custom** (unusual layouts, rich animation, a strong brand) and must look the same everywhere.
- You want **one codebase for mobile and more**: Flutter also targets the web and desktop.
- Your team already knows Dart, or is starting fresh with no web codebase to share.

## When to choose native

- The app lives on the device's hardware: **advanced camera work, Bluetooth peripherals, AR, background audio or heavy graphics**.
- You need new iOS or Android features **on the day they are released**.
- Performance is the product, as in games, real-time media or tools used for hours a day.
- You only need **one platform** for now. A single native app takes about as long to build as a cross-platform one, and you can add the second platform later.

A middle path is worth knowing: **Kotlin Multiplatform** shares business logic between Android and iOS while keeping a native interface on each.

## What matters more than the framework

In practice, apps rarely fail because of the framework. They fail because the first version tried to do too much, the back end was an afterthought, or nobody planned for updates after launch. Whatever you choose:

1. **Start with an MVP.** Launch the smallest version that proves the idea, then build what real users ask for.
2. **Design the back end and data early.** Accounts, payments, notifications and admin tools are often more work than the app screens.
3. **Plan for maintenance.** iOS and Android change every year; an app that isn't updated eventually stops working well.

## Our recommendation

For most business apps, **start cross-platform**: React Native if you have or plan a React web app, Flutter if the design is the product. Choose **native** when the app depends on the device's hardware or performance, or when you only need one platform.

Not sure which fits? Tell us about your app in a [free consultation](/book) and we will recommend an approach with the reasons, or get an [instant estimate](/quote) for both options. You can also read how we work on our [mobile app development](/services/mobile-app-development) page.`,
  },
  {
    slug: "how-much-does-a-mobile-app-cost",
    draft: true,
    title: "How Much Does a Mobile App Cost in 2026? What Drives the Price",
    excerpt: "The cost of an app depends on a handful of decisions you control: platforms, approach, features and build level. Here's what each one does to the budget and timeline, and how to keep both in check.",
    tags: ["Mobile", "App Development", "Planning"],
    coverAlt: "Glowing blocks of different sizes stacked into the outline of a phone",
    content: `"How much does an app cost?" has an honest answer: it depends on a handful of decisions, and most of them are yours to make. Two apps that look similar on a sketch can differ several times over in effort, because of what happens behind the screens.

This guide walks through what actually drives the cost and timeline of a mobile app, so you can plan a budget and know which levers to pull. For a figure for your own app, our [instant quote](/quote) gives you a starting-from estimate in your currency in about two minutes.

## 1. Platforms: Android, iOS or both

Launching on one platform is the cheapest way to start. Building for both costs more, but **less than double** when you build cross-platform, because one codebase serves both.

If your users are mostly on one platform, launching there first and adding the other once the app has proven itself is a sound way to spread the cost.

## 2. Approach: cross-platform or native

**Cross-platform** (React Native or Flutter) builds one app that runs on Android and iOS. It is the faster and more affordable route for most business apps. **Native** builds a separate app for each platform in Kotlin and Swift, which makes sense for apps that depend heavily on the device's hardware or performance, and roughly doubles the work for two platforms.

We compare the options in detail in [React Native vs Flutter vs Native](/blog/react-native-vs-flutter-vs-native).

## 3. Features: where most of the budget goes

Every feature is design, front-end work, back-end work and testing. Some are small; some are projects in their own right. In rough order of effort:

| Feature | Why it costs what it does |
| --- | --- |
| Push notifications | Setup with Apple and Google, plus deciding what to send and when |
| User accounts and login | Sign-up, password reset, social login, security |
| Maps and location | Map display, search, geolocation and permissions |
| Payments | Cards, M-Pesa or in-app purchases, with receipts, refunds and store rules |
| Chat and messaging | Real-time delivery, history, notifications and moderation |
| Offline mode and sync | Storing data on the device and resolving changes when the connection returns |

Chat and offline sync are usually the two biggest single features. If your app needs them, plan for them from the start; adding them later often means reworking how data flows through the app.

## 4. Build level: MVP or production-grade

An **MVP** (minimum viable product) has the core features, built well enough for real users to try. It is the right first step for a new idea: you learn what users want before paying for everything.

A **production-grade** app adds what a business-critical product needs: scalable architecture, automated tests, continuous delivery, monitoring, security hardening and documentation. That typically adds about 60% to the build time, and it is what you want once the app carries real revenue or customer data.

## 5. Design, back end and integrations

The screens are only part of an app:

- **Design:** a polished, custom interface takes longer than one built on standard components.
- **Back end and admin:** most apps need a server, a database and an admin panel to manage users, content and orders. This is often as much work as the app itself.
- **Integrations:** connecting to your website, CRM, stock system or other services adds effort for each connection.

## How long it takes

As a guide, a cross-platform MVP for Android and iOS typically takes **from 7 weeks**, a native app for both platforms from about **10 weeks**, and a production-grade cross-platform app from about **12 weeks**. Each major feature adds to that.

## Costs after launch

Budget for these from day one:

- **App store accounts:** Apple's Developer Program costs US$99 a year; a Google Play developer account is a one-time US$25.
- **Store commission:** Apple and Google take 15–30% of digital goods sold inside the app. Physical goods and services paid by card or M-Pesa are not affected.
- **Hosting and services:** servers, databases, maps, messaging and notification services, which grow with your users.
- **Maintenance:** iOS and Android release new versions every year, and libraries need security updates. An app that isn't maintained slowly breaks. A [support plan](/services/mobile-app-development) covers updates, monitoring and fixes.

## Five ways to keep the cost down

1. **Start with an MVP** and let real users decide what comes next.
2. **Build cross-platform** unless you have a clear reason for native.
3. **Use proven services** for login, payments, maps and notifications instead of building your own.
4. **Write down the scope** before development starts, so the estimate is for what you actually want.
5. **Phase the features:** launch with the core, then add chat, offline mode and extras in later releases.

## Get a figure for your app

Our [instant quote](/quote) asks what you are building (platforms, approach, features and build level) and gives you a starting-from estimate and timeline in your currency. For a fixed price, [book a free consultation](/book): we will scope the app with you and send a written proposal.`,
  },
  {
    slug: "mvp-or-production-grade",
    draft: true,
    title: "MVP or Production-Grade: Which Should You Build First?",
    excerpt: "An MVP gets your idea in front of real users quickly; a production-grade build is ready for scale, security reviews and revenue. Here's how to choose, and how to move from one to the other without a rewrite.",
    tags: ["MVP", "Mobile", "Web", "Startups"],
    coverAlt: "A solid glowing square at the centre of dashed outlines of a larger structure",
    content: `Every new app or web product starts with the same question: build the smallest thing that works, or build it properly from day one? Both are reasonable answers. Choosing the wrong one for your situation either wastes money on features nobody uses, or launches something that can't carry the business that depends on it.

Here is how we help clients decide.

## What each one means

An **MVP** (minimum viable product) contains the core features, built well enough for real users to try it. Its job is to answer one question as cheaply as possible: *do people want this, and will they use it the way we think?*

A **production-grade** build adds what a business-critical product needs: a scalable architecture, automated tests, continuous delivery, monitoring and alerting, security hardening and documentation. Its job is to run reliably for years, for many users, with a team changing it every week. It typically takes about 60% longer to build than an MVP of the same features.

"Minimum" refers to the **scope**, not the quality. An MVP should still be fast, secure and pleasant to use; it just does fewer things.

## Build an MVP first when

- **The idea is new** and demand is unproven. Most early assumptions about what users want turn out to be partly wrong.
- **You are raising money** and need a working product, real users and early numbers to show.
- **The budget is limited** and you would rather spend it learning than polishing features that may change.
- **Speed matters** more than scale: a competitor is moving, or a market window is open.

## Build production-grade from the start when

- **You are replacing a system people already depend on**, such as an internal tool, a booking system or an existing app. Users won't accept a step backwards.
- **You handle sensitive data or money**: payments, health records, financial data or anything subject to strict regulation.
- **You launch to a large audience on day one**, for example an existing customer base or a marketing campaign.
- **Your customers will review your security**: enterprise and public-sector buyers often ask for evidence of testing, monitoring and data protection before they sign.

## What an MVP must still get right

Cutting scope is fine. Cutting these corners is not:

| Area | The minimum |
| --- | --- |
| Security | Proper authentication, hashed passwords, HTTPS everywhere, secrets kept out of the code |
| Data | Automatic backups, and a privacy policy and consent that match what you collect |
| Measurement | Analytics on the actions that prove the idea works (sign-ups, bookings, purchases) |
| Stores and platforms | Compliance with App Store and Google Play rules, so review doesn't delay launch |
| Foundations | A mainstream technology stack and a clean structure, so the MVP can grow instead of being thrown away |

The last row matters most. A well-built MVP is the first version of the production product, not a prototype to discard.

## Moving from MVP to production

When the MVP has proven itself, hardening it is usually a sequence of focused steps rather than a rewrite:

1. **Add automated tests** around the features that make money or hold data.
2. **Set up continuous delivery** so every change is built, tested and released the same way.
3. **Add monitoring and alerting**, so you hear about problems before your users do.
4. **Review security**: dependencies, access control, data handling and secrets.
5. **Prepare for scale**: database indexes, caching and background jobs where the load actually is.
6. **Write things down**: setup, architecture and runbooks, so new developers can contribute safely.

## A simple rule

If you are still finding out *whether* people want the product, build an MVP. If you already know they do, because they use an existing version, pay you today or are waiting in large numbers, build it production-grade.

Our [instant quote](/quote) lets you price both build levels side by side for your project, in your currency. To talk it through, [book a free consultation](/book). We build both for [mobile apps](/services/mobile-app-development) and [web applications](/services/web-development).`,
  },
  {
    slug: "data-engineering-vs-data-science",
    draft: true,
    title: "Data Engineering vs Data Science: Which Does Your Company Need?",
    excerpt: "Data science gets the headlines, but most companies need data engineering first. Here's the difference, the signs that tell you which one you need, and the order that avoids expensive false starts.",
    tags: ["Data Engineering", "Data", "AI"],
    coverAlt: "Coloured points flowing along lines into a database cylinder, connected to a bar chart",
    content: `Companies often come to us asking for "data science" or "AI" when what they need first is something less glamorous: reliable data in one place. It's an easy mix-up, because the two fields work with the same raw material. But they solve different problems, and doing them in the wrong order is one of the most common ways data projects stall.

## The difference in one sentence each

**Data engineering** builds the systems that collect data from your tools, clean it and store it in one place where it can be trusted: pipelines, a data warehouse and the checks that keep them correct.

**Data science** uses that data to answer questions and make predictions: which customers are likely to leave, how much stock to order next month, which leads are worth a call.

Think of data engineering as the plumbing and data science as what you do with the water. Without the plumbing, every analysis starts with someone carrying buckets.

## Who does what

| Role | Main job | Typical output |
| --- | --- | --- |
| Data engineer | Moves, cleans and models data | Pipelines, a data warehouse, data quality checks |
| Data analyst | Explains what happened and why | Dashboards, reports, answers to business questions |
| Data scientist | Predicts what will happen | Forecasts, scoring and classification models |
| Machine learning engineer | Runs models reliably in production | Model services, monitoring, retraining pipelines |

In a small company one person often covers several of these. The work still happens in this order.

## Signs you need data engineering first

- **Reports are built by hand.** Someone exports spreadsheets from several tools every week and stitches them together.
- **Numbers disagree.** Sales, finance and operations each report a different revenue figure, and meetings start with arguments about whose is right.
- **Data lives in many tools**: your app's database, payments, CRM, marketing platforms and spreadsheets, with nothing connecting them.
- **Questions take days to answer**, because each one needs a new extract and a lot of cleaning.
- **A data science or AI project stalled** because the data wasn't ready.

If several of these sound familiar, a model won't help yet. A pipeline and a warehouse will.

## Signs you're ready for data science

- Your key data is **already in one place**, cleaned and updated automatically.
- You have **enough history** for the question you're asking, usually months to years of consistent records.
- You have a **specific decision to improve**, like "predict which subscribers will cancel next month", not "find insights in our data".
- Someone will **act on the result**: a team that will call the at-risk customers, or a buyer who will use the forecast.

## The order that works

1. **Connect and centralise.** Bring your most important sources into a warehouse with automated, monitored pipelines.
2. **Define the metrics.** Agree once on what "active customer" or "monthly revenue" means, and build it into the warehouse.
3. **Report.** Give each team dashboards built on those shared definitions.
4. **Predict.** With clean history and agreed metrics, train models for the decisions that matter most.
5. **Automate and add AI.** Put predictions into your tools and workflows, and build AI features on the same trusted data.

AI assistants follow the same rule. A chatbot that answers questions from your documents is only as good as the documents and data behind it; we explain why in [Retrieval-Augmented Generation, Explained](/blog/retrieval-augmented-generation-explained).

## A sensible first project

Start small and useful: connect your **three most important data sources** into one warehouse and build **one dashboard** that a team checks every day. A project like that typically takes from 3 weeks, pays for itself in saved reporting time, and becomes the foundation for everything after it.

Our [data engineering](/services/data-engineering) page explains how we build pipelines, warehouses and dashboards, and our [AI and automation](/services/ai-automation) page covers what comes next. For a starting-from estimate in your currency, try the [instant quote](/quote), or [book a free consultation](/book) to talk through your data.`,
  },
  {
    slug: "ai-automation-for-small-business",
    draft: true,
    title: "Five Processes Small Businesses Can Automate With AI This Month",
    excerpt: "You don't need a data science team to save hours every week. Five everyday processes that AI handles well today, what each takes to set up, and the guardrails that keep it safe.",
    tags: ["AI", "Automation", "Small Business"],
    coverAlt: "Five glowing steps joined by a dotted line, with a bright spark at the middle step",
    content: `Most small businesses don't need a custom AI model. They need the hours back that go into answering the same questions, copying data between tools and writing up the same reports every week. Today's AI tools are good at exactly that kind of work, as long as you pick the right processes and keep a person in the loop where it matters.

Here are five that pay off quickly, roughly from easiest to most involved.

## 1. Answering common customer questions

**What it does:** a chatbot on your website or WhatsApp answers questions about opening hours, prices, delivery, policies and services, using *your* content: your FAQs, service pages and documents. When it can't answer, it hands over to a person and captures the customer's details.

**Why it works now:** with retrieval-augmented generation (RAG), the assistant looks up the relevant passage before answering, so it quotes your information instead of making things up. We explain how in [Retrieval-Augmented Generation, Explained](/blog/retrieval-augmented-generation-explained).

**Guardrail:** tell it to answer only from your content and to say "I don't know" otherwise. Review a sample of conversations every week for the first month.

## 2. Sorting and routing your inbox

**What it does:** every incoming email or form submission is read, labelled (sales enquiry, support request, invoice, spam), the key details are pulled out (name, company, what they need, urgency) and it is sent to the right person or tool, often with a draft reply attached.

**Why it works now:** classifying and extracting from short messages is one of the things language models do most reliably.

**Guardrail:** let AI *draft* replies, but have a person send them until you trust the results.

## 3. Turning documents into data

**What it does:** invoices, receipts, purchase orders, delivery notes and application forms arrive as PDFs or photos. AI reads them, extracts the fields you need (supplier, date, amounts, line items) and enters them into your accounting system, spreadsheet or CRM.

**Why it works now:** modern models read scanned and photographed documents well, including ones with inconsistent layouts that older template-based tools struggled with.

**Guardrail:** check totals automatically (do the line items add up?) and send anything that fails, or anything above a value you set, for a person to approve.

## 4. Meeting notes and follow-ups

**What it does:** calls and meetings are transcribed and summarised into decisions, action items and owners, which are then added to your CRM or task tool, and a follow-up email is drafted for the client.

**Why it works now:** transcription and summarisation are mature, and many video-call tools now include them.

**Guardrail:** ask for consent before recording, and keep recordings and transcripts in your own accounts with a clear retention period, especially for clients in the UK and EU.

## 5. Weekly reports that write themselves

**What it does:** every Monday, numbers from your sales, bookings, website and finance tools are pulled together, compared with last week and turned into a short written summary with the three things worth attention.

**Why it works now:** the AI does the writing; the numbers come from your systems, so the figures themselves are exact. The work is in connecting the data sources reliably, which is a [data engineering](/services/data-engineering) job.

**Guardrail:** have the report link to the underlying figures, so anyone can check them.

## How to choose where to start

Pick the process that scores highest on all four:

| Question | Good sign |
| --- | --- |
| How often does it happen? | Daily or weekly |
| How much time does it take? | Hours per week, across the team |
| Does it follow clear rules? | Most cases look alike, with a few exceptions |
| What happens if it's wrong? | A person can catch it before it matters |

Start with one, measure the time saved for a month, then do the next.

## Off-the-shelf or custom?

For simple flows between popular apps, automation platforms such as Zapier, Make or n8n with an AI step are often enough, and quick to try. Custom work pays off when the process touches your own systems or databases, needs your documents as a knowledge base, handles sensitive data, or runs at a volume where per-task fees add up.

## A word on data

Whatever you build, use AI providers' **business** plans or APIs, which don't train on your data, keep documents in your own accounts, and give the system access to only what it needs.

If you'd like help picking and building the first one, our [AI and automation](/services/ai-automation) team builds chatbots, document Q&A and workflow automation on your own data. Get a starting-from estimate in your currency with the [instant quote](/quote), or [book a free consultation](/book).`,
  },
  {
    slug: "hiring-offshore-developers-checklist",
    draft: true,
    title: "Hiring Offshore Developers: What to Check Before You Sign",
    excerpt: "Time zones, contracts, code ownership, data protection and how you'll actually work together: a practical checklist for UK and European companies hiring a development team abroad.",
    tags: ["Outsourcing", "Mobile", "Web", "Hiring"],
    coverAlt: "Two clock faces in blue and orange overlapping, with the shared area glowing yellow",
    content: `Hiring a development team in another country can give you senior engineers at a lower cost than hiring locally, and often faster. It can also go badly: missed deadlines, code you can't maintain, or a dispute over who owns what. The difference is almost always in what was checked before the contract was signed.

This checklist is written for UK and European companies, but most of it applies wherever you are.

## 1. Working hours you can actually share

Time-zone overlap matters more than distance. You want several hours a day when both teams are online, for calls, quick questions and reviews.

- **Ask for the team's working hours in your time zone**, including how they handle daylight saving changes.
- **Agree on core overlap hours** for meetings and fast responses.
- **East Africa** is a good example: Nairobi is UTC+3 all year, which is 2–3 hours ahead of the UK and 1–2 hours ahead of Central Europe, so nearly the whole working day overlaps.

A team 8–12 hours away can still work well, but every question takes a day to answer, and that adds up over a project.

## 2. Evidence of real work

- **Live projects you can open**: apps in the stores, websites you can use, not just screenshots.
- **References** from clients who'll take a call, ideally in your industry or market.
- **The people, not just the company**: who exactly will work on your project, and what have they built?
- **A paid trial or discovery phase**: a small, well-defined first piece of work shows you how they communicate, estimate and deliver before you commit to the whole project.

## 3. A contract that protects you

Have a lawyer review the contract, and make sure it covers:

| Clause | What to look for |
| --- | --- |
| Intellectual property | All code, designs and documentation are **assigned to you**, on payment, with no reuse restrictions |
| Confidentiality | An NDA covering your business information and data |
| Scope and change | A written scope, and a clear process for pricing changes |
| Payment | Milestones tied to delivered, working software, not just time passing |
| Warranty | A period after launch in which defects are fixed at no cost |
| Termination and handover | You can end the contract and receive the code, credentials and documentation promptly |
| Governing law | Which country's law applies and how disputes are resolved |

## 4. You own the code and the accounts

Ownership on paper isn't enough; you need control in practice.

- **Repositories in your account** (GitHub, GitLab or Bitbucket), with the team invited as members.
- **Cloud, app store, domain and third-party accounts in your company's name**, not the agency's.
- **Credentials stored in a shared password manager** you control.
- **No lock-in:** mainstream technologies and documented setup, so another team could take over if needed.

## 5. Data protection and GDPR

If the team will handle personal data of people in the UK or EU, data protection law applies to how they do it.

- **A data processing agreement** that sets out what they may do with personal data.
- **A lawful basis for the transfer abroad.** For countries without an adequacy decision, this usually means the EU Standard Contractual Clauses or, for UK data, the International Data Transfer Agreement or the UK Addendum.
- **Data minimisation:** where possible, developers work with test or anonymised data, and production data stays in your own cloud accounts, in the UK or EU region if you need it.
- **Security basics:** access on a need-to-know basis, multi-factor authentication, and access removed when people leave the project.

This isn't legal advice; your lawyer or data protection officer should confirm what applies to you.

## 6. How you'll work together

- **One named point of contact** who speaks for the team and answers within agreed hours.
- **Regular demos of working software**, every week or two, not just status reports.
- **Shared tools**: you can see the task board, the code and the test builds at any time.
- **Code quality practices**: code review, automated tests and a staging environment where you test before release.
- **Clear language**: written English good enough for specifications and documentation, not just conversation.

## 7. After launch

Ask what happens once the project is live: who fixes bugs, who updates the app when iOS and Android change, how quickly urgent issues are handled, and what a support plan costs. A team that talks about this before you sign is a team planning to be around.

## The short version

Choose a team whose hours overlap with yours, whose work you can see and whose clients will vouch for them. Sign a contract that assigns you the code, and keep the accounts in your name. Start with a small paid piece of work, and judge them by working software, not promises.

We're a [mobile](/services/mobile-app-development) and [web development](/services/web-development) team in Nairobi. If you're comparing options, [book a free consultation](/book) and ask us anything on this list, or get a starting-from estimate in your currency with the [instant quote](/quote).`,
  },
];
