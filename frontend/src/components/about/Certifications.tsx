'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, FileText, Users } from 'lucide-react'

const certs = [
  { 
    category: 'License', 
    title: '산림청 등록 나무병원', 
    desc: '수목 진료 전문가 자격 및 시설 기준을 갖춘 공인 기관',
    icon: <ShieldCheck className="w-8 h-8" />
  },
  { 
    category: 'Social', 
    title: '예비 사회적기업 인증', 
    desc: '지역사회 공헌 및 취약계층 일자리 창출 우수 기업',
    icon: <Users className="w-8 h-8" />
  },
  { 
    category: 'Patent', 
    title: '수목 활력 측정 기술', 
    desc: '과학적인 진단을 위한 자체 수목 활력도 측정 특허 보유',
    icon: <FileText className="w-8 h-8" />
  },
  { 
    category: 'Award', 
    title: '농림부 장관 표창 수상', 
    desc: '마을 정원 가꾸기 및 환경 개선 유공 표창',
    icon: <Award className="w-8 h-8" />
  }
]

export default function Certifications() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {certs.map((cert, index) => (
        <motion.div
          key={cert.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-8 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
            {cert.icon}
          </div>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3">{cert.category}</p>
          <h4 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{cert.title}</h4>
          <p className="text-sm font-medium text-gray-400 leading-relaxed">{cert.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}
