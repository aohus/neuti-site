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
      <Container className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-14">
        {/* 데스크톱에서 사진은 오른쪽 설명 높이에 맞춘다. */}
        <Reveal className="mx-auto w-full max-w-[400px] min-w-0 lg:mx-0 lg:w-[340px] lg:max-w-none lg:flex-none">
          <figure className="flex h-full flex-col gap-3">
            {/* 세로 사진이라 붉게 마른 수관이 잘리지 않도록 위쪽을 기준으로 자른다. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:aspect-auto lg:min-h-[320px] lg:flex-1">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 340px, 400px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <figcaption className="text-[13px] leading-relaxed font-bold text-gray-500">
              {content.caption}
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-1">
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
