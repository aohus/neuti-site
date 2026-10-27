'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Container from '@/components/common/Container'
import { BrandWatermark } from '@/components/common/BrandLogo'
import { schoolCta, SCHOOL_PHONE } from '@/data/school-content'

export default function SchoolCTA() {
  return (
    <section
      data-section="school-cta"
      className="section-py-lg bg-primary relative overflow-hidden text-center text-white"
    >
      <BrandWatermark />
      <Container className="relative z-10">
        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-black text-white">
            {schoolCta.badge}
          </span>
          <h2 className="m-0 text-[28px] leading-[1.3] font-black tracking-[-0.04em] text-white md:text-4xl lg:text-[46px]">
            {schoolCta.titleLines[0]}
            <br />
            {schoolCta.titleLines[1]}
          </h2>
          <p className="m-0 text-base leading-[1.7] font-medium text-green-100 md:text-lg">
            {schoolCta.description}
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href={schoolCta.primaryCta.href}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-base font-black text-primary shadow-2xl transition-all hover:bg-green-50 active:scale-95 sm:w-auto md:text-[17px]"
            >
              {schoolCta.primaryCta.label}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${SCHOOL_PHONE}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/60 px-9 py-[14px] text-base font-black text-white transition-colors hover:bg-white/10 sm:w-auto md:text-[17px]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SCHOOL_PHONE}
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
