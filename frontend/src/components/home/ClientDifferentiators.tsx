'use client'

import Image from 'next/image'
import { Shield, Stethoscope, Building2 } from 'lucide-react'
import Container from '../common/Container'

const clients = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처', src: '/images/clients/gongsuchco.jpg' },
  { name: '성남도시개발공사', src: '/images/clients/seongnam_dev.jpg' },
  { name: '성남시', src: '/images/clients/seongnam_city.png' },
  { name: '정부청사관리본부', src: '/images/clients/gov-complex.png' },
]

const differentiators = [
  {
    icon: Shield,
    title: '1종 나무병원 (국가 인증)',
    description: '산림청 지정 정식 수목 진단 전문 기관',
  },
  {
    icon: Stethoscope,
    title: '나무의사 상주 진단',
    description: '전문 나무의사가 현장에서 직접 진단합니다',
  },
  {
    icon: Building2,
    title: '공공기관 다수 수주 실적',
    description: '정부청사, 경기도청 등 주요 기관 협력',
  },
]

export default function ClientDifferentiators() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-4">Trusted Partners</h2>
          <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">공공기관이 선택한 전문성</p>
        </div>

        {/* Client Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-14 md:mb-16">
          {clients.map((client) => (
            <div key={client.name} className="flex-shrink-0">
              <Image
                src={client.src}
                alt={client.name}
                width={160}
                height={60}
                className="h-8 md:h-12 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {differentiators.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-100 text-green-700 mb-5">
                <item.icon size={26} />
              </div>
              <h3 className="text-base md:text-lg font-black text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-500 font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
