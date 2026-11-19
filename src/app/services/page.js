import { FramerImage } from '@/utils/FramerImage';
import Link from 'next/link'
import { SERVICES } from '@/constants'

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
    'Mobile app and web development, data engineering, AI and automation, and cloud consultancy, delivered by a senior team that works directly with you.',
  path: '/services',
})

const ServicesPage = () => {
  return (
    // page-y's top only: the last section's own section-y spacing ends the page
    <div className="pt-8 sm:pt-12">
      {/* An ItemList of the service pages plus Service nodes for the rest, built
          from the same SERVICES constant that renders this page. */}
      <JsonLd schema={servicesSchema()} />
      <section className="max-container padding-container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-16">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Our Services
              </span>
              <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-[40px]">
                Software development services
              </h1>
              <p className="text-base text-muted-foreground">
                From the first idea to a product in your customers&apos; hands: we design,
                build and support web, mobile, data and cloud solutions.
              </p>
            </div>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </ul>
      </section>
      <FAQAccordion />
      <CallToAction />
      <Testimonials />
    </div>
  );
};

export default ServicesPage

// A card per offering; the ones with their own page link to it.
const ServiceCard = ({ icon, title, description, slug }) => {
  const body = (
    <>
      {/* Transparent artwork straight on the card: no tile behind it */}
      <div className="mb-6 flex h-[200px] w-[200px] max-w-full items-center justify-center">
        {/* fixed width => only 1x/2x versions; decorative art, so quality 60 */}
        <FramerImage image={icon} title={title} width={200} quality={60} className="h-full w-full object-contain" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-brand">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {slug && <p className="mt-4 font-medium text-brand">Explore {title.toLowerCase()} <span aria-hidden="true">→</span></p>}
    </>
  );
  const className = "block h-full rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow hover:shadow-lg sm:p-8";
  return (
    <li>
      {slug ? <Link href={`/services/${slug}`} className={`group ${className}`}>{body}</Link> : <div className={className}>{body}</div>}
    </li>
  );
};
