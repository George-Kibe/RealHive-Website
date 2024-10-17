"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ModeToggle } from './ModeToggle';

const links = [
  { id: 1, title: "Home", url: "/"},
  { id: 2, title: "About Us", url: "/aboutus"},
  // { id: 3, title: "Blog", url: "/blog"},
  {id: 3, title:"Services", url: "/services"},
  // { id: 4, title: "Dashboard", url: "/dashboard"},
  { id: 4, title: "Portfolio", url: "/portfolio"},
  { id: 5, title: "Careers", url: "/careers"},
  { id: 6, title: "Contact Us", url: "/contacts"},
]

const NavbarTest = () => {
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
    <nav className="max-container padding-container bg-transparent">
      <div className="w-full mx-auto p-2">
        <div className="flex w-full items-center justify-between h-16">
          <div className="flex w-full items-center justify-between">
            <div className="">
              <Link href="/"  className="font-bold text-[22px] flex gap-2 items-center">
                <Image src="/RealHive-Cosultants-logo.png" alt="logo" width={60} height={25} className='hidden md:flex rounded-lg'/>
                <span className="font-bold">RealHive Consultants</span>
              </Link>              
            </div>
            <div className="hidden md:block w-full">
              <div className="justify-end flex space-x-4">
                {/* <ModeToggle className="self-center justify-self-center" /> */}
                {links.map((link, index) => (
                  <Link key={link.id} href={link.url}  className="">{link.title}</Link>
                ))}                
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleNavbar}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 sm:px-3 flex font-bold text-xl flex-col gap-2">
            {links.map((link) => (
              <button key={link.id} onClick={() => handleNavigation(link.url)} className="self-start">{link.title}</button>))
            }
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavbarTest;