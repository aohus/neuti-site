'use client'

import React from 'react'
import Link from 'next/link'
import Container from './Container'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-green-700 text-white text-center">
      <Container>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
          도심 속 녹지 공간은<br/>우리 삶의 쉼터이자 삶터입니다
        </h2>
        <p className="text-xl md:text-2xl text-green-100 mb-10 font-light opacity-80">
          건강하고 아름다운 녹지 공간, 나무의사의 전문적인 관리가 필수적입니다.
        </p>
        <Link 
          href="/request"
          className="inline-block bg-white text-green-700 px-12 py-4 rounded-full font-bold text-xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          무료 견적 상담하기
        </Link>
      </Container>
    </section>
  )
}
