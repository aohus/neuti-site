'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Notice } from '@/types/board'

export default function NoticeEditPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { isAdmin, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const fetchNotice = async () => {
    setIsLoading(true)
    try {
      const apiUrl = '/backend-api/api/v1'
      const response = await axios.get(`${apiUrl}/notice/${id}`)
      setTitle(response.data.title)
      setContent(response.data.content)
    } catch (err) {
      console.error('Failed to fetch notice', err)
      router.push('/notice')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      router.push('/notice')
      return
    }
    if (id) fetchNotice()
  }, [id, isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const apiUrl = '/backend-api/api/v1'
      await axios.put(`${apiUrl}/notice/${id}`, 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      router.push(`/notice/${id}`)
    } catch (err) {
      console.error('Failed to update notice', err)
      alert('공지사항 수정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="py-24 text-center">로딩 중...</div>

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">공지사항 수정</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="내용을 입력하세요"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md disabled:bg-gray-400"
          >
            {isSubmitting ? '저장 중...' : '수정완료'}
          </button>
        </div>
      </form>
    </div>
  )
}
