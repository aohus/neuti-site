'use client'

import React from 'react'
import Container from './Container'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ClipboardCheck,
  Search,
  Bug,
  Sprout,
  Stethoscope,
  Syringe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Subtle Accent Background Element */}
      <div className="from-accent/50 absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b to-transparent" />

      <Container className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <span className="text-label-accent">Our Core Values</span>
          <h3 className="text-xl leading-relaxed font-bold tracking-tight text-gray-500 md:text-2xl">
            느티나무병원 협동조합은 최고의 기술력과 전문성으로{' '}
            <br className="hidden md:block" />
            <span className="text-deep relative mx-1 inline-block font-black">
              사람과 나무에 모두 안전한 공간
              <span className="bg-accent/30 absolute bottom-1 left-0 -z-10 h-2 w-full"></span>
            </span>
            을 만들어갑니다.
          </h3>
        </motion.div>
      </Container>
    </section>
  )
}

export function LandscapingSection() {
  return (
    <section className="section-py bg-surface overflow-hidden">
      <Container>
        <div className="flex flex-col items-center gap-16 md:gap-24 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="mb-8">
              <span className="text-accent bg-accent/10 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                Expertise
              </span>
              <h2 className="text-deep mt-6 mb-6 text-3xl leading-tight font-black tracking-tighter md:text-4xl">
                도시의 회복탄력성을 키우는
                <br />
                조경/정원 사업
              </h2>
              <h4 className="mb-6 text-lg font-bold text-gray-400 italic opacity-80">
                환경 조건에 맞는 수목과 지속가능한 식재 공간 제안
              </h4>
              <p className="mb-10 text-base leading-relaxed font-bold text-gray-500 opacity-70 md:text-lg">
                단순히 나무를 심는 것을 넘어, 공간의 특성과 수목의 생리적 특성을
                과학적으로 분석합니다. 대형목 이식부터 도시재생구역의 녹지
                개선까지, 전문가의 손길로 아름답고 건강한 공동체의 쉼터를
                조성합니다.
              </p>
            </div>

            <ul className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                '조경/정원 계획 및 설계',
                '수목 식재 및 시설물 시공',
                '체계적인 수목 유지관리',
                '도시재생 환경개선'
              ].map((item, idx) => (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  key={idx}
                  className="text-deep flex items-center text-[14px] font-bold"
                >
                  <CheckCircle2 className="text-accent mr-3 h-4 w-4 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <Link
              href="/business"
              className="group bg-deep shadow-deep/10 inline-flex items-center rounded-full px-8 py-4 font-black text-white shadow-xl transition-all duration-300 hover:bg-black active:scale-95"
            >
              사업분야 자세히 보기
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative lg:w-1/2"
          >
            <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
              <Image
                src="/images/home/landscaping.jpg"
                alt="Landscaping Service"
                fill
                className="object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 z-20 hidden max-w-[240px] rounded-2xl border border-black/5 bg-white p-6 shadow-2xl md:block"
            >
              <p className="text-accent mb-1 text-lg font-black tracking-tighter italic">
                Professional Touch
              </p>
              <p className="text-[12px] leading-relaxed font-bold text-gray-400">
                전문가의 정밀한 분석으로 완성되는 지속가능한 가치의 공간
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export function TreeHospitalSection() {
  const services = [
    {
      title: '수목 정밀 진단/처방',
      icon: ClipboardCheck,
      desc: '첨단 진단 장비를 활용한 과학적인 원인 분석 및 최적의 처방전 발급'
    },
    {
      title: '보호수/노거수 관리',
      icon: Search,
      desc: '역사적 가치가 높은 주요 수목에 대한 정밀 안전 진단 및 정기 점검'
    },
    {
      title: '친환경 병해충 방제',
      icon: Bug,
      desc: '생태계 영향을 최소화하는 친환경 약제와 물리적 방제법의 체계적 운영'
    },
    {
      title: '수목 외과수술',
      icon: Stethoscope,
      desc: '부패부 제거 및 살균 처리를 통한 상처 치유와 수명 연장 전문 시공'
    },
    {
      title: '생육환경 집중 개선',
      icon: Sprout,
      desc: '토양 개량 및 통기성 확보를 통해 뿌리 활력을 근본적으로 회복'
    },
    {
      title: '수간주사/영양공급',
      icon: Syringe,
      desc: '기력 저하 수목에 대한 신속한 영양 공급 및 고기능성 약제 주입'
    }
  ]

  return (
    <section className="section-py bg-white">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-black/5 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-label">Medical Service</span>
            <h2 className="text-deep mt-4 mb-6 text-3xl font-black tracking-tighter md:text-4xl">
              1종 나무병원의 전문 진료
            </h2>
            <p className="text-lg leading-relaxed font-bold text-gray-400">
              나무의 생리를 이해하는 전문가들이 건강한 생명 순환을 책임집니다.{' '}
              <br className="hidden md:block" />
              전문 진단 장비를 통한 과학적 근거 기반의 진료 서비스를 제공합니다.
            </p>
          </div>
          <div>
            <Link
              href="/request"
              className="text-primary group inline-flex items-center text-lg font-black underline-offset-8 transition-all hover:underline"
            >
              진단 및 치료 문의하기
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {services.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group bg-surface/30 hover:border-accent/20 rounded-[2.5rem] border border-gray-100 p-8 transition-all duration-500 hover:bg-white hover:shadow-xl md:p-10"
            >
              <div className="mb-6 flex items-center gap-5">
                <div className="group-hover:bg-accent group-hover:border-accent text-primary flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-deep text-xl font-black tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="text-[16px] leading-relaxed font-medium text-gray-500 transition-colors group-hover:text-gray-600 md:text-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
