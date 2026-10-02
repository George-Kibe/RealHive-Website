import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const links = [
  { href: "/admin", label: "Subscribers" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
];

const AdminHeader = ({ title, email, current }) => (
  <div className="border-b border-border pb-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav aria-label="Admin" className="flex gap-1 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current === link.href ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 font-medium ${
              current === link.href ? "bg-muted ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <AdminLogoutButton />
    </div>
    <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
    <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
  </div>
);

export default AdminHeader;
