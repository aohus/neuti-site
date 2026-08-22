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
