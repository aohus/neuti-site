'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Landmark, CheckCircle2 } from 'lucide-react'
import Container from '../common/Container'

const targets = [
  {
    id: 'apartment',
    title: '아파트 · 기업',
    subtitle: '입주민 만족도와 단지의 가치를 높이는 프리미엄 관리',
    icon: Building2,
    image: '/images/home/carousel_1.jpg',
    features: ['연간 수목 관리 계획 수립', '병해충 정밀 방제 및 전정', '단지 맞춤형 관리 제안서'],
    btnText: '견적 문의하기',
    link: '/performance?type=apartment',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-100'
  },
  {
    id: 'public',
    title: '공공기관 · 공원',
    subtitle: '전문 진단과 풍부한 실적으로 증명하는 신뢰의 조경 관리',
    icon: Landmark,
    image: '/images/home/carousel_2.jpg',
    features: ['나라장터 · 수의계약 전문', '위험목 긴급 대응 시스템', '수목 진단 및 예찰 보고서'],
    btnText: '공공 실적 확인',
    link: '/performance?type=public',
    color: 'text-green-700',
    bgColor: 'bg-green-50/50',
    borderColor: 'border-green-100'
  }
]

export default function TargetCTA() {
  return (
    <section className="py-40 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black text-green-600 tracking-[0.2em] uppercase mb-4">Targeted Solutions</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            공간에 가장 적합한<br/>솔루션을 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {targets.map((target, idx) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-[2.5rem] border ${target.borderColor} ${target.bgColor} p-8 md:p-12 hover:shadow-2xl transition-all duration-500`}
            >
              <div className="flex flex-col h-full">
                {/* Upper Section */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl bg-white shadow-sm ${target.color}`}>
                      <target.icon size={32} />
                    </div>
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                       <Image src={target.image} alt="" fill className="object-cover" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tighter">
                    {target.title}
                  </h3>
                  <p className="text-gray-600 text-lg md:text-xl font-bold leading-snug mb-10 max-w-[90%]">
                    {target.subtitle}
                  </p>

                  <div className="space-y-4 mb-12">
                    {target.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center text-gray-700 font-bold text-base md:text-lg">
                        <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 ${target.color}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button Section */}
                <Link
                  href={target.link}
                  className={`inline-flex items-center justify-between w-full bg-white text-gray-900 px-8 py-5 rounded-full font-black text-lg border-2 ${target.borderColor} hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all transform active:scale-95 shadow-sm`}
                >
                  <span>{target.btnText}</span>
                  <ArrowRight className="ml-4 w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}