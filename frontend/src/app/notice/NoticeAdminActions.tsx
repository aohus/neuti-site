'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

/** 관리자에게만 보이는 수정·삭제 버튼. 공개 본문과 분리해 서버 렌더링을 유지한다. */
export default function NoticeAdminActions({ id }: { id: number }) {
  const { isAdmin, token } = useAuth()
  const router = useRouter()

  if (!isAdmin) return null

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return
    try {
      await axios.delete(`/backend-api/notice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push('/notice')
    } catch (err) {
      console.error('Failed to delete notice', err)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-x-4">
      <Link href={`/notice/edit/${id}`} className="text-blue-600 hover:underline">수정</Link>
      <button onClick={handleDelete} className="text-red-600 hover:underline">삭제</button>
    </div>
  )
}
