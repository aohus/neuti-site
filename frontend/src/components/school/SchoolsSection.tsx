'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import { getSchoolClients, schoolCases } from '@/data/school-content'

export default function SchoolsSection() {
  // 실적 원장에서 파생 — 학교 이름과 연도만 보여 주고 건수는 세지 않는다
  const schools = getSchoolClients()

  return (
    <section data-section="school-schools" className="section-py bg-white">
      <Container className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SchoolSectionHeading
            label={schoolCases.label}
            titleLines={[schoolCases.title]}
          />
          <Link
            href={schoolCases.moreLink.href}
            className="group inline-flex items-center gap-1.5 self-start text-[15px] font-black text-green-700 hover:text-green-900 sm:self-auto"
          >
            {schoolCases.moreLink.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schoolCases.cases.map((item, idx) => (
            <motion.div
              key={item.title}
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                href={item.href}
                className="group bg-surface flex h-full flex-col overflow-hidden rounded-[28px]"
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                      item.focus === 'top' ? 'object-top' : 'object-center'
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-2 px-6 py-6 md:px-7">
                  <div className="flex flex-wrap gap-1.5">
                    {item.chips.map((chip) => (
                      <span
                        key={chip.label}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                          chip.dark
                            ? 'bg-deep text-white'
                            : 'bg-green-100 text-green-900'
                        }`}
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-deep group-hover:text-primary m-0 text-[19px] font-black transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <ul
          aria-label="함께한 학교 목록"
          className="m-0 grid list-none grid-cols-1 gap-x-6 border-t border-gray-100 p-0 sm:grid-cols-2 lg:grid-cols-4"
        >
          {schools.map((school) => (
            <li
              key={school.name}
              data-school-client
              className="flex justify-between gap-3 border-b border-gray-100 py-4"
            >
              <span className="text-[15px] font-bold text-gray-800">
                {school.name}
              </span>
              <span className="shrink-0 text-sm font-bold text-gray-500">
                {school.years.join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
