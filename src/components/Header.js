"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

const CustomMobileLink = ({href, title, className="", toggle}) => {
    const router = useRouter()
    const pathname = usePathname();
    const handleClick = () => {
      toggle()
      router.push(href)
    }
  
    return(
      <button className={`${className} w-full px-4 text-lg uppercase py-1 [text-decoration:none] relative leading-[22px] text-[inherit]`} onClick={handleClick}>
        {title}
        <span className={`h-[1px] inline-block bg-light absolute left-0 -bottom-0.5
          group-hover:w-full transition-[width] ease duration-300 dark:bg-dark
          ${pathname === href? 'w-full': 'w-0'}
          `}
          >
          &nbsp;
        </span>  
      </button>
    )
  }
const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  const pathname = usePathname();
  const inActiveLink = "[text-decoration:none] relative leading-[22px] text-[inherit]"
  return (
    <header className="self-stretch bg-gray-white h-[98px] flex flex-row py-[22px] px-20 box-border items-center justify-center sticky w-full top-[0] [background:white] z-[2] text-center text-5xl text-primary-500 font-body-regular-600 lg:pl-10 lg:pr-10 lg:box-border md:pl-6 md:pr-6 md:box-border">
        <div className="flex-1 flex flex-row items-center justify-between">
        <Link href={"/"} className="[text-decoration:none] flex flex-row items-center justify-center gap-[8px] text-[inherit]">
            <img className="relative w-11 h-11" alt="company-logo" src="/color-logo.png" />
            <div className="flex flex-col items-start justify-start">
            <div className="relative leading-[24px] font-semibold">Buenas</div>
            <div className="relative text-sm leading-[16px] font-medium">
                Consultants Group
            </div>
            </div>
        </Link>
        <div className="flex flex-row items-center justify-end gap-[36px] text-sm text-primary-900 sm:flex">
            <div className="flex flex-row items-start justify-start gap-[30px] md:hidden">
                <Link href={"/"} className={`${inActiveLink} ${pathname === "/"? 'font-semibold text-blue-500': ''}`}>
                    HOME
                </Link>
                <Link href={"/about"} className={`${inActiveLink} ${pathname === "/about"? 'font-semibold text-blue-500': ''}`}>
                    ABOUT US
                </Link>                
                <Link href={"/properties"} className={`${inActiveLink} ${pathname === "/properties"? 'font-semibold text-blue-500': ''}`}>
                    PROPERTIES
                </Link>
                <Link href={"/gallery"} className={`${inActiveLink} ${pathname === "/gallery"? 'font-semibold text-blue-500': ''}`}>
                    GALLERY
                </Link>
                <Link href={"/blog"} className={`${inActiveLink} ${pathname === "/blog"? 'font-semibold text-blue-500': ''}`}>
                    BLOG
                </Link>
                <Link href={"/contacts"} className={`${inActiveLink} ${pathname === "/contacts"? 'font-semibold text-blue-500': ''}`}>
                    CONTACT US
                </Link>
                <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-sm leading-[22px] font-body-regular-600 text-primary-900 text-center inline-block">
                    SEARCH
                </button>
                </div>
                <button onClick={handleClick} className="cursor-pointer [border:none] p-0 bg-[transparent] hidden flex-row items-center justify-center md:flex">
                {
                  isOpen? (
                    <img
                        className="relative w-6 h-6 overflow-hidden shrink-0 md:flex"
                        alt="close-image"
                        src="/cancel.svg"
                    />
                  )
                  :(
                    <img
                        className="relative w-6 h-6 overflow-hidden shrink-0 md:flex"
                        alt="close-image"
                        src="/notification.svg"
                    />
                  )
                }
                </button>
            </div>
            {/* mobile menu */}
            {
                isOpen ?
                <motion.div
                    initial={{scale:0, opacity:0, x:"-50%", y:"-50%"}}
                    animate={{scale:1, opacity:1}}
                    className="min-w-[60vw] hidden pb-12 flex-col justify-between items-center fixed z-50 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                        rounded-lg backdrop-blur-md pt-10 md:flex gap-4 text-sm "
                    >
                    <nav className='flex items-center justify-center flex-col gap-1'>
                        <CustomMobileLink href={"/"} title={"Home"}  toggle={handleClick} className=''/>
                        <CustomMobileLink href={"/about"} title={"About US"}  toggle={handleClick} className=''/>
                        <CustomMobileLink href={"/properties"} title={"Properties"}  toggle={handleClick} className=''/>
                        <CustomMobileLink href={"/gallery"} title={"Gallery"} toggle={handleClick} className=''/>
                        <CustomMobileLink href={"/contacts"} title={"Contact"} toggle={handleClick} className=''/>
                        <CustomMobileLink href={"/blog"} title={"Blog"} toggle={handleClick} className=''/>
                    </nav>
                </motion.div>
                :null
            }
        </div>
        </header>
  )
}

export default Header