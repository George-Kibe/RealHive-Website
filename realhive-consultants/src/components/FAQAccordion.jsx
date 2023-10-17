"use client"

import React, { useState } from "react";
import AnimatedText from "./AnimatedText";

const FAQAccordion = () => {
  return (
    <section className="relative z-20 overflow-hidden bg-white pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]">
      <div className=" mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                FAQS
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                <AnimatedText text={"Any Questions?"} />
                
              </h2>
              <p className="text-base text-body-color">
                Look Here for some of the frequently answered questions about our services.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="What is the typical timeline for a web development or mobile app project?"
              text="The project timeline can vary depending on its complexity and specific requirements. We'll provide you with a detailed project schedule during the initial consultation phase to give you a clear understanding of the timeframe."
            />
            <AccordionItem
              header="Can you redesign and update an existing website or mobile app?"
              text="Yes, we offer redesign and update services to revamp existing websites and mobile apps. We can enhance their design, functionality, and performance to ensure they remain competitive in today's market."
            />
            <AccordionItem
              header="Is my data safe and secure when using your data solutions?"
              text="Yes, we take data security seriously. Our data solutions include robust measures to protect your data and ensure compliance with industry standards and regulations."
            />
            <AccordionItem
              header="Do you provide ongoing support and maintenance for websites and mobile apps after they are developed?"
              text="Yes, we offer ongoing support and maintenance services to keep your websites and mobile apps running smoothly. We provide updates, fix issues, and offer assistance to ensure your digital assets remain up-to-date and secure."
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="How can I benefit from web development services?"
              text="Our web development services can help you establish a strong online presence. We create custom, user-friendly websites that enhance your brand, engage your audience, and drive business growth."
            />
            <AccordionItem
              header="Why is mobile app development important for my business?"
              text="Mobile apps have become essential for businesses to connect with their customers on the go. We design and develop mobile apps that can boost customer engagement, improve user experiences, and increase brand loyalty."
            />
            <AccordionItem
              header="What are the advantages of data solutions from Realhive consultants?"
              text="Our data solutions empower your business with insights that drive decision-making. We help you collect, analyze, and interpret data to make informed choices, optimize operations, and increase efficiency."
            />
            <AccordionItem
              header="What sets Realhive consultants apart from other web development and data solution providers?"
              text="Our commitment to excellence, our creative and highly skilled team, and our passion for innovation set us apart. We focus on delivering solutions that are not just functional but also aesthetically appealing and user-centric, ensuring your business stands out in the digital landscape."
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="1440"
          height="886"
          viewBox="0 0 1440 886"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="1308.65"
              y1="1142.58"
              x2="602.827"
              y2="-418.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3056D3" stopOpacity="0.36" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0.096144" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default FAQAccordion;

const AccordionItem = ({ header, text }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    event.preventDefault();
    setActive(!active);
  };
  return (
    <div className="single-faq mb-8 w-full rounded-lg border border-[#F3F4FE] bg-white p-4 sm:p-8 lg:px-6 xl:px-8">
      <button
        className={`faq-btn flex w-full text-left`}
        onClick={() => handleToggle()}
      >
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-primary bg-opacity-5 text-primary">
          <svg
            className={`duration-200 ease-in-out fill-primary stroke-primary ${
              active ? "rotate-180" : ""
            }`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>

        <div className="w-full">
          <h4 className="text-lg font-semibold text-black">{header}</h4>
        </div>
      </button>

      <div
        className={`pl-[62px] duration-200 ease-in-out ${
          active ? "block" : "hidden"
        }`}
      >
        <p className="py-3 text-base leading-relaxed text-body-color">{text}</p>
      </div>
    </div>
  );
};
