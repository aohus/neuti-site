'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BoardTable from '@/components/common/BoardTable'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Notice } from '@/types/board'

import Container from '@/components/common/Container'

export default function NoticeListPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { isAdmin } = useAuth()
  const router = useRouter()

  const fetchNotices = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/v1/notice/`, {
        params: {
          skip: (currentPage - 1) * 10,
          limit: 10
        }
      })
      setNotices(response.data)
      setTotalPages(1) 
    } catch (err) {
      console.error('Failed to fetch notices', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [currentPage])

  const columns = [
    { header: 'No', key: 'id', className: 'w-16' },
    { header: '제목', key: 'title', className: 'font-black text-deep' },
    { 
      header: '작성일', 
      key: 'created_at', 
      render: (item: Notice) => new Date(item.created_at).toLocaleDateString(),
      className: 'w-32 font-bold text-gray-400'
    },
    { header: '조회수', key: 'views', className: 'w-24 font-bold text-gray-400' },
  ]

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
      <Container>
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-label">Notice</span>
            <p className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">공지사항</p>
          </div>
          {isAdmin && (
            <Link
              href="/notice/write"
              className="bg-deep text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-deep/10"
            >
              글쓰기
            </Link>
          )}
        </div>

        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <BoardTable
          columns={columns}
          data={notices}
          isLoading={isLoading}
          onRowClick={(item) => router.push(`/notice/${item.id}`)}
        />

        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </Container>
    </div>
  )
}
