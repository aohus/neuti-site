'use client'

import React from 'react'
import Link from 'next/link'
import Container from '@/components/common/Container'
import { pineWiltWhyNow as content } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function WhyNowSection() {
  return (
    <section data-section="pw-why-now" className="bg-deep section-py">
      <Container className="flex flex-col gap-8 md:gap-10">
        <SectionHeading
          label={content.label}
          title={content.title}
          tone="dark"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {content.stats.map((stat, idx) => (
            <Reveal
              key={stat.value}
              delay={idx * 0.08}
              className={`flex flex-col gap-2 rounded-3xl border p-6 md:p-7 ${
                stat.isHighlighted
                  ? 'border-amber-400/40 bg-amber-400/12'
                  : 'border-white/12 bg-white/6'
              }`}
            >
              <span
                className={`text-[32px] font-black tracking-[-0.03em] lg:text-[44px] ${
                  stat.isHighlighted ? 'text-amber-200' : 'text-white'
                }`}
              >
                {stat.value}
                {stat.unit && <span className="text-xl">{stat.unit}</span>}
              </span>
              <span
                className={`text-[15px] leading-relaxed font-bold ${
                  stat.isHighlighted ? 'text-amber-100' : 'text-emerald-100'
                }`}
              >
                {stat.lines.map((line, i) => (
                  <React.Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </span>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {content.cards.map((card, idx) => {
            const isLight = card.tone === 'light'
            return (
              <Reveal
                key={card.title}
                delay={idx * 0.1}
                className={`flex flex-col gap-3.5 rounded-3xl p-6 md:p-8 ${
                  isLight ? 'bg-white' : 'border border-white/12 bg-white/6'
                }`}
              >
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-black ${
                    isLight
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-300/16 text-green-200'
                  }`}
                >
                  {card.badge}
                </span>
                <h3
                  className={`text-[22px] font-black tracking-[-0.03em] ${
                    isLight ? 'text-deep' : 'text-white'
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-[15px] leading-[1.75] font-medium ${
                    isLight ? 'text-gray-600' : 'text-emerald-100'
                  }`}
                >
                  {card.body}
                </p>
                {card.link && (
                  <Link
                    href={card.link.href}
                    className="text-[15px] font-black text-green-700 hover:text-green-900"
                  >
                    {card.link.label}
                  </Link>
                )}
              </Reveal>
            )
          })}
        </div>

        {/* 수치는 출처·기준일과 함께 둔다. */}
        <p className="text-[13px] leading-relaxed font-medium text-gray-400">
          출처: {content.sources.join(', ')}
        </p>
      </Container>
    </section>
  )
}
