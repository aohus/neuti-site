import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import PerformancePage from '@/app/performance/page'
import { Performance } from '@/types/performance'

// 시공사례는 정적 json 이 아니라 usePerformances(백엔드 API) 로 읽는다
const mockPerformances = [
  {
    id: 1,
    title: '○○구청 가로수 수목전정',
    subtitle: '고사지 제거와 수형 정리',
    client: '○○구청',
    client_type: '공공기관',
    job_main_category: '수목전정',
    site_type: '도로',
    thumbnail_url: '/uploads/a.jpg',
    year: 2024,
  },
  {
    id: 2,
    title: '△△아파트 화단 꽃식재',
    subtitle: '계절꽃 교체 식재',
    client: '△△아파트',
    client_type: '아파트',
    job_main_category: '꽃식재',
    site_type: '아파트',
    thumbnail_url: '/uploads/b.jpg',
    year: 2023,
  },
] as unknown as Performance[]

const mockUsePerformances = jest.fn()

jest.mock('@/hooks/usePerformance', () => ({
  usePerformances: () => mockUsePerformances(),
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false }),
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

type NextImageMockProps = React.ComponentProps<'img'> & {
  fill?: boolean
  priority?: boolean
}

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill, priority, ...props }: NextImageMockProps) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))

describe('PerformancePage', () => {
  beforeEach(() => {
    mockUsePerformances.mockReturnValue({
      performances: mockPerformances,
      isLoading: false,
      refresh: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page heading', () => {
    render(<PerformancePage />)

    expect(screen.getByText('시공 사례')).toBeInTheDocument()
  })

  it('renders a card for each performance', () => {
    render(<PerformancePage />)

    expect(screen.getByText('○○구청 가로수 수목전정')).toBeInTheDocument()
    expect(screen.getByText('△△아파트 화단 꽃식재')).toBeInTheDocument()
  })

  it('derives filter options from the loaded performances', () => {
    render(<PerformancePage />)

    const jobFilter = screen.getByDisplayValue('전체 작업')

    expect(jobFilter).toContainHTML('<option value="수목전정">수목전정</option>')
    expect(jobFilter).toContainHTML('<option value="꽃식재">꽃식재</option>')
  })

  it('filters the grid by job category', () => {
    render(<PerformancePage />)

    fireEvent.change(screen.getByDisplayValue('전체 작업'), {
      target: { value: '수목전정' },
    })

    expect(screen.getByText('○○구청 가로수 수목전정')).toBeInTheDocument()
    expect(screen.queryByText('△△아파트 화단 꽃식재')).not.toBeInTheDocument()
  })

  it('shows the empty state when a filter matches nothing', () => {
    render(<PerformancePage />)

    fireEvent.change(screen.getByDisplayValue('전체 대상지'), {
      target: { value: '도로' },
    })
    fireEvent.change(screen.getByDisplayValue('전체 발주처'), {
      target: { value: '아파트' },
    })

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument()
  })

  it('shows a loading indicator while fetching', () => {
    mockUsePerformances.mockReturnValue({
      performances: [],
      isLoading: true,
      refresh: jest.fn(),
    })

    render(<PerformancePage />)

    expect(screen.getByText('기록을 불러오고 있습니다...')).toBeInTheDocument()
  })

  it('hides the admin registration button for anonymous visitors', () => {
    render(<PerformancePage />)

    expect(screen.queryByText('사례 등록하기')).not.toBeInTheDocument()
  })
})
