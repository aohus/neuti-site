'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePerformance } from '@/hooks/usePerformance'
import { useAuth } from '@/context/AuthContext'
import { performanceApi } from '@/lib/performanceApi'
import { ChevronLeft, Calendar, User, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function PerformanceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAdmin } = useAuth()
  const { performance, isLoading, error } = usePerformance(Number(id))

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    
    try {
      await performanceApi.deletePerformance(Number(id))
      alert('삭제되었습니다.')
      router.push('/performance')
    } catch (err) {
      console.error('Delete failed', err)
      alert('삭제에 실패했습니다.')
    }
  }

  // Content Rendering helper
  const renderContent = (contentStr: string) => {
    try {
      const blocks = JSON.parse(contentStr)
      if (!Array.isArray(blocks)) throw new Error()
      
      return blocks.map((block: any, index: number) => {
        if (block.type === 'image') {
          return (
            <div key={index} className="my-12">
              <img 
                src={block.value.startsWith('http') ? block.value : `http://localhost:8000${block.value}`} 
                alt={`Content ${index}`} 
                className="w-full rounded-[2.5rem] shadow-2xl"
              />
            </div>
          )
        }
        if (block.type === 'image_row') {
          const images = JSON.parse(block.value)
          return (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-${Math.min(images.length, 3)} gap-6 my-12`}>
              {images.map((imgUrl: string, imgIdx: number) => (
                <img 
                  key={imgIdx}
                  src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:8000${imgUrl}`} 
                  alt={`Content Row ${index}-${imgIdx}`} 
                  className="w-full aspect-video object-cover rounded-[2rem] shadow-xl"
                />
              ))}
            </div>
          )
        }
        return (
          <p key={index} className="my-10 text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
            {block.value}
          </p>
        )
      })
    } catch (e) {
      return <p className="whitespace-pre-wrap text-xl text-gray-700 leading-relaxed font-medium">{contentStr}</p>
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
    </div>
  )

  if (error || !performance) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <p className="text-xl text-gray-500 mb-6">{error || '게시글을 찾을 수 없습니다.'}</p>
      <Link href="/performance" className="text-green-700 font-bold hover:underline flex items-center gap-2">
        <ChevronLeft size={20} /> 목록으로 돌아가기
      </Link>
    </div>
  )

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Image Section */}
      <div className="relative h-[60vh] w-full bg-gray-900 overflow-hidden">
        {performance.thumbnail_url ? (
          <img 
            src={performance.thumbnail_url} 
            alt={performance.title}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-green-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
            <Link href="/performance" className="inline-flex items-center text-white/80 hover:text-white mb-10 transition-colors group">
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-base font-bold tracking-tight">시공 사례 목록으로</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter drop-shadow-2xl">
              {performance.title}
            </h1>
            <div className="flex flex-wrap items-center gap-10 text-white/90">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-black uppercase tracking-widest mb-1">Client</p>
                  <p className="text-lg font-black">{performance.client || '느티나무협동조합'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-lg">
                  <Calendar size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-black uppercase tracking-widest mb-1">Date</p>
                  <p className="text-lg font-black">
                    {performance.construction_date ? new Date(performance.construction_date).toLocaleDateString() : '날짜 미지정'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-20">
        {isAdmin && (
          <div className="flex justify-end gap-3 mb-12">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all hover:shadow-md">
              <Edit size={18} /> 수정하기
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all hover:shadow-md"
            >
              <Trash2 size={18} /> 삭제하기
            </button>
          </div>
        )}

        {/* Dynamic Content Rendering */}
        <div className="performance-content">
          {renderContent(performance.content)}
        </div>

        <div className="mt-24 pt-16 border-t border-gray-100 flex flex-col items-center">
          <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest text-xs">Thank you for watching</p>
          <Link 
            href="/performance"
            className="bg-green-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}