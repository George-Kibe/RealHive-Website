import Image from 'next/image'
import Link from 'next/link'
import heroOffice from '../../public/images/hero-office.webp'
import { buttonVariants } from '@/components/ui/button'
import React from 'react'

// Each point is backed by the service pages (constants/servicePages.js).
const REASONS = [
  { title: 'Senior engineers, no hand-offs', text: 'You talk directly to the people designing and building your product.' },
  { title: 'Working hours that overlap', text: 'From Nairobi (UTC+3): 1–3 hours ahead of the UK and Europe, 1 hour behind the UAE.' },
  { title: 'A clear scope and price', text: 'An instant estimate online, then a written scope with milestones before any work starts.' },
  { title: 'You own everything', text: 'The code, designs and accounts are yours from day one.' },
]

const Hero = () => {
  return (
    <div>
      <div className="max-container padding-container pt-12 pb-16 sm:pt-16 lg:pt-24 lg:pb-20">
        <p className="font-semibold text-brand">RealHive Consultants</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-foreground sm:text-5xl">
          Web, mobile, data and AI engineering for startups and growing companies
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          We are a software development company in Nairobi, Kenya. We build mobile apps, web applications,
          data pipelines and AI solutions for businesses around the world, from a first MVP to a production
          platform that scales.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote" className={buttonVariants({ variant: 'brand', size: 'xl' })}>Get an instant estimate</Link>
          <Link href="/book" className={buttonVariants({ variant: 'brandOutline', size: 'xl' })}>Book a free consultation</Link>
        </div>
      </div>

      <div className="max-container padding-container md:grid md:grid-cols-2 md:gap-10 lg:gap-16 md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why teams work with us</h2>
          <ul className="mt-6 space-y-5">
            {REASONS.map((reason) => (
              <li key={reason.title} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <div>
                  <h3 className="font-semibold">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/portfolio" className="mt-6 inline-block font-medium text-brand hover:underline">
            See the projects we have shipped <span aria-hidden="true">→</span>
          </Link>
        </div>
        {/* A scene photo can't lose its background without losing the scene, so
            its edges fade into the page instead (.fade-edges in globals.css). */}
        <Image
          src={heroOffice}
          alt="A developer writing code at a desk in a dimly lit office"
          sizes="(min-width: 1152px) 528px, (min-width: 768px) 45vw, calc(100vw - 32px)"
          placeholder="blur"
          loading="eager"
          className="fade-edges mt-8 w-full h-auto md:mt-0"
        />
      </div>
    </div>
  )
}

export default Hero
