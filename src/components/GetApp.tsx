"use client"

import { useRouter } from 'next/navigation'
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import { buttonVariants } from '@/components/ui/button'
import React, { useState } from 'react'


const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubscription = async() => {
    if (!email){
      alert("Please enter your email")
      return
    }
    console.log("Email: ", email)
    setLoading(true);
    setEmail("")
    try {
      // Add to a list of subscribers
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <div className="">
      <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Subscribe to our newsletter.</h2>
                <p className="mt-4 text-lg leading-8">
                To get property research updates and property related news on a weekly basis.
                </p>
                <div className="mt-6 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-auto rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                />
                <button
                    type="submit"
                    onClick={handleSubscription}
                    disabled={loading}
                    className={buttonVariants({ variant: 'brand', className: 'flex-none' })}
                >
                    {loading? "Loading...": "Subscribe"}
                </button>
                </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                <div className="flex flex-col items-start">
                <div className="rounded-md p-2 ring-1 ring-border">
                    <CalendarDaysIcon aria-hidden="true" className="h-6 w-6" />
                </div>
                <dt className="mt-4 font-semibold ">Weekly articles</dt>
                <dd className="mt-2 leading-7">
                    Property related trends.
                </dd>
                </div>
                <div className="flex flex-col items-start">
                <div className="rounded-md p-2 ring-1 ring-border">
                    <HandRaisedIcon aria-hidden="true" className="h-6 w-6" />
                </div>
                <dt className="mt-4 font-semibold ">No spam</dt>
                <dd className="mt-2 leading-7">
                    Weekly nad monthly updates.
                </dd>
                </div>
            </dl>
            </div>
        </div>
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        </div>
        </div>
    </div>
  )
}

export default CallToAction