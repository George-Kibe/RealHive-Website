import Image from 'next/image'
import React from 'react'

const Guide = () => {
  return (
    <section className="flexCenter flex-col">
      <div className="padding-container items-center max-container w-full pb-24">
        <div className="flex items-center">
        <p className="uppercase regular-18 -mt-1 mb-3 text-green-50">
          We are here for you
        </p>
        </div>
        <div className="flex flex-wrap justify-between gap-5 lg:gap-10">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[390px]">Get Your Services Online</h2>
          <p className="regular-16 text-gray-30 xl:max-w-[820px] text-justify">            
            At Realhive consultants, we understand that the digital landscape is constantly evolving, and to stay ahead of the competition, your business needs to have a strong online presence. Our team of experts specializes in web development, mobile app development, and data solutions, making us your ideal partner in this digital age. We take pride in bringing your business into the digital realm, crafting innovative and user-friendly websites, creating cutting-edge mobile applications, and harnessing the power of data to drive your success. With our services, you can reach a global audience, engage customers effectively, and achieve your business goals in an increasingly online world
          </p>
        </div>
      </div>

    </section>
  )
}

export default Guide