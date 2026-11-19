import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import CallToAction from '@/components/CallToAction'
import JsonLd from '@/components/JsonLd'
import Testimonials from '@/components/Testimonials'
import PostCard from '@/components/blog/PostCard'
import { buttonVariants } from '@/components/ui/button'
import { PROJECTS } from '@/constants/projects'
import {
  ENGAGEMENT,
  PROCESS,
  SERVICE_PAGES,
  SERVICE_PAGE_BY_SLUG,
  TIME_ZONES,
  postsForService,
  servicePath,
} from '@/constants/servicePages'
import { getPublishedPosts } from '@/lib/blog'
import { servicePageSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

// Related posts and testimonials come from the database: blog and testimonial
// edits revalidate these pages, and the hourly fallback covers a missed one.
export const revalidate = 3600
// Only the pages in SERVICE_PAGES exist; any other slug is a real 404.
export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }) {
  const page = SERVICE_PAGE_BY_SLUG[(await params).slug]
  if (!page) return {}
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: servicePath(page.slug) })
}

const ThemedImage = ({ image, alt, className, ...props }) =>
  image.light ? (
    <>
      <Image src={image.light} alt={alt} className={`${className} dark:hidden`} {...props} />
      <Image src={image.dark} alt={alt} className={`${className} hidden dark:block`} {...props} />
    </>
  ) : (
    <Image src={image} alt={alt} className={className} {...props} />
  )

const SectionHeading = ({ id, title, children }) => (
  <div className="max-w-3xl">
    <h2 id={id} className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    {children && <p className="mt-4 text-lg text-muted-foreground">{children}</p>}
  </div>
)

const Card = ({ title, children }) => (
  <li className="rounded-2xl p-6 ring-1 ring-border sm:p-8">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-3 text-muted-foreground">{children}</p>
  </li>
)

export default async function ServicePage({ params }) {
  const page = SERVICE_PAGE_BY_SLUG[(await params).slug]
  if (!page) notFound()

  const posts = postsForService(page, await getPublishedPosts())
  const work = page.work.map((id) => PROJECTS[id]).filter(Boolean)
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug)

  return (
    <div className="pt-8 sm:pt-12">
      <JsonLd schema={servicePageSchema(page)} />

      {/* Intro: the main keyword in the h1, then the two conversion paths */}
      <section className="max-container padding-container">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: page.name, path: servicePath(page.slug) },
          ]}
        />
        <div className="mt-8 grid items-center gap-10 md:grid-cols-[3fr_2fr] lg:gap-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{page.h1}</h1>
            {page.lead.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-lg text-muted-foreground">{paragraph}</p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote" className={buttonVariants({ variant: 'brand', size: 'xl' })}>Get an instant estimate</Link>
              <Link href="/book" className={buttonVariants({ variant: 'brandOutline', size: 'xl' })}>Book a free consultation</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <ThemedImage
              image={page.image}
              alt={page.imageAlt}
              sizes="(min-width: 768px) 384px, calc(100vw - 32px)"
              quality={60}
              preload
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="who" className="section-y max-container padding-container">
        <SectionHeading id="who" title="Who it's for" />
        <ul className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {page.audience.map((item) => <Card key={item.title} title={item.title}>{item.text}</Card>)}
        </ul>
      </section>

      <section aria-labelledby="what" className="section-y max-container padding-container">
        <SectionHeading id="what" title="What we build" />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {page.builds.map((item) => <Card key={item.title} title={item.title}>{item.text}</Card>)}
        </ul>
      </section>

      {work.length > 0 && (
        <section aria-labelledby="work" className="section-y max-container padding-container">
          <SectionHeading id="work" title="Recent work">
            Shipped projects you can open and try. <Link href="/portfolio" className="text-brand hover:underline">See the full portfolio</Link>.
          </SectionHeading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
            {work.map((project) => (
              <li key={project.title} className="flex flex-col overflow-hidden rounded-2xl ring-1 ring-border">
                <Image
                  src={project.image}
                  alt={`${project.title}: screenshot`}
                  sizes="(min-width: 1152px) 548px, (min-width: 768px) 50vw, calc(100vw - 32px)"
                  placeholder="blur"
                  className="aspect-video w-full object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-sm font-semibold text-brand">{project.type}</p>
                  <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
                  <p className="mt-3 text-muted-foreground">{project.summary}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto pt-5 font-medium text-brand hover:underline">
                    View the live project<span className="sr-only"> {project.title} (opens in a new tab)</span> →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="how" className="section-y max-container padding-container">
        <SectionHeading id="how" title="How we work" />
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="rounded-2xl p-6 ring-1 ring-border sm:p-8">
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-semibold text-brand-foreground">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-6 rounded-2xl bg-muted p-6 ring-1 ring-border sm:p-8 md:grid-cols-2 lg:gap-8">
          <div>
            <h3 className="text-lg font-semibold">Timeline</h3>
            <p className="mt-2 text-muted-foreground">{page.timeline}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Working hours</h3>
            <p className="mt-2 text-muted-foreground">{TIME_ZONES}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="tech" className="section-y max-container padding-container">
        <SectionHeading id="tech" title="Technology we use" />
        <dl className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {page.tech.map((group) => (
            <div key={group.group} className="rounded-2xl p-6 ring-1 ring-border sm:p-8">
              <dt className="text-lg font-semibold">{group.group}</dt>
              <dd className="mt-4">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-full bg-muted px-3 py-1 text-sm ring-1 ring-border">{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="engage" className="section-y max-container padding-container">
        <SectionHeading id="engage" title="Ways to work with us">
          Pick what suits your project. For a starting-from price in your currency, the{' '}
          <Link href="/quote" className="text-brand hover:underline">instant quote</Link> takes about two minutes.
        </SectionHeading>
        <ul className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {ENGAGEMENT.map((item) => <Card key={item.title} title={item.title}>{item.text}</Card>)}
        </ul>
      </section>

      {/* Answers are plain HTML (not a collapsed accordion), so search engines and AI answers can read them */}
      <section aria-labelledby="faq" className="section-y max-container padding-container">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq" className="text-3xl font-bold tracking-tight sm:text-4xl">Common questions</h2>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <dt className="text-lg font-semibold">{faq.question}</dt>
                <dd className="mt-3 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Testimonials />

      {posts.length > 0 && (
        <section aria-labelledby="reading" className="section-y max-container padding-container">
          <SectionHeading id="reading" title="From our blog" />
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post._id} post={post} headingLevel={3} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="more" className="section-y max-container padding-container">
        <SectionHeading id="more" title="Other services" />
        <ul className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={servicePath(other.slug)} className="group block h-full rounded-2xl p-6 ring-1 ring-border transition-shadow hover:shadow-lg sm:p-8">
                <h3 className="text-xl font-semibold group-hover:text-brand">{other.name}</h3>
                <p className="mt-3 text-muted-foreground">{other.metaDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CallToAction eyebrow={`${page.name}: tell us what you're building`} title="Get your estimate or book a call" />
    </div>
  )
}
