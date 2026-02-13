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
    icon: <PenTool className="w-5 h-5" />
  },
  {
    title: "유지관리",
    desc: "사계절 건강한 녹지 유지 서비스",
    icon: <Trees className="w-5 h-5" />
  },
  {
    title: "대형목 이식",
    desc: "특수 장비를 통한 고난도 이식 수행",
    icon: <Truck className="w-5 h-5" />
  },
  {
    title: "도시재생 녹지 개선",
    desc: "마을정원 프로젝트 등 공공 사업 참여",
    icon: <Home className="w-5 h-5" />
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

            <div className="space-y-0 divide-y divide-gray-100">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-4 py-5 group"
                >
                  <div className="text-primary mt-1 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="text-deep text-lg font-black group-hover:text-primary transition-colors">
                      {feature.title}
                    </h5>
                    <p className="text-[15px] text-gray-400 font-bold mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Content — asymmetric 3-photo grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-12 grid-rows-[auto_auto] gap-3"
          >
            <div className="col-span-5 row-span-1 relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl mt-12">
              <img
                src="/images/business/landscaping-1.jpg"
                alt="조경식재 시공 현장"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-7 row-span-1 relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/business/landscaping-2.jpg"
                alt="조경식재 완성 모습"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-8 row-span-1 relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl -mt-6">
              <img
                src="/images/business/landscaping-3.jpg"
                alt="조경식재 시공 현장"
                className="w-full h-full object-cover"
              />
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
