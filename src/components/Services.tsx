import { SERVICES } from '@/constants'
import Image, { type StaticImageData } from 'next/image'
// RealHive's own property app (also on /portfolio): a scene photo, so its edges fade into the page
import realhiveApp from '../../public/images/realhive-app.webp'
import React from 'react'

const Services = () => {
  return (
    <section className="section-y flex flex-col overflow-hidden">
      <div className="max-container padding-container relative flex flex-col gap-10 lg:flex-row">
        <div className="flex items-start lg:flex-1">
          <Image
            src={realhiveApp}
            alt="The RealHive property app, built by our team, open on a phone"
            sizes="(min-width: 1024px) 400px, calc(100vw - 48px)"
            placeholder="blur"
            className="fade-edges h-auto w-full"
          />
        </div>

        <div className="z-20 flex w-full flex-col lg:w-[60%]">
          <div className='relative'>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Our Services</h2>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
            {SERVICES.map((service) => (
              <ServiceItem 
                key={service.title}
                title={service.title} 
                icon={service.icon}
                description={service.description}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

type ServiceIcon = StaticImageData | { light: StaticImageData; dark: StaticImageData };

type ServiceItemProps = {
  title: string;
  icon: ServiceIcon;
  description: string;
}

// Transparent artwork straight on the page (no badge behind it). Themed icons
// render both versions and CSS shows one; the hidden lazy image isn't fetched.
// A fixed `width` (height follows the image's ratio) makes next/image offer
// only 1x/2x versions, so high-DPR phones don't fetch 3x copies of a 64px icon.
const ICON_HEIGHT = 64
const iconWidth = (img: StaticImageData) => Math.round((img.width / img.height) * ICON_HEIGHT)

const ServiceIconImage = ({ icon, title }: { icon: ServiceIcon; title: string }) => {
  const imageClass = "h-16 w-auto object-contain"
  if ("light" in icon) {
    return (
      <>
        <Image src={icon.light} alt={title} width={iconWidth(icon.light)} quality={60} className={`${imageClass} dark:hidden`} />
        <Image src={icon.dark} alt={title} width={iconWidth(icon.dark)} quality={60} className={`${imageClass} hidden dark:block`} />
      </>
    )
  }
  return <Image src={icon} alt={title} width={iconWidth(icon)} quality={60} className={imageClass} />
}

const ServiceItem = ({ title, icon, description }: ServiceItemProps) => {
  return (
    <li className="flex w-full flex-1 flex-col items-start">
      <div className="flex h-16 items-center">
        <ServiceIconImage icon={icon} title={title} />
      </div>
      <h3 className="mt-5 text-xl font-semibold capitalize lg:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-justify text-muted-foreground">
        {description}
      </p>
    </li>
  )
}

export default Services