import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

import WebAndMobileImage from "../../../public/web-and-mobile.png"

const Button = ({text, url}) => {
  return (
    <Link href={url}>
      <button className="p-2 border-none bg-[#53c28b] text-white cursor-pointer rounded-md">{text}</button>
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
        <div className="absolute bottom-5 left-5 bg-[#53c28b] text-white p-2 rounded-md">
          <h1 className="font-bold text-[30px]">Web, Mobile, Data</h1>
          <h2 className="text-white font-semibold">Award winning Digital experts</h2>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className='py-5 flex-1 gap-10'>
          <h1 className="font-bold text-[25px] md:text-[40px]">Who are We?</h1>
          <p className="mb-4 text-justify">
          RealHive Consultants Limited is a software development company that provides a range of technology services, including web application development, mobile application development, data science solutions, and data engineering consultancy.
          </p>
          <Button url={"contacts"} text={"Contact"}/>
        </div>
        <div className='py-5 flex-1'>
          <h1 className="font-bold text-[25px] md:text-[40px]">See Our Works?</h1>
          <p className="mb-4 text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam alias aliquam reprehenderit? Adipisci nemo aperiam, ad maxime, necessitatibus blanditiis, ipsam consequuntur nesciunt vel culpa quia omnis neque nulla. Ipsa officia doloribus, et distinctio vero eos sunt corrupti, hic ipsum aut repellat quam voluptates eius delectus natus molestiae laboriosam error. Ducimus perspiciatis facilis in vero, id veritatis modi iusto dolorem, commodi dolor quam molestias enim aliquam dicta repellendus obcaecati tempora repudiandae. Sit eligendi voluptatem ipsum ducimus dolor necessitatibus fuga totam modi iusto deserunt nihil, similique labore molestias sequi veritatis quo accusamus est voluptas dolorem, tenetur dicta fugiat maxime incidunt rerum. Nemo.
          </p>
          <Button url={"/portfolio"} text={"Portfolio"}/>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
