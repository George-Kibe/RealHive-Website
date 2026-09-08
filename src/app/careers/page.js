import AnimatedText from '@/components/AnimatedText'
import React from 'react'

const CareersPage = () => {
  return (
    <div className='padding-container max-container'>
      <AnimatedText text={"Careers"}/>
        <div className='flex flex-col justify-center gap-4 '>
          <p>RealHive Consultants is an equal opportunity employer.</p>
          <p>No Jobs found for now. Be on the lookout</p>
        </div>
    </div>
  )
}

export default CareersPage