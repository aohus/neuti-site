'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePerformance } from '@/hooks/usePerformance'
import { useAuth } from '@/context/AuthContext'
import { performanceApi } from '@/lib/performanceApi'
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Trash2, 
  Edit, 
  Info, 
  Map, 
  Tag, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react'
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
    const getFullUrl = (url: string) => {
      if (!url) return ''
      if (url.startsWith('http')) return url
      // 도메인 없이 상대 경로(/uploads/...)만 반환하여 Proxy 이용
      return url.startsWith('/') ? url : `/${url}`
    }

    try {
      const blocks = JSON.parse(contentStr)
      if (!Array.isArray(blocks)) throw new Error()
      
      return blocks.map((block: any, index: number) => {
        if (block.type === 'image') {
          try {
            // 새 형식: JSON stringified {url, alt}
            const imgData = typeof block.value === 'string' && block.value.startsWith('{') 
              ? JSON.parse(block.value) 
              : { url: block.value, alt: '' };
            
            const url = getFullUrl(imgData.url)
            return (
              <div key={index} className="my-16 md:my-24 text-center px-2 md:px-0">
                <img 
                  src={url} 
                  alt={imgData.alt || `Content ${index}`}
                  className="w-full rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white mb-6"
                />
                {imgData.alt && (
                  <p className="text-sm md:text-base text-gray-400 font-bold tracking-tight px-4">
                    {imgData.alt}
                  </p>
                )}
              </div>
            )
          } catch (err) {
            // 파싱 실패 시 원본 그대로 출력 시도
            const url = getFullUrl(block.value)
            return (
              <div key={index} className="my-16 md:my-24 px-2 md:px-0">
                <img src={url} alt="" className="w-full rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white" />
              </div>
            )
          }
        }
        if (block.type === 'image_row') {
          try {
            const items = JSON.parse(block.value)
            const isBeforeAfter = items.length === 2;

            return (
              <div key={index} className="my-16 md:my-24 px-2 md:px-0">
                <div className={`grid grid-cols-1 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 md:gap-8 mb-6`}>
                  {items.map((item: any, imgIdx: number) => {
                    const img = typeof item === 'string' ? { url: item, alt: '' } : item
                    const url = getFullUrl(img.url)
                    return (
                      <div key={imgIdx} className="text-center group/img relative">
                        <div className="relative aspect-[4/3] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border-2 md:border-4 border-white mb-4 group-hover/img:shadow-2xl transition-all duration-500">
                          <img 
                            src={url} 
                            alt={img.alt || `Content Row ${index}-${imgIdx}`} 
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000"
                          />
                          {isBeforeAfter && (
                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                              <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg ${imgIdx === 0 ? 'bg-white text-deep' : 'bg-accent text-white'}`}>
                                {imgIdx === 0 ? 'Before' : 'After'}
                              </span>
                            </div>
                          )}
                        </div>
                        {img.alt && (
                          <p className="text-xs md:text-sm text-gray-400 font-bold tracking-tight opacity-80 group-hover/img:opacity-100 transition-opacity px-2">
                            {img.alt}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          } catch (err) {
            return null
          }
        }
        
        // Final Markdown Text Rendering
        const markdown = block.value.replace(/\n/g, '\n');

        return (
          <div key={index} className="prose-magazine my-10 md:my-16 px-4 md:px-0">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h2: ({node, ...props}) => <h2 className="text-xl md:text-3xl font-black text-deep mt-16 md:mt-24 mb-8 md:mb-12 tracking-tight border-l-4 md:border-l-8 border-primary pl-4 md:pl-6 leading-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg md:text-2xl font-black text-deep mt-12 md:mt-16 mb-6 tracking-tight" {...props} />,
                p: ({node, ...props}) => <p className="mb-6 md:mb-8 whitespace-pre-wrap leading-relaxed text-gray-600" {...props} />,
                strong: ({node, ...props}) => <strong className="font-black text-deep border-b-2 border-accent/40 px-0.5" {...props} />,
                blockquote: ({node, children, ...props}) => {
                  const firstChild = node?.children[0] as any;
                  const firstText = firstChild?.children[0]?.value || '';
                  const match = firstText.match(/^\!\!(INFO|TIP|WARNING|SUCCESS)\]\s*(.*)/i);
                  
                  if (match) {
                    const type = match[1].toUpperCase();
                    const title = match[2] || (type === 'SUCCESS' ? '시공 결과' : type);
                    
                    if (firstChild?.children[0]) {
                      firstChild.children[0].value = firstText.replace(/^\!.*?\\\]\s*/, '');
                    }

                    return (
                      <div className={`my-12 md:my-20 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-2 callout-box callout-${type.toLowerCase()}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center callout-icon">
                            {type === 'INFO' && <Info size={18} />}
                            {type === 'TIP' && <Tag size={18} />}
                            {type === 'WARNING' && <AlertTriangle size={18} />}
                            {type === 'SUCCESS' && <CheckCircle2 size={18} />}
                          </div>
                          <span className="text-[12px] md:text-sm font-black uppercase tracking-widest callout-title">{title}</span>
                        </div>
                        <div className="text-base md:text-xl font-bold leading-relaxed callout-content">
                          {children}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <blockquote className="my-12 md:my-20 py-8 md:py-12 px-10 md:px-16 bg-surface rounded-[2rem] md:rounded-[3.5rem] border border-black/5 relative">
                      <span className="absolute -top-4 left-8 md:-top-8 md:left-12 text-6xl md:text-8xl font-black text-accent/20">"</span>
                      <div className="relative z-10 text-lg md:text-2xl font-black text-primary leading-snug italic keep-all">
                        {children}
                      </div>
                    </blockquote>
                  );
                },
                ul: ({node, ...props}) => <ul className="my-8 md:my-12 space-y-3 md:space-y-4 list-none" {...props} />,
                li: ({node, children, ...props}) => (
                  <li className="relative pl-6 md:pl-8 text-base md:text-lg font-bold text-gray-500">
                    <span className="absolute left-0 text-accent font-black top-1">●</span>
                    <div>{children}</div>
                  </li>
                )
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )
      })
    } catch (e) {
      return (
        <div className="prose-magazine my-12 px-4 md:px-0">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {contentStr.replace(/\n/g, '\n')}
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
            <h1 className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter drop-shadow-2xl">
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
