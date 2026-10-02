import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import { formatMoney } from "@/lib/quote/format";
import { TIERS, countryName } from "@/lib/quote/regions";
import Quote from "@/models/QuoteModel";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = { title: "Quotes" };

// local amount as the visitor saw it, plus the USD equivalent for comparison
const both = (local, usd, currency) =>
  currency === "USD" || usd == null ? formatMoney(local, currency) : `${formatMoney(local, currency)} (≈ ${formatMoney(usd, "USD")})`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" }).format(date);

// Quotes visitors had emailed to themselves from /quote: a list of sales leads.
export default async function AdminQuotesPage() {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(500).lean();

  return (
    <div>
      <AdminHeader title="Quote requests" email={admin.email} current="/admin/quotes" />
      <p className="mt-4 text-sm text-muted-foreground">
        Estimates visitors emailed to themselves from the quote page, newest first. Downloads without an email aren&apos;t recorded.
        Country and pricing tier are visible only here and in the team notification email, never to the visitor.
      </p>
      {quotes.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No quote requests yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {quotes.map((q) => (
            <li key={q._id.toString()} className="rounded-lg p-4 ring-1 ring-border">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  {q.name}
                  {q.company && <span className="font-normal text-muted-foreground"> · {q.company}</span>}
                </p>
                <p className="text-sm text-muted-foreground">{q.reference} · {formatDate(q.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm">
                <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Your RealHive estimate ${q.reference}`)}`} className="text-brand hover:underline">{q.email}</a>
                <span className="text-muted-foreground">
                  {" · "}{q.country ? countryName(q.country) : "Location unknown"} · {TIERS[q.tier]?.label ?? q.tier} · {q.buildLevel === "production" ? "Production-grade" : "MVP"}
                </span>
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {q.items.map((item) => (
                  <li key={item.serviceId} className="flex justify-between gap-4">
                    <span><span className="font-medium">{item.name}</span>{item.details && <span className="text-muted-foreground">: {item.details}</span>}</span>
                    <span className="shrink-0 tabular-nums">from {both(item.from, item.fromUsd, q.currency)}{item.monthly && "/mo"}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-semibold">
                Project from {both(q.projectFrom, q.projectFromUsd, q.currency)}
                {q.monthlyFrom > 0 && <> · support from {both(q.monthlyFrom, q.monthlyFromUsd, q.currency)}/mo</>}
              </p>
              {q.notes && <p className="mt-2 whitespace-pre-line rounded bg-muted p-2 text-sm">{q.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
