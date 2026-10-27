'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone, Search } from 'lucide-react'
import Container from '@/components/common/Container'
import {
  DIAGNOSIS_REQUEST_HREF,
  PINE_WILT_PHONE,
  pineWiltHero as hero
} from '@/data/pine-wilt-content'
import heroImage from '../../../public/images/pine-wilt/daemosan-drill-inject.jpg'

export default function PineWiltHero() {
  return (
    <section data-section="pw-hero" className="bg-surface hero-py">
      <Container className="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex w-full min-w-0 flex-col gap-6 md:gap-7 lg:flex-[1.15]"
        >
          <span className="bg-deep inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-black text-white">
            <Search
              className="h-4 w-4 text-amber-400"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            {hero.badge}
          </span>

          <h1 className="text-deep text-[32px] leading-[1.25] font-black tracking-[-0.04em] text-balance md:text-[44px] lg:text-[54px]">
            {hero.titleLines[0]}
            <br />
            {hero.titleLines[1]}
          </h1>

          <p className="max-w-[600px] text-base leading-[1.75] font-medium text-gray-600 md:text-xl">
            {hero.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={DIAGNOSIS_REQUEST_HREF}
              className="group bg-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-black text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 md:py-[18px] md:text-[17px]"
            >
              {hero.primaryLabel}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${PINE_WILT_PHONE}`}
              className="border-deep text-deep hover:bg-deep inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-[14px] text-base font-black transition-colors hover:text-white md:py-4 md:text-[17px]"
            >
              <Phone className="h-[18px] w-[18px]" />
              {PINE_WILT_PHONE}
            </a>
          </div>

          <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
            {hero.checks.map((check) => (
              <li
                key={check}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-700"
              >
                <Check
                  className="text-primary h-4 w-4 shrink-0"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {check}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          data-reveal
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative w-full max-w-[560px] min-w-0 lg:max-w-none lg:flex-1"
        >
          {/* 원본이 4:3 이라 좁은 화면에서는 그대로 두고, 2열이 되는 lg 에서 시안의 4:5 로 자른다. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-[0_24px_48px_rgba(30,57,50,0.18)] lg:aspect-[4/5]">
            {/* 정적 import 로 빌드 시 blurDataURL 을 만들어 첫 화면 공백을 줄인다. */}
            <Image
              src={heroImage}
              alt={hero.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 560px, 100vw"
              placeholder="blur"
              priority
              className="object-cover object-[55%_center]"
            />
          </div>
          {/* 음수 오프셋을 모바일에 주면 가로 스크롤이 생겨 lg 이상에서만 사진 밖으로 뺀다. */}
          <div className="absolute bottom-6 left-4 flex flex-col gap-0.5 rounded-[20px] bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] md:bottom-8 lg:-left-5">
            <span className="text-primary text-xs font-black tracking-[0.08em]">
              {hero.seasonLabel}
            </span>
            <span className="text-deep text-lg font-black">
              {hero.seasonValue}
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
