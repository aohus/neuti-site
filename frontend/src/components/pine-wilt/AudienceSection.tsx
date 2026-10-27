'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { pineWiltAudience as content } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function AudienceSection() {
  return (
    <section data-section="pw-for-whom" className="bg-surface section-py">
      <Container className="flex flex-col gap-8 md:gap-10">
        <SectionHeading
          label={content.label}
          title={content.title}
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {content.cards.map((card, idx) => (
            <Reveal
              key={card.title}
              delay={idx * 0.08}
              className="flex flex-col gap-3 rounded-[28px] bg-white p-7 md:p-8"
            >
              <h3 className="text-deep text-xl font-black">{card.title}</h3>
              <p className="text-[15px] leading-[1.7] font-medium text-gray-500">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
