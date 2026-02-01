'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePerformance } from '@/hooks/usePerformance'
import { useAuth } from '@/context/AuthContext'
import { performanceApi } from '@/lib/performanceApi'
import { ChevronLeft, Calendar, User, Trash2, Edit, Info, Map, Tag } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

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
          const imgData = JSON.parse(block.value)
          const url = imgData.url.startsWith('http') ? imgData.url : `http://localhost:8000${imgData.url}`
          return (
            <div key={index} className="my-20 text-center">
              <img 
                src={url} 
                alt={imgData.alt || `Content ${index}`} 
                className="w-full rounded-[3rem] shadow-2xl border-8 border-white mb-6"
              />
              {imgData.alt && (
                <p className="text-sm md:text-base text-gray-400 font-bold tracking-tight">
                  {imgData.alt}
                </p>
              )}
            </div>
          )
        }
        if (block.type === 'image_row') {
          const images = JSON.parse(block.value)
          return (
            <div key={index} className="my-20">
              <div className={`grid grid-cols-1 md:grid-cols-${Math.min(images.length, 3)} gap-8 mb-6`}>
                {images.map((img: any, imgIdx: number) => {
                  const url = img.url.startsWith('http') ? img.url : `http://localhost:8000${img.url}`
                  return (
                    <div key={imgIdx} className="text-center">
                      <img 
                        src={url} 
                        alt={img.alt || `Content Row ${index}-${imgIdx}`} 
                        className="w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-xl border-4 border-white mb-4"
                      />
                      {img.alt && (
                        <p className="text-xs md:text-sm text-gray-400 font-bold tracking-tight">
                          {img.alt}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
        return (
          <div key={index} className="prose-magazine my-12">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-black text-deep mt-20 mb-10 tracking-tight border-l-8 border-primary pl-6 leading-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-black text-deep mt-16 mb-6 tracking-tight" {...props} />,
                p: ({node, ...props}) => <p className="mb-8 whitespace-pre-wrap leading-relaxed text-gray-600" {...props} />,
                strong: ({node, ...props}) => <strong className="font-black text-deep border-b-2 border-accent/40 px-0.5" {...props} />,
                blockquote: ({node, children, ...props}) => (
                  <blockquote className="my-16 py-10 px-12 bg-surface rounded-[3rem] border border-black/5 relative">
                    <span className="absolute -top-6 left-10 text-7xl font-black text-accent/20">"</span>
                    <div className="relative z-10 text-xl md:text-2xl font-black text-primary leading-snug italic keep-all">
                      {children}
                    </div>
                  </blockquote>
                ),
                ul: ({node, ...props}) => <ul className="my-10 space-y-4 list-none" {...props} />,
                li: ({node, children, ...props}) => (
                  <li className="relative pl-8 text-lg font-bold text-gray-500">
                    <span className="absolute left-0 text-accent font-black top-1">●</span>
                    <div>{children}</div>
                  </li>
                )
              }}
            >
              {block.value.replace(/\\n/g, '\n')}
            </ReactMarkdown>
          </div>
        )
      })
    } catch (e) {
      return (
        <div className="prose-magazine my-12">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {contentStr.replace(/\\n/g, '\n')}
          </ReactMarkdown>
        </div>
      )
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
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-3">
            {isAdmin && (
              <div className="flex justify-end gap-3 mb-8">
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
          </div>

          {/* Sidebar Metadata Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-[2.5rem] p-8 sticky top-24 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-green-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Info size={14} /> Project Info
              </h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">발주처</p>
                  <p className="text-gray-900 font-black">{performance.client || '-'}</p>
                </div>
                
                {performance.year && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">연도</p>
                    <p className="text-gray-900 font-black">{performance.year}년</p>
                  </div>
                )}

                {(performance.job_main_category || performance.job_sub_category) && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Tag size={10} /> 작업분류
                    </p>
                    <p className="text-gray-900 font-black">{performance.job_main_category || '-'}</p>
                    {performance.job_sub_category && (
                      <p className="text-sm text-gray-500 font-bold mt-1">{performance.job_sub_category}</p>
                    )}
                  </div>
                )}

                {(performance.site_type || performance.site_location) && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Map size={10} /> 대상지
                    </p>
                    <p className="text-gray-900 font-black">{performance.site_location || '-'}</p>
                    {performance.site_type && (
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg">
                        {performance.site_type}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
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
