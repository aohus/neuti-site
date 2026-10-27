'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import Container from '@/components/common/Container'
import {
  DIAGNOSIS_REQUEST_HREF,
  PINE_WILT_PHONE,
  pineWiltCta as content
} from '@/data/pine-wilt-content'
import Reveal from './Reveal'

/**
 * 페이지 전용 CTA. 공용 FinalCTA 는 견적 상담(/request)으로 보내지만
 * 이 페이지는 진단 의뢰 탭으로 바로 보내고 전화 버튼을 나란히 둔다.
 */
export default function PineWiltCTA() {
  return (
    <section
      data-section="pw-cta"
      className="section-py-lg bg-green-700 text-center"
    >
      <Container>
        <Reveal className="flex flex-col items-center gap-6 md:gap-7">
          <h2 className="text-[28px] leading-[1.3] font-black tracking-[-0.04em] text-white md:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="text-base leading-[1.7] font-medium text-green-100 md:text-lg">
            {content.body}
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href={DIAGNOSIS_REQUEST_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-base font-black text-green-700 shadow-xl transition-all hover:bg-green-50 active:scale-95 md:py-[18px] md:text-[17px]"
            >
              {content.primaryLabel}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${PINE_WILT_PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 px-8 py-[14px] text-base font-black text-white transition-colors hover:bg-white/10 md:py-4 md:text-[17px]"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              {PINE_WILT_PHONE}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
