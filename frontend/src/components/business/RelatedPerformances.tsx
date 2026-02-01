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

export default function RelatedPerformances({ category, title, theme = 'light' }: RelatedPerformancesProps) {
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
      <div className="flex justify-between items-end mb-12">
        <div>
          <h5 className={`text-sm font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>Portfolio</h5>
          <p className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        </div>
        <Link 
          href="/performance" 
          className={`flex items-center gap-2 font-black text-sm transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-green-700'}`}
        >
          전체 사례 보기 <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : (
          performances.map((perf, idx) => (
            <motion.div
              key={perf.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/performance/${perf.id}`} className="group block space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white/5 group-hover:border-green-500/50 transition-all">
                  {perf.thumbnail_url ? (
                    <img 
                      src={perf.thumbnail_url} 
                      alt={perf.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-900/20" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-green-500/60' : 'text-green-600/60'}`}>
                    {perf.client || '느티나무협동조합'}
                  </p>
                  <h6 className={`font-black line-clamp-1 leading-tight ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-700'} transition-colors`}>
                    {perf.title}
                  </h6>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
