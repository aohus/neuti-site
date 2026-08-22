import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

// API 를 호출하거나 Auth 컨텍스트를 요구하는 섹션은 자리표시자로 대체한다.
// 여기서 검증할 것은 각 섹션의 내부 동작이 아니라 홈의 섹션 구성과 순서다.
jest.mock('@/components/home/TechnologySection', () => {
  const Mock = () => <div data-section="technology" />
  Mock.displayName = 'TechnologySection'
  return Mock
})
jest.mock('@/components/home/RecentPortfolio', () => {
  const Mock = () => <div data-section="recent-portfolio" />
  Mock.displayName = 'RecentPortfolio'
  return Mock
})
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

/**
 * 홈은 `docs/product.md` 의 고객 여정 4단계 순서대로 답을 쌓는다.
 *   Hero(무엇을 하나) → 실적(믿을 만한가) → 차별점(왜 우리인가)
 *   → 기술력(어떻게 하나) → 최근 사례(품질이 어떤가) → CTA(어떻게 맡기나)
 * 섹션이 빠지거나 순서가 뒤집히면 이 흐름이 깨지므로 순서까지 검증한다.
 */
describe('Home Page', () => {
  it('고객 여정 순서대로 모든 섹션을 렌더링한다', () => {
    const { container } = render(<Page />)

    const sections = Array.from(
      container.querySelectorAll('[data-section]')
    ).map((el) => el.getAttribute('data-section'))

    expect(sections).toEqual([
      'hero',
      'clients',
      'why-us',
      'technology',
      'recent-portfolio',
      'cta',
    ])
  })

  /**
   * 홈에서 수의계약 안내로 가는 길은 내비게이션과 Hero 버튼이면 충분하다.
   * 본문 섹션까지 계약 이야기로 채우면 조경·수목관리 회사로 읽히지 않는다.
   */
  it('본문 섹션은 수의계약 페이지로 유도하지 않는다', () => {
    const { container } = render(<Page />)

    const bodyLinks = Array.from(
      container.querySelectorAll(
        '[data-section]:not([data-section="hero"]) a[href="/contract"]'
      )
    )
    expect(bodyLinks).toHaveLength(0)
  })

  it('h1 은 하나만 두어 문서 구조를 유지한다', () => {
    render(<Page />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('데스크톱 방문자도 홈에서 바로 전화 견적을 걸 수 있다', () => {
    render(<Page />)
    const telLinks = screen
      .getAllByRole('link')
      .filter((el) => el.getAttribute('href')?.startsWith('tel:'))
    expect(telLinks.length).toBeGreaterThan(0)
  })
})
