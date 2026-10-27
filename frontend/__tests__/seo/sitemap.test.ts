import sitemap, { dynamic } from '@/app/sitemap'
import { getPerformanceFeed, getNotices } from '@/lib/feed'
import { SITE_URL } from '@/lib/seo'

jest.mock('@/lib/feed', () => ({
  getPerformanceFeed: jest.fn(),
  getNotices: jest.fn(),
}))

const mockPerformances = getPerformanceFeed as jest.Mock
const mockNotices = getNotices as jest.Mock

beforeEach(() => {
  mockPerformances.mockResolvedValue([
    {
      id: 7,
      title: '가로수 방제',
      subtitle: null,
      thumbnail_url: null,
      job_main_category: null,
      summary: null,
      created_at: '2026-08-13T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z',
    },
  ])
  mockNotices.mockResolvedValue([{ id: 3, title: '공지', content: '본문', created_at: '2026-05-01T00:00:00Z' }])
})

describe('sitemap', () => {
  it('빌드 시점이 아니라 요청 시점에 만든다', () => {
    // 빌드(CI)에서는 백엔드에 닿지 않아 시공사례가 빠진 sitemap 이 굳어 버린다
    expect(dynamic).toBe('force-dynamic')
  })

  it('시공사례 상세 URL 을 수정일과 함께 넣는다', async () => {
    const entries = await sitemap()
    const detail = entries.find((e) => e.url === `${SITE_URL}/performance/7`)

    expect(detail).toBeDefined()
    expect(detail?.lastModified).toEqual(new Date('2026-09-01T00:00:00Z'))
  })

  it('공지 상세 URL 을 넣는다', async () => {
    const entries = await sitemap()
    expect(entries.map((e) => e.url)).toContain(`${SITE_URL}/notice/3`)
  })

  it('정적 페이지에는 매 요청 바뀌는 가짜 lastModified 를 넣지 않는다', async () => {
    const entries = await sitemap()
    const contract = entries.find((e) => e.url === `${SITE_URL}/contract`)

    expect(contract).toBeDefined()
    expect(contract?.lastModified).toBeUndefined()
  })

  it('백엔드 목록이 비어도 정적 페이지는 남는다', async () => {
    mockPerformances.mockResolvedValue([])
    mockNotices.mockResolvedValue([])

    const entries = await sitemap()
    expect(entries.map((e) => e.url)).toContain(SITE_URL)
  })
})
