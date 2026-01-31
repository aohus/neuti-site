'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Inquiry } from '@/types/board'

export default function QnADetailPage() {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isPasswordRequired, setIsPasswordRequired] = useState(false)
  const [answerContent, setAnswerContent] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  
  const { isAdmin, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const fetchInquiry = async (pw?: string) => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const config: any = {}
      if (token) config.headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.get(`${apiUrl}/api/v1/inquiry/${id}${pw ? `?password=${pw}` : ''}`, config)
      setInquiry(response.data)
      setIsPasswordRequired(false)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setIsPasswordRequired(true)
      } else {
        console.error('Failed to fetch inquiry', err)
        router.push('/qna')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchInquiry(password)
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnswering(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.post(`${apiUrl}/api/v1/inquiry/${id}/answer`, 
        { inquiry_id: Number(id), content: answerContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchInquiry()
      setAnswerContent('')
    } catch (err) {
      console.error('Failed to save answer', err)
      alert('답변 저장에 실패했습니다.')
    } finally {
      setIsAnswering(false)
    }
  }

  useEffect(() => {
    if (id) fetchInquiry()
  }, [id])

  if (isLoading && !isPasswordRequired) return <div className="py-24 text-center">로딩 중...</div>

  if (isPasswordRequired) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-6 0v4h6z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-4">비밀글입니다.</h2>
          <p className="text-sm text-gray-500 mb-8">작성 시 설정한 비밀번호를 입력해주세요.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!inquiry) return null

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-12">
        <div className="border-b border-gray-100 pb-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{inquiry.title}</h1>
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <span className="font-bold text-gray-700">{inquiry.author}</span>
              <span className="ml-4">작성일: {new Date(inquiry.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-12 whitespace-pre-wrap text-gray-700 leading-relaxed min-h-[200px]">
          {inquiry.content}
        </div>
      </div>

      {inquiry.answer ? (
        <div className="bg-green-50 p-8 rounded-3xl border border-green-100 mb-12 relative shadow-inner">
          <div className="absolute -top-4 left-8 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
            답변
          </div>
          <div className="mt-4 prose max-w-none whitespace-pre-wrap text-green-900 leading-relaxed">
            {inquiry.answer.content}
          </div>
          <div className="mt-6 text-xs text-green-600 text-right">
            답변일: {new Date(inquiry.answer.created_at).toLocaleDateString()}
          </div>
        </div>
      ) : (
        isAdmin && (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 mb-12 shadow-inner">
            <h3 className="text-lg font-bold text-gray-900 mb-6">답변 작성하기</h3>
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="답변 내용을 입력하세요"
                rows={6}
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isAnswering}
                className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md disabled:bg-gray-400"
              >
                {isAnswering ? '저장 중...' : '답변 저장'}
              </button>
            </form>
          </div>
        )
      )}

      <div className="flex justify-center">
        <Link
          href="/qna"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-sm"
        >
          목록으로
        </Link>
      </div>
    </div>
  )
}
