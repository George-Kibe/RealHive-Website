"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Button = ({ type, title, icon, variant, full, url }) => {
  const router = useRouter()
  return (
    <button
    onClick={() => router.push(url)}
    className={`flexCenter gap-3 rounded-full border ${variant} ${full && 'w-full'}`}
      type={type}
    >
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap cursor-pointer">{title}</label>
    </button>
  )
}

const GetApp = () => {
  return (
    <section className="flexCenter w-full flex-col pb-[100px]">
      <div className="get-app">
        <div className="z-20 flex w-full flex-1 flex-col items-start justify-center gap-12">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[320px]">Contact Us now!</h2>
          <p className="regular-16 text-gray-10">Get in touch and for a least one free consultation</p>
          <div className="flex w-full flex-col gap-3 whitespace-nowrap xl:flex-row">
            <Button 
              type="button"
              title="Email Us"
              icon="/email.png"
              variant="btn_white"
              full
              url="/contacts"
            />
            <Button 
              type="button"
              title="Talk To one of Us"
              icon="/chat.jpg"
              variant="btn_dark_green_outline"
              full
              url="/contacts"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
          {/* <Image src="/phones.png" alt="phones" width={550} height={870} /> */}
        </div>
      </div>
    </section>
  )
}

export default GetApp