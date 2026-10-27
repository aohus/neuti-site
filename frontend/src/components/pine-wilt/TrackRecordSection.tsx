'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/common/Container'
import {
  pineWiltTrackRecord,
  type TrackRecordFeatured,
  type TrackRecordItem
} from '@/data/pine-wilt-content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

interface TrackRecordSectionProps {
  featured?: TrackRecordFeatured
  items?: TrackRecordItem[]
}

const { label, title, linkLabel } = pineWiltTrackRecord

function FeaturedCard({ record }: { record: TrackRecordFeatured }) {
  return (
    <Link
      href={record.href}
      className="group bg-deep flex h-full flex-col overflow-hidden rounded-[28px] sm:flex-row"
    >
      <div className="relative min-h-[240px] sm:min-h-[260px] sm:flex-1">
        <Image
          src={record.image.src}
          alt={record.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center gap-3 p-7 sm:flex-[1.1] md:p-9">
        <span className="text-deep self-start rounded-full bg-amber-400 px-3 py-1 text-xs font-black">
          {record.meta}
        </span>
        <h3 className="text-2xl leading-[1.35] font-black text-white">
          {record.title}
        </h3>
        <p className="text-[15px] leading-[1.7] font-medium text-emerald-100">
          {record.body}
          {/* 시행 본수는 확정 전까지 숨긴다. */}
          {record.treeCount && <> {record.treeCount}</>}
        </p>
        <span className="text-[15px] font-black text-green-200">
          {linkLabel}
        </span>
      </div>
    </Link>
  )
}

export default function TrackRecordSection({
  featured = pineWiltTrackRecord.featured,
  items = pineWiltTrackRecord.items
}: TrackRecordSectionProps) {
  return (
    <section data-section="pw-track-record" className="section-py bg-white">
      <Container className="flex flex-col gap-8 md:gap-10">
        <SectionHeading label={label} title={title} />

        <div className="flex flex-col gap-4 lg:flex-row">
          <Reveal className="min-w-0 lg:flex-[2]">
            <FeaturedCard record={featured} />
          </Reveal>

          <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
            {items.map((item, idx) => (
              <Reveal
                key={item.title}
                delay={(idx + 1) * 0.08}
                className="flex-1"
              >
                <Link
                  href={item.href}
                  className="bg-surface group flex h-full flex-col gap-2 rounded-[28px] p-7 transition-colors hover:bg-green-50"
                >
                  <span className="text-primary text-[13px] font-black">
                    {item.meta}
                  </span>
                  <h3 className="text-deep text-lg leading-[1.4] font-black">
                    {item.title}
                  </h3>
                  <span className="text-sm font-black text-green-700">
                    {linkLabel}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
