'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../common/Container'
import { performanceApi } from '@/lib/performanceApi'
import type { Performance } from '@/types/performance'

/** 홈에 노출할 최신 시공사례 수. 3열 그리드가 두 줄로 떨어지는 값. */
export const RECENT_PORTFOLIO_LIMIT = 6

/**
 * 홈 하단의 최신 시공사례.
 *
 * `TechnologySection` 은 선택한 **카테고리**의 사례 3건만 보여주므로,
 * 카테고리를 고르지 않은 방문자는 최근 작업을 볼 수 없다. 이 섹션이
 * 카테고리 무관 최신순으로 그 공백을 메운다.
 *
 * 조회에 실패하거나 등록된 사례가 없으면 섹션 자체를 렌더링하지 않는다.
 * 홈 한가운데의 "사례가 없습니다" 빈 상자는 없는 편이 낫다.
 */
export default function RecentPortfolio() {
  const [items, setItems] = useState<Performance[]>([])

  useEffect(() => {
    let isActive = true

    performanceApi
      .getPerformances(0, RECENT_PORTFOLIO_LIMIT)
      .then((data) => {
        if (isActive) setItems(data)
      })
      .catch(() => {
        if (isActive) setItems([])
      })

    return () => {
      isActive = false
    }
  }, [])

  if (items.length === 0) return null

  return (
    <section data-section="recent-portfolio" className="bg-gray-50/50 py-16 md:py-24">
      <Container>
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 text-xs font-black tracking-widest text-green-600 uppercase">
            Recent Projects
          </p>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 md:text-5xl">
            최근 시공 사례
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                href={`/performance/${item.id}`}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
              >
                {item.thumbnail_url && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {/* next/image 를 쓰면 안 된다. uploads 는 프론트 public/ 에 없고
                        next.config 의 rewrite 로 백엔드에서 프록시되는데, 이미지
                        최적화기는 로컬 경로를 처리할 때 그 rewrite 를 타지 않는다.
                        운영에서 /_next/image 가 400 을 내고 썸네일이 전부 깨졌다.
                        업로드 이미지는 커밋 전 장변 1600px 로 압축해 들어온다. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.job_main_category && (
                      <span className="absolute top-3 left-3 rounded-full bg-green-600 px-3 py-1 text-[10px] font-black tracking-wider text-white">
                        {item.job_main_category}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="mb-1 line-clamp-1 text-base font-black text-gray-900 transition-colors group-hover:text-green-700">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="mb-2 line-clamp-1 text-sm font-medium text-gray-500">
                      {item.subtitle}
                    </p>
                  )}
                  {item.client && (
                    <p className="text-sm font-bold text-gray-400">
                      {item.client}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:mt-14">
          <Link
            href="/performance"
            className="group inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-sm font-black text-white shadow-lg transition-all hover:bg-green-700"
          >
            전체 시공사례 보기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
