// NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/aboutus', key: 'aboutUs', label: 'About Us' },
  { href: '/services', key: 'services', label: 'Services' },
  { href: '/portfolio', key: 'portfolio ', label: 'Portfolio ' },
  { href: '/careers', key: 'careers ', label: 'Careers ' },
  { href: '/contacts', key: 'contact_us', label: 'Contact Us' },
];

// CAMP SECTION
export const PEOPLE_URL = [
  '/person-1.png',
  '/person-2.png',
  '/person-3.png',
  '/person-4.png',
];

// SERVICES SECTION
export const SERVICES = [
  {
    title: 'Web Application Development',
    icon: '/web.jpg',
    variant: 'green',
    description:
      'We offer custom web application development services, creating responsive, user-friendly web solutions for our clients. Our team of experienced developers and designers work closely with clients to build web applications tailored to their specific needs.',
  },
  {
    title: 'Mobile Application Development',
    icon: '/application.jpg',
    variant: 'green',
    description:
      "We specialize in developing mobile applications for iOS and Android platforms. We create native and cross-platform apps, focusing on user experience and functionality.",
  },
  {
    title: 'Data Science Solutions',
    icon: '/data.jpeg',
    variant: 'green',
    description:
      'We provide data science services, including data analysis, machine learning, predictive analytics, and data visualization. Our expertise helps clients harness the power of their data to make informed business decisions.',
  },
  {
    title: 'Data Engineering and Cloud Computing Consultancy',
    icon: '/big-data.png',
    variant: 'orange',
    description:
      'Our data engineering experts assist clients in setting up data pipelines, data warehousing, and ETL (Extract, Transform, Load) processes. We ensure data is well-structured, accessible, and ready for analysis.',
  },
];

// FOOTER SECTION
export const FOOTER_LINKS = [
  {
    title: 'Learn More',
    links: [
      {"href": "/aboutus", "name":"About RealHive Consultants"},
      {"href": "/careers", "name":"Jobs"},
      {"href": "/privacy-policy", "name":"Privacy Policy"},
      {"href": "/contactus", "name":"Contact Us"},
    ],
  },
  {
    title: 'Our Focus',
    links: [
      {"href": "/portfolio", "name":"Mobile Development"},
      {"href": "/portfolio", "name":"🌐 Web Development"},
      {"href": "/portfolio", "name":"Data Science"},
      {"href": "/portfolio", "name":"Data Engineering"},
      ],
  },
];

export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  links: [
    { label: 'Our Contacts', value: '+254 795-288-155' },
    { label: 'Our Offices', value: '+Off Kamiti Road, Bayer Apt, Suite F2' },
    { label: 'Our Email', value: 'realHivecosultants@gmail.com' },
  ],
};

export const SOCIALS = {
  title: 'Social',
  links: [
    '/facebook.png',
    '/instagram.png',
    '/twitter.png',
    '/youtube.png',
  ],
};
