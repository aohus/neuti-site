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
            const imgData =
              typeof block.value === 'string' && block.value.startsWith('{')
                ? JSON.parse(block.value)
                : { url: block.value, alt: '' }

            const url = getFullUrl(imgData.url)
            return (
              <div
                key={index}
                className="my-16 px-2 text-center md:my-24 md:px-0"
              >
                <img
                  src={url}
                  alt={imgData.alt || `Content ${index}`}
                  className="mb-6 w-full rounded-[2rem] border-4 border-white shadow-2xl md:rounded-[3rem] md:border-8"
                />
                {imgData.alt && (
                  <p className="px-4 text-sm font-bold tracking-tight text-gray-400 md:text-base">
                    {imgData.alt}
                  </p>
                )}
              </div>
            )
          } catch (err) {
            // 파싱 실패 시 원본 그대로 출력 시도
            const url = getFullUrl(block.value)
            return (
              <div key={index} className="my-16 px-2 md:my-24 md:px-0">
                <img
                  src={url}
                  alt=""
                  className="w-full rounded-[2rem] border-4 border-white shadow-2xl md:rounded-[3rem] md:border-8"
                />
              </div>
            )
          }
        }
        if (block.type === 'image_row') {
          try {
            const items = JSON.parse(block.value)
            const isBeforeAfter = items.length === 2

            return (
              <div key={index} className="my-16 px-2 md:my-24 md:px-0">
                <div
                  className={`grid grid-cols-1 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} mb-6 gap-6 md:gap-8`}
                >
                  {items.map((item: any, imgIdx: number) => {
                    const img =
                      typeof item === 'string' ? { url: item, alt: '' } : item
                    const url = getFullUrl(img.url)
                    return (
                      <div
                        key={imgIdx}
                        className="group/img relative text-center"
                      >
                        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-white shadow-xl transition-all duration-500 group-hover/img:shadow-2xl md:rounded-[2.5rem] md:border-4">
                          <img
                            src={url}
                            alt={img.alt || `Content Row ${index}-${imgIdx}`}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                          />
                          {isBeforeAfter && (
                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                              <span
                                className={`rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase shadow-lg md:px-4 md:py-1.5 md:text-[10px] ${imgIdx === 0 ? 'text-deep bg-white' : 'bg-accent text-white'}`}
                              >
                                {imgIdx === 0 ? 'Before' : 'After'}
                              </span>
                            </div>
                          )}
                        </div>
                        {img.alt && (
                          <p className="px-2 text-xs font-bold tracking-tight text-gray-400 opacity-80 transition-opacity group-hover/img:opacity-100 md:text-sm">
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
        const markdown = block.value.replace(/\n/g, '\n')

        return (
          <div
            key={index}
            className="prose-magazine my-10 px-4 md:my-16 md:px-0"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-deep border-primary mt-16 mb-8 border-l-4 pl-4 text-xl leading-tight font-black tracking-tight md:mt-24 md:mb-12 md:border-l-8 md:pl-6 md:text-3xl"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-deep mt-12 mb-6 text-lg font-black tracking-tight md:mt-16 md:text-2xl"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    className="mb-6 leading-relaxed whitespace-pre-wrap text-gray-600 md:mb-8"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-deep border-accent/40 border-b-2 px-0.5 font-black"
                    {...props}
                  />
                ),
                blockquote: ({ node, children, ...props }) => {
                  const firstChild = node?.children[0] as any
                  const firstText = firstChild?.children[0]?.value || ''
                  const match = firstText.match(
                    /^\!\!(INFO|TIP|WARNING|SUCCESS)\]\s*(.*)/i
                  )

                  if (match) {
                    const type = match[1].toUpperCase()
                    const title =
                      match[2] || (type === 'SUCCESS' ? '시공 결과' : type)

                    if (firstChild?.children[0]) {
                      firstChild.children[0].value = firstText.replace(
                        /^\!.*?\\\]\s*/,
                        ''
                      )
                    }

                    return (
                      <div
                        className={`callout-box my-12 rounded-[2rem] border-2 p-8 md:my-20 md:rounded-[2.5rem] md:p-12 callout-${type.toLowerCase()}`}
                      >
                        <div className="mb-6 flex items-center gap-4">
                          <div className="callout-icon flex h-8 w-8 items-center justify-center rounded-full md:h-10 md:w-10">
                            {type === 'INFO' && <Info size={18} />}
                            {type === 'TIP' && <Tag size={18} />}
                            {type === 'WARNING' && <AlertTriangle size={18} />}
                            {type === 'SUCCESS' && <CheckCircle2 size={18} />}
                          </div>
                          <span className="callout-title text-[12px] font-black tracking-widest uppercase md:text-sm">
                            {title}
                          </span>
                        </div>
                        <div className="callout-content text-base leading-relaxed font-bold md:text-xl">
                          {children}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <blockquote className="bg-surface relative my-12 rounded-[2rem] border border-black/5 px-10 py-8 md:my-20 md:rounded-[3.5rem] md:px-16 md:py-12">
                      <span className="text-accent/20 absolute -top-4 left-8 text-6xl font-black md:-top-8 md:left-12 md:text-8xl">
                        "
                      </span>
                      <div className="text-primary keep-all relative z-10 text-lg leading-snug font-black italic md:text-2xl">
                        {children}
                      </div>
                    </blockquote>
                  )
                },
                ul: ({ node, ...props }) => (
                  <ul
                    className="my-8 list-none space-y-3 md:my-12 md:space-y-4"
                    {...props}
                  />
                ),
                li: ({ node, children, ...props }) => (
                  <li className="relative pl-6 text-base font-bold text-gray-500 md:pl-8 md:text-lg">
                    <span className="text-accent absolute top-1 left-0 font-black">
                      ●
                    </span>
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
      // JSON 파싱 실패 시: HTML 또는 마크다운 콘텐츠 처리
      if (contentStr.includes('<p>') || contentStr.includes('<img') || contentStr.includes('<h')) {
        // 이미 HTML인 경우 (이전 수정으로 HTML이 저장된 데이터 대응)
        return (
          <div
            className="prose-magazine my-12 px-4 md:px-0"
            dangerouslySetInnerHTML={{ __html: contentStr }}
          />
        )
      }
      return (
        <div className="prose-magazine my-12 px-4 md:px-0">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {contentStr.replace(/\n/g, '\n')}
          </ReactMarkdown>
        </div>
      )
    }
  }

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-green-700"></div>
      </div>
    )

  if (error || !performance)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="mb-6 text-xl text-gray-500">
          {error || '게시글을 찾을 수 없습니다.'}
        </p>
        <Link
          href="/performance"
          className="flex items-center gap-2 font-bold text-green-700 hover:underline"
        >
          <ChevronLeft size={20} /> 목록으로 돌아가기
        </Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image Section */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        {performance.thumbnail_url ? (
          <img
            src={performance.thumbnail_url}
            alt={performance.title}
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="h-full w-full bg-green-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
            <Link
              href="/performance"
              className="group mb-10 inline-flex items-center text-white/80 transition-colors hover:text-white"
            >
              <ChevronLeft
                size={24}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-base font-bold tracking-tight">
                시공 사례 목록으로
              </span>
            </Link>
            <h1 className="mb-10 text-4xl leading-tight font-black tracking-tighter text-white drop-shadow-2xl md:text-7xl">
              {performance.title}
            </h1>
            <div className="flex flex-wrap items-center gap-10 text-white/90">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-lg">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-black tracking-widest text-white/60 uppercase">
                    Client
                  </p>
                  <p className="text-lg font-black">
                    {performance.client || '느티나무병원 협동조합'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-md">
                  <Calendar size={28} className="text-white" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-black tracking-widest text-white/60 uppercase">
                    Date
                  </p>
                  <p className="text-lg font-black">
                    {performance.construction_date
                      ? new Date(
                          performance.construction_date
                        ).toLocaleDateString()
                      : '날짜 미지정'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8 lg:px-10">
        <div className="mb-16 grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {isAdmin && (
              <div className="mb-8 flex justify-end gap-3">
                <Link
                  href={`/performance/${id}/edit`}
                  className="flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-2.5 font-bold text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md"
                >
                  <Edit size={18} /> 수정하기
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-2.5 font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
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
            <div className="sticky top-24 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-8 shadow-sm">
              <h3 className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-green-600 uppercase">
                <Info size={14} /> Project Info
              </h3>

              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    발주처
                  </p>
                  <p className="font-black text-gray-900">
                    {performance.client || '-'}
                  </p>
                </div>

                {performance.year && (
                  <div>
                    <p className="mb-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      연도
                    </p>
                    <p className="font-black text-gray-900">
                      {performance.year}년
                    </p>
                  </div>
                )}

                {(performance.job_main_category ||
                  performance.job_sub_category) && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      <Tag size={10} /> 작업분류
                    </p>
                    <p className="font-black text-gray-900">
                      {performance.job_main_category || '-'}
                    </p>
                    {performance.job_sub_category && (
                      <p className="mt-1 text-sm font-bold text-gray-500">
                        {performance.job_sub_category}
                      </p>
                    )}
                  </div>
                )}

                {(performance.site_type || performance.site_location) && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      <Map size={10} /> 대상지
                    </p>
                    <p className="font-black text-gray-900">
                      {performance.site_location || '-'}
                    </p>
                    {performance.site_type && (
                      <span className="mt-2 inline-block rounded-lg bg-green-100 px-3 py-1 text-[10px] font-black text-green-700">
                        {performance.site_type}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center border-t border-gray-100 pt-16">
          <p className="mb-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
            Thank you for watching
          </p>
          <Link
            href="/performance"
            className="rounded-2xl bg-green-700 px-10 py-5 text-lg font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-green-800 hover:shadow-2xl"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
