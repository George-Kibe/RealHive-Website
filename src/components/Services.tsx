import { SERVICES } from '@/constants'
import Image, { type StaticImageData } from 'next/image'
import phone from '../../public/images/phone.webp'
import React from 'react'

const Services = () => {
  return (
    <section className="flex flex-col overflow-hidden  bg-center bg-no-repeat py-24">
      <div className="flex-col md:flex-row  max-container padding-container relative w-full flex justify-end rounded-lg ">
        <div className="flex flex-1">
          <Image
            src={phone}
            alt="A mobile app shown on a phone"
            sizes="(min-width: 768px) 400px, 70vw"
            className="h-auto w-full max-w-[400px] object-contain rotate-6"
          />
        </div>

        <div className="z-20 flex w-full flex-col lg:w-[60%]">
          <div className='relative mt-10'>
            <h2 className="bold-40 lg:bold-64">Our Services</h2>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:mg-20 lg:gap-20">
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
      <h2 className=" lg:bold-32 mt-5 capitalize">
        {title}
      </h2>
      <p className="regular-16 mt-5 text-justify text-gray-30 lg:mt-[30px] lg:bg-none">
        {description}
      </p>
    </li>
  )
}

export default Services