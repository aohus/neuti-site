'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import {
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  TreePine,
  Leaf,
  Bug,
  AlertTriangle,
  Sprout,
  Trees,
  ArrowRight,
  ClipboardList,
  MapPin,
  FileCheck,
  Handshake,
  HardHat,
  BookCheck,
  ChevronRight,
} from 'lucide-react'
import axios from 'axios'

/* ─── Service Cards ─── */
const services = [
  { key: '조경식재', icon: Trees, label: '조경식재', filterKey: '조경식재' },
  { key: '녹지관리', icon: Leaf, label: '녹지관리', filterKey: '녹지관리' },
  { key: '소나무전정', icon: TreePine, label: '소나무 전정', filterKey: '소나무전정' },
  { key: '병충해방제', icon: Bug, label: '병충해 방제', filterKey: '병충해방제' },
  { key: '위험목제거', icon: AlertTriangle, label: '위험목 제거', filterKey: '위험목제거' },
  { key: '수목진단치료', icon: Sprout, label: '수목 진단·치료', filterKey: '수목진단' },
]

/* ─── Qualifications ─── */
const qualifications = [
  {
    title: '산림청 등록 1종 나무병원',
    desc: '수목 진단·치료·방제 공인 기관',
    icon: ShieldCheck,
  },
  {
    title: '조경업 면허',
    desc: '조경 설계·시공·유지관리',
    icon: FileText,
  },
  {
    title: '산림사업 등록',
    desc: '산림 조성·벌채·병해충 방제',
    icon: TreePine,
  },
]

/* ─── Clients ─── */
const clients = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처', src: '/images/clients/gongsuchco.jpg' },
  { name: '성남도시개발공사', src: '/images/clients/seongnam_dev.jpg' },
  { name: '성남시', src: '/images/clients/seongnam_city.png' },
  { name: '정부청사관리본부', src: '/images/clients/gov-complex.png' },
]

/* ─── Process Steps ─── */
const steps = [
  { icon: ClipboardList, label: '견적 요청', desc: '전화 또는 온라인' },
  { icon: MapPin, label: '현장 확인', desc: '필요시 방문 조사' },
  { icon: FileCheck, label: '견적서 발급', desc: '즉일~1영업일' },
  { icon: Handshake, label: '계약 체결', desc: '수의계약 진행' },
  { icon: HardHat, label: '시공', desc: '전문 인력 투입' },
  { icon: BookCheck, label: '완료 보고', desc: '실적증명서 발급' },
]

