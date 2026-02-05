'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Landmark, ShieldCheck } from 'lucide-react'
import Container from '../common/Container'

const targets = [
  {
    id: 'apartment',
    title: '아파트 / 기업 / 산업단지',
    description: '체계적인 수목 관리와 정밀 방제를 통해 단지의 가치를 높이고 쾌적한 환경을 조성합니다.',
    icon: Building2,
    image: '/images/home/target_apt.jpg',
    features: ['연간 수목 관리 대행', '대형 수목 전정/벌목', '병해충 정밀 방제'],
    btnText: '관리 제안서 보기',
    link: '/performance?type=apartment',
    color: 'bg-blue-600',
  },
  {
    id: 'public',
    title: '공공기관 / 교육시설 / 공원',
    description: '나무의사의 전문 진단과 풍부한 공공 시공 실적을 바탕으로 신뢰할 수 있는 최상의 솔루션을 제공합니다.',
    icon: Landmark,
    image: '/images/home/target_public.jpg',
    features: ['공공 조경 관리', '수목 진단 및 예찰', '하자 관리 및 기술 자문'],
    btnText: '공공 실적 확인',
    link: '/performance?type=public',
    color: 'bg-green-700',
  }
]

export default function TargetCTA() {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">Targeted Solutions</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            맞춤형 관리로<br/>나무와 사람을 잇습니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {targets.map((target, idx) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <div className={`absolute inset-0 ${target.color} opacity-20 z-10`} />
                <Image
                  src={target.image}
                  alt={target.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 z-20">
                   <div className={`${target.color} p-3 rounded-2xl text-white shadow-lg`}>
                     <target.icon size={28} />
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{target.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{target.description}</p>
                
                <ul className="space-y-3 mb-10">
                  {target.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-gray-700 font-medium">
                      <ShieldCheck className="text-green-500 w-5 h-5 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={target.link}
                  className={`inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-full font-black text-white transition-all active:scale-95 ${target.color} hover:brightness-110 shadow-lg`}
                >
                  {target.btnText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
