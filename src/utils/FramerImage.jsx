"use client"

import { motion } from 'motion/react';
import Image from 'next/image';
import React from 'react'

const FramerImageView = motion.create(Image);

const hover = { whileHover: { scale: 1.05 }, transition: { duration: 0.2 } };

/**
 * next/image with a hover zoom. `image` is a static import, or { light, dark }
 * for artwork that needs a different version per theme: both are rendered and
 * CSS shows one. They're lazy-loaded, and the browser skips fetching a lazy
 * image that is display:none, so only the visible version is downloaded.
 */
export const FramerImage = ({ image, title, sizes, width, quality, className = 'w-full h-[40vh] object-contain', preload = false }) => {
  const shared = { alt: title, sizes, width, quality, ...hover }
  if (image?.light && image?.dark) {
    return (
      <>
        <FramerImageView src={image.light} {...shared} className={`${className} dark:hidden`} />
        <FramerImageView src={image.dark} {...shared} className={`${className} hidden dark:block`} />
      </>
    )
  }
  return <FramerImageView src={image} {...shared} preload={preload} className={className} />
}
