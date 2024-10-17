import React from "react";
import GeorgeImage from "../../public/people/George.jpg"
import GeorgeRbImage from "../../public/people/george-rb.png"
import JohnImage from "../../public/people/Mbugua.jpeg"
import MercyImage from "../../public/people/Mercy.jpeg"
import { FramerImage } from "@/utils/FramerImage";

const Team = () => {
  return (
    <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20">
      <div className="">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Our Team
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                Our Awesome Team
              </h2>
              <p className="text-base text-body-color">
                Our team comprises of a diverse range of IT professionals. These include Web developers, Designers,  Mobile Developers, Data Engineers and Data Scientist
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center -mx-4">
          <TeamCard
            name="George Kibe"
            profession="Mobile Developer and Data Engineer"
            image={GeorgeImage}
          />
          <TeamCard
            name="John Mbugua"
            profession="Web Developer"
            image={JohnImage}
          />
          <TeamCard
            name="Mercy Wanjiru"
            profession="Web Designer"
            image={MercyImage}
          />
          <TeamCard
            name="Trent George"
            profession="Web Developer and Data Scientist"
            image={GeorgeRbImage}
          />
        </div>
      </div>
    </section>
  );
};

export default Team;

const TeamCard = ({ image, name, profession }) => {
  return (
    <>
      <div className="w-full px-4 md:w-1/2 xl:w-1/4">
        <div className="mx-auto mb-10 w-full max-w-[370px]">
          <div className="relative overflow-hidden rounded-lg">
            <div className="rounded-md">
                <FramerImage title={name} image={image} />
            </div>            
            <div className="absolute left-0 w-full text-center bottom-5">
              <div className="relative px-3 py-5 mx-5 overflow-hidden bg-white rounded-lg">
                <h3 className="text-base font-semibold text-black">{name}</h3>
                <p className="text-sm text-black/70">{profession}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
