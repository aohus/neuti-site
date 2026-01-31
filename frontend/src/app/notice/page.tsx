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
      // For now, totalPages is hardcoded or should be returned from API
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
    { header: '제목', key: 'title', className: 'font-bold text-gray-900' },
    { 
      header: '작성일', 
      key: 'created_at', 
      render: (item: Notice) => new Date(item.created_at).toLocaleDateString(),
      className: 'w-32'
    },
    { header: '조회수', key: 'views', className: 'w-24' },
  ]

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Notice</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">공지사항</p>
        </div>
        {isAdmin && (
          <Link
            href="/notice/write"
            className="bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
          >
            글쓰기
          </Link>
        )}
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <BoardTable
        columns={columns}
        data={notices}
        isLoading={isLoading}
        onRowClick={(item) => router.push(`/notice/${item.id}`)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
