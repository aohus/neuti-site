'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { Notice } from '@/types/board'
import { Project } from '@/types/project'

export default function LatestUpdates() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const noticeRes = await axios.get(`${apiUrl}/api/v1/notice/?limit=5`)
      setNotices(noticeRes.data)

      const { getAllProjects } = await import('@/lib/projects')
      const allProjects = getAllProjects()
      setProjects(allProjects.slice(0, 4))
    } catch (err) {
      console.error('Failed to fetch latest updates', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <section className="py-32 bg-gray-50/50">
      <Container>
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Notices Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-5/12"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">새소식</h3>
              <Link href="/notice" className="group flex items-center text-gray-500 font-bold text-sm hover:text-green-600 transition-colors">
                전체보기
                <div className="ml-2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-600 group-hover:bg-green-50 transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="space-y-2">
              {notices.map((post, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={post.id}
                >
                  <Link 
                    href={`/notice/${post.id}`}
                    className="block p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all group border border-transparent"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-green-600 px-2 py-1 bg-green-50 rounded-md uppercase tracking-wider">Notice</span>
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1 mb-2">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-1 font-medium">
                      {post.content}
                    </p>
                  </Link>
                </motion.div>
              ))}
              {!isLoading && notices.length === 0 && (
                <div className="py-20 text-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">등록된 공지사항이 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Projects Column (Bento Grid Style) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:w-7/12"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">시공 사례</h3>
              <Link href="/performance" className="group flex items-center text-gray-500 font-bold text-sm hover:text-green-600 transition-colors">
                전체보기
                <div className="ml-2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-600 group-hover:bg-green-50 transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700 ${idx === 0 ? 'sm:row-span-2 aspect-[4/5]' : 'aspect-[16/10]'}`}
                >
                  <Image
                    src={project.image || '/images/projects/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">{project.category}</p>
                    <h5 className="text-white font-bold text-xl leading-tight mb-4 drop-shadow-md">
                      {project.title}
                    </h5>
                    <Link 
                      href="/performance"
                      className="inline-flex items-center text-white/70 text-sm font-bold group-hover:text-white transition-colors"
                    >
                      상세보기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
              {!isLoading && projects.length === 0 && (
                <div className="col-span-full py-32 text-center bg-white/50 rounded-[3rem] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">등록된 실적 이미지가 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}