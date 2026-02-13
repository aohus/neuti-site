'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'
import { ShieldCheck, Search, Activity, AlertTriangle } from 'lucide-react'
import RelatedPerformances from './RelatedPerformances'

const features = [
  {
    title: '수목 진단·처방',
    desc: '병해충, 생육 이상 등 원인 분석',
    icon: <Search className="h-5 w-5" />
  },
  {
    title: '수목 치료·방제',
    desc: '예방·치료를 위한 약제 처리 및 관리',
    icon: <ShieldCheck className="h-5 w-5" />
  },
  {
    title: '생육환경 개선',
    desc: '토양 개량, 통풍 및 관수 시스템 개선',
    icon: <Activity className="h-5 w-5" />
  },
  {
    title: '위험수목 진단',
    desc: '구조적 위험성을 과학적으로 분석',
    icon: <AlertTriangle className="h-5 w-5" />
  }
]

export default function TreeHospitalSection() {
  return (
    <section className="bg-white py-24 md:py-32" id="tree-hospital">
      <Container>
        <div className="flex flex-col items-center gap-20 lg:flex-row">
          {/* Text Content */}
          <div className="space-y-12 lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-label-accent">Section 01</span>
              <h4 className="text-deep mb-8 text-3xl leading-tight font-black tracking-tight md:text-5xl">
                나무병원 사업 <br />
                <span className="text-primary text-xl md:text-2xl">
                  정확한 진단과 과학적 치료
                </span>
              </h4>
              <p className="text-lg leading-relaxed font-bold text-gray-500">
                느티나무병원 협동조합은 산림청 등록 1종 나무병원으로서,{' '}
                <br className="hidden md:block" />
                수목 진료 전문가들이 아픈 나무의 원인을 과학적으로 분석하고{' '}
                <br className="hidden md:block" />
                최적의 처방과 정밀한 치료를 제공합니다.
              </p>
            </motion.div>

            <div className="space-y-0 divide-y divide-gray-100">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
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
            <div className="col-span-6 row-span-1 relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/business/tree-hospital-1.jpg"
                alt="나무병원 진단 현장"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-6 row-span-1 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl mt-16">
              <img
                src="/images/business/tree-hospital-2.jpg"
                alt="나무병원 치료 현장"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-11 col-start-2 row-span-1 relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl -mt-6">
              <img
                src="/images/business/tree-hospital-3.jpg"
                alt="나무병원 시공 현장"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-20">
          <RelatedPerformances
            category="나무병원"
            title="나무병원 시공 사례"
            theme="light"
          />
        </div>
      </Container>
    </section>
  )
}
