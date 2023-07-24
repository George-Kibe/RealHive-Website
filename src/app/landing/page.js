"use client"
import Head from "next/head";
import HeroContainer from "@/components/hero-container";
import AreasContainer from "@/components/areas-container";
import FeatureContainer from "@/components/feature-container";
import RentPropertiesContainer from "@/components/rent-properties-container";
import PropertiesOfRentCard from "@/components/properties-of-rent-card";
import ContactForm from "@/components/contact-form";
import FooterSection from "@/components/footer-section";

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>RealHive real estate</title>
        <meta name="description" content="Discover your perfect home" />
      </Head>
      <div className="relative bg-gray-white w-full flex flex-col items-center justify-start">
        <header className="self-stretch bg-gray-white h-[98px] flex flex-row py-[22px] px-20 box-border items-center justify-center gap-[10px] sticky w-full top-[0] [background:white] z-[2] text-center text-5xl text-primary-500 font-body-regular-600 lg:pl-10 lg:pr-10 lg:box-border md:pl-6 md:pr-6 md:box-border">
          <div className="flex-1 flex flex-row items-center justify-between">
            <a className="[text-decoration:none] flex flex-row items-center justify-center gap-[8px] text-[inherit]">
              <img className="relative w-11 h-11" alt="" src="/houseline.svg" />
              <div className="flex flex-col items-start justify-start">
                <div className="relative leading-[24px] font-semibold">
                  REIS
                </div>
                <div className="relative text-sm leading-[16px] font-medium">
                  Real State
                </div>
              </div>
            </a>
            <div className="flex flex-row items-center justify-end text-sm text-primary-900 md:hidden sm:hidden">
              <div className="flex flex-row items-start justify-start gap-[30px]">
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  HOME
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  ABOUT US
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  OUR AGENTS
                </a>
                <a className="[text-decoration:none] relative leading-[22px] font-semibold text-[inherit]">
                  PROPERTIES
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  GALLERY
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  BLOG
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  CONTACT US
                </a>
                <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                  SEARCH
                </a>
              </div>
            </div>
          </div>
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0 md:flex"
              alt=""
              src="/notification.svg"
            />
          </button>
        </header>
        <HeroContainer />
        <AreasContainer />
        <FeatureContainer />
        <RentPropertiesContainer />
        <PropertiesOfRentCard />
        <ContactForm />
        <FooterSection />
      </div>
    </>
  );
};

export default LandingPage;
