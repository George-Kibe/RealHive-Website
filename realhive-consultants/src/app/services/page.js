import AnimatedText from '@/components/AnimatedText';
import { FramerImage } from '@/utils/FramerImage';
import WebImage from "../../../public/web.jpg"
import ApplicationImage from "../../../public/application.jpg"
import DataImage from "../../../public/data.jpeg"
import BigDataImage from "../../../public/big-data.png"
import CloudImage from "../../../public/cloud.png"

import React from 'react'
import FAQAccordion from '@/components/FAQAccordion';
import CallToAction from '@/components/CallToAction';

const ServicesPage = () => {
  return (
    <section className="padding-container max-container pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Our Services
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                <AnimatedText text={"What We Offer"} />
              </h2>
              <p className="text-base text-body-color">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4">
          <ServiceCard
            title="Refreshing Design"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ WebImage}
          />
          <ServiceCard
            title="Based on Tailwind CSS"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ ApplicationImage}
          />
          <ServiceCard
            title="100+ Components"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ DataImage}
          />
          <ServiceCard
            title="Speed Optimized"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ BigDataImage}
          />
          <ServiceCard
            title="Fully Customizable"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ CloudImage}
          />
          <ServiceCard
            title="Regular Updates"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            image={ WebImage}
          />
        </div>
      </div>
      <FAQAccordion />
      <CallToAction />
    </section>
  );
};

export default ServicesPage

const ServiceCard = ({ image, title, details }) => {
  return (
    <>
      <div className="w-full px-4 md:w-1/2 lg:w-1/3">
        <div className="mb-8 rounded-[20px] bg-white p-10 shadow-md hover:shadow-lg md:px-7 xl:px-10">
          <div
            className={`mb-8 flex h-[200px] w-[200px] p-3 items-center justify-center rounded-2xl bg-primary`}
          >
            <FramerImage image={image} title={image} />
          </div>
          <h4 className="mb-3 text-xl font-semibold text-dark">{title}</h4>
          <p className="text-body-color">{details}</p>
        </div>
      </div>
    </>
  );
};
