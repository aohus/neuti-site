/* eslint-disable @typescript-eslint/no-unused-vars -- react-markdown 의 node prop 을 DOM 으로 흘리지 않으려고 구조분해로 버린다 */
import ReactMarkdown from 'react-markdown'
import type { Element } from 'hast'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Info, Tag, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { normalizeMarkdown } from '@/lib/markdown'

/** 시공사례 텍스트 블록용 마크다운. 페이지 h1 은 제목 하나뿐이므로 본문의 # 는 h2 로 내린다. */
export default function PerformanceMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: ({ node, ...props }) => (
          <h2
            className="text-deep border-primary mt-16 mb-8 border-l-4 pl-4 text-xl leading-tight font-black tracking-tight md:mt-24 md:mb-12 md:border-l-8 md:pl-6 md:text-3xl"
            {...props}
          />
        ),
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
        blockquote: ({ node, children }) => {
          // hast 의 blockquote 자식에는 줄바꿈 텍스트 노드가 섞여 들어온다.
          // (텍스트 노드에는 children 이 없으므로) 첫 엘리먼트만 골라야 한다.
          const firstElement = node?.children?.find(
            (child): child is Element => child.type === 'element'
          )
          const firstTextNode = firstElement?.children?.[0] as
            | { value?: unknown }
            | undefined
          const firstText =
            typeof firstTextNode?.value === 'string' ? firstTextNode.value : ''
          const match = firstText.match(
            /^\!\!(INFO|TIP|WARNING|SUCCESS)\]\s*(.*)/i
          )

          if (match) {
            const type = match[1].toUpperCase()
            const title = match[2] || (type === 'SUCCESS' ? '시공 결과' : type)

            if (firstTextNode) {
              firstTextNode.value = firstText.replace(/^\!.*?\\\]\s*/, '')
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
              <span
                aria-hidden="true"
                className="text-accent/20 absolute -top-4 left-8 text-6xl font-black md:-top-8 md:left-12 md:text-8xl"
              >
                &quot;
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
        // 넓은 표가 본문 밖으로 넘치지 않도록 가로 스크롤 컨테이너로 감싼다
        table: ({ node, ...props }) => (
          <div className="my-10 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <table
              className="w-full min-w-[28rem] border-collapse text-base md:text-lg"
              {...props}
            />
          </div>
        ),
        li: ({ node, children }) => (
          <li className="relative pl-6 text-base font-bold text-gray-500 md:pl-8 md:text-lg">
            <span className="text-accent absolute top-1 left-0 font-black">
              ●
            </span>
            <div>{children}</div>
          </li>
        ),
      }}
    >
      {normalizeMarkdown(source)}
    </ReactMarkdown>
  )
}
