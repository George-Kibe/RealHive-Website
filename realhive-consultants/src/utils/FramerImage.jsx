"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react'

const FramerImageView = motion(Image);

export const FramerImage = ({image, title}) => {
  return (
    <FramerImageView src={image} alt={title} className='w-full h-[40vh] object-contain' 
        whileHover={{scale:1.05}}
        transition={{duration:0.2}}
    />
  )
}
