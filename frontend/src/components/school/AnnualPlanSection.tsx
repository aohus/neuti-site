'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import {
  annualPlan,
  FISCAL_MONTHS,
  fiscalIndex,
  type CalendarBar,
  type CalendarTone
} from '@/data/school-content'

const TONE_CLASS: Record<CalendarTone, string> = {
  pest: 'bg-green-400 text-green-900',
  weed: 'bg-lime-400 text-lime-900',
  flower: 'bg-pink-200 text-pink-900',
  prune: 'bg-sky-200 text-sky-900',
  survey: 'bg-white/15 text-white',
  budget: 'border-2 border-dashed border-amber-400 text-amber-200'
}

/** 첫 열은 행 이름이라 월 칸은 2열부터 시작한다 */
function barColumn(bar: CalendarBar): string {
  return `${fiscalIndex(bar.from) + 2} / ${fiscalIndex(bar.to) + 3}`
}

export default function AnnualPlanSection() {
  return (
    <section data-section="school-annual-plan" className="section-py bg-deep">
      <Container className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SchoolSectionHeading
            label={annualPlan.label}
            titleLines={[annualPlan.title]}
            tone="dark"
          />
          <p className="m-0 text-[15px] font-bold text-green-100">
            {annualPlan.aside}
          </p>
        </div>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-2"
        >
          {/* 모바일은 캘린더 박스 안에서만 가로로 스크롤한다. relative 가 없으면 sr-only(absolute) 텍스트가 박스를 빠져나가 페이지가 가로로 늘어난다 */}
          <div
            role="region"
            aria-label="학교 회계연도 연간 작업 일정"
            tabIndex={0}
            className="relative w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]"
          >
            <div className="grid min-w-[900px] grid-cols-[150px_repeat(12,minmax(0,1fr))] items-center gap-x-1 gap-y-3.5 p-7">
              <span aria-hidden="true" />
              {FISCAL_MONTHS.map((month, idx) => (
                <span
                  key={month}
                  className={`text-center text-[13px] font-black ${
                    idx === 0 ? 'text-green-300' : 'text-green-100'
                  }`}
                >
                  {month}월
                </span>
              ))}

              {annualPlan.rows.map((row) => (
                <React.Fragment key={row.label}>
                  <span
                    className={`col-start-1 text-[15px] font-black ${
                      row.highlight ? 'text-amber-200' : 'text-white'
                    }`}
                  >
                    {row.label}
                  </span>
                  {row.bars.map((bar) => (
                    <span
                      key={bar.label}
                      style={{ gridColumn: barColumn(bar) }}
                      className={`flex h-[30px] items-center truncate rounded-lg px-2.5 text-xs font-black ${
                        TONE_CLASS[bar.tone]
                      }`}
                    >
                      {bar.label}
                      <span className="sr-only">
                        {' '}
                        ({bar.from}월부터 {bar.to}월까지)
                      </span>
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <p className="m-0 text-xs font-bold text-green-200/70 lg:hidden">
            옆으로 밀어서 전체 일정을 보세요
          </p>
        </motion.div>

        <p className="m-0 text-[13px] font-medium text-gray-400">
          {annualPlan.footnote}
        </p>
      </Container>
    </section>
  )
}
