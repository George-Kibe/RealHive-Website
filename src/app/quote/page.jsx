import AnimatedText from '@/components/AnimatedText'
import QuoteBuilder from '@/components/quote/QuoteBuilder'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Get an Instant Project Quote',
  description:
    'Pick the web, mobile, data or cloud services you need, choose MVP or production-grade, and get an instant "starting from" estimate in your currency, emailed to you as a PDF.',
  path: '/quote',
})

// Static: the page holds no prices. Estimates come from /api/quote/estimate.
const QuotePage = () => (
  <div className='max-container padding-container page-y pb-40 sm:pb-40 lg:pb-40'>
    <AnimatedText text={"Get a Quote"} />
    <p className='mx-auto -mt-4 max-w-2xl text-center text-lg text-muted-foreground'>
      Choose what you need and see an instant &ldquo;starting from&rdquo; estimate. Download it, or have the PDF emailed to you.
    </p>
    <QuoteBuilder />
  </div>
)

export default QuotePage
