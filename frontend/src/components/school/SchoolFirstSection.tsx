'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  FileText,
  Leaf,
  Shield,
  type LucideIcon
} from 'lucide-react'
import Container from '@/components/common/Container'
import SchoolSectionHeading from './SchoolSectionHeading'
import { schoolFirst, type SchoolFirstIcon } from '@/data/school-content'

const ICONS: Record<SchoolFirstIcon, LucideIcon> = {
  calendar: CalendarDays,
  shield: Shield,
  leaf: Leaf,
  document: FileText
}

export default function SchoolFirstSection() {
  return (
    // 바로 위 TREE DOCTOR 섹션이 아래 여백을 이미 가지므로 위 여백은 두지 않는다
    <section
      data-section="school-first"
      className="bg-white pb-12 sm:pb-16 md:pb-24"
    >
      <Container className="flex flex-col gap-8 md:gap-11">
        <SchoolSectionHeading
          label={schoolFirst.label}
          titleLines={[schoolFirst.title]}
          className="max-w-[720px]"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {schoolFirst.cards.map((card, idx) => {
            const Icon = ICONS[card.icon]
            return (
              <motion.div
                key={card.title}
                data-reveal
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-surface flex flex-col gap-3 rounded-[28px] px-7 py-8"
              >
                <span className="text-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                </span>
                <h3 className="text-deep m-0 text-[19px] font-black">
                  {card.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.7] font-medium text-gray-500">
                  {card.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schoolFirst.photos.map((photo) => (
            <motion.figure
              key={photo.src}
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="m-0 flex flex-col gap-2.5"
            >
              <div className="relative aspect-video overflow-hidden rounded-3xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-[13px] font-bold text-gray-500">
                {photo.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
