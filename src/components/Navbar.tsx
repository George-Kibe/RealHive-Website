"use client"

import React, { useState } from "react"
import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import Button from "./Button"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./ModeToggle"

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const handleNavigation = (link) => {
    setIsOpen(!isOpen);
    router.push(link);
  }
  console.log(isOpen)
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5 bg-transparent">
      <div className="w-full mx-auto p-2">
      <div className="flex w-full items-center justify-between h-16">
      <div className="flex w-full items-center justify-between">
      <Link href="/">
        <div className="rounded-lg flex gap-2">
          <Image src="/RealHive-Cosultants-logo.png" alt="logo" width={74} height={29} className='rounded-lg'/>
          <div className="flex-col">
            <p className="font-semibold text-[20px]">RealHive</p>
            <p className="font-semibold text-[20px]">Consultants</p>
          </div>              
        </div>
      </Link>
      <div className="hidden items-center justify-center h-full lg:flex gap-8">
        <ModeToggle />
        <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link href={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
              {link.label}
            </Link>
          ))}
        </ul>
      </div>

      <div className="lg:flexCenter hidden">
        <Button 
          type="button"
          title="Login"
          icon="/user.svg"
          variant="btn_dark_green"
        />
      </div>

      <Image 
        src={isOpen? "cancel.svg":"menu.svg"}
        onClick={toggleNavbar}
        alt="menu"
        width={32}
        height={32}
        className="inline-block bg-white cursor-pointer lg:hidden"
      />

      {isOpen && (
        <div className="md:hidden ">
          <div className="px-2 pt-2 pb-3 sm:px-3 flex font-bold text-xl flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <button key={link.key} onClick={() => handleNavigation(link.href)} className="self-start">{link.label}</button>))
            }
            <ModeToggle />
          </div>
        </div>
      )}
      </div>
      </div>
      </div>
    </nav>
  )
}

export default Navbar