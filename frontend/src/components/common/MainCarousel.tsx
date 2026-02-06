'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Container from './Container'
import { heroImages } from '@/data/home-content'

const carouselItems = [
  {
    id: 1,
    title: <>나무는 우리 삶의 동반자,<br/>더불어 사는 초록빛 마을</>,
    description: <>전문적인 수목 관리와 정성 어린 치료를 통해<br/>자연과 사람이 공존하는 건강한 도시 생태계를 꿈꿉니다.</>,
    image: heroImages[0].src,
    btnText: '느티나무 이야기',
    btnLink: '/about',
  },
  {
    id: 2,
    title: <>나무의사의 과학적인<br/>진단과 맞춤형 처방</>,
    description: <>농약 오·남용 없는 안전한 관리, 1종 나무병원의 전문 장비로<br/>소중한 수목의 활력을 되찾아 드립니다.</>,
    image: heroImages[1].src,
    btnText: '수목 진단 의뢰',
    btnLink: '/request',
  }
]

export default function MainCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={carouselItems[currentIndex].image}
              alt="Hero Image"
              fill
              className="object-cover opacity-80"
              priority
            />
            {/* Premium Dark Overlay for Trust & Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
          </div>

          <Container className="relative h-full z-20 flex flex-col justify-center text-left pt-20 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10">
                <CheckCircle2 className="text-green-400 w-4 h-4" />
                <span className="text-green-50 text-sm font-bold tracking-wide">신뢰받는 1종 나무병원</span>
              </div>
              
              <h1 
                className="text-white text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter"
              >
                {carouselItems[currentIndex].title}
              </h1>
              <p 
                className="text-gray-200 text-lg md:text-2xl mb-12 opacity-90 leading-relaxed font-medium max-w-2xl"
              >
                {carouselItems[currentIndex].description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href={carouselItems[currentIndex].btnLink}
                  className="group inline-flex items-center bg-green-600 text-white px-10 py-5 font-black rounded-full hover:bg-green-700 transition-all shadow-2xl active:scale-95 text-lg"
                >
                  {carouselItems[currentIndex].btnText}
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  href="/performance"
                  className="group inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-10 py-5 font-black rounded-full hover:bg-white/20 transition-all border border-white/20 text-lg"
                >
                  시공사례 보기
                </Link>
              </div>
            </motion.div>
          </Container>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="absolute bottom-12 right-12 md:right-24 z-30 flex items-center space-x-8">
        <div className="flex space-x-3">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-green-500 w-16' : 'bg-white/20 w-8 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
