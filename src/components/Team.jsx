import React from "react";
import { TEAM } from "@/constants/team";
import { FramerImage } from "@/utils/FramerImage";

const Team = () => {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full px-4">
          <div className="mx-auto mb-12 max-w-127.5 text-center">
            <span className="block mb-2 text-lg font-semibold text-primary">
              Our Team
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-[40px]">
              Meet the team
            </h2>
            <p className="text-base text-muted-foreground">
              Web and mobile developers, designers, data engineers and data scientists: the people who design and
              build your product, and the authors of our blog.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center -mx-4">
        {TEAM.map((member) => <TeamCard key={member.slug} member={member} />)}
      </div>
    </section>
  );
};

export default Team;

// Each card is the anchor blog bylines link to (/aboutus#<slug>).
const TeamCard = ({ member }) => {
  return (
    <div className="w-full px-4 md:w-1/2 xl:w-1/4">
      <article id={member.slug} className="mx-auto mb-10 w-full max-w-92.5 scroll-mt-28">
        <div className="relative overflow-hidden rounded-lg">
          <div className="rounded-md">
            <FramerImage title={member.name} image={member.image} sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="absolute left-0 w-full text-center bottom-4">
            <div className="relative px-1 py-1 mx-1 overflow-hidden bg-white rounded-lg">
              <h3 className="text-base font-semibold text-black">{member.name}</h3>
              <p className="text-sm text-black/70">{member.role}</p>
            </div>
          </div>
        </div>
        {member.bio && <p className="mt-4 text-sm text-muted-foreground">{member.bio}</p>}
        {member.links.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {member.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                  {link.name}<span className="sr-only"> profile of {member.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
};
