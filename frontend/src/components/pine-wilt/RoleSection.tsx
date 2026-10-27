'use client'

import React from 'react'
import { Check } from 'lucide-react'
import Container from '@/components/common/Container'
import { pineWiltRole as content } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

/**
 * 나무병원이 하는 일과 관할 기관이 하는 일을 나란히 둔다.
 * 감염 판정·미감염 확인증은 오른쪽(관할 기관) 칸에만 나와야 한다.
 */
export default function RoleSection() {
  return (
    <section data-section="pw-role" className="section-py bg-white">
      <Container className="flex flex-col gap-8 md:gap-10">
        <div className="flex max-w-[720px] flex-col gap-3">
          <SectionHeading label={content.label} title={content.title} />
          <p className="text-base leading-[1.75] font-medium text-gray-600 md:text-[17px]">
            {content.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="flex flex-col gap-[18px] rounded-[28px] bg-green-50 p-7 md:p-9">
            <h3 className="text-xl font-black text-green-900">
              {content.ours.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.ours.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-base leading-relaxed font-bold text-gray-800"
                >
                  <Check
                    className="text-primary mt-1 h-4 w-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex flex-col gap-[18px] rounded-[28px] border-2 border-gray-100 bg-gray-50 p-7 md:p-9"
          >
            <h3 className="text-xl font-black text-gray-700">
              {content.agency.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.agency.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-base leading-relaxed font-bold text-gray-600"
                >
                  <span className="text-gray-400" aria-hidden="true">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <p className="text-sm leading-relaxed font-medium text-gray-500">
          {content.lawNote}
        </p>
      </Container>
    </section>
  )
}
