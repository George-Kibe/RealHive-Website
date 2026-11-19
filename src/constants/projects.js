// Portfolio projects, shown on /portfolio and as "recent work" on the service
// pages (servicePages.js refers to them by id). Real, shipped projects only.
import EcommerceImage from "../../public/projects/ecommerce1.png";
import RealHiveImage from "../../public/projects/realhive.jpg";
import CompanyImage from "../../public/projects/company.png";
import HauteCornerImage from "../../public/projects/haute-corner.jpg";
import MernBnbImage from "../../public/projects/mernbnb.png";

export const PROJECTS = {
  buenasStore: {
    type: "Web Application",
    title: "Buenas Electronics Store",
    summary: "An online store for an electronics shop with the full shopping flow: product catalogue, latest arrivals, browsing by category, a cart and Stripe checkout.",
    image: EcommerceImage,
    link: "https://buenas-ecommerce.vercel.app",
    github: "https://github.com/George-Kibe/Ecommerce-next",
  },
  realhiveApp: {
    type: "Mobile Application",
    title: "RealHive",
    summary: "Inspired by Airbnb, a React Native app that matches property seekers with property owners, and tenants with landlords.",
    image: RealHiveImage,
    link: "https://play.google.com/store/apps/details?id=com.realhive.app",
    github: "https://github.com/George-Kibe",
  },
  buenasConsultants: {
    type: "Website",
    title: "Buenas Consultants",
    summary: "A company website for an IT consultancy, presenting its services and projects, with a blog on trends in the industry.",
    image: CompanyImage,
    link: "https://buenas-portfolio.vercel.app/",
    github: "https://github.com/George-Kibe/Nextjs",
  },
  hauteCorner: {
    type: "Mobile Application",
    title: "Haute Corner",
    summary: "An e-commerce mobile app built with React Native and AWS Amplify: product catalogue, latest arrivals, browsing by category, a cart and Stripe checkout.",
    image: HauteCornerImage,
    link: "https://play.google.com/store/apps/details?id=com.hautecorner.app",
    github: "https://github.com/George-Kibe/Haute-corner",
  },
  mernbnb: {
    type: "Web Application",
    title: "Mernbnb",
    summary: "Inspired by Airbnb, a web app for booking holiday homes, where guests book stays and view their accommodation. Built on the MERN stack (MongoDB, Express, React, Node.js) with AWS for cloud storage.",
    image: MernBnbImage,
    link: "https://mernbnb.vercel.app/",
    github: "https://github.com/George-Kibe/Mernbnbclone",
  },
};
