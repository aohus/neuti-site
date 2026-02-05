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
    icon: <Search className="h-6 w-6" />
  },
  {
    title: '수목 치료·방제',
    desc: '예방·치료를 위한 약제 처리 및 관리',
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: '생육환경 개선',
    desc: '토양 개량, 통풍 및 관수 시스템 개선',
    icon: <Activity className="h-6 w-6" />
  },
  {
    title: '위험수목 진단',
    desc: '구조적 위험성을 과학적으로 분석',
    icon: <AlertTriangle className="h-6 w-6" />
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

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface hover:border-accent/20 group rounded-[2.5rem] border border-black/5 p-8 transition-all hover:shadow-xl"
                >
                  <div className="bg-deep group-hover:bg-accent mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h5 className="text-deep mb-2 text-lg font-black">
                    {feature.title}
                  </h5>
                  <p className="text-sm leading-relaxed font-bold text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border-surface relative aspect-[4/5] overflow-hidden rounded-[3.5rem] border-[12px] shadow-2xl lg:w-1/2"
          >
            <img
              src="/images/home/carousel_2.jpg"
              alt="Tree Hospital Service"
              className="h-full w-full object-cover"
            />
            <div className="from-deep/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
            <div className="absolute right-12 bottom-12 left-12 text-white">
              <p className="mb-4 text-xs font-black tracking-widest uppercase italic opacity-80">
                Professional Diagnosis
              </p>
              <p className="text-2xl leading-tight font-black drop-shadow-lg">
                "나무는 우리 삶의 동반자입니다. <br /> 전문가의 손길로 생명을
                지킵니다."
              </p>
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
