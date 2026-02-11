'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function QnAWritePage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [password, setPassword] = useState('')
  const [isSecret, setIsSecret] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const apiUrl = '/backend-api'
      await axios.post(`${apiUrl}/inquiry/`, {
        title,
        author,
        content,
        password: isSecret ? password : null,
        is_secret: isSecret
      })
      router.push('/qna')
    } catch (err) {
      console.error('Failed to create inquiry', err)
      alert('문의 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 md:pt-40 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center text-gray-900">시공/견적 문의하기</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">작성자</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="성함 또는 업체명"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all w-full">
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
              />
              <span className="text-sm font-bold text-gray-700 uppercase">비밀글로 작성</span>
            </label>
          </div>
        </div>

        {isSecret && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isSecret}
            />
          </div>
        )}

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
          <label className="block text-sm font-bold text-gray-700 mb-2">문의 내용</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="문의하실 내용을 자세히 적어주세요"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-sm"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md disabled:bg-gray-400"
          >
            {isSubmitting ? '제출 중...' : '문의 등록하기'}
          </button>
        </div>
      </form>

      <div className="mt-12 p-10 border-2 border-dashed border-black/5 rounded-[2.5rem] text-center bg-white max-w-xl mx-auto">
        <span className="text-[10px] font-black tracking-[0.2em] text-green-700 uppercase mb-6 block">Contact Info</span>
        <ul className="text-[15px] text-gray-500 space-y-4 font-bold">
          <li><span className="text-gray-900 mr-2">전화:</span> 031-752-6000</li>
          <li><span className="text-gray-900 mr-2">이메일:</span> coopneuti@naver.com</li>
        </ul>
      </div>
    </div>
  )
}
