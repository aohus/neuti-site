'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import { paperwork } from '@/data/school-content'

export default function PaperworkSection() {
  return (
    <section data-section="school-paperwork" className="section-py bg-surface">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-col gap-3.5 lg:flex-1">
          <SchoolSectionHeading
            label={paperwork.label}
            titleLines={paperwork.titleLines}
          />
          <p className="m-0 text-base leading-[1.75] font-medium text-gray-600">
            {paperwork.description}
          </p>
        </div>

        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:flex-[1.3]">
          {paperwork.items.map((item, idx) => (
            <motion.li
              key={item.title}
              data-reveal
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="flex flex-col gap-1 rounded-[18px] bg-white px-[22px] py-5"
            >
              <span className="text-primary text-xs font-black">
                {item.phase}
              </span>
              <span className="text-deep text-base font-black break-keep">
                {item.title}
              </span>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
