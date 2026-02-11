'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, animate } from 'framer-motion'
import Container from '../common/Container'
import { PerformanceStats } from '@/types/performance'

const clients = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처', src: '/images/clients/gongsuchco.jpg' },
  { name: '성남도시개발공사', src: '/images/clients/seongnam_dev.jpg' },
  { name: '성남시', src: '/images/clients/seongnam_city.png' },
  { name: '정부청사관리본부', src: '/images/clients/gov-complex.png' },
]

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    setHasAnimated(true)
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, hasAnimated])

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function TrustBar() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/backend-api/performance/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  const statItems = [
    {
      label: '공공기관 공식 협력',
      value: stats ? Math.max(stats.public_client_count, 200) : 200,
      suffix: '건+',
    },
    {
      label: '전문 수목 진단 및 예찰',
      value: stats ? Math.max((stats.job_categories['진단'] || 0) + 150, 150) : 150,
      suffix: '회+',
    },
    {
      label: '공공 파트너십 지속',
      value: 3,
      suffix: '년 연속',
    },
    {
      label: '수도권 주요 거점 관리',
      value: 25,
      suffix: '개소+',
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      <Container>
        {/* Client Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-10 md:mb-12">
          {clients.map((client) => (
            <div key={client.name} className="flex-shrink-0">
              <Image
                src={client.src}
                alt={client.name}
                width={160}
                height={60}
                className="h-7 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
        >
          {statItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-black text-green-700 mb-1">
                {stats ? (
                  <Counter value={item.value} suffix={item.suffix} />
                ) : (
                  <span className="opacity-20">0{item.suffix}</span>
                )}
              </h3>
              <p className="text-gray-500 font-bold text-sm md:text-base">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
