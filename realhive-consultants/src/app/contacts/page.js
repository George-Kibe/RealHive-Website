"use client"
import {MdOutlineEmail} from "react-icons/md"
import {BsWhatsapp} from "react-icons/bs"
import {ImTwitter} from "react-icons/im"
//emailjs imports
import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// export const metadata = {
//     title: 'Portfolio | Contacts',
//     description: 'Powered by Nextjs',
// }
const ContactPage = () => {
  const form = useRef();
  const notify = () => toast("Wow so easy!");
  const sendEmail = async(e) => {
    e.preventDefault();
    if(!e.target[0].value | !e.target[1].value | !e.target[2].value){
      toast.error("You have missing details!")
      return
    }
    toast.info("Sending your message")
    const response = await emailjs.sendForm('service_zejea4b', 'template_d1kc1do', form.current, 'qO3BsJQp9qAyPG6LX')
    if(response.status === 200){
      toast.success("Message sent successfully. George will get back to you as soon as possible.")
      e.target.reset()
    }else{
      toast.error("Message sending Error! Try sending again or send a direct Email")
      return
    }    
  };
  return (
    <div className="items-center p-4 md:p-8">
      <h5 className="text-center text-xs">Get In Touch</h5>
      <div> <ToastContainer /> </div>
      <h1 className="text-center my-4 font-bold text-2xl md:text-4xl md:my-8 lg:text-6xl">Lets get in Touch</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col flex-1 md:items-center gap-4 mb-4 sm:mx-4 md:mx-0 xl:mx-24">
          <div className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
            <MdOutlineEmail className="text-[25px] md:text-[40px]"/>
            <h4 className="text-center">Email</h4>
            <h5 className="text-center">georgekibew@gmail.com</h5>
            <a href="mailto:georgekibew@gmail.com" target="_blank" rel="noreferrer" className="items-center">Send an Email</a>
          </div>
          <article className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
            <ImTwitter className="text-[25px] md:text-[40px]"/>
            <h4>Twitter</h4>
            <h5>@KibeGeorge_</h5>
            <a href="https://twitter.com/kibegeorge_" target="_blank" rel="noreferrer">Message me on Twitter</a>
          </article>
          <article className="flex flex-col items-center justify-center border-2 light:border-dark dark:border-light p-2 w-full rounded-xl">
            <BsWhatsapp className="text-[25px] md:text-[40px]"/>
            <h4>Whatsapp</h4>
            <h5>+254 704 817 466</h5>
            <a href="https://wa.link/rcnr3u" target="_blank" rel="noreferrer">Whatsapp Me</a>
          </article>
        </div>
        {/* Contact form */}
        <form ref={form} onSubmit={sendEmail} className="flex flex-1 flex-col items-start sm:items-center md:px-20 gap-2 mb-4 sm:mx-4 md:mx-0 xl:mx-24">
          <input type="text" name='name' className="p-2 rounded-md w-[100%] md:w-80%] bg-transparent border-2" placeholder='Your Name' />
          <input type="email" name='email' className="p-2 rounded-md w-[100%] md:w-80%] bg-transparent border-2" placeholder='Your Email' />
          <textarea name="message" rows="6" className="p-2 rounded-md w-[100%] md:w-80%] bg-transparent border-2" placeholder='Your Message'></textarea>
          <button type='submit' className="self-start bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage