'use client'

import React from 'react'
import Container from '@/components/common/Container'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Search, Activity, AlertTriangle, TreePine, ArrowRight } from 'lucide-react'
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
    <section className="bg-white py-12 sm:py-16 md:py-32" id="tree-hospital">
      <Container>
        <div className="flex flex-col items-center gap-20 lg:flex-row">
          {/* Text Content */}
          <div className="space-y-12 lg:w-1/2">
            <motion.div
              data-reveal
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
                  data-reveal
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

            {/* 방제기(9월-3월)에 검색으로 들어온 방문자를 재선충 현장진단 페이지로 보낸다 */}
            <motion.div
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/pine-wilt"
                className="group flex items-center gap-4 rounded-3xl bg-deep px-5 py-5 transition-shadow hover:shadow-xl md:gap-5 md:px-7 md:py-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-deep md:h-[52px] md:w-[52px]">
                  <TreePine className="h-6 w-6 md:h-[26px] md:w-[26px]" aria-hidden />
                </span>
                <span className="flex min-w-0 grow flex-col gap-1">
                  <span className="text-xs font-black tracking-[0.08em] text-amber-400">
                    방제기 9월-3월 집중 운영
                  </span>
                  <span className="text-[17px] font-black text-white md:text-[19px]">
                    소나무재선충병 현장진단
                  </span>
                  <span className="text-[13px] font-bold text-green-100 md:text-sm">
                    나무의사 현장 1차 진단 · 관할 기관 신고 연계 · 예방나무주사
                  </span>
                </span>
                <ArrowRight
                  className="h-6 w-6 shrink-0 text-green-200 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>

          {/* Visual Content — asymmetric 3-photo grid */}
          <motion.div
            data-reveal
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-12 grid-rows-[auto_auto] gap-3"
          >
            <div className="col-span-6 row-span-1 relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/business/tree-hospital-1.jpg"
                alt="나무병원 진단 현장"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-6 row-span-1 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl mt-8 md:mt-16">
              <Image
                src="/images/business/park-pest-control-2025.jpg"
                alt="2025년 수정·중원구 공원 산림·돌발해충 방제 현장"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-11 col-start-2 row-span-1 relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl -mt-6">
              <Image
                src="/images/business/tree-hospital-3.jpg"
                alt="나무병원 시공 현장"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-10 md:mt-20">
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
