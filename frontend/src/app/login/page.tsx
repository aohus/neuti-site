'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.post(`${apiUrl}/api/v1/login/access-token`, formData)
      
      login(response.data.access_token)
      router.push('/')
    } catch (err: any) {
      console.error('Login failed', err)
      setError(err.response?.data?.detail || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">관리자 로그인</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">아이디</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
