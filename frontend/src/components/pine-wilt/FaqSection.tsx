'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import Container from '@/components/common/Container'
import { pineWiltFaq, type FaqItem } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'

interface FaqSectionProps {
  items?: FaqItem[]
}

export default function FaqSection({
  items = pineWiltFaq.items
}: FaqSectionProps) {
  // 답이 확정되지 않은 질문(예: 진단 비용)은 질문까지 통째로 뺀다.
  const answered = items.filter(
    (item): item is FaqItem & { answer: string } => item.answer !== null
  )

  return (
    <section data-section="pw-faq" className="bg-surface section-py">
      <Container>
        <div className="mx-auto flex max-w-[880px] flex-col gap-8">
          <SectionHeading
            label={pineWiltFaq.label}
            title={pineWiltFaq.title}
            align="center"
          />

          <div className="flex flex-col gap-3">
            {answered.map((item, idx) => (
              <details
                key={item.question}
                open={idx === 0}
                className="group rounded-[20px] bg-white px-6 py-5 md:px-7 md:py-6"
              >
                <summary className="text-deep flex cursor-pointer list-none items-start justify-between gap-4 text-base font-black md:text-[17px] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown
                    className="text-primary mt-0.5 h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3.5 text-[15px] leading-[1.75] font-medium text-gray-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
