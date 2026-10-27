import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import Page from '../src/app/page'

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
jest.mock('@/lib/serverApi', () => ({ serverFetch: jest.fn().mockResolvedValue(null) }))
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

/**
 * 메인 사진 하단 "지금 많이 찾는 서비스" 패널.
 * 검색 유입 방문자가 재선충·학교 서비스 페이지로 바로 들어갈 수 있어야 한다.
 */
describe('홈 서비스 패널', () => {
  const getPanel = () =>
    screen.getByRole('navigation', { name: '지금 많이 찾는 서비스' })

  it('네 갈래 링크를 순서대로 보여준다', async () => {
    render(await Page())

    const hrefs = within(getPanel())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/pine-wilt', '/school', '/contract', '/request'])
  })

  it('재선충·학교 카드는 서비스 이름을 링크 이름으로 가진다', async () => {
    render(await Page())

    const panel = within(getPanel())
    expect(panel.getByRole('link', { name: /소나무재선충 현장진단/ })).toHaveAttribute(
      'href',
      '/pine-wilt'
    )
    expect(panel.getByRole('link', { name: /학교 방제·연간관리/ })).toHaveAttribute(
      'href',
      '/school'
    )
  })

  it('패널 제목은 h2 라 홈의 h1 은 하나로 유지된다', async () => {
    render(await Page())

    expect(
      within(getPanel()).getByRole('heading', { level: 2, name: '지금 많이 찾는 서비스' })
    ).toBeInTheDocument()
  })

  it('패널은 hero 래퍼 안에 있어 /contract 링크가 본문 링크로 세지지 않는다', async () => {
    const { container } = render(await Page())

    const hero = container.querySelector('[data-section="hero"]')
    expect(hero).toContainElement(getPanel())
  })
})
