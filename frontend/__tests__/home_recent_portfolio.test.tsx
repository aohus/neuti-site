import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RecentPortfolio from '@/components/home/RecentPortfolio'
import type { Performance } from '@/types/performance'

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
  it('제목과 부제목, 발주처를 함께 보여준다', () => {
    render(<RecentPortfolio items={[makePerformance(1)]} />)

    expect(screen.getByText('시공사례 1')).toBeInTheDocument()
    expect(screen.getByText('부제목 1')).toBeInTheDocument()
    expect(screen.getByText('발주처 1')).toBeInTheDocument()
  })

  it('각 카드는 상세 페이지로 연결한다', () => {
    render(<RecentPortfolio items={[makePerformance(7)]} />)

    const link = screen.getByRole('link', { name: /시공사례 7/ })
    expect(link).toHaveAttribute('href', '/performance/7')
  })

  it('등록된 사례가 없으면 빈 섹션을 렌더링하지 않는다', () => {
    const { container } = render(<RecentPortfolio items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('전체 시공사례 목록으로 연결한다', () => {
    render(<RecentPortfolio items={[makePerformance(1)]} />)

    const link = screen.getByRole('link', { name: /전체 시공사례/ })
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
 *
 * 대신 백엔드 썸네일 API(/backend-api/thumb)로 줄인 사본을 쓴다. 원본(1600px)을
 * 카드에 그대로 쓰면 모바일 목록 한 페이지가 4MB 를 넘는다.
 */
describe('RecentPortfolio 썸네일 경로', () => {
  it('업로드 썸네일을 /_next/image 가 아닌 백엔드 썸네일 API 로 내보낸다', () => {
    render(<RecentPortfolio items={[makePerformance(7)]} />)

    const img = screen.getByAltText('시공사례 7')
    expect(img.getAttribute('src')).toBe('/backend-api/thumb/960/7.jpg')
    expect(img.getAttribute('srcset')).toBe(
      '/backend-api/thumb/480/7.jpg 480w, /backend-api/thumb/960/7.jpg 960w',
    )
    expect(img.getAttribute('sizes')).toContain('100vw')
  })
})
