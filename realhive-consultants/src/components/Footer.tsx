import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="flexCenter">      
      <div className="padding-container max-container flex w-full flex-col gap-14">
        <div className="border bg-gray-20" />      
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          <Link href="/" className="mb-10">
            <div className="rounded-lg flex gap-2">
              <Image src="/RealHive-Cosultants-logo.png" alt="logo" width={60} height={25} className='rounded-lg'/>
              <div className="flex-col">
                <p className="font-semibold text-[20px]">RealHive</p>
                <p className="font-semibold text-[20px]">Consultants</p>
              </div>              
            </div>
          </Link>

          <div className='flex flex-wrap gap-4 sm:justify-around md:flex-1'>
            <div className="flex flex-col gap-8">
              {FOOTER_LINKS.map((columns, index) => (
                <FooterColumn key={index} title={columns.title}>
                  <ul className="flex flex-col gap-2">
                    {columns.links.map((link, index) => (
                      <Link key={index} href={link.href || "/"} >
                        {link.name}
                      </Link>
                    ))}
                  </ul>
                </FooterColumn>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    href="/"
                    key={link.label}
                    className="flex-col gap-2 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap">
                      {link.label}:
                    </p>
                    <p className="text-sm ">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>
            </div>

            <div className="flex flex-col gap-2">
              <FooterColumn title={SOCIALS.title}>
                <ul className="regular-14 flex gap-4 text-gray-30">
                  {SOCIALS.links.map((link) => (
                    <Link href="/" key={link}>
                      <Image src={link} alt="logo" width={24} height={24} />
                    </Link>
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
 