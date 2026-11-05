'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/common/Container'
import { pineWiltWhyNow as content } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

function KpiGrid() {
  return (
    <dl className="grid h-full gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-1 lg:grid-rows-3">
      {content.kpis.map((kpi, idx) => (
        <Reveal
          key={kpi.label}
          delay={idx * 0.06}
          className={`flex flex-row-reverse items-center justify-end gap-3 rounded-2xl border px-4 py-3.5 sm:flex-col-reverse sm:items-start sm:justify-start sm:gap-1 md:px-5 md:py-4 lg:justify-center ${
            kpi.isHighlighted
              ? 'border-amber-400/40 bg-amber-400/12'
              : 'border-white/12 bg-white/6'
          }`}
        >
          <dt
            className={`text-[13px] leading-snug font-bold break-keep md:text-sm ${
              kpi.isHighlighted ? 'text-amber-100' : 'text-emerald-100'
            }`}
          >
            {kpi.label}
          </dt>
          <dd
            className={`shrink-0 text-[22px] font-black tracking-[-0.03em] tabular-nums lg:text-[30px] ${
              kpi.isHighlighted ? 'text-amber-200' : 'text-white'
            }`}
          >
            {kpi.value}
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}

function QuarantineMap() {
  const { map } = content
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#f2f1ed]">
      {/* 지도 글씨가 작아 모바일에서는 원본을 따로 열어 확대해 볼 수 있게 한다. */}
      <a
        href={map.src}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center"
      >
        <Image
          src={map.src}
          alt={map.alt}
          width={map.width}
          height={map.height}
          sizes="(min-width: 1024px) 280px, 320px"
          className="h-auto w-full"
        />
      </a>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 text-xs font-bold text-gray-600">
        <span>{map.caption}</span>
        <a
          href={map.src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-black hover:text-green-900"
        >
          지도 크게 보기 ↗
        </a>
      </figcaption>
    </figure>
  )
}

function WhyNowCards() {
  return (
    <div className="grid h-full gap-3 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
      {content.cards.map((card, idx) => {
        const isLight = card.tone === 'light'
        return (
          <Reveal
            key={card.title}
            delay={idx * 0.1}
            className={`flex flex-col gap-2 rounded-2xl p-5 md:p-6 lg:justify-center ${
              isLight ? 'bg-white' : 'border border-white/12 bg-white/6'
            }`}
          >
            <span
              className={`self-start rounded-full px-2.5 py-0.5 text-xs font-black ${
                isLight
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-300/16 text-green-200'
              }`}
            >
              {card.badge}
            </span>
            <h3
              className={`text-lg font-black tracking-[-0.03em] md:text-xl ${
                isLight ? 'text-deep' : 'text-white'
              }`}
            >
              {card.title}
            </h3>
            <p
              className={`text-sm leading-relaxed font-medium md:text-[15px] ${
                isLight ? 'text-gray-600' : 'text-emerald-100'
              }`}
            >
              {card.body}
            </p>
            {card.link && (
              <Link
                href={card.link.href}
                className="text-sm font-black text-green-700 hover:text-green-900"
              >
                {card.link.label}
              </Link>
            )}
          </Reveal>
        )
      })}
    </div>
  )
}

export default function WhyNowSection() {
  return (
    <section
      data-section="pw-why-now"
      className="bg-deep py-10 sm:py-12 md:py-16"
    >
      <Container className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-2">
          <SectionHeading
            label={content.label}
            title={content.title}
            tone="dark"
          />
          <p className="text-sm font-medium text-emerald-100 md:text-[15px]">
            {content.description}
          </p>
        </div>

        {/* 데스크톱은 지도 | 수치 세로 3칸 | 카드 세로 2칸, 세 열의 높이를 맞춘다.
            모바일은 수치 → 지도 → 카드 순 */}
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-3">
          <div className="lg:col-start-2 lg:row-start-1">
            <KpiGrid />
          </div>
          <Reveal className="mx-auto w-full max-w-[320px] lg:col-start-1 lg:row-start-1 lg:max-w-none">
            <QuarantineMap />
          </Reveal>
          <div className="lg:col-start-3 lg:row-start-1">
            <WhyNowCards />
          </div>
        </div>

        {/* 수치는 출처·기준일과 함께 둔다. */}
        <p className="text-xs leading-relaxed font-medium text-gray-400">
          출처: {content.sources.join(', ')}
        </p>
      </Container>
    </section>
  )
}
