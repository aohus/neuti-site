'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BoardTable from '@/components/common/BoardTable'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import Container from '@/components/common/Container'

/**
 * 목록에 공개되는 필드만. 본문(content)과 답변 내용은 비밀글 보호를 위해
 * 서버에서 제거하고 넘긴다. 클라이언트 컴포넌트 props 는 RSC payload 로 HTML 에 실린다.
 */
export interface InquiryListItem {
  id: number
  title: string
  author: string
  is_secret: boolean
  created_at: string
  hasAnswer: boolean
}

export default function QnAList({ inquiries }: { inquiries: InquiryListItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  const router = useRouter()

  const columns = [
    { header: 'No', key: 'id', className: 'w-16' },
    {
      header: '제목',
      key: 'title',
      render: (item: InquiryListItem) => (
        <div className="flex items-center gap-2">
          {item.is_secret && (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
          <Link href={`/qna/${item.id}`} className="font-black text-deep">{item.title}</Link>
        </div>
      ),
      className: 'font-black text-deep',
    },
    { header: '작성자', key: 'author', className: 'w-32 font-bold text-gray-500' },
    {
      header: '작성일',
      key: 'created_at',
      render: (item: InquiryListItem) => new Date(item.created_at).toLocaleDateString(),
      className: 'w-32 font-bold text-gray-400',
    },
    {
      header: '상태',
      key: 'status',
      render: (item: InquiryListItem) => (
        <span className={`px-3 py-1 rounded-full text-xs font-black ${item.hasAnswer ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
          {item.hasAnswer ? '답변완료' : '접수완료'}
        </span>
      ),
      className: 'w-24',
    },
  ]

  return (
    <div className="page-py bg-white">
      <Container>
        <div className="flex justify-between items-end mb-8 md:mb-16">
          <div>
            <span className="text-label">Support</span>
            <h1 className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">시공/견적문의</h1>
          </div>
          <Link
            href="/qna/write"
            className="bg-deep text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-deep/10"
          >
            문의하기
          </Link>
        </div>

        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <BoardTable
          columns={columns}
          data={inquiries}
          onRowClick={(item) => router.push(`/qna/${item.id}`)}
        />

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setPage} />
        </div>
      </Container>
    </div>
  )
}
