'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}

/**
 * 스크롤 시 아래에서 떠오르는 등장 효과.
 * data-reveal 이 붙어 있어 모바일·모션 축소 환경에서는 바로 보인다 (globals.css).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = 'div'
}: RevealProps) {
  const Component = as === 'li' ? motion.li : motion.div
  return (
    <Component
      data-reveal
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  )
}
