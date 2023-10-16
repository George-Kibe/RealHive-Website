"use client"

import React, { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext'


const DarkModeToggle = () => {
  const {toggle, mode} = useContext(ThemeContext)
  return (
    <div onClick={toggle}
        className='w-14 h-8 rounded-3xl items-center relative flex justify-between p-1 border-[#53c58b] 
        border-2 border-solid'
    >
      <div className="text-[14px]">🌙</div>
      <div className="text-[14px]">🔆</div>
      <div className={`absolute bg-[#53c28b] rounded-full w-4 h-4 cursor-pointer
            ${mode === "dark"? "right-1":"left-1"}`} 
      />
    </div>
  )
}

export default DarkModeToggle