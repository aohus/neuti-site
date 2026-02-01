'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from './Container'

const carouselItems = [
  {
    id: 1,
    title: <>나무는 우리 삶의 동반자,<br/>더불어 사는 초록빛 마을</>,
    description: <>전문적인 수목 관리와 정성 어린 치료를 통해<br/>자연과 사람이 공존하는 건강한 도시 생태계를 꿈꿉니다.</>,
    image: '/images/home/carousel_1.jpg',
    btnText: '느티나무 이야기',
    btnLink: '/about',
  },
  {
    id: 2,
    title: <>나무의사의 과학적인<br/>진단과 맞춤형 처방</>,
    description: <>농약 오·남용 없는 안전한 관리, 1종 나무병원의 전문 장비로<br/>소중한 수목의 활력을 되찾아 드립니다.</>,
    image: '/images/home/carousel_2.jpg',
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
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Full Width Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={carouselItems[currentIndex].image}
              alt="Hero Image"
              fill
              className="object-cover"
              priority
            />
            {/* Soft dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30 z-10" />
          </div>

          <Container className="relative h-full z-20 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl"
            >
              <h1 
                className="text-white text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
                {carouselItems[currentIndex].title}
              </h1>
              <p 
                className="text-white text-lg md:text-xl mb-12 opacity-95 leading-relaxed font-bold"
              >
                {carouselItems[currentIndex].description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={carouselItems[currentIndex].btnLink}
                  className="group inline-flex items-center bg-white text-green-800 px-8 py-4 font-black rounded-full hover:bg-green-700 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  {carouselItems[currentIndex].btnText}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </Container>
        </motion.div>
      </AnimatePresence>

      {/* Modern Pagination Controls */}
      <div className="absolute bottom-12 right-12 md:right-24 z-30 flex items-center space-x-8">
        <div className="flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-white w-12' : 'bg-white/30 w-6'
              }`}
            />
          ))}
        </div>
        <div className="text-white font-black text-xl tracking-widest font-mono">
          0{currentIndex + 1}
        </div>
      </div>
    </section>
  )
}
