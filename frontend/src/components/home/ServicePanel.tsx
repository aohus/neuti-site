'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileCheck, MessageSquare } from 'lucide-react'
import Container from '../common/Container'
import {
  featuredServices,
  quickLinks,
  type FeaturedTone,
  type QuickLink,
} from '@/data/home-featured'

const TONE_STYLES: Record<FeaturedTone, { card: string; chip: string; accent: string }> = {
  amber: {
    card: 'bg-amber-50 hover:bg-amber-100/70',
    chip: 'bg-amber-400 text-deep',
    accent: 'text-amber-800',
  },
  green: {
    card: 'bg-green-50 hover:bg-green-100/70',
    chip: 'bg-primary text-white',
    accent: 'text-green-700',
  },
}

const QUICK_LINK_ICONS: Record<QuickLink['icon'], React.ReactNode> = {
  contract: <FileCheck className="h-5 w-5 shrink-0" aria-hidden />,
  inquiry: <MessageSquare className="h-5 w-5 shrink-0" aria-hidden />,
}

/**
 * 메인 사진 하단에 걸치는 "지금 많이 찾는 서비스" 패널.
 *
 * 홈 섹션 순서 테스트 때문에 data-section 을 따로 두지 않고, MainCarousel 의
 * hero 래퍼 안에서 렌더링된다. 그래서 /contract 링크가 본문 링크로 세지지 않는다.
 */
export default function ServicePanel() {
  return (
    <nav aria-label="지금 많이 찾는 서비스" className="relative z-30 -mt-16 md:-mt-[100px]">
      <Container className="flex flex-col gap-2 md:gap-3">
        <h2 className="ml-1 text-[13px] font-black tracking-[0.04em] text-white md:text-[15px]">
          지금 많이 찾는 서비스
        </h2>

        <div className="grid gap-2 rounded-[22px] bg-white p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.16)] md:grid-cols-2 md:gap-3 md:rounded-[28px] md:p-3 md:shadow-[0_24px_56px_rgba(0,0,0,0.18)] lg:grid-cols-[1.35fr_1.35fr_1fr]">
          {featuredServices.map((service) => {
            const tone = TONE_STYLES[service.tone]
            return (
              <Link
                key={service.href}
                href={service.href}
                className={`group flex items-center gap-3 rounded-2xl p-2 transition-colors md:gap-[18px] md:rounded-[20px] md:p-3 ${tone.card}`}
              >
                <span className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl lg:h-28 lg:w-28 lg:rounded-2xl">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 112px, 68px"
                    className="object-cover"
                  />
                </span>
                <span className="flex min-w-0 grow flex-col gap-[3px] md:gap-1.5">
                  <span
                    className={`hidden self-start rounded-full px-2.5 py-0.5 text-[11px] font-black md:inline-block ${tone.chip}`}
                  >
                    {service.chip}
                  </span>
                  <span className="text-base font-black tracking-[-0.03em] break-keep text-deep lg:text-xl">
                    {service.title}
                  </span>
                  <span className={`text-xs font-bold break-keep md:text-sm ${tone.accent}`}>
                    <span className="md:hidden">{service.mobileDesc}</span>
                    <span className="hidden md:inline">{service.desc}</span>
                  </span>
                </span>
                <ArrowRight
                  className={`mr-1.5 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 md:mr-2 lg:h-[22px] lg:w-[22px] ${tone.accent}`}
                  aria-hidden
                />
              </Link>
            )
          })}

          <div className="grid grid-cols-2 gap-2 md:col-span-2 lg:col-span-1 lg:grid-cols-1">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex min-h-12 items-center justify-center gap-3.5 rounded-[14px] bg-gray-50 px-2 text-deep transition-colors hover:bg-gray-100 md:min-h-14 md:justify-start md:rounded-[18px] md:px-[18px]"
              >
                <span className="hidden md:inline-flex">{QUICK_LINK_ICONS[link.icon]}</span>
                <span className="text-[13px] font-black md:grow md:text-base">
                  <span className="md:hidden">
                    {link.shortLabel} <span aria-hidden>→</span>
                  </span>
                  <span className="hidden md:inline">{link.label}</span>
                </span>
                <span
                  className="hidden font-black text-gray-500 transition-transform group-hover:translate-x-1 md:inline"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </nav>
  )
}
