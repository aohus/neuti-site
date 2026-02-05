'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Container from '../common/Container'

const categories = [
  { id: 'pest', label: '병해충 방제/치료' },
  { id: 'plant', label: '계절꽃/조경식재' },
  { id: 'prune', label: '수목 전정/관리' },
]

const cases = [
  {
    id: 1,
    category: 'pest',
    title: '아파트 단지 소나무 재선충 및 병해충 정밀 치료',
    description: '고사 위기의 소나무를 수간주사 및 정밀 약제 처방으로 95% 이상 회복시켰습니다.',
    before: '/images/home/carousel_1.jpg', // 실제 사례 이미지로 교체 필요
    after: '/images/home/carousel_2.jpg',
    tags: ['수간주사', '토양 개량', '회복률 95%']
  },
  {
    id: 2,
    category: 'plant',
    title: '성남시 주요 공원 계절꽃 식재 및 경관 조성',
    description: '삭막했던 도심 공원을 테마가 있는 화단으로 조성하여 시민들의 만족도를 높였습니다.',
    before: '/images/home/carousel_2.jpg',
    after: '/images/home/carousel_1.jpg',
    tags: ['테마 정원', '공공기관 협력', '도시 재생']
  },
  {
    id: 3,
    category: 'prune',
    title: '정부과천청사 대형 수목 정밀 전정',
    description: '수형을 유지하면서도 안전사고를 예방할 수 있도록 과학적인 전정 기술을 적용했습니다.',
    before: '/images/home/carousel_1.jpg',
    after: '/images/home/carousel_2.jpg',
    tags: ['수형 관리', '안전 진단', '청사 관리']
  }
]

export default function ImpactGallery() {
  const [activeTab, setActiveTab] = useState('pest')

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">Evidence of Excellence</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 mb-8">결과로 증명하는 기술력</p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === cat.id 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {cases.filter(c => c.category === activeTab).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Image Comparison */}
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-md">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">BEFORE</div>
                    <Image src={item.before} alt="Before" fill className="object-cover" />
                  </div>
                  <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500/30">
                    <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">AFTER</div>
                    <Image src={item.after} alt="After" fill className="object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-green-50 text-green-700 px-4 py-1.5 rounded-lg text-sm font-bold border border-green-100">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="flex items-center text-gray-900 font-black mb-2">
                      <CheckCircle2 className="text-green-600 mr-2 w-5 h-5" />
                      나무의사의 한마디
                    </p>
                    <p className="text-gray-500 text-sm italic font-medium leading-relaxed">
                      "단순한 미관 개선을 넘어, 수목의 생리적 특성을 고려한 과학적 접근이 최상의 결과(After)를 만듭니다."
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
