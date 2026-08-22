import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import RecentPortfolio, {
  RECENT_PORTFOLIO_LIMIT,
} from '@/components/home/RecentPortfolio'
import { performanceApi } from '@/lib/performanceApi'
import type { Performance } from '@/types/performance'

jest.mock('@/lib/performanceApi', () => ({
  performanceApi: { getPerformances: jest.fn() },
}))

const mockGet = performanceApi.getPerformances as jest.Mock

const makePerformance = (id: number): Performance =>
  ({
    id,
    title: `시공사례 ${id}`,
    subtitle: `부제목 ${id}`,
    client: `발주처 ${id}`,
    thumbnail_url: `/uploads/${id}.jpg`,
    job_main_category: '녹지관리',
  }) as Performance

describe('RecentPortfolio', () => {
  beforeEach(() => jest.clearAllMocks())

  it('최신 시공사례를 정해진 건수만큼 요청한다', async () => {
    mockGet.mockResolvedValue([makePerformance(1)])
    render(<RecentPortfolio />)

    await waitFor(() =>
      expect(mockGet).toHaveBeenCalledWith(0, RECENT_PORTFOLIO_LIMIT)
    )
  })

  it('제목과 부제목, 발주처를 함께 보여준다', async () => {
    mockGet.mockResolvedValue([makePerformance(1)])
    render(<RecentPortfolio />)

    expect(await screen.findByText('시공사례 1')).toBeInTheDocument()
    expect(screen.getByText('부제목 1')).toBeInTheDocument()
    expect(screen.getByText('발주처 1')).toBeInTheDocument()
  })

  it('각 카드는 상세 페이지로 연결한다', async () => {
    mockGet.mockResolvedValue([makePerformance(7)])
    render(<RecentPortfolio />)

    const link = await screen.findByRole('link', { name: /시공사례 7/ })
    expect(link).toHaveAttribute('href', '/performance/7')
  })

  it('조회에 실패해도 섹션 전체가 사라져 홈이 비지 않는다', async () => {
    mockGet.mockRejectedValue(new Error('network'))
    const { container } = render(<RecentPortfolio />)

    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('등록된 사례가 없으면 빈 섹션을 렌더링하지 않는다', async () => {
    mockGet.mockResolvedValue([])
    const { container } = render(<RecentPortfolio />)

    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('전체 시공사례 목록으로 연결한다', async () => {
    mockGet.mockResolvedValue([makePerformance(1)])
    render(<RecentPortfolio />)

    const link = await screen.findByRole('link', { name: /전체 시공사례/ })
    expect(link).toHaveAttribute('href', '/performance')
  })
})

/**
 * 회귀 방지 — `/uploads/*` 는 next/image 최적화를 거치면 안 된다.
 *
 * uploads 는 프론트 컨테이너의 public/ 에 없고 next.config 의 rewrite 로
 * 백엔드에서 프록시된다. 그런데 이미지 최적화기는 로컬 경로를 처리할 때
 * 이 rewrite 를 타지 않아서, 운영에서 /_next/image 가 400
 * ("The requested resource isn't a valid image") 을 내고 썸네일이 전부 깨졌다.
 * public/ 이미지(기술력 섹션 등)는 정상이라 uploads 만의 문제다.
 */
describe('RecentPortfolio 썸네일 경로', () => {
  beforeEach(() => jest.clearAllMocks())

  it('업로드 썸네일을 /_next/image 로 감싸지 않고 원본 경로로 내보낸다', async () => {
    mockGet.mockResolvedValue([makePerformance(7)])
    render(<RecentPortfolio />)

    const img = await screen.findByAltText('시공사례 7')
    expect(img.getAttribute('src')).toBe('/uploads/7.jpg')
  })
})
