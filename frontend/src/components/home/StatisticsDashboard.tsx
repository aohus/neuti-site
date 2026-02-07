'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, animate } from 'framer-motion'
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
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  })
  
  // Appears as it enters, peaks very early, disappears quickly
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.4], [40, 0, 0, -40])
  const scale = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [0.95, 1, 1, 0.95])

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

  const items = [
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
    <motion.section 
      ref={containerRef}
      style={{ opacity, y, scale }}
      className="py-32 bg-white border-b border-gray-100 min-h-[300px] flex items-center"
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 lg:gap-24 text-center">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
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
    </motion.section>
  )
}
