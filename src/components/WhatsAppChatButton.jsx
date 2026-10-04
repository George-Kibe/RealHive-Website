"use client"

import { usePathname } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import { WHATSAPP } from "@/constants";

/**
 * Floating "Chat with us" WhatsApp button on every public page. Opens a chat
 * with the company number, first message pre-filled. Clicks are tracked as
 * `contact_click` (method "whatsapp") by the delegated listener in
 * GoogleAnalytics.jsx. Hidden in the admin panel; raised on /quote so it sits
 * above that page's sticky price bar. Dark green text on WhatsApp green keeps
 * the label readable (white on #25D366 fails contrast).
 */
const WhatsAppChatButton = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const raised = pathname === "/quote";

  return (
    <a
      href={WHATSAPP.chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp (${WHATSAPP.number})`}
      className={`fixed right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#052e16] shadow-lg ring-1 ring-black/10 transition hover:bg-[#20bd5a] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] print:hidden sm:right-6 ${raised ? "bottom-20" : "bottom-4 sm:bottom-6"}`}
    >
      <BsWhatsapp aria-hidden="true" className="h-5 w-5" />
      Chat with us
    </a>
  );
};

export default WhatsAppChatButton;
