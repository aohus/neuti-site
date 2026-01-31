'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Notice } from '@/types/board'

export default function NoticeDetailPage() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { isAdmin, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const fetchNotice = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/v1/notice/${id}`)
      setNotice(response.data)
    } catch (err) {
      console.error('Failed to fetch notice', err)
      router.push('/notice')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.delete(`${apiUrl}/api/v1/notice/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/notice')
    } catch (err) {
      console.error('Failed to delete notice', err)
      alert('삭제에 실패했습니다.')
    }
  }

  useEffect(() => {
    if (id) fetchNotice()
  }, [id])

  if (isLoading) return <div className="py-24 text-center">로딩 중...</div>
  if (!notice) return null

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <span>작성일: {new Date(notice.created_at).toLocaleDateString()}</span>
            <span className="ml-4">조회수: {notice.views}</span>
          </div>
          {isAdmin && (
            <div className="space-x-4">
              <Link href={`/notice/edit/${id}`} className="text-blue-600 hover:underline">수정</Link>
              <button onClick={handleDelete} className="text-red-600 hover:underline">삭제</button>
            </div>
          )}
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
