'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from './Container'

const carouselItems = [
  {
    id: 1,
    title: <>자연과 사람이 함께 누리는<br/>건강한 녹지공간</>,
    description: <>건강한 나무, 아름다운 녹지공간<br/>느티나무병원협동조합이 약속드립니다.</>,
    image: '/images/home/carousel_1.jpg',
    btnText: '조합 소개 바로가기',
    btnLink: '/about',
    color: '#2e7d32'
  },
  {
    id: 2,
    title: <>나무가 아플 땐<br/>1종 나무병원을 찾아주세요</>,
    description: <>국가공인 나무의사의 정확한 진단과 처방,<br/>농약 오·남용 없는 안전한 관리를 제공합니다.</>,
    image: '/images/home/carousel_2.jpg',
    btnText: '진단 의뢰하기',
    btnLink: '/request',
    color: '#1b5e20'
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
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Filter */}
          <div className="absolute inset-0 bg-gray-800">
            {/* Using a div with background color as fallback since images might be missing initially */}
            <div 
              className="absolute inset-0 brightness-[0.6]"
              style={{ backgroundColor: item.color }}
            />
            {/* Real Image */}
            <Image
              src={item.image}
              alt="Hero Image"
              fill
              className="object-cover brightness-[0.6]"
              priority={index === 0}
            />
          </div>

          <Container className="relative h-full z-20 flex flex-col justify-center text-left">
            <h1 
              className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {item.title}
            </h1>
            <p 
              className="text-white text-lg md:text-2xl mb-10 opacity-90 leading-relaxed"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {item.description}
            </p>
            <div>
              <Link
                href={item.btnLink}
                className="inline-block bg-green-600 text-white px-8 py-4 text-lg font-bold hover:bg-green-700 transition-colors rounded-sm shadow-lg"
              >
                {item.btnText}
              </Link>
            </div>
          </Container>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
