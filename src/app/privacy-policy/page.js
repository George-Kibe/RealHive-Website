import AnimatedText from '@/components/AnimatedText'
import React from 'react'
import { buildMetadata } from '@/lib/seo'
import { CONTACT } from '@/lib/schema'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How RealHive Consultants collects, uses, stores and protects the personal information you submit through this website and during client engagements.',
  path: '/privacy-policy',
})

// Keep this in step with what the site actually does (forms, analytics, providers).
const LAST_UPDATED = '3 October 2026'

const H2 = ({ id, children }) => <h2 id={id} className='scroll-mt-24 pt-6 pb-2 text-lg font-semibold'>{children}</h2>

const PrivacyPolicyPage = () => {
  return (
    <div className="max-container padding-container page-y">
      <AnimatedText text={"Privacy Policy"} />

      <div className='mx-auto max-w-3xl space-y-3 leading-7'>
        <p><strong>Effective date:</strong> 15 September 2023 · <strong>Last updated:</strong> {LAST_UPDATED}</p>

        <p>RealHive Consultants Limited (&ldquo;we&rdquo;) values your privacy. This policy explains what personal information this website collects, why, who processes it for us, and the choices you have.</p>

        <H2 id='information'>1. Information we collect</H2>
        <ul className='list-disc space-y-1 pl-6'>
          <li><strong>Contact form:</strong> your name, email, phone number and message.</li>
          <li><strong>Quotes:</strong> the services you choose, and, if you ask us to email the quote, your name, email, company and notes.</li>
          <li><strong>Consultation bookings:</strong> your name, email, company, what you&apos;d like to discuss, the time you book and your time zone.</li>
          <li><strong>Newsletter:</strong> your email address.</li>
          <li><strong>Accounts and blog comments:</strong> your name, email, password (stored only as a secure hash) and the comments you post.</li>
          <li><strong>Approximate location:</strong> the country your connection comes from, worked out from your IP address by our hosting provider, used to show prices in your currency and to decide whether to ask for cookie consent.</li>
          <li><strong>Usage information:</strong> pages viewed, device, browser and how you reached the site (see Cookies and analytics).</li>
        </ul>

        <H2 id='use'>2. How we use it</H2>
        <ul className='list-disc space-y-1 pl-6'>
          <li>To respond to your enquiries, send the quotes and booking confirmations you request, and hold the consultations you book.</li>
          <li>To send the newsletter you subscribed to. You can unsubscribe at any time by emailing us.</li>
          <li>To run accounts and blog comments.</li>
          <li>To understand how the site is used and improve it.</li>
          <li>To protect the site against spam and abuse. For rate limiting we store a one-way hash of your IP address, not the address itself.</li>
        </ul>
        <p>We don&apos;t sell your information or use it for advertising.</p>

        <H2 id='cookies'>3. Cookies and analytics</H2>
        <p>We use <strong>Google Analytics</strong> to understand how visitors use the site. It sets cookies and is run in Google&apos;s Consent Mode: if you are in the European Economic Area, the UK or Switzerland, analytics cookies are only set after you accept them in the banner, and you can change your choice at any time with <strong>Cookie settings</strong> at the bottom of every page. Advertising features are switched off.</p>
        <p>We also use <strong>Vercel Speed Insights</strong> to measure page speed. It doesn&apos;t use cookies.</p>
        <p>The site stores a few settings in your browser that aren&apos;t sent to anyone: your light or dark theme choice, your cookie choice, and, if you sign in, a secure session cookie needed for your account.</p>

        <H2 id='sharing'>4. Who processes your information</H2>
        <p>We share information only with the providers that run the site for us, under their data-protection terms:</p>
        <ul className='list-disc space-y-1 pl-6'>
          <li><strong>Vercel</strong>: website hosting and page-speed measurement.</li>
          <li><strong>MongoDB Atlas</strong>: the database that stores the information above.</li>
          <li><strong>Google</strong>: email delivery (Gmail), Google Analytics, and Google Calendar and Meet for the consultations you book.</li>
          <li><strong>Cloudinary</strong>: hosting of blog and testimonial images.</li>
        </ul>
        <p>These providers may process data outside your country, including in the United States and the European Union.</p>

        <H2 id='retention'>5. How long we keep it</H2>
        <p>Enquiries, quotes and bookings are kept for as long as they are needed for the business relationship, and deleted on request. Newsletter addresses are kept until you unsubscribe; accounts until you ask us to delete them. Google Analytics data is kept for up to 14 months.</p>

        <H2 id='rights'>6. Your rights</H2>
        <p>You can ask to see, correct or delete the personal information we hold about you, object to how we use it, or withdraw consent at any time. These rights apply under, among others, the Kenya Data Protection Act 2019 and the EU and UK GDPR. To make a request, email us (below). You can also complain to a data protection authority, such as Kenya&apos;s Office of the Data Protection Commissioner.</p>

        <H2 id='security'>7. Security</H2>
        <p>We use encrypted connections (HTTPS), hashed passwords and access controls to protect your information. No method of transmission or storage is completely secure, so we can&apos;t guarantee absolute security.</p>

        <H2 id='changes'>8. Changes to this policy</H2>
        <p>We may update this policy. Changes are posted on this page with a new &ldquo;last updated&rdquo; date.</p>

        <H2 id='contact'>9. Contact us</H2>
        <p>For any privacy question or request, email <a href={`mailto:${CONTACT.email}`} className='underline'>{CONTACT.email}</a> or call {CONTACT.telephone}.</p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
