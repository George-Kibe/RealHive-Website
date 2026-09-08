import Features from "@/components/Services";
import GetApp from "@/components/GetApp";
import Guide from "@/components/Guide";
import Hero from "@/components/Hero";
import { buildMetadata, SITE } from '@/lib/seo'

export const metadata = buildMetadata({
  title: SITE.defaultTitle,
  absoluteTitle: true,
  description: SITE.defaultDescription,
  path: '/',
})

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Features />
      <GetApp />
    </div>
  )
}