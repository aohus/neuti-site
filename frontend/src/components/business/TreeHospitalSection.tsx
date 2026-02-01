'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'
import { ShieldCheck, Search, Activity, AlertTriangle } from 'lucide-react'
import RelatedPerformances from './RelatedPerformances'

const features = [
  {
    title: "수목 진단·처방",
    desc: "병해충, 생육 이상 등 원인 분석",
    icon: <Search className="w-6 h-6" />
  },
  {
    title: "수목 치료·방제",
    desc: "예방·치료를 위한 약제 처리 및 관리",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "생육환경 개선",
    desc: "토양 개량, 통풍 및 관수 시스템 개선",
    icon: <Activity className="w-6 h-6" />
  },
  {
    title: "위험수목 진단",
    desc: "구조적 위험성을 과학적으로 분석",
    icon: <AlertTriangle className="w-6 h-6" />
  }
]

export default function TreeHospitalSection() {
  return (
    <section className="py-24 md:py-32 bg-white" id="tree-hospital">
      <Container>
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-label-accent">Section 01</span>
              <h4 className="text-3xl md:text-5xl font-black text-deep tracking-tight leading-tight mb-8">
                나무병원 사업 <br />
                <span className="text-primary text-xl md:text-2xl">정확한 진단과 과학적 치료</span>
              </h4>
              <p className="text-lg text-gray-500 font-bold leading-relaxed">
                느티나무병원은 산림청 등록 1종 나무병원으로서, <br className="hidden md:block" />
                수목 진료 전문가들이 아픈 나무의 원인을 과학적으로 분석하고 <br className="hidden md:block" />
                최적의 처방과 정밀한 치료를 제공합니다.
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
                  <div className="w-12 h-12 rounded-2xl bg-deep group-hover:bg-accent text-white flex items-center justify-center mb-6 transition-colors">
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
            className="lg:w-1/2 relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[12px] border-surface shadow-2xl"
          >
            <img 
              src="/images/home/carousel_2.jpg" 
              alt="Tree Hospital Service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-4 italic opacity-80">Professional Diagnosis</p>
              <p className="text-2xl font-black leading-tight drop-shadow-lg">
                "나무는 우리 삶의 동반자입니다. <br /> 전문가의 손길로 생명을 지킵니다."
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
