import PerformanceMarkdown from './PerformanceMarkdown'
import { parseBlocks } from './content'
import { normalizeMarkdown } from '@/lib/markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface ImageData {
  url: string
  alt: string
}

interface BodyProps {
  content: string
  /** 이미지 alt 의 대체값(캡션이 없을 때) */
  title: string
}

// 도메인 없이 상대 경로(/uploads/...)만 반환하여 Proxy 이용
const toUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url.startsWith('/') ? url : `/${url}`
}

function toImage(raw: unknown): ImageData {
  if (typeof raw === 'string') {
    if (raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw)
        return { url: String(parsed.url ?? ''), alt: String(parsed.alt ?? '') }
      } catch {
        // 파싱 실패 시 원본 그대로 URL 로 취급
      }
    }
    return { url: raw, alt: '' }
  }
  const obj = (raw ?? {}) as Partial<ImageData>
  return { url: String(obj.url ?? ''), alt: String(obj.alt ?? '') }
}

function ImageBlock({ value, title }: { value: string; title: string }) {
  const img = toImage(value)
  return (
    <div className="my-16 px-2 text-center md:my-24 md:px-0">
      <img
        src={toUrl(img.url)}
        alt={img.alt || title}
        loading="lazy"
        className="mb-6 w-full rounded-[2rem] border-4 border-white shadow-2xl md:rounded-[3rem] md:border-8"
      />
      {img.alt && (
        <p className="px-4 text-sm font-bold tracking-tight text-gray-400 md:text-base">
          {img.alt}
        </p>
      )}
    </div>
  )
}

function ImageRowBlock({ value, title }: { value: string; title: string }) {
  let items: unknown[]
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    items = parsed
  } catch {
    return null
  }
  const isBeforeAfter = items.length === 2

  return (
    <div className="my-16 px-2 md:my-24 md:px-0">
      <div
        className={`grid grid-cols-1 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} mb-6 gap-6 md:gap-8`}
      >
        {items.map((item, idx) => {
          const img = toImage(item)
          return (
            <div key={idx} className="group/img relative text-center">
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-white shadow-xl transition-all duration-500 group-hover/img:shadow-2xl md:rounded-[2.5rem] md:border-4">
                <img
                  src={toUrl(img.url)}
                  alt={img.alt || title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                />
                {isBeforeAfter && (
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span
                      className={`rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase shadow-lg md:px-4 md:py-1.5 md:text-[10px] ${idx === 0 ? 'text-deep bg-white' : 'bg-accent text-white'}`}
                    >
                      {idx === 0 ? '시공 전' : '시공 후'}
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
}

/** 시공사례 본문(JSON 블록 또는 구형 HTML/마크다운)을 렌더링한다. 서버 컴포넌트로 쓸 수 있다. */
export default function PerformanceBody({ content, title }: BodyProps) {
  const blocks = parseBlocks(content)

  if (!blocks) {
    // JSON 이 아닌 구형 데이터: HTML 이 저장된 경우와 순수 마크다운
    if (content.includes('<p>') || content.includes('<img') || content.includes('<h')) {
      return (
        <div
          className="prose-magazine my-12 px-4 md:px-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    return (
      <div className="prose-magazine my-12 px-4 md:px-0">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {normalizeMarkdown(content)}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'image') {
          return <ImageBlock key={index} value={block.value} title={title} />
        }
        if (block.type === 'image_row') {
          return <ImageRowBlock key={index} value={block.value} title={title} />
        }
        return (
          <div key={index} className="prose-magazine my-10 px-4 md:my-16 md:px-0">
            <PerformanceMarkdown source={block.value} />
          </div>
        )
      })}
    </>
  )
}
