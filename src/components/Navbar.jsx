"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './ModeToggle';
import NavLink from './NavLink';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const closeNavbar = () => {
    setIsOpen(false);
  };
  return (
    <nav className="max-container padding-container bg-transparent">
      <div className="w-full mx-auto p-2">
        <div className="flex w-full items-center justify-between h-20 sm:h-24 md:h-28 lg:h-32">
          <div className="flex w-full items-center justify-between">
            <div className="">
              <Link href="/" className="flex items-center" aria-label="RealHive Consultants Ltd — home">
                {/* /logo.png is the padding-trimmed display asset (1600x545,
                    2.94:1). The original had ~40% transparent vertical padding,
                    so a given CSS height rendered only 60% as much visible
                    logo; the untrimmed master is kept at
                    /RealHive-Consultants-logo.png.
                    Intrinsic width/height are the file's true pixels so the
                    aspect ratio is locked; the h-* steps below set the rendered
                    size, and width stays auto so it can never stretch. */}
                <Image
                  src="/logo.png"
                  alt="RealHive Consultants Ltd"
                  width={1600}
                  height={545}
                  sizes="(max-width: 639px) 145px, (max-width: 767px) 190px, (max-width: 1023px) 240px, 285px"
                  className="h-12 w-auto sm:h-16 lg:h-20 object-contain"
                  priority
                />
              </Link>              
            </div>
            <div className="hidden md:block w-full">
              <div className="justify-end flex items-center space-x-6">
                {/* <ModeToggle className="self-center justify-self-center" /> */}
                {links.map((link) => (
                  <NavLink key={link.id} href={link.url} className="font-medium">
                    {link.title}
                  </NavLink>
                ))}                
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleNavbar}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-hidden focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
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
              <NavLink
                key={link.id}
                href={link.url}
                onClick={closeNavbar}
                className="self-start"
              >
                {link.title}
              </NavLink>
            ))}
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar;