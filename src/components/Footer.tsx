import { FOOTER_ABOUT, FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants'
import { CONTACT } from '@/lib/schema'
import Image from 'next/image'
import Link from 'next/link'
import NavLink from './NavLink'
import React from 'react'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import CookieSettingsButton from './analytics/CookieSettingsButton'

// the site-wide content column and gutters (globals.css), as on every page
const INNER = 'max-container padding-container'

// "+254795288155" -> "+254 795 288 155"
const prettyPhone = (phone: string) => phone.replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4')

/**
 * Four columns on desktop: brand (logo, description, tagline) · Our Company ·
 * Our Services · Contact Us with the socials under it. Tablet: the brand spans
 * the top and the three columns sit below it; phone: everything stacks.
 */
const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className={`${INNER} grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12`}>
        {/* Brand */}
        <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
          <Link href="/" aria-label="RealHive Consultants, home" className="w-fit">
            {/* Same trimmed asset and locked aspect ratio as the header. */}
            <Image
              src="/logo.png"
              alt="RealHive Consultants Ltd"
              width={1600}
              height={545}
              sizes="(max-width: 639px) 165px, 205px"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{FOOTER_ABOUT.description}</p>
          <p className="text-sm font-semibold italic text-brand">&ldquo;{FOOTER_ABOUT.tagline}&rdquo;</p>
        </div>

        {/* Our Company + Our Services */}
        {FOOTER_LINKS.map((column) => (
          <FooterColumn key={column.title} title={column.title}>
            <ul className="flex flex-col gap-3 text-sm">
              {column.links.map((link) => (
                <li key={link.name}>
                  <NavLink href={link.href} showActive={column.title === 'Our Company'} className="text-muted-foreground hover:text-brand">
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </FooterColumn>
        ))}

        {/* Contact Us, socials beneath */}
        <FooterColumn title={FOOTER_CONTACT_INFO.title}>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href={`tel:${CONTACT.telephone}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-brand">
                <FiPhone aria-hidden="true" className="shrink-0" /> {prettyPhone(CONTACT.telephone)}
              </a>
            </li>
            <li>
              <a href={FOOTER_CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-brand">
                <BsWhatsapp aria-hidden="true" className="shrink-0" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-brand">
                <FiMail aria-hidden="true" className="shrink-0" />
                {/* <wbr>: if the column is too narrow, wrap before the @ rather than mid-word */}
                <span>{CONTACT.email.split('@')[0]}<wbr />@{CONTACT.email.split('@')[1]}</span>
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <FiMapPin aria-hidden="true" className="shrink-0" /> {FOOTER_CONTACT_INFO.location}
            </li>
          </ul>

          <ul aria-label="Social media" className="mt-6 flex gap-4">
            {SOCIALS.links.map((link) => (
              <li key={link.name}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={'label' in link && link.label ? link.label : `RealHive Consultants on ${link.name}`}
                    title={'label' in link && link.label ? link.label : link.name}
                    className="inline-block opacity-80 transition-opacity duration-200 hover:opacity-100"
                  >
                    <Image src={link.icon} alt="" width={24} height={24} />
                  </a>
                ) : (
                  <Image src={link.icon} alt={link.name} width={24} height={24} className="opacity-40" />
                )}
              </li>
            ))}
          </ul>
        </FooterColumn>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        {/* extra bottom padding keeps this row clear of the floating "Chat with us" button */}
        <div className={`${INNER} flex flex-col items-center justify-between gap-3 pt-6 pb-24 text-center text-sm text-muted-foreground sm:flex-row sm:text-left`}>
          <p>&copy; {new Date().getFullYear()} RealHive Consultants Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <CookieSettingsButton className="hover:text-foreground" />
          </div>
        </div>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => (
  <div className="flex flex-col gap-5">
    <h2 className="text-base font-semibold">{title}</h2>
    {children}
  </div>
)

export default Footer
