import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import Subscriber from "@/models/SubscriberModel";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = { title: "Subscribers" };

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(date);

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const isFromLastWeek = (date) => Date.now() - date.getTime() <= WEEK_MS;

export default async function AdminDashboard() {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
  const stats = [
    { label: "Total subscribers", value: subscribers.length },
    { label: "Active", value: subscribers.filter((s) => s.isActive !== false).length },
    { label: "Joined in the last 7 days", value: subscribers.filter((s) => isFromLastWeek(s.createdAt)).length },
  ];

  return (
    <div>
      <AdminHeader title="Newsletter subscribers" email={admin.email} current="/admin" />

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg p-4 ring-1 ring-border">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {subscribers.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No one has subscribed yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg ring-1 ring-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">#</th>
                <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Subscribed</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((subscriber, i) => (
                <tr key={subscriber._id.toString()}>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 break-all">
                    <a href={`mailto:${subscriber.email}`} className="hover:underline">{subscriber.email}</a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(subscriber.createdAt)}</td>
                  <td className="px-4 py-3">
                    {subscriber.isActive !== false ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
