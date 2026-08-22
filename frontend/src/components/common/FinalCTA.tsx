'use client'

import React from 'react'
import Link from 'next/link'
import Container from './Container'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'

/** 대표 전화. 발주 담당자의 1차 문의 채널이라 CTA에서 항상 보이게 둔다. */
const PHONE = '031-752-6000'

interface CTAButton {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

interface FinalCTAProps {
  buttons?: CTAButton[]
}

const defaultButtons: CTAButton[] = [
  { label: '무료 진단 및 견적 상담', href: '/request', variant: 'primary' },
]

export default function FinalCTA({ buttons = defaultButtons }: FinalCTAProps) {
  return (
    <section data-section="cta" className="py-16 md:py-32 bg-green-700 text-white text-center relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-green-900/50 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <Container className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 md:mb-10 leading-tight tracking-tighter"
        >
          도심 속 녹지 공간은<br/>우리 삶의 쉼터이자 삶터입니다
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl lg:text-2xl text-green-100 mb-10 md:mb-16 font-light opacity-90 max-w-3xl mx-auto leading-relaxed"
        >
          건강하고 아름다운 마을 환경을 가꾸는 일, <br className="hidden md:block" />
          사회적 가치를 실현하는 나무병원이 정성을 다해 함께하겠습니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.href}
              className={`group inline-flex items-center px-8 py-4 md:px-14 md:py-5 rounded-full font-extrabold text-base md:text-xl transition-all shadow-2xl active:scale-95 ${
                btn.variant === 'secondary'
                  ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:shadow-white/10'
                  : 'bg-white text-green-700 hover:bg-green-50 hover:shadow-white/20'
              }`}
            >
              {btn.label}
              <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          ))}
        </motion.div>

        {/* 전화 채널 — 모바일은 하단 고정 바(MobileBottomCTA)가 담당하지만
            데스크톱에는 푸터 외에 전화번호가 없어 여기서 노출한다. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-10"
        >
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 text-lg font-black text-green-100 transition-colors hover:text-white md:text-2xl"
          >
            <Phone className="h-5 w-5 md:h-6 md:w-6" />
            전화 문의 {PHONE}
          </a>
        </motion.div>
      </Container>
    </section>
  )
}
