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
    <section className="bg-white py-24 border-b border-gray-100">
      <Container className="text-center">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug tracking-tight max-w-4xl mx-auto"
        >
          &quot;느티나무병원은 최고의 기술력과 전문성으로 <br className="hidden md:block" />
          <span className="text-green-600 relative inline-block">
            사람과 나무에 모두 안전한 공간
            <span className="absolute bottom-1 left-0 w-full h-3 bg-green-100/50 -z-10"></span>
          </span>
          을 만들어갑니다.&quot;
        </motion.h3>
      </Container>
    </section>
  )
}

export function LandscapingSection() {
  return (
    <section className="py-32 bg-gray-50 overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="mb-8">
              <span className="text-green-600 font-bold uppercase tracking-widest text-sm bg-green-100/50 px-3 py-1 rounded-md">Expertise</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-6 mb-8 leading-tight tracking-tighter">
                도시의 회복탄력성을 키우는<br/>
                조경/정원 사업
              </h2>
              <h4 className="text-xl text-gray-500 font-medium mb-6 italic">환경 조건에 맞는 수목과 지속가능한 식재 공간 제안</h4>
              <p className="text-lg text-gray-600 leading-relaxed mb-10 font-medium opacity-80">
                단순히 나무를 심는 것을 넘어, 공간의 특성과 수목의 생리적 특성을 과학적으로 분석합니다. 
                대형목 이식부터 도시재생구역의 녹지 개선까지, 전문가의 손길로 아름답고 건강한 공동체의 쉼터를 조성합니다.
              </p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {[
                '조경/정원 계획 및 설계',
                '수목 식재 및 시설물 시공',
                '체계적인 수목 유지관리',
                '도시재생 환경개선'
              ].map((item, idx) => (
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={idx} 
                  className="flex items-center text-base text-gray-800 font-bold"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <Link 
              href="/business"
              className="group inline-flex items-center bg-green-700 text-white px-10 py-4 font-bold rounded-full hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-green-900/10 active:scale-95"
            >
              사업분야 자세히 보기
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl z-10 border-8 border-white">
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
              className="absolute -bottom-10 -left-10 bg-white p-8 shadow-2xl z-20 hidden md:block max-w-[280px] rounded-2xl border border-gray-50"
            >
              <p className="font-black text-green-700 mb-2 text-xl tracking-tighter italic">Professional Touch</p>
              <p className="text-sm text-gray-500 leading-relaxed font-bold">전문가의 정밀한 분석으로 완성되는<br/>지속가능한 가치의 공간</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export function TreeHospitalSection() {
  const services = [
    { title: "수목 정밀 진단/처방", icon: ClipboardCheck, desc: "첨단 진단 장비를 활용한 과학적인 원인 분석 및 최적의 처방전 발급", color: "text-green-600" },
    { title: "보호수/노거수 관리", icon: Search, desc: "역사적 가치가 높은 주요 수목에 대한 정밀 안전 진단 및 정기 점검", color: "text-green-600" },
    { title: "친환경 병해충 방제", icon: Bug, desc: "생태계 영향을 최소화하는 친환경 약제와 물리적 방제법의 체계적 운영", color: "text-green-600" },
    { title: "수목 외과수술", icon: Stethoscope, desc: "부패부 제거 및 살균 처리를 통한 상처 치유와 수명 연장 전문 시공", color: "text-green-600" },
    { title: "생육환경 집중 개선", icon: Sprout, desc: "토양 개량 및 통기성 확보를 통해 뿌리 활력을 근본적으로 회복", color: "text-green-600" },
    { title: "수간주사/영양공급", icon: Syringe, desc: "기력 저하 수목에 대한 신속한 영양 공급 및 고기능성 약제 주입", color: "text-green-600" },
  ]

  return (
    <section className="py-32 bg-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-gray-100 pb-12">
          <div className="max-w-2xl">
            <span className="text-green-600 font-bold uppercase tracking-[0.2em] text-xs">Medical Service</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 tracking-tighter">
              1종 나무병원의 전문 진료
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              나무의 생리를 이해하는 전문가들이 건강한 생명 순환을 책임집니다. <br className="hidden md:block" />
              전문 진단 장비를 통한 과학적 근거 기반의 진료 서비스를 제공합니다.
            </p>
          </div>
          <div>
            <Link 
              href="/request"
              className="inline-flex items-center text-green-700 font-black text-lg group hover:underline underline-offset-8 transition-all"
            >
              진단 및 치료 문의하기
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {services.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-300 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.title}</h3>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed mb-6 pl-1 border-l-2 border-transparent group-hover:border-green-200 transition-colors">
                {item.desc}
              </p>
              <Link 
                href="/request" 
                className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-green-600 transition-colors flex items-center"
              >
                Learn More <ArrowRight className="w-3 h-3 ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
