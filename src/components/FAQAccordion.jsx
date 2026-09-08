"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useState } from "react";
import AnimatedText from "./AnimatedText";

const questions = [
  {
    question: "What is the typical timeline for a web development or mobile app project?",
    answer: "The project timeline can vary depending on its complexity and specific requirements. We'll provide you with a detailed project schedule during the initial consultation phase to give you a clear understanding of the timeframe."
  },
  {
    question: "Can you redesign and update an existing website or mobile app?",
    answer: "Yes, we offer redesign and update services to revamp existing websites and mobile apps. We can enhance their design, functionality, and performance to ensure they remain competitive in today's market."
  },
  {
    question: "Is my data safe and secure when using your data solutions?",
    answer: "Yes, we take data security seriously. Our data solutions include robust measures to protect your data and ensure compliance with industry standards and regulations."
  },
  {
    question: "Do you provide ongoing support and maintenance for websites and mobile apps after they are developed?",
    answer: "Yes, we offer ongoing support and maintenance services to keep your websites and mobile apps running smoothly. We provide updates, fix issues, and offer assistance to ensure your digital assets remain up-to-date and secure."
  },
  {
    question: "How can I benefit from web development services?",
    answer: "Our web development services can help you establish a strong online presence. We create custom, user-friendly web solutions for our clients. Our team of experienced developers and designers work closely with clients to build web applications tailored to their specific needs."
  },
  {
    question: "Why is mobile app development important for my business?",
    answer: "Mobile apps have become essential for businesses to connect with their customers on the go. We design and develop mobile apps that can boost customer engagement, improve user experiences, and increase brand loyalty."
  },
  {
    question: "What are the advantages of data solutions from Realhive consultants?",
    answer: "Our data solutions empower your business with insights that drive decision-making. We help you collect, analyze, and interpret data to make informed choices, optimize operations, and increase efficiency."
  },
  {
    question: "How can I ensure the security of my data when using Realhive consultants?",
    answer: "We implement robust security measures to protect your data from unauthorized access, data breaches, and other threats. Our team of experts works closely with you to ensure that your data is secure at all times."
  }
];
<section className="relative z-20 overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]">
<div className=" mx-auto">
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

const FAQAccordion = () => {
  return (
    <div className="flex-col">
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
      <div className="p-4 md:p-8">
        {
          questions.map((question, index) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">
                  {index+1}. {question.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  {question.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        }
      </div>
    </div>
  );
};

export default FAQAccordion;
