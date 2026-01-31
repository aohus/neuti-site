'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BoardTable from '@/components/common/BoardTable'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Inquiry } from '@/types/board'

export default function QnAListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { isAdmin } = useAuth()
  const router = useRouter()

  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/v1/inquiry/`, {
        params: {
          skip: (currentPage - 1) * 10,
          limit: 10
        }
      })
      setInquiries(response.data)
      setTotalPages(1) 
    } catch (err) {
      console.error('Failed to fetch inquiries', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [currentPage])

  const columns = [
    { header: 'No', key: 'id', className: 'w-16' },
    { 
      header: '제목', 
      key: 'title', 
      render: (item: Inquiry) => (
        <div className="flex items-center gap-2">
          {item.is_secret && (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-bold text-gray-900">{item.title}</span>
        </div>
      ),
      className: 'font-bold text-gray-900' 
    },
    { header: '작성자', key: 'author', className: 'w-32' },
    { 
      header: '작성일', 
      key: 'created_at', 
      render: (item: Inquiry) => new Date(item.created_at).toLocaleDateString(),
      className: 'w-32'
    },
    { 
      header: '상태', 
      key: 'status', 
      render: (item: Inquiry) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.answer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.answer ? '답변완료' : '접수완료'}
        </span>
      ),
      className: 'w-24'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Q&A</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">시공/견적문의</p>
        </div>
        <Link
          href="/qna/write"
          className="bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
        >
          문의하기
        </Link>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <BoardTable
        columns={columns}
        data={inquiries}
        isLoading={isLoading}
        onRowClick={(item) => router.push(`/qna/${item.id}`)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
