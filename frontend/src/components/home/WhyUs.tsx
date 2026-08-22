'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Stethoscope, Flower2, Repeat, Sprout } from 'lucide-react'
import Container from '../common/Container'

/**
 * 우리가 일하는 방식.
 *
 * 두 가지를 지킨다.
 * 1. 발주 절차(수의계약·증빙·서류) 이야기를 두지 않는다. 그건 담당자가
 *    `/contract` 에서 찾는 정보고, 홈에 깔면 계약 영업만 하는 회사처럼 읽힌다.
 * 2. 수목 진료로만 좁히지 않는다. 실적상 계절꽃 식재·화단 조성이 녹지관리
 *    다음으로 많은 공종이라(`contract-projects.ts`), 나무 이야기만 하면
 *    사업 범위가 실제보다 좁게 읽힌다.
 */
export const strengths = [
  {
    icon: Stethoscope,
    title: '나무의사가 직접 진단합니다',
    desc: '산림청 등록 1종 나무병원입니다. 진단과 처방, 시공까지 한 팀이 맡기 때문에 현장에서 판단이 어긋나지 않습니다.',
  },
  {
    icon: Flower2,
    title: '수목부터 화단까지 한 곳에서',
    desc: '조경수·관목 식재와 계절꽃 화단 조성, 잔디·녹지 유지관리, 병해충 방제까지 다룹니다. 공종별로 업체를 나눠 맡기지 않아도 됩니다.',
  },
  {
    icon: Repeat,
    title: '같은 곳에서 다시 찾아주십니다',
    desc: '대상지를 돌며 상태를 살핀 뒤 필요한 작업만 제안합니다. 한 해로 끝나지 않고 여러 해 이어서 맡겨주신 기관이 적지 않습니다.',
  },
  {
    icon: Sprout,
    title: '성남에 뿌리내린 여성기업 협동조합',
    desc: '성남을 중심으로 수도권 현장에 직접 나갑니다. 심고 끝내는 대신 활착과 이후 생육까지 살피고 기록으로 남깁니다.',
  },
] as const

export default function WhyUs() {
  return (
    <section data-section="why-us" className="bg-gray-50/60 py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            Our Way
          </p>
          <h2 className="text-[2rem] font-black tracking-tighter text-gray-900 md:text-[2.75rem]">
            우리가 일하는 방식
          </h2>
          <p className="mt-4 leading-relaxed font-bold text-gray-500">
            나무 한 그루부터 계절 화단 하나까지,
            <br className="hidden md:block" />
            심는 일보다 살리는 일을 먼저 생각합니다.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {strengths.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="rounded-3xl border-2 border-gray-100 bg-white p-7 transition-all hover:border-green-200 hover:shadow-xl md:p-9"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-black text-gray-900 md:text-xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed font-medium text-gray-500 md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="group inline-flex items-center text-sm font-black text-green-700 transition-colors hover:text-green-900 md:text-base"
          >
            느티나무병원 이야기
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
