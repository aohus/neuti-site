'use client'

import React from 'react'
import Image from 'next/image'
import Container from '@/components/common/Container'
import {
  pineWiltPrevention,
  type PreventionStep
} from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

interface PreventionSectionProps {
  steps?: PreventionStep[]
}

function PhotoStep({ step }: { step: PreventionStep }) {
  return (
    <>
      {step.image && (
        <div className="relative aspect-[4/3]">
          <Image
            src={step.image.src}
            alt={step.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-7">
        <span className="text-primary text-[13px] font-black">
          {step.number}
        </span>
        <h3 className="text-deep text-[19px] font-black">{step.title}</h3>
        <p className="text-sm leading-[1.7] font-medium text-gray-500">
          {step.body}
        </p>
      </div>
    </>
  )
}

/** 사진이 없는 마지막 단계는 짙은 카드로 두어 기록·보고 단계를 강조한다. */
function RecordStep({ step }: { step: PreventionStep }) {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5 px-7 py-8">
      <span className="text-[13px] font-black text-amber-400">
        {step.number}
      </span>
      <h3 className="text-[19px] font-black text-white">{step.title}</h3>
      <p className="text-sm leading-[1.7] font-medium text-emerald-100">
        {step.body}
      </p>
      {/* 효과 지속기간·재접종 주기는 나무의사 확인 전까지 비워 둔다. */}
      {step.note && (
        <span className="text-[13px] font-bold text-green-300">
          {step.note}
        </span>
      )}
    </div>
  )
}

export default function PreventionSection({
  steps = pineWiltPrevention.steps
}: PreventionSectionProps) {
  return (
    <section data-section="pw-prevention" className="bg-surface section-py">
      <Container className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            label={pineWiltPrevention.label}
            title={pineWiltPrevention.title}
          />
          <p className="max-w-[440px] text-[15px] leading-[1.7] font-bold text-gray-500">
            {pineWiltPrevention.description}
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <Reveal
              as="li"
              key={step.number}
              delay={idx * 0.08}
              className={
                step.image
                  ? 'flex flex-col overflow-hidden rounded-[28px] bg-white'
                  : 'bg-deep rounded-[28px] sm:col-span-2 lg:col-span-1'
              }
            >
              {step.image ? (
                <PhotoStep step={step} />
              ) : (
                <RecordStep step={step} />
              )}
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
