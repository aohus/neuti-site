'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import axios from 'axios'
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
      
      // Fetch notices
      const noticeRes = await axios.get(`${apiUrl}/api/v1/notice/?limit=5`)
      setNotices(noticeRes.data)

      // Fetch projects (from the local JSON data through our lib)
      // Since it's client-side, we'll use our lib directly if possible or a mock for now
      // Actually, getAllProjects from lib is fine.
      // But for better integration, let's assume an API exists or just load the JSON.
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
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Notices Column */}
          <div className="lg:w-5/12">
            <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Recent Updates</h3>
              <Link href="/notice" className="text-green-600 font-bold text-sm hover:text-green-700 flex items-center">
                전체보기
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {notices.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/notice/${post.id}`}
                  className="block py-5 group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate pr-4">
                      {post.title}
                    </h4>
                    <span className="text-sm text-gray-400 shrink-0">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {post.content}
                  </p>
                </Link>
              ))}
              {!isLoading && notices.length === 0 && (
                <p className="py-8 text-gray-400 text-center">등록된 공지사항이 없습니다.</p>
              )}
            </div>
          </div>

          {/* Projects Column */}
          <div className="lg:w-7/12">
            <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Major Projects</h3>
              <Link href="/performance" className="text-green-600 font-bold text-sm hover:text-green-700 flex items-center">
                전체보기
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href="/performance"
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
                >
                  <Image
                    src={project.image || '/images/projects/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h5 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                      {project.title}
                    </h5>
                  </div>
                </Link>
              ))}
              {!isLoading && projects.length === 0 && (
                <div className="col-span-full py-8 text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  등록된 실적 이미지가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
