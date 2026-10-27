'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import { treeDoctor } from '@/data/school-content'

export default function TreeDoctorSection() {
  return (
    <section data-section="school-tree-doctor" className="section-py bg-white">
      <Container className="flex flex-col gap-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
          <SchoolSectionHeading
            label={treeDoctor.label}
            titleLines={treeDoctor.titleLines}
            className="min-w-0 lg:flex-[1.2]"
          />

          {/* 법 안내 — 문구는 확인된 범위만 쓴다 (학교가 반드시 나무병원에 맡겨야 한다고 단정하지 않는다) */}
          <motion.aside
            data-reveal
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex min-w-0 flex-col gap-2 rounded-[20px] border border-amber-200 bg-amber-50 px-6 py-[22px] lg:flex-1"
          >
            <p className="m-0 text-[15px] font-black text-amber-900">
              {treeDoctor.law.title}
            </p>
            <p className="m-0 text-sm leading-[1.7] font-bold text-amber-800">
              {treeDoctor.law.body}
            </p>
          </motion.aside>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {treeDoctor.steps.map((step, idx) => (
            <motion.li
              key={step.title}
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`flex flex-col gap-2.5 rounded-3xl px-6 py-7 ${
                step.highlight ? 'bg-deep' : 'bg-green-50'
              }`}
            >
              <span
                className={`text-[13px] font-black ${step.highlight ? 'text-amber-400' : 'text-primary'}`}
              >
                {step.step}
              </span>
              <h3
                className={`m-0 text-[19px] font-black ${step.highlight ? 'text-white' : 'text-deep'}`}
              >
                {step.title}
              </h3>
              <p
                className={`m-0 text-sm leading-[1.7] font-medium ${
                  step.highlight ? 'text-green-100' : 'text-gray-600'
                }`}
              >
                {step.desc}
              </p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
