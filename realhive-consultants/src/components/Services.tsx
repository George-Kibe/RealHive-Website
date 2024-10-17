import { SERVICES } from '@/constants'
import Image from 'next/image'
import React from 'react'

const Services = () => {
  return (
    <section className="flex flex-col overflow-hidden  bg-center bg-no-repeat py-24">
      <div className="flex-col md:flex-row  max-container padding-container relative w-full flex justify-end rounded-lg ">
        <div className="flex flex-1">
          <Image
            src="/phone.png"
            alt="phone"
            width={400}
            height={200}
            className="object-contain rotate-6"
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

type ServiceItemProps = {
  title: string;
  icon: string;
  description: string;
}

const ServiceItem = ({ title, icon, description }: ServiceItemProps) => {
  return (
    <li className="flex w-full flex-1 flex-col items-start">
      <div className="rounded-full p-1 lg:p-4 bg-green-50">
        <Image src={icon} alt="map" width={50} height={50} className='object-contain' />
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