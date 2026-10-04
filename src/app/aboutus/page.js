import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import WebAndMobileImage from "../../../public/images/web-and-mobile.webp"
import Team from '@/components/Team'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'About Our Software Engineering Team',
  description:
    'RealHive Consultants Limited is a software development company delivering web, mobile, data science and cloud engineering. Meet the team and how we work.',
  path: '/aboutus',
})

const Button = ({text, url}) => {
  return (
    <Link href={url} className={buttonVariants({ variant: 'brand', size: 'lg' })}>
      {text}
    </Link>
  )
}
const AboutUsPage = () => {
  return (
    <div className='max-container padding-container page-y'>
      <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[75vh] mb-12 sm:mb-16">
        {/* The page's largest above-the-fold image, so it's preloaded. Its
            background is removed, so it sits directly on the page. */}
        <Image
          src={WebAndMobileImage}
          fill
          preload
          sizes="(min-width: 1280px) 1200px, 100vw"
          alt="Web and mobile app development: responsive sites on desktop, tablet and phone"
          className='object-contain'
        />
        <div className="absolute bottom-4 left-0 bg-brand text-brand-foreground p-2 rounded-md">
          <h1 className="font-bold text-[30px]">Web, Mobile, Data</h1>
          {/* No hardcoded text colour here: the label inherits
              text-brand-foreground, which flips to dark ink in dark mode.
              Leaving it as text-white would drop to 2.22:1 on the bright
              logo blue. */}
          <h2 className="font-semibold">Digital product experts</h2>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className='flex-1'>
          <h2 className="mb-4 font-bold text-[25px] md:text-[40px]">Who are We?</h2>
          <p className="mb-4 text-justify">
          RealHive Consultants Limited is a software development company that provides a range of technology services, including web application development, mobile application development, data science solutions, and data engineering consultancy.
          </p>
          <Button url={"/contacts"} text={"Contact"}/>
        </div>
        <div className='flex-1'>
          <h2 className="mb-4 font-bold text-[25px] md:text-[40px]">Our Offering</h2>
          <p className="mb-4 text-justify">
            We engage with clients through initial consultations to understand their specific requirements and objectives. We offer flexible engagement models, such as fixed-price projects, hourly consulting, and long-term partnerships.
          </p>
          <Button url={"/portfolio"} text={"Portfolio"}/>
        </div>        
      </div>
      <Team />
    </div>
  )
}

export default AboutUsPage
