'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../common/Container'
import axios from 'axios'

interface PortfolioItem {
  id: number
  title: string
  thumbnail_url: string | null
  job_main_category: string | null
  client: string | null
}

export default function RecentPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/backend-api/performance', {
          params: { skip: 0, limit: 6 },
        })
        if (Array.isArray(res.data)) {
          setItems(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch recent portfolio', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getImageUrl = (url: string | null) => {
    if (!url) return '/images/hero/hero_1.jpg'
    if (url.startsWith('http')) return url
    return url.startsWith('/') ? url : `/${url}`
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <Container>
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-4">
            Recent Projects
          </h2>
          <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
            최근 시공 사례
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="border-green-600 mb-4 inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2" />
            <p className="font-bold text-gray-400">불러오는 중...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">등록된 시공 사례가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  href={`/performance/${item.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getImageUrl(item.thumbnail_url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {item.job_main_category && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                        {item.job_main_category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.client && (
                      <p className="text-sm text-gray-400 font-bold">{item.client}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/performance"
            className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-green-700 transition-all shadow-lg text-sm"
          >
            전체 시공사례 보기
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
