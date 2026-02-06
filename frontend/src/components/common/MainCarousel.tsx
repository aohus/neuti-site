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
    title: <>체계적인 녹지 관리로<br/>완성하는 명품 단지의 가치</>,
    description: <>아파트 및 공공기관의 수목을 과학적으로 관리하여<br/>사계절 푸르고 아름다운 프리미엄 조경 공간을 유지합니다.</>,
    image: heroImages[0].src,
    btnText: '녹지관리 솔루션',
    btnLink: '/business',
  },
  {
    id: 2,
    title: <>자연과 조화를 이루는<br/>고품격 조경식재 및 시공</>,
    description: <>1종 나무병원의 전문 진단과 풍부한 시공 실적을 바탕으로<br/>주변 환경에 가장 적합하고 지속 가능한 숲을 조성합니다.</>,
    image: heroImages[1].src,
    btnText: '조경식재 포트폴리오',
    btnLink: '/performance',
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
    <section className="relative h-[calc(100vh-160px)] min-h-[500px] w-full overflow-hidden bg-black">
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
                className="text-white text-5xl md:text-7xl font-black mb-8 leading-[1.2] tracking-tighter"
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
