"use client"
import React from 'react'
import { motion } from 'motion/react'

const quote = {
    initial:{
        opacity:1
    },
    animate: {
        opacity: 1,
        transition: {
            delay: 0.5,
            staggerChildren: 0.08,
        }
    }
}

const singleWord = {
    initial: {
        opacity: 0,
        y:50,
    },
    animate: {
        opacity: 1,
        y:0,
        transition: {
            duration:1
        }
    }
}

const AnimatedText = ({text, className=""}) => {
  return (
    <div className='mx-auto flex flex-wrap items-center justify-center overflow-hidden py-2 mb-4 text-center'>
      <motion.h1 className={`${className} inline-block text-foreground font-bold capitalize text-[40px] lg:text-[60px] self-center`}
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {
            text.split(" ").map((word, index) => 
            <motion.span key={word+"-"+index} className='inline-block '
                variants={singleWord}
                initial="initial"
                animate="animate"
            >
                {word}&nbsp;
            </motion.span>
            )
        }

      </motion.h1>
    </div>
  )
}

export default AnimatedText