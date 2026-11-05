import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import { render, screen, within } from '@testing-library/react'
import PineWiltPage from '@/app/pine-wilt/page'
import ProcessSection from '@/components/pine-wilt/ProcessSection'
import PreventionSection from '@/components/pine-wilt/PreventionSection'
import TrackRecordSection from '@/components/pine-wilt/TrackRecordSection'
import FaqSection from '@/components/pine-wilt/FaqSection'
import WhyNowSection from '@/components/pine-wilt/WhyNowSection'
import {
  pineWiltFaq,
  pineWiltPrevention,
  pineWiltProcess,
  pineWiltTrackRecord,
  pineWiltWhyNow
} from '@/data/pine-wilt-content'

const mockGetPerformanceFeed = jest.fn()
jest.mock('@/lib/feed', () => ({
  getPerformanceFeed: () => mockGetPerformanceFeed()
}))

beforeEach(() => {
  mockGetPerformanceFeed.mockReset()
  mockGetPerformanceFeed.mockResolvedValue([])
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string | { src: string } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === 'string' ? src : src.src} />
  )
}))

const PLACEHOLDER = /\[(?:[^\]]*(확정 필요|기입|교체|견적 기준|횟수))[^\]]*\]/

function sectionOf(container: HTMLElement, name: string): HTMLElement {
  const el = container.querySelector<HTMLElement>(`[data-section="${name}"]`)
  if (!el) throw new Error(`section ${name} not found`)
  return el
}

/**
 * 재선충 검색 방문자의 질문 순서대로 답을 쌓는다.
 *   왜 지금 → 어떻게 예방 → 우리 나무도? → 어떻게 진단 → 누가 판정
 *   → 내 경우인가 → 해본 적 있나 → 궁금한 점 → 의뢰
 */
