import AnimatedText from '@/components/AnimatedText'
import BookingWidget from '@/components/booking/BookingWidget'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Book a Free Consultation',
  description:
    'Pick a time that suits you for a free video consultation with RealHive Consultants about your web, mobile, data or cloud project.',
  path: '/book',
})

// Static shell: available times are loaded in the browser from /api/booking/slots.
const BookPage = () => (
  <div className='padding-container max-container pb-24'>
    <AnimatedText text={"Book a Consultation"} />
    <p className='mx-auto -mt-4 max-w-2xl text-center text-lg text-muted-foreground'>
      A free video call with our team about your project. Pick a time that suits you.
    </p>
    <BookingWidget />
  </div>
)

export default BookPage
