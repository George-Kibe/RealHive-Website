import AnimatedText from '@/components/AnimatedText'
import Image from 'next/image'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons';
import React from 'react'
import MernBnbImage from "../../../public/projects/mernbnb.png"
import EcommerceImage from "../../../public/projects/ecommerce1.png"
import CompanyImage from "../../../public/projects/company.png"
import RealHiveImage from "../../../public/projects/realhive.png"
import HauteCornerImage from "../../../public/projects/haute-corner.png"
import { FramerImage } from '@/utils/FramerImage';

export const metadata = {
    title: 'Portfolio | Projects',
    description: 'Powered by Nextjs',
  }

const style={width:40, height:40}

const FeaturedProject = ({type, title, summary, image, link, github}) => {
  return(
    <article className="w-full flex flex-col md:flex-row md:items-center justify-between relative rounded-br-2xl
        rounded-3xl border border-solid border-dark dark:border-light bg-light dark:bg-black shadow-2xl p-4 md:p-10">
      <Link href={link} target='_blank' className='w-full cursor-pointer overflow-hidden rounded-lg'>
        <FramerImage title={title} image={image}
        />
      </Link>
      <div className="w-full flex flex-col items-start justify-between pl-6 ">
        <span className="text-primary dark:text-gray-300 font-medium">{type}</span>
        <Link href={link} className='hover:underline underline-offset-2' target='_blank'>
          <h2 className="my-2 w-full text-left text-4xl font-bold">{title}</h2>
        </Link>
        <p className="my-2 font-medium">{summary}</p>
        <div className="mt-2 flex items-center">
          <div className="border-1 dark:bg-white border-transparent dark:border-light rounded-full p-1">
            <SocialIcon url={github} style={style} target={"_blank"} />
          </div>          
          <Link href={link} target='_blank' className='ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg 
          font-semibold border border-1 border-transparent dark:border-light' >Live Project</Link>
        </div>
      </div>
    </article>
  )
}
const Project = ({type, title, summary, image, link, github}) => {
  return(
    <article className="w-full flex flex-col gap-4 items-center justify-center
     rounded-3xl border border-solid border-dark dark:border-light bg-light dark:bg-dark shadow-2xl p-4 md:p-10">
      <Link href={link} target='_blank' className='w-full cursor-pointer overflow-hidden rounded-lg'>
        <FramerImage title={title} image={image}
        />
      </Link>
      <div className="w-full flex flex-col items-start justify-between pl-6 ">
        <span className="text-primary font-medium dark:text-gray-300">{type}</span>
        <Link href={link} className='hover:underline underline-offset-2' target='_blank'>
          <h2 className="my-2 w-full text-left text-4xl font-bold">{title}</h2>
        </Link>
        <p className="my-2 font-medium">{summary}</p>
        <div className="mt-2 flex items-center">
          <div className="border-1 dark:bg-white border-transparent dark:border-light rounded-full p-1">
            <SocialIcon url={github} style={style} target={"_blank"} />
          </div>          
          <Link href={link} target='_blank' className='ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg 
          font-semibold border border-1 border-transparent dark:border-light' >Live Project</Link>
        </div>
      </div>
    </article>
  )
}

const page = () => {
  return (
    <div className='padding-container max-container w-full flex flex-col my-20'>
      <main className='items-center'>
        <AnimatedText text={"A demo is worth a thousand words"}/> 
        <div className="mb-2 md:mb-8">
          <FeaturedProject 
            type={"Web Application"}
            title={"Ecommerce Web Application"}
            summary={"This is an E-commerce application for an Electronics shop. It has all the main functionalities of an e-commerce application including displaying all products, latest products. Grouping the products by category. Adding to cart and checking out via stripe."}
            image={EcommerceImage}
            link={"https://buenas-ecommerce.vercel.app"}
            github={"https://github.com/George-Kibe/Ecommerce-next"}  
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="md:w-1/2">
            <Project 
              type={"Mobile Application"}
              title={"RealHive"}
              summary={"Inspired by Airbnb, this is a mobile application that leverages React Native to build a platform for match making between property seekers and property owners or landlords and tenants."}
              image={RealHiveImage}
              link={"https://play.google.com/store/apps/details?id=com.realhive.app"}
              github={"https://github.com/George-Kibe"}
            />
          </div>
          <div className="md:w-1/2">
            <Project 
              type={"Website"}
              title={"Buenas Consultants"}
              summary={"This is a portfolio for a company. It is for an IT company listing all the servies offered by the company. It has the main project page and an additional blog for the trends relevant to the indusrty of the business."}
              image={CompanyImage}
              link={"https://buenas-portfolio.vercel.app/"}
              github={"https://github.com/George-Kibe/Nextjs"}
            />
          </div>
        </div>
        <div className="my-2 md:my-8">
          <FeaturedProject 
            type={"Web Application"}
            title={"Ecommerce Mobile Application"}
            summary={"This is an E-commerce mobile application for an Electronics shop. The application is builtin React Native and AWS Amplify and has all the main functionalities of an e-commerce application including displaying all products, latest products. Grouping the products by category. Adding to cart and checking out via stripe."}
            image={HauteCornerImage}
            link={"https://play.google.com/store/apps/details?id=com.hautecorner.app"}
            github={"https://github.com/George-Kibe/Haute-corner"}  
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="md:w-1/2 ">
            <Project 
              type={"Web Application"}
              title={"Mernbnb"}
              summary={"Inspired by Airbnb, this is a web application where users can be able to book for holiday homes. People can book and view their accommodations. The projects leverages the MERN stack technologies(MongoDb, Express, React and Nodejs). It also uses AWS for cloud storage"}
              image={MernBnbImage}
              link={"https://mernbnb.vercel.app/"}
              github={"https://github.com/George-Kibe/Mernbnbclone"}
            />
          </div>
          {/* <div className="">
            <Project 
              type={"Website"}
              title={"Buenas Consultants"}
              summary={"This is a portfolio for a company. It is for an IT company listing all the servies offered by the company. It has the main project page and an additional blog for the trends relevant to the indusrty of the business."}
              image={CompanyImage}
              link={"https://buenas-portfolio.vercel.app/"}
              github={"https://github.com/George-Kibe/Nextjs"}
            />
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default page