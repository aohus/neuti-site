'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, animate } from 'framer-motion'
import Container from '../common/Container'
import { PerformanceStats } from '@/types/performance'

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (value) => setDisplayValue(Math.round(value)),
    })
    return () => controls.stop()
  }, [value])

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function StatisticsDashboard() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // next.config.ts의 rewrite 설정에 의해 /backend-api/는 이미 /api/v1/으로 매핑되어 있음
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

  const items = [
    {
      label: '누적 시공 완료',
      value: stats?.total_count || 0,
      suffix: '+',
    },
    {
      label: '관리 수목 (주)',
      value: 50000 + (stats?.total_count || 0) * 10, 
      suffix: '+',
    },
    {
      label: '나무의사 직접 진단',
      value: 100,
      suffix: '%',
    },
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100 min-h-[200px]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <h3 className="text-4xl md:text-5xl font-black text-green-700 mb-2">
                {stats ? (
                  <Counter value={item.value} suffix={item.suffix} />
                ) : (
                  <span className="opacity-20">0{item.suffix}</span>
                )}
              </h3>
              <p className="text-gray-500 font-bold text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
