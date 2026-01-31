'use client'

import React from 'react'
import { motion } from 'framer-motion'
import historyData from '@/data/history.json'
import { HistoryItem } from '@/types/about'

export default function HistoryTimeline() {
  return (
    <div className="relative py-12">
      {/* Central Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-100 hidden md:block" />

      <div className="space-y-16">
        {(historyData as HistoryItem[]).map((item, index) => (
          <motion.div
            key={item.year + item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row items-center ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Year Label */}
            <div className="md:w-1/2 flex justify-center md:justify-start px-8 mb-4 md:mb-0">
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'} w-full`}>
                <span className="text-5xl font-black text-green-600/20 tabular-nums leading-none">
                  {item.year}
                </span>
                <h4 className="text-xl font-black text-gray-900 mt-2">{item.title}</h4>
              </div>
            </div>

            {/* Dot on the line */}
            <div className="relative z-10 w-12 h-12 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg ring-4 ring-green-50" />
            </div>

            {/* Description */}
            <div className="md:w-1/2 px-8 text-center md:text-left">
              <p className={`text-gray-500 font-medium leading-relaxed max-w-sm ${
                index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
              }`}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
