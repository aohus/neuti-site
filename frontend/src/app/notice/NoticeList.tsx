'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BoardTable from '@/components/common/BoardTable'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import Container from '@/components/common/Container'
import { useAuth } from '@/context/AuthContext'
import { Notice } from '@/types/board'

/** 서버가 받아 넘긴 공지 목록을 표로 그린다. 제목은 실제 링크라 JS 없이도 크롤된다. */
export default function NoticeList({ notices }: { notices: Notice[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)

  const { isAdmin } = useAuth()
  const router = useRouter()

  const columns = [
    { header: 'No', key: 'id', className: 'w-16' },
    {
      header: '제목',
      key: 'title',
      render: (item: Notice) => <Link href={`/notice/${item.id}`}>{item.title}</Link>,
      className: 'font-black text-deep',
    },
    {
      header: '작성일',
      key: 'created_at',
      render: (item: Notice) => new Date(item.created_at).toLocaleDateString(),
      className: 'w-32 font-bold text-gray-400',
    },
    { header: '조회수', key: 'views', className: 'w-24 font-bold text-gray-400' },
  ]

  return (
    <div className="page-py bg-white">
      <Container>
        <div className="flex justify-between items-end mb-8 md:mb-16">
          <div>
            <span className="text-label">Notice</span>
            <h1 className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">공지사항</h1>
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
          onRowClick={(item) => router.push(`/notice/${item.id}`)}
        />

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setPage} />
        </div>
      </Container>
    </div>
  )
}
