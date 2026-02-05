'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { Performance } from '@/types/performance'
import { performanceApi } from '@/lib/performanceApi'

interface RelatedPerformancesProps {
  category: string
  title: string
  theme?: 'light' | 'dark'
}

export default function RelatedPerformances({
  category,
  title,
  theme = 'light'
}: RelatedPerformancesProps) {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await performanceApi.getPerformances(0, 4, { category })
        setPerformances(data)
      } catch (err) {
        console.error('Failed to fetch related performances', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [category])

  if (!isLoading && performances.length === 0) return null

  return (
    <div className="mt-32 border-t border-white/10 pt-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h5
            className={`mb-4 text-sm font-black tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}
          >
            Portfolio
          </h5>
          <p
            className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </p>
        </div>
        <Link
          href="/performance"
          className={`flex items-center gap-2 text-sm font-black transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-green-700'}`}
        >
          전체 사례 보기 <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-2xl bg-white/5"
              />
            ))
          : performances.map((perf, idx) => (
              <motion.div
                key={perf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/performance/${perf.id}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-white/5 shadow-lg transition-all group-hover:border-green-500/50">
                    {perf.thumbnail_url ? (
                      <img
                        src={perf.thumbnail_url}
                        alt={perf.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-green-900/20" />
                    )}
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                  </div>
                  <div>
                    <p
                      className={`mb-1 text-[11px] font-black tracking-widest uppercase ${theme === 'dark' ? 'text-white/60' : 'text-primary'}`}
                    >
                      {perf.client || '느티나무병원 협동조합'}
                    </p>
                    <h6
                      className={`line-clamp-1 leading-tight font-black ${theme === 'dark' ? 'group-hover:text-accent text-white' : 'text-deep group-hover:text-primary'} transition-colors`}
                    >
                      {perf.title}
                    </h6>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  )
}
