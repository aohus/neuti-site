'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import {
  plans,
  PRICE_FALLBACK,
  type PlanItem,
  type SchoolPlan
} from '@/data/school-content'

function PlanItemText({
  item,
  featured
}: {
  item: PlanItem
  featured: boolean
}) {
  // count 가 없는 항목은 문구 그대로, null 이면 아직 정하지 않은 횟수라 견적 안내로 대신한다
  if (item.count === undefined) return <>{item.text}</>
  if (item.count === null) {
    return (
      <>
        {item.text}
        <span
          className={`ml-1.5 text-[13px] ${featured ? 'text-green-200' : 'text-gray-400'}`}
        >
          (횟수는 {PRICE_FALLBACK})
        </span>
      </>
    )
  }
  return (
    <>
      {item.text} {item.count}
    </>
  )
}

function PlanCard({ plan, delay }: { plan: SchoolPlan; delay: number }) {
  const featured = plan.featured === true

  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`flex flex-col gap-5 rounded-[28px] border-2 px-7 py-8 md:px-8 md:py-9 ${
        featured
          ? 'border-deep bg-deep md:col-span-2 lg:col-span-1'
          : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex flex-col gap-1.5">
        {plan.badge && (
          <span className="text-deep self-start rounded-full bg-amber-400 px-3 py-1 text-xs font-black">
            {plan.badge}
          </span>
        )}
        <h3
          className={`m-0 text-[22px] font-black ${featured ? 'text-white' : 'text-deep'}`}
        >
          {plan.name}
        </h3>
        <p
          className={`m-0 text-[15px] font-bold ${featured ? 'text-green-100' : 'text-gray-500'}`}
        >
          {plan.target}
        </p>
      </div>

      <ul className="m-0 flex grow list-none flex-col gap-2.5 p-0">
        {plan.items.map((item) => (
          <li
            key={item.text}
            className={`flex gap-2.5 text-[15px] font-bold ${featured ? 'text-white' : 'text-gray-700'}`}
          >
            <Check
              className={`mt-1 h-4 w-4 shrink-0 ${featured ? 'text-green-400' : 'text-primary'}`}
              aria-hidden="true"
            />
            <span>
              <PlanItemText item={item} featured={featured} />
            </span>
          </li>
        ))}
      </ul>

      <p
        className={`m-0 text-[15px] font-black ${featured ? 'text-green-200' : 'text-deep'}`}
      >
        {plan.price ?? PRICE_FALLBACK}
      </p>
    </motion.div>
  )
}

export default function PlansSection() {
  return (
    <section data-section="school-plans" className="section-py bg-white">
      <Container className="flex flex-col gap-8 md:gap-11">
        <SchoolSectionHeading
          label={plans.label}
          titleLines={[plans.title]}
          align="center"
        />

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.items.map((plan, idx) => (
            <PlanCard key={plan.name} plan={plan} delay={idx * 0.08} />
          ))}
        </div>
      </Container>
    </section>
  )
}
