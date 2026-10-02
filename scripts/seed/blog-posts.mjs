/**
 * Seed blog posts for `npm run seed-blog`. Each `slug` matches a cover image in
 * ./blog-covers/<slug>.png, uploaded to Cloudinary as realhive/blog/seed/<slug>.
 * `daysAgo` staggers the publish dates so the blog list has a natural order.
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
];
