import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { serverFetch } from '@/lib/serverApi'
import { Notice } from '@/types/board'
import NoticeAdminActions from '../NoticeAdminActions'

const DESCRIPTION_MAX = 150

type Props = { params: Promise<{ id: string }> }

/** 숫자 id 만 백엔드로 보낸다. 없는 글은 null. 백엔드 장애는 던진다. */
async function loadNotice(rawId: string): Promise<Notice | null> {
  if (!/^\d+$/.test(rawId)) return null
  return serverFetch<Notice>(`/notice/${rawId}`, { revalidate: 60 })
}

function excerpt(content: string) {
  const flat = content.replace(/\s+/g, ' ').trim()
  return flat.length > DESCRIPTION_MAX ? `${flat.slice(0, DESCRIPTION_MAX - 1)}…` : flat
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const notice = await loadNotice(id)
  if (!notice) return { title: '공지사항', robots: { index: false } }
  return buildMetadata({
    title: notice.title,
    description: excerpt(notice.content) || '느티나무병원 협동조합 공지사항',
    path: `/notice/${notice.id}`,
    ogType: 'article',
  })
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params
  const notice = await loadNotice(id)
  if (!notice) notFound()

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <span>작성일: {new Date(notice.created_at).toLocaleDateString()}</span>
            <span className="ml-4">조회수: {notice.views}</span>
          </div>
          <NoticeAdminActions id={notice.id} />
        </div>
      </div>

      <div className="prose max-w-none mb-12 whitespace-pre-wrap text-gray-700 leading-relaxed">
        {notice.content}
      </div>

      <div className="flex justify-center border-t border-gray-100 pt-12">
        <Link
          href="/notice"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          목록으로
        </Link>
      </div>
    </div>
  )
}
