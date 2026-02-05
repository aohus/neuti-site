'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Stethoscope, Syringe, ClipboardCheck } from 'lucide-react'
import Container from '../common/Container'

const steps = [
  {
    icon: Search,
    title: '정밀 예찰',
    description: '수목 전문가가 현장을 방문하여 나무의 상태와 병해충 발생 여부를 정밀하게 관찰합니다.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Stethoscope,
    title: '과학적 진단',
    description: '채취한 시료 분석과 전문 장비를 통해 수목 건강 상태를 과학적으로 진단하고 처방전을 발급합니다.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Syringe,
    title: '정밀 시공',
    description: '처방에 따라 저독성 약제 주입, 수간 주사, 전정 등 전문 시공팀이 정밀한 치료를 수행합니다.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: ClipboardCheck,
    title: '성과 보고',
    description: '작업 전후 비교 및 효과 분석 보고서를 통해 투명하고 체계적인 사후 관리를 보장합니다.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  }
]

export default function ProcessFlow() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">Professional Process</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            데이터와 과학으로<br/>나무의 생명을 지킵니다
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className={`${step.bgColor} ${step.color} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  <step.icon size={40} />
                </div>
                <div className="relative">
                  <div className="bg-white px-4">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                  {/* Step Number Badge */}
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-gray-100 text-6xl font-black -z-10 select-none">
                    0{idx + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
