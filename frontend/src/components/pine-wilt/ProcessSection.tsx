'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { pineWiltProcess, type ProcessStep } from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

interface ProcessSectionProps {
  steps?: ProcessStep[]
}

export default function ProcessSection({
  steps = pineWiltProcess.steps
}: ProcessSectionProps) {
  return (
    <section data-section="pw-process" className="bg-surface section-py">
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeading
          label={pineWiltProcess.label}
          title={pineWiltProcess.title}
          align="center"
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            // 마지막 단계(결과 보고·후속 연결)를 짙게 칠해 절차의 끝을 보여준다.
            const isLast = idx === steps.length - 1
            const body = step.body ?? step.fallback
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={idx * 0.08}
                className={`flex flex-col gap-3.5 rounded-[28px] border-2 px-7 py-8 ${
                  isLast ? 'border-deep bg-deep' : 'border-gray-100 bg-white'
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${
                    isLast
                      ? 'text-deep bg-amber-400'
                      : 'text-primary bg-green-50'
                  }`}
                >
                  {idx + 1}
                </span>
                <h3
                  className={`text-xl font-black ${isLast ? 'text-white' : 'text-deep'}`}
                >
                  {step.title}
                </h3>
                {body && (
                  <p
                    className={`text-[15px] leading-[1.7] font-medium ${
                      isLast ? 'text-emerald-100' : 'text-gray-500'
                    }`}
                  >
                    {body}
                  </p>
                )}
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
