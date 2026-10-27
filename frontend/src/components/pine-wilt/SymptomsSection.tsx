'use client'

import React from 'react'
import Image from 'next/image'
import Container from '@/components/common/Container'
import { pineWiltSymptoms as content } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function SymptomsSection() {
  return (
    <section data-section="pw-symptoms" className="section-py bg-white">
      <Container className="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
        <Reveal className="w-full min-w-0 lg:flex-1">
          <figure className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px]">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* 사진은 재선충 사례가 아니다. 갈변만으로 단정하지 말라는 메시지와 맞춘다. */}
            <figcaption className="text-[13px] leading-relaxed font-bold text-gray-500">
              {content.caption}
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-[1.1]">
          <SectionHeading label={content.label} title={content.title} />

          <ol className="border-t border-gray-100">
            {content.items.map((item, idx) => (
              <Reveal
                as="li"
                key={item}
                delay={idx * 0.06}
                className="flex gap-4 border-b border-gray-100 py-4 md:py-[18px]"
              >
                <span className="text-primary shrink-0 text-[15px] font-black">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-base leading-relaxed font-bold text-gray-800 md:text-[17px]">
                  {item}
                </span>
              </Reveal>
            ))}
          </ol>

          <div className="rounded-[20px] bg-green-50 px-6 py-5">
            <p className="text-base leading-[1.7] font-bold text-green-900">
              {content.notice}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
