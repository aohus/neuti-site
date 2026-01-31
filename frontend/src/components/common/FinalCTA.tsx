'use client'

import React from 'react'
import Link from 'next/link'
import Container from './Container'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-32 bg-green-700 text-white text-center relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-900/50 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <Container className="relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold mb-10 leading-tight tracking-tighter"
        >
          도심 속 녹지 공간은<br/>우리 삶의 쉼터이자 삶터입니다
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-green-100 mb-16 font-light opacity-90 max-w-3xl mx-auto leading-relaxed"
        >
          건강하고 아름다운 마을 환경을 가꾸는 일, <br className="hidden md:block" />
          사회적 가치를 실현하는 나무병원이 정성을 다해 함께하겠습니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/request"
            className="group inline-flex items-center bg-white text-green-700 px-14 py-5 rounded-full font-extrabold text-xl hover:bg-green-50 transition-all shadow-2xl hover:shadow-white/20 active:scale-95"
          >
            무료 진단 및 견적 상담
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}