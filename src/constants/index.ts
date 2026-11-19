// NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/aboutus', key: 'aboutUs', label: 'About Us' },
  { href: '/services', key: 'services', label: 'Services' },
  { href: '/portfolio', key: 'portfolio ', label: 'Portfolio ' },
  { href: '/blog', key: 'blog', label: 'Blog' },
  { href: '/contacts', key: 'contact_us', label: 'Contact Us' },
];

// SERVICES
// Every offering, in display order: the homepage shows the ones with a page
// (slug -> /services/<slug>, see constants/servicePages.js), /services shows all.
// Icons are static imports so next/image knows their size. The data artwork has
// a version per theme because its grey/white text would vanish on one background.
import serviceWeb from "../../public/images/service-web.webp";
import serviceMobile from "../../public/images/service-mobile.webp";
import serviceDataLight from "../../public/images/service-data-light.webp";
import serviceDataDark from "../../public/images/service-data-dark.webp";
import serviceBigDataLight from "../../public/images/service-bigdata-light.webp";
import serviceBigDataDark from "../../public/images/service-bigdata-dark.webp";
import serviceCloud from "../../public/images/service-cloud.webp";

export const SERVICES = [
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    icon: serviceMobile,
    description:
      "iOS and Android apps built with React Native, Flutter or native code, from a first MVP to a production app with payments, maps, chat and offline mode.",
  },
  {
    title: "Web Development",
    slug: "web-development",
    icon: serviceWeb,
    description:
      "Custom web applications, SaaS products, portals and online stores built with Next.js and React: fast, secure, search-friendly and easy to manage.",
  },
  {
    title: "Data Engineering",
    slug: "data-engineering",
    icon: { light: serviceBigDataLight, dark: serviceBigDataDark },
    description:
      "Data pipelines, ETL, data warehouses and dashboards that bring scattered data together into reporting your team can trust.",
  },
  {
    title: "AI & Automation",
    slug: "ai-automation",
    icon: { light: serviceDataLight, dark: serviceDataDark },
    description:
      "AI chatbots and document Q&A built on your own data, workflow automation, predictive models and AI features for your app.",
  },
  {
    title: "Cloud Consultancy",
    icon: serviceCloud,
    description:
      "Migration to the cloud, infrastructure as code and CI/CD, and security and cost reviews of the cloud setup you already have.",
  },
  {
    title: "Support and Maintenance",
    icon: serviceMobile,
    description:
      "We keep your website, app or data platform running after launch: security patches, dependency and OS updates, monitoring, bug fixes and new features.",
  },
];

// WhatsApp: the company number (+254 795 288 155, same as CONTACT.telephone in
// lib/schema.js) as a wa.me chat link. `chatUrl` pre-fills a first message.
const WHATSAPP_NUMBER = '254795288155';
export const WHATSAPP = {
  number: `+${WHATSAPP_NUMBER}`,
  url: `https://wa.me/${WHATSAPP_NUMBER}`,
  chatUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi RealHive Consultants, I'd like to talk about a project.")}`,
};

// FOOTER SECTION
export const FOOTER_ABOUT = {
  description:
    'RealHive Consultants is a software development company in Nairobi, Kenya. We build web and mobile apps, data pipelines and AI solutions for startups and growing businesses around the world.',
  tagline: 'Transforming ideas into reality through code',
};

export const FOOTER_LINKS = [
  {
    title: 'Our Company',
    links: [
      { href: '/aboutus', name: 'About Us' },
      { href: '/portfolio', name: 'Portfolio' },
      { href: '/blog', name: 'Blog' },
      { href: '/careers', name: 'Careers' },
      { href: '/quote', name: 'Get a Quote' },
      { href: '/book', name: 'Book a Consultation' },
    ],
  },
  {
    // Each service with its own page links there; the rest open the /services overview.
    title: 'Our Services',
    links: SERVICES.slice(0, 5).map((s) => ({ href: s.slug ? `/services/${s.slug}` : '/services', name: s.title })),
  },
];

// Phone and email come from CONTACT in lib/schema.js (the verified details);
// these are the remaining contact entries shown in the footer.
export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  whatsapp: WHATSAPP.url,
  location: 'Nairobi, Kenya · working with clients worldwide',
};

// `href: null` shows the icon without a link (YouTube, until the channel URL is added).
// Add a profile to SAME_AS in lib/schema.js only once it has a real URL.
export const SOCIALS = {
  title: 'Social',
  links: [
    { name: 'WhatsApp', icon: '/whatsapp.svg', href: WHATSAPP.url, label: `Chat with RealHive Consultants on WhatsApp (${WHATSAPP.number})` },
    { name: 'Instagram', icon: '/instagram.svg', href: 'https://www.instagram.com/realhiveconsultants/' },
    { name: 'X', icon: '/x.svg', href: 'https://x.com/kibegeorge_' },
    { name: 'YouTube', icon: '/youtube.svg', href: null },
  ],
};
