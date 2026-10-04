// NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/aboutus', key: 'aboutUs', label: 'About Us' },
  { href: '/services', key: 'services', label: 'Services' },
  { href: '/portfolio', key: 'portfolio ', label: 'Portfolio ' },
  { href: '/blog', key: 'blog', label: 'Blog' },
  { href: '/contacts', key: 'contact_us', label: 'Contact Us' },
];

// SERVICES SECTION
// Icons are static imports so next/image knows their size and can serve
// AVIF/WebP at the requested width. The data artwork has a version per theme
// (see FramerImage / ServiceIcon) because its grey/white text would vanish on
// one of the two backgrounds.
import serviceWeb from "../../public/images/service-web.webp";
import serviceMobile from "../../public/images/service-mobile.webp";
import serviceDataLight from "../../public/images/service-data-light.webp";
import serviceDataDark from "../../public/images/service-data-dark.webp";
import serviceBigDataLight from "../../public/images/service-bigdata-light.webp";
import serviceBigDataDark from "../../public/images/service-bigdata-dark.webp";

export const SERVICES = [
  {
    title: 'Web Application Development',
    icon: serviceWeb,
    variant: 'green',
    description:
      'We offer custom web application development services, creating responsive, user-friendly web solutions for our clients. Our team of experienced developers and designers work closely with clients to build web applications tailored to their specific needs.',
  },
  {
    title: 'Mobile Application Development',
    icon: serviceMobile,
    variant: 'green',
    description:
      "We specialize in developing mobile applications for iOS and Android platforms. We create native and cross-platform apps, focusing on user experience and functionality.",
  },
  {
    title: 'Data Science Solutions',
    icon: { light: serviceDataLight, dark: serviceDataDark },
    variant: 'green',
    description:
      'We provide data science services, including data analysis, machine learning, predictive analytics, and data visualization. Our expertise helps clients harness the power of their data to make informed business decisions.',
  },
  {
    title: 'Data Engineering and Cloud Computing Consultancy',
    icon: { light: serviceBigDataLight, dark: serviceBigDataDark },
    variant: 'orange',
    description:
      'Our data engineering experts assist clients in setting up data pipelines, data warehousing, and ETL (Extract, Transform, Load) processes. We ensure data is well-structured, accessible, and ready for analysis.',
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
    // Each service gets its own page in phase 2 of the SEO plan; until then they all open /services.
    title: 'Our Services',
    links: [
      { href: '/services', name: 'Web Application Development' },
      { href: '/services', name: 'Mobile App Development' },
      { href: '/services', name: 'Data Engineering' },
      { href: '/services', name: 'AI & Automation' },
      { href: '/services', name: 'Cloud Consultancy' },
    ],
  },
];

// Phone and email come from CONTACT in lib/schema.js (the verified details);
// these are the remaining contact entries shown in the footer.
export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  whatsapp: WHATSAPP.url,
  location: 'Nairobi, Kenya · working with clients worldwide',
};

// Only real profiles. YouTube: add { name: 'YouTube', icon: '/youtube.svg', href } once the channel exists
// (`href: null` would show the icon without a link).
export const SOCIALS = {
  title: 'Social',
  links: [
    { name: 'WhatsApp', icon: '/whatsapp.svg', href: WHATSAPP.url, label: `Chat with RealHive Consultants on WhatsApp (${WHATSAPP.number})` },
    { name: 'Instagram', icon: '/instagram.svg', href: 'https://www.instagram.com/realhiveconsultants/' },
    { name: 'X', icon: '/x.svg', href: 'https://x.com/kibegeorge_' },
  ],
};
