import AnimatedText from '@/components/AnimatedText';
import { FramerImage } from '@/utils/FramerImage';
import WebImage from "../../../public/images/service-web.webp"
import ApplicationImage from "../../../public/images/service-mobile.webp"
import DataLightImage from "../../../public/images/service-data-light.webp"
import DataDarkImage from "../../../public/images/service-data-dark.webp"
import BigDataLightImage from "../../../public/images/service-bigdata-light.webp"
import BigDataDarkImage from "../../../public/images/service-bigdata-dark.webp"
import CloudImage from "../../../public/images/service-cloud.webp"

import React from 'react'
import FAQAccordion from '@/components/FAQAccordion';
import CallToAction from '@/components/CallToAction';
import Testimonials from '@/components/Testimonials';
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { servicesSchema } from '@/lib/schema'

// Testimonials come from the database. Admin edits revalidate this page
// immediately; the hourly fallback covers a missed revalidation.
export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Software Development Services',
  description:
    'Web application development, iOS and Android apps, data science and cloud data engineering, delivered by a senior team that works directly with you.',
  path: '/services',
})

const ServicesPage = () => {
  return (
    // page-y's top only: the last section's own section-y spacing ends the page
    <div className="pt-8 sm:pt-12">
      {/* Service nodes, generated from the same SERVICES constant that renders
          this page, so markup and visible content cannot diverge. */}
      <JsonLd schema={servicesSchema()} />
      <section className="max-container padding-container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-16">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Our Services
              </span>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-[40px]">
                <AnimatedText text={"What We Offer"} />
              </h2>
              <p className="text-base text-muted-foreground">
                From the first idea to a product in your customers&apos; hands: we design,
                build and support web, mobile, data and cloud solutions.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <ServiceCard
            title="Web Application Development"
            details=" We offer custom web application development services, creating responsive, user-friendly web solutions for our clients. Our team of experienced developers and designers work closely with clients to build web applications tailored to their specific needs."
            image={ WebImage}
          />
          <ServiceCard
            title="Mobile Application Development"
            details=" We specialize in developing mobile applications for iOS and Android platforms. We create native and cross-platform apps, focusing on user experience and functionality."
            image={ ApplicationImage}
          />
          <ServiceCard
            title="Data Science Solutions"
            details="We provide data science services, including data analysis, machine learning, predictive analytics, and data visualization. Our expertise helps clients harness the power of their data to make informed business decisions."
            image={{ light: DataLightImage, dark: DataDarkImage }}
          />
          <ServiceCard
            title="Data Engineering Consultancy"
            details="Our data engineering experts assist clients in setting up data pipelines, data warehousing, and ETL (Extract, Transform, Load) processes. We ensure data is well-structured, accessible, and ready for analysis."
            image={{ light: BigDataLightImage, dark: BigDataDarkImage }}
          />
          <ServiceCard
            title="Cloud Computing Consultancy"
            details="Whether you're looking to migrate to the cloud, optimize existing cloud infrastructure, or develop a customized cloud strategy, our team will work closely with you to ensure seamless integration, improved scalability, and enhanced security."
            image={ CloudImage}
          />
          <ServiceCard
            title="Support and Maintenance"
            details="We keep your website, app or data platform running after launch: security patches, dependency and OS updates, monitoring, bug fixes and new features as your business grows."
            image={ ApplicationImage}
          />
        </div>
      </section>
      <FAQAccordion />
      <CallToAction />
      <Testimonials />
    </div>
  );
};

export default ServicesPage

const ServiceCard = ({ image, title, details }) => {
  return (
    <>
      <div className="rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow hover:shadow-lg sm:p-8">
          {/* Transparent artwork straight on the card: no tile behind it */}
          <div className="mb-6 flex h-[200px] w-[200px] max-w-full items-center justify-center">
            {/* fixed width => only 1x/2x versions; decorative art, so quality 60 */}
            <FramerImage image={image} title={title} width={200} quality={60} className="h-full w-full object-contain" />
          </div>
          <h4 className="mb-3 text-xl font-semibold text-foreground">{title}</h4>
          <p className="text-muted-foreground">{details}</p>
      </div>
    </>
  );
};
