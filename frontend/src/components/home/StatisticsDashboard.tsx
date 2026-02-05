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
        const response = await fetch('/backend-api/api/v1/performance/stats')
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

  if (!stats) return null

  const items = [
    {
      label: '누적 시공 완료',
      value: stats.total_count,
      suffix: '+',
    },
    {
      label: '관리 수목 (주)',
      // 실제 데이터가 공사실적.md에 이미지 장수로 되어있어 
      // 사용자 요청대로 50,000+ 와 같은 상징적 수치나 
      // 또는 실적 데이터 기반의 추정치를 표시할 수 있습니다.
      // 여기서는 50,000 기준에 실적 증가분을 반영하는 식으로 연출하겠습니다.
      value: 50000 + stats.total_count * 10, 
      suffix: '+',
    },
    {
      label: '나무의사 직접 진단',
      value: 100,
      suffix: '%',
    },
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
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
                <Counter value={item.value} suffix={item.suffix} />
              </h3>
              <p className="text-gray-500 font-bold text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
