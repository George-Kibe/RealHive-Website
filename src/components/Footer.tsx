import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import NavLink from './NavLink'
import React from 'react'

const Footer = () => {
  return (
    <footer className="flexCenter">      
      <div className="padding-container max-container flex w-full flex-col gap-14">
        <div className="border bg-gray-20" />      
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          <Link href="/" className="mb-10">
            <div className="flex items-center">
              {/* Same trimmed asset and locked aspect ratio as the header,
                  one step larger since the footer has more room. */}
              <Image
                src="/logo.png"
                alt="RealHive Consultants Ltd"
                width={1600}
                height={545}
                sizes="(max-width: 639px) 165px, (max-width: 767px) 190px, (max-width: 1023px) 240px, 285px"
                className="h-14 w-auto sm:h-16 lg:h-20 object-contain"
              />
            </div>
          </Link>

          <div className='flex flex-wrap gap-4 sm:justify-around md:flex-1'>
            <div className="flex flex-col gap-8">
              {FOOTER_LINKS.map((columns, index) => (
                <FooterColumn key={index} title={columns.title}>
                  <ul className="flex flex-col gap-2">
                    {columns.links.map((link, index) => (
                      <li key={index}>
                        <NavLink href={link.href || "/"}>{link.name}</NavLink>
                      </li>
                    ))}
                  </ul>
                </FooterColumn>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <NavLink
                    href="/"
                    key={link.label}
                    showActive={false}
                    className="flex-col gap-2 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap">
                      {link.label}:
                    </p>
                    <p className="text-sm ">
                      {link.value}
                    </p>
                  </NavLink>
                ))}
              </FooterColumn>
            </div>

            <div className="flex flex-col gap-2">
              <FooterColumn title={SOCIALS.title}>
                <ul className="regular-14 flex gap-4 text-gray-30">
                  {SOCIALS.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="/"
                        className="inline-block opacity-75 transition-opacity duration-200 hover:opacity-100"
                      >
                        <Image src={link} alt="" width={24} height={24} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>

        <div className="border bg-gray-20" />
        <p className="regular-14 w-full mb-12 text-center text-gray-30">&copy; {new Date().getFullYear()} RealHive Consultants | All rights reserved</p>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
      {children}
    </div>
  )
}

export default Footer
 