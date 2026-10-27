import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import PerformancePage, { dynamic } from '@/app/performance/page'
import { metadata } from '@/app/performance/layout'
import { Performance } from '@/types/performance'

const mockServerFetch = jest.fn()
const mockGetPerformances = jest.fn()

jest.mock('@/lib/serverApi', () => ({
  serverFetch: (...args: unknown[]) => mockServerFetch(...args),
}))
jest.mock('@/lib/performanceApi', () => ({
  performanceApi: { getPerformances: (...a: unknown[]) => mockGetPerformances(...a) },
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false }),
}))

const items = [
  { id: 1, title: '○○구청 가로수 수목전정', subtitle: '고사지 제거', client: '○○구청',
    client_type: '공공기관', job_main_category: '수목전정', site_type: '도로',
    thumbnail_url: '/uploads/a.jpg', year: 2024 },
  { id: 2, title: '△△아파트 화단 꽃식재', subtitle: '계절꽃 교체', client: '△△아파트',
    client_type: '아파트', job_main_category: '꽃식재', site_type: '아파트',
    thumbnail_url: '/uploads/b.jpg', year: 2023 },
] as unknown as Performance[]

beforeEach(() => {
  mockServerFetch.mockReset()
  mockGetPerformances.mockReset()
  mockServerFetch.mockResolvedValue(items)
})

describe('/performance (server)', () => {
  it('빌드 시점 프리렌더를 막기 위해 force-dynamic 이다', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  it('서버에서 받은 목록을 첫 HTML 에 링크로 낸다', async () => {
    render(await PerformancePage())

    expect(mockServerFetch).toHaveBeenCalledWith('/performance?limit=100')
    expect(screen.queryByText('기록을 불러오고 있습니다...')).not.toBeInTheDocument()
    const link = screen.getByRole('link', { name: /○○구청 가로수 수목전정/ })
    expect(link).toHaveAttribute('href', '/performance/1')
    expect(screen.getByRole('link', { name: /△△아파트/ })).toHaveAttribute('href', '/performance/2')
  })

  it('h1 이 정확히 하나이고 "시공 사례" 이다', async () => {
    const { container } = render(await PerformancePage())
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: '시공 사례' })).toBeInTheDocument()
  })

  it('필터 동작을 유지한다', async () => {
    render(await PerformancePage())
    fireEvent.change(screen.getByDisplayValue('전체 작업'), { target: { value: '수목전정' } })
    expect(screen.getByText('○○구청 가로수 수목전정')).toBeInTheDocument()
    expect(screen.queryByText('△△아파트 화단 꽃식재')).not.toBeInTheDocument()
  })

  it('서버 fetch 가 실패하면 로그만 남기고 클라이언트 fetch 로 대체한다', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockServerFetch.mockRejectedValue(new Error('down'))
    mockGetPerformances.mockResolvedValue(items)

    render(await PerformancePage())

    expect(err).toHaveBeenCalled()
    expect(mockGetPerformances).toHaveBeenCalled()
    expect(await screen.findByText('○○구청 가로수 수목전정')).toBeInTheDocument()
    err.mockRestore()
  })
})

describe('/performance layout metadata', () => {
  it('canonical 과 OG 를 buildMetadata 로 채운다', () => {
    expect(metadata.title).toEqual({ absolute: '시공사례 | 느티나무병원 협동조합' })
    expect(metadata.alternates?.canonical).toBe('/performance')
    const og = metadata.openGraph as { title?: string; url?: string; siteName?: string }
    expect(og.title).toBe('시공사례 | 느티나무병원 협동조합')
    expect(og.url).toBe('/performance')
    expect(og.siteName).toBe('느티나무병원 협동조합')
  })
})
