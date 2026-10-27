'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SchoolSectionHeadingProps {
  label: string
  /** 줄바꿈 단위. 모바일에서도 나눠야 "진단·처방" 같은 가운뎃점에서 줄이 끊기지 않는다. */
  titleLines: string[]
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
}

export default function SchoolSectionHeading({
  label,
  titleLines,
  tone = 'light',
  align = 'left',
  className = ''
}: SchoolSectionHeadingProps) {
  const isDark = tone === 'dark'

  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col gap-2.5 ${align === 'center' ? 'items-center text-center' : ''} ${className}`}
    >
      <p
        className={`m-0 text-[13px] font-black tracking-[0.3em] uppercase ${
          isDark ? 'text-green-300' : 'text-primary'
        }`}
      >
        {label}
      </p>
      <h2
        className={`text-[26px] leading-[1.3] font-black tracking-[-0.04em] md:text-[32px] lg:text-[40px] ${
          isDark ? 'text-white' : 'text-deep'
        }`}
      >
        {titleLines.map((line, idx) => (
          <React.Fragment key={line}>
            {idx > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </h2>
    </motion.div>
  )
}
