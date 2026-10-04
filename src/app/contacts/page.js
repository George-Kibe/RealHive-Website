"use client"

import {MdOutlineEmail} from "react-icons/md"
import {BsWhatsapp} from "react-icons/bs"
import { FaXTwitter } from "react-icons/fa6"
import { FiLoader } from "react-icons/fi";
import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { trackEvent } from "@/lib/analytics"
import { WHATSAPP } from "@/constants"
import { buttonVariants } from "@/components/ui/button";
import { inputClass } from "@/components/account/shared";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");

  const form = useRef();
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!name || !email || !message || !phoneNumber){
      toast.error("You have missing details!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/alert", {
        name,
        email,
        message,
        phoneNumber
      })
      if(response.status === 200){
        toast.success("Message sent successfully. One of us will get back to you as soon as possible.")
        trackEvent("contact_form_submit", { form: "contact" })
      }
      setLoading(false);
      setName(""); setEmail(""); setMessage(""); setPhoneNumber("");
    } catch (error) {
      toast.error("Message sending Error! Try sending again or send a direct Email");
      setLoading(false);
    }
  }
  const card = "flex flex-col items-center justify-center gap-1 rounded-2xl p-6 text-center ring-1 ring-border"
  return (
    <div className="max-container padding-container page-y">
      <ToastContainer />
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand">Get In Touch</p>
      <h1 className="mt-3 mb-10 text-center text-3xl font-bold sm:mb-12 sm:text-4xl lg:text-6xl">
        Lets get in Touch
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <div className={card}>
            <MdOutlineEmail className="text-[25px] md:text-[40px]"/>
            <h2 className="font-semibold">Email</h2>
            <p>realhiveconsultants@gmail.com</p>
            <a href="mailto:realhiveconsultants@gmail.com" target="_blank" rel="noreferrer" className="text-brand hover:underline">Send an Email</a>
          </div>
          <article className={card}>
            <FaXTwitter className="text-[25px] md:text-[40px]"/>
            <h2 className="font-semibold">X</h2>
            <p>@KibeGeorge_</p>
            <a href="https://x.com/kibegeorge_" target="_blank" rel="noreferrer" className="text-brand hover:underline">Message our CEO on X</a>
          </article>
          <article className={card}>
            <BsWhatsapp className="text-[25px] md:text-[40px]"/>
            <h2 className="font-semibold">Whatsapp</h2>
            <p>+254 795 288 155</p>
            <a href={WHATSAPP.chatUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">Whatsapp Us</a>
          </article>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
          <label className="text-sm font-medium">
            Name
            <input type="text" placeholder='Name'
              value={name}
              onChange={ev => setName(ev.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            Email
            <input type="email" placeholder='Email'
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            Phone Number
            <input type="text" placeholder='Phone Number'
              value={phoneNumber}
              onChange={ev => setPhoneNumber(ev.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            Your Message
            <textarea placeholder='Enter Your Message here...'
              value={message}
              onChange={ev => setMessage(ev.target.value)}
              className={`${inputClass} h-32`}
            />
          </label>
          <div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={buttonVariants({ variant: "brand", size: "lg" })}
            >
              {
                loading
                  ? <><FiLoader className="mr-2 animate-spin" /> Sending...</>
                  : "Send Message"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage