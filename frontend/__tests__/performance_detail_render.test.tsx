import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import PerformanceDetailPage from '@/app/performance/[id]/page'
import { Performance } from '@/types/performance'
import fixture from './fixtures/performance-13.json'

// 실제 운영 API(/backend-api/performance/13)에서 받은 '녹지대 관리공사' 본문.
// 커밋 직후 상세 페이지가 client-side exception 으로 죽던 케이스의 재현 데이터.
const performance = fixture as unknown as Performance

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '13' }),
  useRouter: () => ({ push: jest.fn() })
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false })
}))

jest.mock('@/hooks/usePerformance', () => ({
  usePerformance: () => ({ performance, isLoading: false, error: null })
}))

describe('PerformanceDetailPage - 실제 시공사례 본문 렌더링', () => {
  it('녹지대 관리공사 본문을 예외 없이 렌더링한다', () => {
    expect(() => render(<PerformanceDetailPage />)).not.toThrow()

    expect(screen.getByRole('heading', { name: '녹지대 관리공사' })).toBeInTheDocument()
  })

  it('인용문(blockquote) 블록을 내용과 함께 렌더링한다', () => {
    const { container } = render(<PerformanceDetailPage />)

    const blockquote = container.querySelector('blockquote')

    expect(blockquote).not.toBeNull()
    expect(blockquote?.textContent).toContain('기술 포인트')
    expect(blockquote?.textContent).toContain('나일론 줄')
  })
})
