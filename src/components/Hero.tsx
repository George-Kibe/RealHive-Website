import Image from 'next/image'
import heroOffice from '../../public/images/hero-office.webp'
import React from 'react'

const Hero = () => {
  return (
    <div className=''>
      <div className="">
        <div className="max-container padding-container pt-12 pb-16 sm:pt-16 lg:pt-24 lg:pb-20">
          <h2 className="max-w-4xl font-semibold text-foreground text-4xl sm:text-5xl">
            <span className="text-brand">Realhive Consultants:</span> Transforming ideas into reality through code
          </h2>
          <div className="max-w-4xl">
            <p className="mt-5 text-muted-foreground text-justify text-lg">
            Excellent Design and Performance for your Digital Products. At Realhive Consultants, we specialize in turning conceptual visions into concrete forms, whether it be through design, artistry, or technological innovation.
            </p>
          </div>
          <div className="max-w-4xl">
            <p className="mt-5 text-muted-foreground text-justify text-lg">
            Turning your idea into a reality. We bring together teams from the tech industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-container padding-container md:grid md:grid-cols-2 md:gap-10 lg:gap-16 md:items-center">
        <blockquote>
          <p className="text-justify">
          At Realhive consultants, we understand that the digital landscape is constantly evolving, and to stay ahead of the competition, your business needs to have a strong online presence. Our team of experts specializes in web development, mobile app development, and data solutions, making us your ideal partner in this digital age. We take pride in bringing your business into the digital realm, crafting innovative and user-friendly websites, creating cutting-edge mobile applications, and harnessing the power of data to drive your success. With our services, you can reach a global audience, engage customers effectively, and achieve your business goals in an increasingly online world.
          </p>
        </blockquote>
        {/* A scene photo can't lose its background without losing the scene, so
            its edges fade into the page instead (.fade-edges in globals.css). */}
        <Image
          src={heroOffice}
          alt="A developer writing code at a desk in a dimly lit office"
          sizes="(min-width: 1152px) 528px, (min-width: 768px) 45vw, calc(100vw - 32px)"
          placeholder="blur"
          loading="eager"
          className="fade-edges mt-8 w-full h-auto md:mt-0"
        />
      </div>
    </div>
  )
}

export default Hero