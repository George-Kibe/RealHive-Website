import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import WebAndMobileImage from "../../../public/web-and-mobile.png"
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
    <div className='padding-container max-container my-20'>
      <div className="relative w-[100%] h-[40vh] md:h-[60vh] lg:h[75vh] mb-20">
        <Image 
          src={WebAndMobileImage}
          fill
          alt='pexels image'
          className='rounded-xl object-contain '
        />
        <div className="absolute bottom-5 left-5 bg-brand text-brand-foreground p-2 rounded-md">
          <h1 className="font-bold text-[30px]">Web, Mobile, Data</h1>
          {/* No hardcoded text colour here: the label inherits
              text-brand-foreground, which flips to dark ink in dark mode.
              Leaving it as text-white would drop to 2.22:1 on the bright
              logo blue. */}
          <h2 className="font-semibold">Award winning Digital experts</h2>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className='py-5 flex-1 gap-10'>
          <h1 className="font-bold text-[25px] md:text-[40px]">Who are We?</h1>
          <p className="mb-4 text-justify">
          RealHive Consultants Limited is a software development company that provides a range of technology services, including web application development, mobile application development, data science solutions, and data engineering consultancy.
          </p>
          <Button url={"/contacts"} text={"Contact"}/>
        </div>
        <div className='py-5 flex-1'>
          <h1 className="font-bold text-[25px] md:text-[40px]">Our Offering</h1>
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
