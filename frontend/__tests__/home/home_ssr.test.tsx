import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Home, { metadata, dynamic } from '@/app/page'
import { serverFetch } from '@/lib/serverApi'

jest.mock('@/lib/serverApi', () => ({ serverFetch: jest.fn() }))
jest.mock('@/context/AuthContext', () => ({ useAuth: () => ({ isAdmin: false }) }))
function mockStub(name: string, section?: string) {
  const Stub = () => <div data-section={section} />
  Stub.displayName = name
  return Stub
}
jest.mock('@/components/common/MainCarousel', () => ({ __esModule: true, default: mockStub('MainCarousel', 'hero') }))
jest.mock('@/components/home/ClientLogos', () => ({ __esModule: true, default: mockStub('ClientLogos') }))
jest.mock('@/components/home/WhyUs', () => ({ __esModule: true, default: mockStub('WhyUs') }))
jest.mock('@/components/common/FinalCTA', () => ({ __esModule: true, default: mockStub('FinalCTA') }))
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

const mockFetch = serverFetch as jest.Mock

const perf = (id: number) => ({
  id,
  title: `사례 ${id}`,
  subtitle: null,
  client: null,
  thumbnail_url: `uploads/${id}.jpg`,
  job_main_category: '녹지관리',
})

const techItem = {
  id: 1,
  item_key: 'k1',
  title: '서버제공 기술 탭',
  description: null,
  doctor_note: null,
  key_points: null,
  images: [],
  sort_order: 0,
  created_at: '2026-01-01',
  updated_at: null,
}

function route(map: Record<string, unknown>) {
  mockFetch.mockImplementation(async (path: string) => {
    for (const [prefix, value] of Object.entries(map)) {
      if (path.startsWith(prefix)) {
        if (value instanceof Error) throw value
        return value
      }
    }
    return null
  })
}

describe('Home 서버 렌더링', () => {
  let errSpy: jest.SpyInstance
  beforeEach(() => {
    jest.clearAllMocks()
    errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => errSpy.mockRestore())

  it('서버에서 받은 최근 시공사례를 초기 HTML 의 링크로 렌더링한다', async () => {
    route({ '/performance': [perf(3), perf(4)], '/technology-item': [techItem] })
    const { container } = render(await Home())

    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/performance/3')
    expect(hrefs).toContain('/performance/4')
    expect(container.querySelector('img[alt="사례 3"]')?.getAttribute('src')).toBe(
      '/backend-api/thumb/960/3.jpg',
    )
  })

  it('서버에서 받은 기술력 항목을 탭으로 렌더링한다', async () => {
    route({ '/performance': [], '/technology-item': [techItem] })
    const { getByRole } = render(await Home())
    expect(getByRole('button', { name: '서버제공 기술 탭' })).toBeInTheDocument()
  })

  it('조회가 실패하면 로그만 남기고 정적 폴백으로 홈을 렌더링한다', async () => {
    route({ '/performance': new Error('down'), '/technology-item': new Error('down') })
    const { container } = render(await Home())

    expect(errSpy).toHaveBeenCalled()
    expect(container.querySelector('[data-section="recent-portfolio"]')).toBeNull()
    expect(container.querySelector('[data-section="technology"]')).not.toBeNull()
  })

  it('빌드 시점 프리렌더를 막는다 (CI 빌드에서 백엔드 접근 불가)', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  it('canonical 을 / 로 선언한다', () => {
    expect(metadata.alternates?.canonical).toBe('/')
  })
})
