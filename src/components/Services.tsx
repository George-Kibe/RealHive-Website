import { SERVICES } from '@/constants'
import Image, { type StaticImageData } from 'next/image'
import React from 'react'

const Services = () => {
  return (
    <section className="section-y">
      <div className="max-container padding-container">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Our Services</h2>
        {/* One column on phones, a 2x2 grid from tablets up: four cards across
            the 1152px container would leave each description only a few words wide. */}
        <ul className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:gap-8">
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
    </section>
  )
}

type ServiceIcon = StaticImageData | { light: StaticImageData; dark: StaticImageData };

type ServiceItemProps = {
  title: string;
  icon: ServiceIcon;
  description: string;
}

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
    <li className="flex flex-col rounded-2xl p-6 ring-1 ring-border sm:p-8">
      <div className="flex h-16 items-center">
        <ServiceIconImage icon={icon} title={title} />
      </div>
      <h3 className="mt-5 text-xl font-semibold lg:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-muted-foreground">
        {description}
      </p>
    </li>
  )
}

export default Services