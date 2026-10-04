import AnimatedText from '@/components/AnimatedText'
import React from 'react'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Engineering Careers & Open Roles',
  description:
    'RealHive Consultants is an equal opportunity employer. No roles are listed right now, so check back here for engineering and data positions as they open.',
  path: '/careers',
})

const CareersPage = () => {
  return (
    <div className='max-container padding-container page-y'>
      <AnimatedText text={"Careers"}/>
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
          <p>RealHive Consultants is an equal opportunity employer.</p>
          <p>No Jobs found for now. Be on the lookout</p>
        </div>
    </div>
  )
}

export default CareersPage