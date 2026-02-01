'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'
import { PenTool, Trees, Truck, Home } from 'lucide-react'
import RelatedPerformances from './RelatedPerformances'

const features = [
  {
    title: "조경 설계·시공",
    desc: "환경 조건에 맞는 수목 식재 및 디자인",
    icon: <PenTool className="w-6 h-6" />
  },
  {
    title: "유지관리",
    desc: "사계절 건강한 녹지 유지 서비스",
    icon: <Trees className="w-6 h-6" />
  },
  {
    title: "대형목 이식",
    desc: "특수 장비를 통한 고난도 이식 수행",
    icon: <Truck className="w-6 h-6" />
  },
  {
    title: "도시재생 녹지 개선",
    desc: "마을정원 프로젝트 등 공공 사업 참여",
    icon: <Home className="w-6 h-6" />
  }
]

export default function LandscapingSection() {
  return (
    <section className="py-40 bg-white" id="landscaping">
      <Container>
        <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-label-accent">Section 02</span>
              <h4 className="text-3xl md:text-5xl font-black text-deep tracking-tight leading-tight mb-8">
                조경식재 사업 <br />
                <span className="text-primary text-xl md:text-2xl">사람과 자연이 숨 쉬는 공간 창조</span>
              </h4>
              <p className="text-lg text-gray-500 font-bold leading-relaxed">
                단순한 식재를 넘어, 공간의 가치를 높이는 조경 솔루션을 제공합니다. <br className="hidden md:block" />
                지속 가능한 녹지 인프라 구축을 통해 <br className="hidden md:block" />
                모두가 행복한 자연 친화적 환경을 만들어갑니다.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface border border-black/5 p-8 rounded-[2.5rem] hover:shadow-xl hover:border-accent/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-deep group-hover:bg-accent text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                    {feature.icon}
                  </div>
                  <h5 className="text-lg font-black text-deep mb-2">{feature.title}</h5>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[12px] border-gray-50 shadow-2xl"
          >
            <img 
              src="/images/hero-bg.jpg" // Placeholder
              alt="Landscaping Service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="text-sm font-black text-white uppercase tracking-widest mb-4 italic">Sustainable Greenery</p>
              <p className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                "푸른 마을, 건강한 도시. <br /> 우리가 꿈꾸는 내일의 모습입니다."
              </p>
            </div>
          </motion.div>
        </div>

        <RelatedPerformances 
          category="조경식재" 
          title="조경식재 시공 사례" 
          theme="light" 
        />
      </Container>
    </section>
  )
}