describe('/pine-wilt 소나무재선충 현장진단', () => {
  it('시안 순서대로 섹션을 렌더링한다', async () => {
    const { container } = render(await PineWiltPage())

    const sections = Array.from(
      container.querySelectorAll('[data-section]')
    ).map((el) => el.getAttribute('data-section'))

    expect(sections).toEqual([
      'pw-hero',
      'pw-why-now',
      'pw-prevention',
      'pw-symptoms',
      'pw-process',
      'pw-role',
      'pw-for-whom',
      'pw-track-record',
      'pw-faq',
      'pw-cta'
    ])
  })

  it('h1 은 히어로 하나뿐이다', async () => {
    render(await PineWiltPage())
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(
      '소나무가 갑자기 시들었다면,재선충부터 확인합니다'
    )
  })

  it('히어로와 마지막 CTA 모두 진단 의뢰 탭과 전화로 연결된다', async () => {
    const { container } = render(await PineWiltPage())

    for (const name of ['pw-hero', 'pw-cta']) {
      const section = within(sectionOf(container, name))
      const links = section.getAllByRole('link')
      expect(
        links.some((a) => a.getAttribute('href') === '/request?tab=diagnosis')
      ).toBe(true)
      expect(
        links.some((a) => a.getAttribute('href') === 'tel:031-752-6000')
      ).toBe(true)
    }
  })

  it('실적 카드는 피드에서 찾은 시공사례 상세로 연결된다', async () => {
    const feedRow = (id: number, source_file: string) => ({
      id, source_file, title: '', subtitle: null, thumbnail_url: null,
      job_main_category: null, summary: null, created_at: '', updated_at: ''
    })
    mockGetPerformanceFeed.mockResolvedValue([
      feedRow(11, '2026_대모산_구룡산_재선충_예방나무주사'),
      feedRow(12, '2025_수정_중원구_산림_돌발해충_방제')
    ])
    const { container } = render(await PineWiltPage())
    const hrefs = within(sectionOf(container, 'pw-track-record'))
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))

    expect(hrefs).toEqual(['/performance/11', '/performance/12'])
  })

  it('피드를 못 받으면 실적 카드는 시공사례 목록으로 연결된다', async () => {
    const { container } = render(await PineWiltPage())
    const hrefs = within(sectionOf(container, 'pw-track-record'))
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))

    expect(hrefs).toEqual([
      '/performance?job_main=병해충방제',
      '/performance?job_main=병해충방제'
    ])
  })

  it('Service·BreadcrumbList JSON-LD 를 내고 FAQPage 는 내지 않는다', async () => {
    const { container } = render(await PineWiltPage())
    const types = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    ).map((el) => JSON.parse(el.textContent || '{}')['@type'])

    expect(types).toEqual(['Service', 'BreadcrumbList'])
  })

  it('감염 판정·확인증 발급은 관할 기관 칸에만 나온다', async () => {
    const { container } = render(await PineWiltPage())
    const role = sectionOf(container, 'pw-role')
    const ours = within(role).getByText('느티나무병원이 하는 일').parentElement!
    const agency = within(role).getByText('관할 기관이 하는 일').parentElement!

    expect(ours).not.toHaveTextContent(/판정|확인증/)
    expect(agency).toHaveTextContent('감염 최종 판정')
    expect(agency).toHaveTextContent('미감염 확인증 발급')
  })

  it('화면 어디에도 대괄호 자리표시 문구나 소요기간 약속이 없다', async () => {
    const { container } = render(await PineWiltPage())
    const text = container.textContent ?? ''
    expect(text).not.toMatch(PLACEHOLDER)
    expect(text).not.toMatch(/즉일|영업일|당일 결과/)
  })

  it('src/ 소스에 대괄호 자리표시 문구가 남아 있지 않다', () => {
    const srcDir = path.join(__dirname, '..', 'src')
    const files = [
      path.join(srcDir, 'data', 'pine-wilt-content.ts'),
      path.join(srcDir, 'app', 'pine-wilt', 'page.tsx'),
      path.join(srcDir, 'app', 'pine-wilt', 'layout.tsx'),
      ...fs
        .readdirSync(path.join(srcDir, 'components', 'pine-wilt'))
        .map((f) => path.join(srcDir, 'components', 'pine-wilt', f))
    ]
    const offenders = files.filter((f) =>
      PLACEHOLDER.test(fs.readFileSync(f, 'utf8'))
    )
    expect(offenders).toEqual([])
  })
})

describe('WHY NOW 반출금지구역 시각화', () => {
  it('핵심 수치 3개(서울 → 경기 → 성남)를 숫자와 설명 쌍으로 보여준다', () => {
    const { container } = render(<WhyNowSection />)
    const values = Array.from(container.querySelectorAll('dl')[0].querySelectorAll('dd')).map(
      (dd) => dd.textContent
    )
    expect(values).toEqual(['서울 18배', '경기 +66%', '성남 전역'])
  })

  it('지도는 내용을 설명하는 alt 를 달고 원본을 크게 열 수 있다', () => {
    render(<WhyNowSection />)
    const map = screen.getByAltText(pineWiltWhyNow.map.alt)
    expect(map).toHaveAttribute('src', '/images/pine-wilt/seongnam-quarantine-map.jpg')
    expect(screen.getByText('지도 크게 보기 ↗')).toHaveAttribute('href', pineWiltWhyNow.map.src)
  })

  it('막대그래프 없이 지도와 핵심 수치만 둔다', () => {
    const { container } = render(<WhyNowSection />)
    expect(container.querySelectorAll('figure')).toHaveLength(1)
    expect(container.querySelector('ul')).toBeNull()
  })

  it('반출금지구역 출처와 기준일을 밝힌다', () => {
    render(<WhyNowSection />)
    expect(screen.getByText(/반출금지구역관리정보」\(2026\.07\.01\)/)).toBeInTheDocument()
  })
})

