import React from "react";
// Portraits with their backgrounds removed, trimmed and resized for the card
// (~370px wide at most, so ~740px covers 2x screens).
import GeorgeImage from "../../public/images/team-george-kibe.webp"
import GeorgeRbImage from "../../public/images/team-trent-george.webp"
import JohnImage from "../../public/images/team-john-mbugua.webp"
import MercyImage from "../../public/images/team-mercy-wanjiru.webp"
import { FramerImage } from "@/utils/FramerImage";

const Team = () => {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24">
      <div className="">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-127.5 text-center">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Our Team
              </span>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-[40px]">
                Our Awesome Team
              </h2>
              <p className="text-base text-muted-foreground">
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
        <div className="mx-auto mb-10 w-full max-w-92.5">
          <div className="relative overflow-hidden rounded-lg">
            <div className="rounded-md">
                <FramerImage title={name} image={image} sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw" />
            </div>            
            <div className="absolute left-0 w-full text-center bottom-4">
              <div className="relative px-1 py-1 mx-1 overflow-hidden bg-white rounded-lg">
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
