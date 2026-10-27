import { buildRssXml, collectRssItems } from '@/lib/rss'
import { SITE_URL } from '@/lib/seo'

const performance = {
  id: 7,
  title: '순환로 가로수 <방제> & 전정',
  subtitle: '새벽 수간 살포',
  thumbnail_url: '/uploads/a.jpg',
  job_main_category: '방제',
  summary: '성남시 중원구 순환로 가로수 방제',
  created_at: '2026-08-13T00:00:00Z',
  updated_at: '2026-09-01T00:00:00Z',
}

const notice = { id: 3, title: '휴무 안내', content: '## 추석\n\n휴무입니다.', created_at: '2026-09-20T00:00:00Z' }

describe('collectRssItems', () => {
  it('시공사례와 공지를 최신순으로 합친다', () => {
    const items = collectRssItems([performance], [notice])

    expect(items.map((i) => i.link)).toEqual([`${SITE_URL}/notice/3`, `${SITE_URL}/performance/7`])
  })

  it('시공사례 제목에 부제를 붙이고 요약을 설명으로 쓴다', () => {
    const [item] = collectRssItems([performance], [])

    expect(item.title).toBe('순환로 가로수 <방제> & 전정 — 새벽 수간 살포')
    expect(item.description).toBe('성남시 중원구 순환로 가로수 방제')
    expect(item.category).toBe('방제')
  })

  it('공지 본문은 소제목·마크다운 기호를 걷어 설명으로 쓴다', () => {
    const [item] = collectRssItems([], [notice])
    expect(item.description).toBe('휴무입니다.')
  })
})

describe('buildRssXml', () => {
  const xml = buildRssXml(collectRssItems([performance], [notice]))

  it('RSS 2.0 채널 정보를 담는다', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain(`<link>${SITE_URL}</link>`)
    expect(xml).toContain('<language>ko</language>')
  })

  it('특수문자를 XML 이스케이프한다', () => {
    expect(xml).toContain('순환로 가로수 &lt;방제&gt; &amp; 전정')
    expect(xml).not.toContain('<방제>')
  })

  it('항목마다 guid 와 RFC 822 pubDate 를 넣는다', () => {
    expect(xml).toContain(`<guid isPermaLink="true">${SITE_URL}/performance/7</guid>`)
    expect(xml).toContain('<pubDate>Thu, 13 Aug 2026 00:00:00 GMT</pubDate>')
  })
})