describe('확정 전 항목(null) 처리', () => {
  it('진단 방식이 정해졌으면 절차 3단계에 대체 문구 대신 그 문장을 쓴다', async () => {
    const body = pineWiltProcess.steps[2].body
    expect(body).toMatch(/PCR/)
    render(await PineWiltPage())
    expect(screen.getByText(body!)).toBeInTheDocument()
    expect(
      screen.queryByText('나무의사가 현장에서 재선충 여부를 1차 판별합니다.')
    ).not.toBeInTheDocument()
  })

  it('진단 방식이 null 이면 절차 3단계에 대체 문구를 쓴다', () => {
    const steps = pineWiltProcess.steps.map((step, idx) =>
      idx === 2 ? { ...step, body: null } : step
    )
    render(<ProcessSection steps={steps} />)
    expect(
      screen.getByText('나무의사가 현장에서 재선충 여부를 1차 판별합니다.')
    ).toBeInTheDocument()
  })

  it('진단 절차 아래에 시료 채취와 PCR 진단 사진을 보여준다', () => {
    const { container } = render(<ProcessSection />)
    const srcs = Array.from(container.querySelectorAll('figure img')).map(
      (img) => img.getAttribute('src')
    )
    expect(srcs).toEqual([
      '/images/pine-wilt/gachon-sample-drill.jpg',
      '/images/pine-wilt/gachon-pcr-pipette.jpg',
      '/images/pine-wilt/gachon-pcr-cycler.jpg'
    ])
  })

  it('예방나무주사 03 의 효과 지속기간은 null 이면 숨기고, 값이 있으면 보인다', () => {
    expect(pineWiltPrevention.steps[2].note).toBeNull()
    const { rerender } = render(<PreventionSection />)
    expect(screen.queryByText(/지속/)).not.toBeInTheDocument()

    const steps = pineWiltPrevention.steps.map((step, idx) =>
      idx === 2 ? { ...step, note: '효과 지속 2년, 2년마다 재접종' } : step
    )
    rerender(<PreventionSection steps={steps} />)
    expect(
      screen.getByText('효과 지속 2년, 2년마다 재접종')
    ).toBeInTheDocument()
  })

  it('예방나무주사 세 단계 모두 나무주사 현장 사진을 보여준다', () => {
    const { container } = render(<PreventionSection />)

    const srcs = Array.from(container.querySelectorAll('li img')).map((img) =>
      img.getAttribute('src')
    )
    expect(srcs).toEqual([
      '/images/pine-wilt/daemosan-dbh-measure.jpg',
      '/images/pine-wilt/daemosan-injection-gun.jpg',
      '/images/pine-wilt/daemosan-injection-tag.jpg'
    ])
  })

  it('실적 카드 본수는 null 이면 숨기고, 값이 있으면 본문 뒤에 붙인다', () => {
    const { featured } = pineWiltTrackRecord
    expect(featured.treeCount).toBeNull()
    const { rerender } = render(<TrackRecordSection />)
    expect(screen.getByText(featured.body)).toBeInTheDocument()

    rerender(
      <TrackRecordSection
        featured={{ ...featured, treeCount: '총 1,200본.' }}
      />
    )
    expect(screen.getByText(/총 1,200본\./)).toBeInTheDocument()
  })

  it('비용 FAQ 는 답이 null 이면 질문까지 숨긴다', () => {
    const cost = pineWiltFaq.items.find((i) => i.question.includes('비용'))
    expect(cost?.answer).toBeNull()

    const { container, rerender } = render(<FaqSection />)
    expect(
      screen.queryByText('진단 비용은 얼마인가요?')
    ).not.toBeInTheDocument()
    expect(container.querySelectorAll('details')).toHaveLength(
      pineWiltFaq.items.length - 1
    )
    // 숨긴 항목 대신 남은 첫 질문이 펼쳐진 상태로 시작한다.
    expect(container.querySelector('details')).toHaveAttribute('open')

    const items = pineWiltFaq.items.map((i) =>
      i === cost ? { ...i, answer: '사진 상담은 무료입니다.' } : i
    )
    rerender(<FaqSection items={items} />)
    expect(screen.getByText('진단 비용은 얼마인가요?')).toBeInTheDocument()
  })
})