/* ─── Fade-in wrapper ─── */
function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ContractContent() {
  const [jobCounts, setJobCounts] = useState<Record<string, number>>({})
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    axios
      .get('/backend-api/performance/stats')
      .then((res) => {
        setJobCounts(res.data.job_categories || {})
        setTotalCount(res.data.total_count || 0)
      })
      .catch(() => {})
  }, [])

  function getCount(filterKey: string) {
    // job_categories keys may partially match
    let count = 0
    for (const [k, v] of Object.entries(jobCounts)) {
      if (k.includes(filterKey) || filterKey.includes(k)) count += v
    }
    return count
  }

  return (
    <div className="bg-white pb-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-green-900 pt-40 pb-20 md:pb-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)]" />
        <Container className="relative z-10 text-center">
          <FadeIn>
            <p className="text-xs font-black tracking-[0.3em] text-green-400 uppercase mb-4">
              Direct Contract
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight text-white drop-shadow-lg">
              조경·수목관리 수의계약
            </h1>
            <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed font-medium">
              견적서 즉일 발급 · 자격증빙 즉시 제공 · 실적증명 바로 확인
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:031-752-6000"
                className="inline-flex items-center gap-3 bg-white text-green-800 px-8 py-4 rounded-full font-black text-lg shadow-2xl hover:bg-green-50 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5" />
                031-752-6000
              </a>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                온라인 견적 요청
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-green-200">
              <Mail className="w-5 h-5" />
              <a href="mailto:coopneuti@naver.com" className="text-base md:text-lg font-black hover:text-white transition-colors">
                coopneuti@naver.com
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── Services ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-black tracking-[0.2em] text-green-600 uppercase mb-3">
              Services
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              수의계약 가능 서비스
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {services.map((svc, i) => {
              const count = getCount(svc.filterKey)
              return (
                <FadeIn key={svc.key} delay={i * 0.05}>
                  <Link
                    href={`/performance?job_main=${encodeURIComponent(svc.filterKey)}`}
                    className="group flex flex-col items-center text-center p-6 md:p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-green-200 hover:shadow-xl transition-all"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <svc.icon className="w-7 h-7" />
                    </div>
                    <p className="font-black text-gray-900 text-base md:text-lg mb-1">
                      {svc.label}
                    </p>
                    {count > 0 && (
                      <p className="text-sm font-bold text-green-600">
                        실적 {count}건
                      </p>
                    )}
                    <span className="mt-2 text-xs font-bold text-gray-400 group-hover:text-green-600 flex items-center gap-1 transition-colors">
                      실적 보기 <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
          {totalCount > 0 && (
            <FadeIn className="text-center mt-8">
              <p className="text-sm font-bold text-gray-400">
                전체 누적 시공실적{' '}
                <span className="text-green-700 font-black text-base">{totalCount}건</span>
              </p>
            </FadeIn>
          )}
        </Container>
      </section>

      {/* ── Qualifications ── */}
      <section className="py-20 md:py-28 bg-gray-50 rounded-[3rem] mx-4 md:mx-10">
        <Container>
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-black tracking-[0.2em] text-green-600 uppercase mb-3">
              Credentials
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              보유 자격 및 등록 현황
            </h2>
            <p className="mt-4 text-gray-500 font-bold">
              업체 선정 보고 시 아래 증빙을 즉시 제공합니다
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {qualifications.map((q, i) => (
              <FadeIn key={q.title} delay={i * 0.1}>
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
                    <q.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{q.title}</h3>
                  <p className="text-sm font-medium text-gray-400 leading-relaxed">
                    {q.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Clients ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-black tracking-[0.2em] text-green-600 uppercase mb-3">
              Track Record
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              주요 발주처
            </h2>
            <p className="mt-4 text-gray-500 font-bold">
              정부기관·공공기관과의 다수 프로젝트 수행
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 max-w-3xl mx-auto">
            {clients.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.05}>
                <Image
                  src={c.src}
                  alt={c.name}
                  width={200}
                  height={70}
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Process ── */}
      <section className="py-20 md:py-28 bg-gray-50 rounded-[3rem] mx-4 md:mx-10">
        <Container>
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-black tracking-[0.2em] text-green-600 uppercase mb-3">
              Process
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              수의계약 절차
            </h2>
          </FadeIn>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <FadeIn key={step.label} delay={i * 0.05}>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-green-600/20">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-green-600 mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-black text-gray-900 text-sm mb-1">{step.label}</p>
                  <p className="text-xs font-medium text-gray-400">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <div className="bg-green-800 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                  견적서 즉일 발급<br className="md:hidden" /> · 자격증빙 함께 제공
                </h2>
                <p className="text-green-200 font-bold mb-10 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  견적 요청 시 실적증명서·자격증빙을 함께 보내드립니다.
                  <br className="hidden md:block" />
                  업체 선정에 필요한 서류를 한 번에 해결하세요.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:031-752-6000"
                    className="inline-flex items-center gap-3 bg-white text-green-800 px-8 py-4 rounded-full font-black text-lg shadow-2xl hover:bg-green-50 transition-all active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    전화 견적: 031-752-6000
                  </a>
                  <Link
                    href="/request"
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-white/20 transition-all active:scale-95"
                  >
                    온라인 견적 요청
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  )
}
