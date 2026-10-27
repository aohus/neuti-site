'use client'

import React from 'react'
import Reveal from './Reveal'

interface SectionHeadingProps {
  label: string
  title: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** 영문 라벨 + h2 로 된 섹션 제목. 페이지의 h1 은 히어로 하나뿐이다. */
export default function SectionHeading({
  label,
  title,
  align = 'left',
  tone = 'light',
  className = ''
}: SectionHeadingProps) {
  const isDark = tone === 'dark'
  return (
    <Reveal
      className={`${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <p
        className={`mb-3 text-[13px] font-black tracking-[0.3em] uppercase ${
          isDark ? 'text-green-300' : 'text-primary'
        }`}
      >
        {label}
      </p>
      <h2
        className={`text-[26px] leading-snug font-black tracking-[-0.04em] md:text-[32px] lg:text-[40px] ${
          isDark ? 'text-white' : 'text-deep'
        }`}
      >
        {title}
      </h2>
    </Reveal>
  )
}
