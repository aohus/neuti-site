import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import SchoolPage from '@/app/school/page'
import { contractProjects } from '@/data/contract-projects'
import { getSchoolClients, isSchoolClient } from '@/data/school-content'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string | { src: string } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === 'string' ? src : src.src} />
  )
}))

/** 실적 원장에 학교 발주처로 등록된 이름 */
const SCHOOL_CLIENTS_IN_LEDGER = new Set(
  Object.values(contractProjects)
    .flat()
    .filter((p) => isSchoolClient(p.client))
    .map((p) => p.client)
)

describe('/school 학교 수목관리 페이지', () => {
  it('README §5 순서대로 섹션을 렌더링한다', () => {
    const { container } = render(<SchoolPage />)

    const sections = Array.from(
      container.querySelectorAll('[data-section]')
    ).map((el) => el.getAttribute('data-section'))

    expect(sections).toEqual([
      'school-hero',
      'school-tree-doctor',
      'school-first',
      'school-annual-plan',
      'school-plans',
      'school-paperwork',
      'school-schools',
      'school-cta'
    ])
  })

  it('h1 은 하나뿐이다', () => {
    render(<SchoolPage />)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(
      '학생이 없는 날,교정의 나무를 돌봅니다'
    )
  })

  it('주요 상담 버튼은 견적 요청 탭으로, 전화 링크는 대표번호로 연결된다', () => {
    const { container } = render(<SchoolPage />)

    expect(
      screen.getByRole('link', { name: /내년도 연간관리 상담/ })
    ).toHaveAttribute('href', '/request?tab=estimate')
    expect(
      screen.getByRole('link', { name: /연간관리 상담 신청/ })
    ).toHaveAttribute('href', '/request?tab=estimate')
    expect(
      container.querySelector('a[href="tel:031-752-6000"]')
    ).toBeInTheDocument()
  })

  it('CTA 문구를 보여 준다', () => {
    const { container } = render(<SchoolPage />)

    const cta = container.querySelector(
      '[data-section="school-cta"]'
    ) as HTMLElement
    expect(
      within(cta).getByText('학교회계는 3월에 시작합니다')
    ).toBeInTheDocument()
    expect(within(cta).getByRole('heading', { level: 2 })).toHaveTextContent(
      '내년도 예산 편성 전에상담받아 보세요'
    )
  })

  it('법 안내 박스는 확인된 문구만 쓴다', () => {
    const { container } = render(<SchoolPage />)

    expect(
      screen.getByText(
        /아파트·학교 등 생활권 수목의 진단·처방·방제는 나무병원으로 등록한 곳만 할 수 있습니다\./
      )
    ).toBeInTheDocument()
    expect(container.textContent).not.toMatch(
      /처방전 발급 의무|반드시 나무병원/
    )
  })

  it('정해지지 않은 견적 기준·횟수는 "현장 확인 후 견적"으로 대체한다', () => {
    const { container } = render(<SchoolPage />)

    const plans = container.querySelector(
      '[data-section="school-plans"]'
    ) as HTMLElement
    // 패키지 3개의 견적 기준 + 방제 횟수
    expect(
      within(plans).getAllByText(/현장 확인 후 견적/).length
    ).toBeGreaterThanOrEqual(3)
  })

  it('캘린더 각주와 예찰 사진 캡션은 확정 문구로 노출한다', () => {
    const { container } = render(<SchoolPage />)

    expect(screen.getByText('학교 여건에 따라 조정됩니다')).toBeInTheDocument()
    expect(screen.getByText('나무의사 현장 예찰')).toBeInTheDocument()
    // 대괄호 자리표시가 화면에 남지 않는다
    expect(container.textContent).not.toMatch(/\[[^\]]*\]/)
  })

  it('캘린더는 박스 안에서만 가로 스크롤한다', () => {
    render(<SchoolPage />)

    const region = screen.getByRole('region', {
      name: '학교 회계연도 연간 작업 일정'
    })
    expect(region).toHaveClass('overflow-x-auto')
  })

  it('학교 시공 사례 모아보기는 시공사례 목록으로 연결된다', () => {
    render(<SchoolPage />)

    expect(
      screen.getByRole('link', { name: /학교 시공 사례 모아보기/ })
    ).toHaveAttribute('href', '/performance')
  })

  it('함께한 학교 목록은 실적 원장의 학교 발주처에서 파생한다', () => {
    const { container } = render(<SchoolPage />)

    const items = Array.from(container.querySelectorAll('[data-school-client]'))
    const names = items.map((li) => li.querySelector('span')?.textContent ?? '')

    expect(names).toContain('늘푸른초등학교')
    expect(names).toContain('수도여자고등학교')
    expect(names.length).toBe(SCHOOL_CLIENTS_IN_LEDGER.size)
    for (const name of names) {
      expect(SCHOOL_CLIENTS_IN_LEDGER.has(name)).toBe(true)
    }
    // 학교 이름은 한 번씩만 나온다
    expect(new Set(names).size).toBe(names.length)
  })

  it('목록 연도 칸에는 연도만 쓴다', () => {
    const { container } = render(<SchoolPage />)

    const years = Array.from(
      container.querySelectorAll('[data-school-client] span:last-child')
    ).map((el) => el.textContent ?? '')
    expect(years.length).toBeGreaterThan(0)
    for (const text of years) {
      expect(text).toMatch(/^\d{4}( · \d{4})*$/)
    }
  })

  it('학교 실적 횟수·학교 수를 노출하지 않는다', () => {
    const { container } = render(<SchoolPage />)

    const text = container.textContent ?? ''
    expect(text).not.toMatch(/\d+\s*개교/)
    expect(text).not.toMatch(/\d+\s*회/)
    expect(text).not.toMatch(/통제선|안전띠|라바콘|구역 통제/)
    expect(text).not.toMatch(/즉일|영업일|당일/)
  })
})

describe('getSchoolClients', () => {
  it('초·중·고등학교만 고르고 대학교 부속시설·교육지원청·어린이집은 뺀다', () => {
    expect(isSchoolClient('늘푸른초등학교')).toBe(true)
    expect(isSchoolClient('수도여자고등학교')).toBe(true)
    expect(isSchoolClient('분당중학교')).toBe(true)
    expect(isSchoolClient('수도여고')).toBe(true)
    expect(isSchoolClient('신구대학교 식물원')).toBe(false)
    expect(isSchoolClient('성남교육지원청')).toBe(false)
    expect(isSchoolClient('백마어린이집')).toBe(false)
  })

  it('같은 학교는 하나로 묶고 연도를 최신순으로 모은다', () => {
    const result = getSchoolClients({
      a: [
        { name: '방제', client: '가나초등학교', year: '2024' },
        { name: '전정', client: '성남시청', year: '2026' }
      ],
      b: [
        { name: '화단', client: '가나초등학교', year: '2026' },
        { name: '예초', client: '가나초등학교', year: '2026' },
        { name: '방제', client: '다라고등학교', year: '2025' }
      ]
    })

    expect(result).toEqual([
      { name: '가나초등학교', years: ['2026', '2024'] },
      { name: '다라고등학교', years: ['2025'] }
    ])
  })
})
