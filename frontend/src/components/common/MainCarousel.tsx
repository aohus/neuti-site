'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TreePine } from 'lucide-react'
import Container from './Container'

export default function MainCarousel() {
  return (
    <section className="relative h-[calc(100vh-160px)] min-h-[400px] md:min-h-[540px] w-full overflow-hidden bg-black">
      {/* Background Image — 1번 사진 고정 */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero_1.jpg"
          alt="느티나무병원 협동조합"
          fill
          sizes="100vw"
          className="object-cover opacity-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
      </div>

      <Container className="relative z-20 h-full flex flex-col justify-center pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10">
            <TreePine className="text-green-400 w-4 h-4" />
            <span className="text-green-50 text-sm font-bold tracking-wide">산림청 지정 1종 나무병원</span>
          </div>

          <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-8 leading-[1.2] tracking-tighter">
            나무를 살리는 기술,<br />
            도시를 가꾸는 사람들
          </h1>

          <p className="text-gray-200 text-base md:text-lg lg:text-2xl mb-8 md:mb-12 opacity-90 leading-relaxed font-medium max-w-2xl">
            전문 나무의사의 과학적 진단과 풍부한 시공 실적으로<br className="hidden md:block" />
            공공기관과 아파트의 녹지 공간을 건강하게 관리합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/request"
              className="group inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 md:px-10 md:py-5 font-black rounded-full hover:bg-green-700 transition-all shadow-2xl active:scale-95 text-base md:text-lg"
            >
              견적·상담 문의
              <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/contract"
              className="group inline-flex items-center justify-center bg-white/10 border border-white/30 text-white px-8 py-4 md:px-10 md:py-5 font-black rounded-full hover:bg-white/20 transition-all shadow-2xl active:scale-95 text-base md:text-lg backdrop-blur-sm"
            >
              수의계약 안내
              <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
