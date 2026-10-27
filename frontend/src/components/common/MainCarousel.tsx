'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { TreePine } from 'lucide-react'
import Container from './Container'
import ServicePanel from '../home/ServicePanel'
import heroImage from '../../../public/images/hero/hero_1.jpg'

/**
 * data-section="hero" 는 사진 section 이 아니라 바깥 래퍼에 둔다.
 * 사진 section 은 overflow-hidden 이라, 그 안에 두면 음수 margin 으로 걸친
 * 서비스 패널이 잘린다. 패널을 형제로 빼되 hero 래퍼 안에 두어야
 * 패널의 /contract 링크가 홈 본문 링크로 세지지 않는다.
 */
export default function MainCarousel() {
  return (
    <div data-section="hero">
      <section className="relative h-[calc(100vh-160px)] min-h-[400px] md:min-h-[540px] w-full overflow-hidden bg-black">
        {/* Background Image — 1번 사진 고정 */}
        <div className="absolute inset-0">
          {/* 정적 import 를 쓰면 Next 가 빌드 시 blurDataURL 을 만들어준다.
              5MB 원본이 내려오기 전까지 검은 화면 대신 흐린 미리보기가 보인다. */}
          <Image
            src={heroImage}
            alt="느티나무병원 협동조합"
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover opacity-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
          {/* 패널 제목(흰 글씨)이 사진 하단에 얹히므로 아래쪽을 한 번 더 어둡게 깐다 */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-10" />
        </div>

        {/* 하단 패딩은 서비스 패널이 사진에 걸치는 높이만큼 확보한다 */}
        <Container className="relative z-20 h-full flex flex-col justify-center pt-20 md:pt-24 pb-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-5 md:mb-8 border border-white/10">
              <TreePine className="text-green-400 w-4 h-4" />
              <span className="text-green-50 text-xs md:text-sm font-bold tracking-wide">산림청 지정 1종 나무병원</span>
            </div>

            <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-8 leading-[1.2] tracking-tighter">
              나무를 살리는 기술,<br />
              도시를 가꾸는 사람들
            </h1>

            <p className="text-gray-200 text-base md:text-lg lg:text-2xl opacity-90 leading-relaxed font-medium max-w-2xl">
              나무의사의 진단·치료부터 조경수·계절꽃 식재와 화단 조성까지{' '}<br className="hidden md:block" />
              공공기관과 아파트의 녹지 공간을 가꾸고 관리합니다.
            </p>
          </motion.div>
        </Container>
      </section>

      <ServicePanel />
    </div>
  )
}
