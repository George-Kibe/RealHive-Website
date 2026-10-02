// "12 Sept 2026" in Nairobi time; safe to call on the server and the client
export const formatPostDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeZone: "Africa/Nairobi" }).format(new Date(iso))
    : "";
