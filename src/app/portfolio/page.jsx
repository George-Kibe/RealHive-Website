import AnimatedText from '@/components/AnimatedText'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { SocialIcon } from 'react-social-icons';
import React from 'react'
import MernBnbImage from "../../../public/projects/mernbnb.png"
import EcommerceImage from "../../../public/projects/ecommerce1.png"
import CompanyImage from "../../../public/projects/company.png"
import RealHiveImage from "../../../public/projects/realhive.jpg"
import HauteCornerImage from "../../../public/projects/haute-corner.jpg"
import { FramerImage } from '@/utils/FramerImage';
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Our Work: Web & Mobile Projects',
  description:
    'See the web and mobile applications we have designed, built and shipped, each with the problem it solved, the stack behind it and a live link to open.',
  path: '/portfolio',
})

const style={width:40, height:40}

const FeaturedProject = ({type, title, summary, image, link, github}) => {
  return(
    <article className="w-full flex flex-col md:flex-row md:items-center justify-between relative rounded-br-2xl
        gap-6 rounded-3xl border border-solid border-border bg-card shadow-2xl p-4 sm:p-6 md:gap-8 lg:p-10">
      <Link href={link} target='_blank' className='w-full cursor-pointer overflow-hidden rounded-lg'>
        <FramerImage title={title} image={image} sizes="(min-width: 768px) 520px, calc(100vw - 64px)"
          className="h-auto w-full rounded-lg object-cover"
        />
      </Link>
      <div className="w-full flex flex-col items-start justify-between">
        <span className="text-primary dark:text-gray-300 font-medium">{type}</span>
        <Link href={link} className='hover:underline underline-offset-2' target='_blank'>
          <h2 className="my-2 w-full text-left text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
        </Link>
        <p className="my-2 font-medium">{summary}</p>
        <div className="mt-2 flex items-center">
          <div className="border border-border bg-white rounded-full p-1">
            <SocialIcon url={github} style={style} target={"_blank"} />
          </div>          
          <Link
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className={buttonVariants({ variant: 'brand', size: 'lg', className: 'ml-4' })}
          >Live Project</Link>
        </div>
      </div>
    </article>
  )
}
const Project = ({type, title, summary, image, link, github}) => {
  return(
    <article className="w-full flex flex-col gap-4 items-center justify-center
     h-full rounded-3xl border border-solid border-border bg-card shadow-2xl p-4 sm:p-6 lg:p-10">
      <Link href={link} target='_blank' className='w-full cursor-pointer overflow-hidden rounded-lg'>
        <FramerImage title={title} image={image} sizes="(min-width: 768px) 520px, calc(100vw - 64px)"
          className="h-auto w-full rounded-lg object-cover"
        />
      </Link>
      <div className="w-full flex flex-col items-start justify-between">
        <span className="text-primary font-medium dark:text-gray-300">{type}</span>
        <Link href={link} className='hover:underline underline-offset-2' target='_blank'>
          <h2 className="my-2 w-full text-left text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
        </Link>
        <p className="my-2 font-medium">{summary}</p>
        <div className="mt-2 flex items-center">
          <div className="border border-border bg-white rounded-full p-1">
            <SocialIcon url={github} style={style} target={"_blank"} />
          </div>          
          <Link
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className={buttonVariants({ variant: 'brand', size: 'lg', className: 'ml-4' })}
          >Live Project</Link>
        </div>
      </div>
    </article>
  )
}

const page = () => {
  return (
    <div className='max-container padding-container page-y flex flex-col'>
      <div className='flex flex-col gap-6 md:gap-8'>
        <AnimatedText text={"A demo is worth a thousand words"}/> 
        <div>
          <FeaturedProject 
            type={"Web Application"}
            title={"Buenas Electronics Store"}
            summary={"An online store for an electronics shop with the full shopping flow: product catalogue, latest arrivals, browsing by category, a cart and Stripe checkout."}
            image={EcommerceImage}
            link={"https://buenas-ecommerce.vercel.app"}
            github={"https://github.com/George-Kibe/Ecommerce-next"}  
          />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="md:w-1/2">
            <Project 
              type={"Mobile Application"}
              title={"RealHive"}
              summary={"Inspired by Airbnb, a React Native app that matches property seekers with property owners, and tenants with landlords."}
              image={RealHiveImage}
              link={"https://play.google.com/store/apps/details?id=com.realhive.app"}
              github={"https://github.com/George-Kibe"}
            />
          </div>
          <div className="md:w-1/2">
            <Project 
              type={"Website"}
              title={"Buenas Consultants"}
              summary={"A company website for an IT consultancy, presenting its services and projects, with a blog on trends in the industry."}
              image={CompanyImage}
              link={"https://buenas-portfolio.vercel.app/"}
              github={"https://github.com/George-Kibe/Nextjs"}
            />
          </div>
        </div>
        <div>
          <FeaturedProject 
            type={"Mobile Application"}
            title={"Haute Corner"}
            summary={"An e-commerce mobile app built with React Native and AWS Amplify: product catalogue, latest arrivals, browsing by category, a cart and Stripe checkout."}
            image={HauteCornerImage}
            link={"https://play.google.com/store/apps/details?id=com.hautecorner.app"}
            github={"https://github.com/George-Kibe/Haute-corner"}  
          />
        </div>
        <div>
          <FeaturedProject
            type={"Web Application"}
            title={"Mernbnb"}
            summary={"Inspired by Airbnb, a web app for booking holiday homes, where guests book stays and view their accommodation. Built on the MERN stack (MongoDB, Express, React, Node.js) with AWS for cloud storage."}
            image={MernBnbImage}
            link={"https://mernbnb.vercel.app/"}
            github={"https://github.com/George-Kibe/Mernbnbclone"}
          />
        </div>
      </div>
    </div>
  )
}

export default page