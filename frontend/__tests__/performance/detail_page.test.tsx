import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import PerformanceDetailPage, { generateMetadata } from '@/app/performance/[id]/page'
import { Performance } from '@/types/performance'
import fixture from '../fixtures/performance-13.json'

const performance = {
  ...(fixture as unknown as Performance),
  updated_at: '2026-09-01T00:00:00Z',
} as Performance

const mockServerFetch = jest.fn()
const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('@/lib/serverApi', () => ({
  serverFetch: (...args: unknown[]) => mockServerFetch(...args),
}))
jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
  useRouter: () => ({ push: jest.fn() }),
}))
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false }),
}))

const params = (id: string) => ({ params: Promise.resolve({ id }) })

beforeEach(() => {
  mockServerFetch.mockReset()
  mockNotFound.mockClear()
  mockServerFetch.mockResolvedValue(performance)
})

describe('generateMetadata', () => {
  it('제목·설명·canonical·OG 이미지를 사례별로 만든다', async () => {
    const meta = await generateMetadata(params('13'))

    expect(meta.title).toEqual({ absolute: '녹지대 관리공사 | 느티나무병원 협동조합' })
    expect(String(meta.description).length).toBeLessThanOrEqual(150)
    expect(String(meta.description)).toContain('도촌동')
    expect(String(meta.description)).not.toMatch(/[*#|]/)
    expect(meta.alternates?.canonical).toBe('/performance/13')
    const og = meta.openGraph as { type?: string; images?: { url: string }[] }
    expect(og.type).toBe('article')
    expect(og.images?.[0].url).toBe(performance.thumbnail_url)
  })

  it('부제목이 짧으면 제목에 붙인다', async () => {
    mockServerFetch.mockResolvedValue({ ...performance, subtitle: '예초 관리' })
    const meta = await generateMetadata(params('13'))
    expect(meta.title).toEqual({ absolute: '녹지대 관리공사 - 예초 관리 | 느티나무병원 협동조합' })
  })

  it('없는 사례는 빈 메타데이터(크래시 없음)', async () => {
    mockServerFetch.mockResolvedValue(null)
    await expect(generateMetadata(params('999'))).resolves.toEqual({})
  })

  it('숫자가 아닌 id 는 백엔드를 부르지 않는다', async () => {
    await expect(generateMetadata(params('abc'))).resolves.toEqual({})
    expect(mockServerFetch).not.toHaveBeenCalled()
  })
})

describe('PerformanceDetailPage', () => {
  it('없는 사례는 notFound() 를 호출한다', async () => {
    mockServerFetch.mockResolvedValue(null)
    await expect(PerformanceDetailPage(params('999'))).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockNotFound).toHaveBeenCalled()
  })

  it.each(['abc', '1.5', '-3', '0', '12abc'])('잘못된 id(%s)는 notFound()', async (id) => {
    await expect(PerformanceDetailPage(params(id))).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockServerFetch).not.toHaveBeenCalled()
  })

  it('서버 HTML 에 h1 이 정확히 하나이고 제목이다', async () => {
    const { container } = render(await PerformanceDetailPage(params('13')))
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('녹지대 관리공사')
  })

  it('본문 블록을 렌더링한다(인용문 포함)', async () => {
    const { container } = render(await PerformanceDetailPage(params('13')))
    expect(container.querySelector('blockquote')?.textContent).toContain('나일론 줄')
  })

  it('영어 라벨 대신 한국어 라벨을 쓴다', async () => {
    const { container } = render(await PerformanceDetailPage(params('13')))
    expect(screen.getAllByText('발주처').length).toBeGreaterThan(0)
    expect(screen.getByText('시공 시기')).toBeInTheDocument()
    expect(screen.getByText('공사 개요')).toBeInTheDocument()
    for (const en of ['Client', 'Date', 'Project Info', 'Thank you for watching']) {
      expect(container.textContent).not.toContain(en)
    }
  })

  it('이미지 alt 는 실제 설명이거나 제목이며 Content N 형태가 없다', async () => {
    const { container } = render(await PerformanceDetailPage(params('13')))
    const imgs = Array.from(container.querySelectorAll('img'))
    expect(imgs.length).toBeGreaterThan(1)
    for (const img of imgs) {
      expect(img.getAttribute('alt')).toBeTruthy()
      expect(img.getAttribute('alt')).not.toMatch(/^Content/)
    }
    expect(imgs[0]).toHaveAttribute('fetchpriority', 'high')
    for (const img of imgs.slice(1)) expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('날짜·연도를 time 요소로 렌더링한다', async () => {
    mockServerFetch.mockResolvedValue({ ...performance, construction_date: '2025-09-16' })
    const { container } = render(await PerformanceDetailPage(params('13')))
    const time = container.querySelector('time')
    expect(time).toHaveAttribute('datetime', '2025-09-16')
    expect(time).toHaveTextContent('2025년 9월 16일')
  })

  describe('JSON-LD', () => {
    async function ld() {
      const { container } = render(await PerformanceDetailPage(params('13')))
      const scripts = Array.from(
        container.querySelectorAll('script[type="application/ld+json"]')
      )
      return {
        raw: scripts.map((s) => s.innerHTML),
        data: scripts.map((s) => JSON.parse(s.innerHTML)),
      }
    }

    it('Article 을 절대 URL·날짜·발행자와 함께 낸다', async () => {
      const { data } = await ld()
      const article = data.find((d) => d['@type'] === 'Article')
      expect(article.headline).toBe('녹지대 관리공사')
      expect(article.image[0]).toMatch(/^https?:\/\/.+\/uploads\//)
      expect(article.datePublished).toBe(performance.created_at)
      expect(article.dateModified).toBe('2026-09-01T00:00:00Z')
      expect(article.publisher['@type']).toBe('Organization')
      expect(article.publisher.logo.url).toMatch(/\/brand\/logo\.svg$/)
      expect(article.mainEntityOfPage['@id']).toMatch(/\/performance\/13$/)
    })

    it('updated_at 이 없으면 dateModified 는 created_at', async () => {
      mockServerFetch.mockResolvedValue({ ...performance, updated_at: undefined })
      const { data } = await ld()
      expect(data.find((d) => d['@type'] === 'Article').dateModified).toBe(performance.created_at)
    })

    it('BreadcrumbList 는 홈 → 시공사례 → 제목', async () => {
      const { data } = await ld()
      const crumbs = data.find((d) => d['@type'] === 'BreadcrumbList')
      expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual([
        '홈',
        '시공사례',
        '녹지대 관리공사',
      ])
      expect(crumbs.itemListElement[2].position).toBe(3)
    })

    it('< 를 이스케이프해 script 탈출을 막는다', async () => {
      mockServerFetch.mockResolvedValue({ ...performance, title: 'x</script><b>' })
      const { raw } = await ld()
      for (const r of raw) expect(r).not.toContain('<')
    })
  })
})
