'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Phone } from 'lucide-react'
import Container from '@/components/common/Container'
import { schoolHero, SCHOOL_PHONE } from '@/data/school-content'
import heroImage from '../../../public/images/school/sudo-girls-canopy-spray.jpg'

export default function SchoolHero() {
  return (
    <section data-section="school-hero" className="bg-surface hero-py">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex min-w-0 flex-col gap-5 md:gap-6"
          >
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-green-100 bg-white px-4 py-2 text-sm font-black text-green-700">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              {schoolHero.badge}
            </span>

            <h1 className="text-deep text-[32px] leading-[1.2] font-black tracking-[-0.05em] text-balance sm:text-5xl lg:text-[62px]">
              {schoolHero.titleLines[0]}
              <br />
              {schoolHero.titleLines[1]}
            </h1>

            <p className="max-w-[600px] text-base leading-[1.75] font-medium text-gray-600 md:text-xl">
              {schoolHero.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={schoolHero.primaryCta.href}
                className="group bg-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-black text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 md:text-[17px]"
              >
                {schoolHero.primaryCta.label}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${SCHOOL_PHONE}`}
                className="border-deep text-deep inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-[14px] text-base font-black transition-colors hover:bg-white md:text-[17px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SCHOOL_PHONE}
              </a>
            </div>

            <ul className="mt-2 grid max-w-[600px] grid-cols-3 gap-2 sm:gap-3">
              {schoolHero.chips.map((chip) => (
                <li
                  key={chip.title}
                  className={`flex flex-col gap-1 rounded-[20px] p-3 sm:px-4 sm:py-[18px] ${
                    chip.highlight ? 'bg-deep' : 'bg-white'
                  }`}
                >
                  <span
                    className={`text-[15px] leading-snug font-black break-keep sm:text-[17px] ${
                      chip.highlight ? 'text-white' : 'text-deep'
                    }`}
                  >
                    {chip.title}
                  </span>
                  <span
                    className={`text-xs leading-snug font-bold break-keep sm:text-[13px] ${
                      chip.highlight ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {chip.desc}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            data-reveal
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative min-w-0"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-[0_24px_48px_rgba(30,57,50,0.18)] lg:aspect-[4/5]">
              <Image
                src={heroImage}
                alt={schoolHero.image.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                placeholder="blur"
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-[18px] bg-white px-[18px] py-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] lg:bottom-8 lg:-left-5">
              <p className="text-primary m-0 text-xs font-black">
                {schoolHero.overlay.meta}
              </p>
              <p className="text-deep m-0 mt-0.5 text-base font-black">
                {schoolHero.overlay.title}
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
