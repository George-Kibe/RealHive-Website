"use client"

import {MdOutlineEmail} from "react-icons/md"
import {BsWhatsapp} from "react-icons/bs"
import {ImTwitter} from "react-icons/im"
import { FiLoader } from "react-icons/fi";
import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

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
      }
      setLoading(false);
      setName(""); setEmail(""); setMessage(""); setPhoneNumber("");
    } catch (error) {
      toast.error("Message sending Error! Try sending again or send a direct Email");
      setLoading(false);
    }
  }
  return (
    <div className="padding-container">
      <h5 className="text-center text-xs">Get In Touch</h5>
      <div> <ToastContainer /> </div>
      <h1 className="text-center my-4 font-bold text-2xl md:text-4xl md:my-8 lg:text-6xl">
        Lets get in Touch
      </h1>
      <div className="-mx-4 flex flex-wrap lg:justify-between">
        <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
          <div className="flex flex-col flex-1 md:items-center gap-4 mb-4 sm:mx-4 md:mx-0 xl:mx-24">
            <div className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
              <MdOutlineEmail className="text-[25px] md:text-[40px]"/>
              <h4 className="text-center">Email</h4>
              <h5 className="text-center">realhiveconsultants@gmail.com</h5>
              <a href="mailto:realhiveconsultants@gmail.com" target="_blank" rel="noreferrer" className="items-center">Send an Email</a>
            </div>
            <article className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
              <ImTwitter className="text-[25px] md:text-[40px]"/>
              <h4>Twitter</h4>
              <h5>@KibeGeorge_</h5>
              <a href="https://twitter.com/kibegeorge_" target="_blank" rel="noreferrer">Message our CEO on Twitter</a>
            </article>
            <article className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
              <BsWhatsapp className="text-[25px] md:text-[40px]"/>
              <h4>Whatsapp</h4>
              <h5>+254 795 288 155</h5>
              <a href="https://wa.link/176li6" target="_blank" rel="noreferrer">Whatsapp Us</a>
            </article>
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-5/12">
          <div className="relative rounded-lg px-8 shadow-lg dark:bg-dark-2 sm:px-12">
            <div>
              <div className="">
                <p className="">Name:</p>
                <input type="text" placeholder='Name' 
                  value={name}
                  onChange={ev => setName(ev.target.value)}
                  className="border-2 bg-transparent border-gray-300 rounded-md p-1 w-full 
                  mb-2 focus:border-blue-900" 
                /> 
              </div>
              <div className="">
                <p className="">Email:</p>
                <input type="email" placeholder='Name' 
                  value={email}
                  onChange={ev => setEmail(ev.target.value)}
                  className="border-2 bg-transparent border-gray-300 rounded-md p-1 w-full 
                  mb-2 focus:border-blue-900" 
                /> 
              </div>
              <div className="">
                <p className="">Phone Number:</p>
                <input type="text" placeholder='Phone Number'
                  value={phoneNumber}
                  onChange={ev => setPhoneNumber(ev.target.value)}
                  className="border-2 bg-transparent border-gray-300 rounded-md p-1 w-full
                  mb-2 focus:border-blue-900"
                />
              </div>
              <p className="font-semibold pr-2">Your Message</p>
                <textarea type="text" placeholder='Enter Your Message here...' 
                  value={message} 
                  onChange={ev => setMessage(ev.target.value)}
                  className="border-2 h-24 bg-transparent border-gray-300 rounded-md p-1 w-full 
                  mb-2 focus:border-blue-900" 
                /> 
              <div>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-800 rounded-md p-2"
                >
                  {
                    loading? <p className="items-center justify-center text-white flex"><FiLoader className="mr-2 animate-spin" /> Loading...</p> : <p className="text-white">Send Message</p>
                  }
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  )
}

export default ContactPage