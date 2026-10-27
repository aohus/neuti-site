'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../common/Container'
import type { Performance } from '@/types/performance'
import { thumbUrl, uploadSrcSet } from '@/lib/thumb'

/**
 * 홈 하단의 최신 시공사례.
 *
 * `TechnologySection` 은 선택한 **카테고리**의 사례 3건만 보여주므로,
 * 카테고리를 고르지 않은 방문자는 최근 작업을 볼 수 없다. 이 섹션이
 * 카테고리 무관 최신순으로 그 공백을 메운다.
 *
 * 데이터는 홈 서버 컴포넌트가 받아 props 로 넘긴다(크롤러가 JS 없이도 링크를 본다).
 * 등록된 사례가 없으면 섹션 자체를 렌더링하지 않는다.
 * 홈 한가운데의 "사례가 없습니다" 빈 상자는 없는 편이 낫다.
 */
export default function RecentPortfolio({ items }: { items: Performance[] }) {
  if (items.length === 0) return null

  return (
    <section data-section="recent-portfolio" className="bg-gray-50/50 section-py">
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
                        대신 백엔드 썸네일 API 로 줄인 사본을 쓴다(lib/thumb.ts). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl(item.thumbnail_url, 960)}
                      srcSet={uploadSrcSet(item.thumbnail_url)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
