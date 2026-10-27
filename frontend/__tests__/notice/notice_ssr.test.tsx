import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import NoticeListPage, { dynamic } from '@/app/notice/page'
import NoticeDetailPage, { generateMetadata } from '@/app/notice/[id]/page'
import { serverFetch } from '@/lib/serverApi'
import { notFound } from 'next/navigation'

jest.mock('@/lib/serverApi', () => ({ serverFetch: jest.fn() }))
jest.mock('@/context/AuthContext', () => ({ useAuth: () => ({ isAdmin: false, token: null }) }))
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  useRouter: () => ({ push: jest.fn() }),
}))

const mockFetch = serverFetch as jest.Mock
const notice = {
  id: 5,
  title: '휴무 안내',
  content: '추석 연휴 기간 휴무입니다. '.repeat(20),
  created_at: '2026-09-01T00:00:00',
  views: 3,
}

describe('공지 목록', () => {
  beforeEach(() => jest.clearAllMocks())

  it('빌드 시점 프리렌더를 막는다', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  it('서버에서 받은 공지를 초기 HTML 에 렌더링하고 h1 이 있다', async () => {
    mockFetch.mockResolvedValue([notice])
    render(await NoticeListPage())
    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '휴무 안내' })).toHaveAttribute('href', '/notice/5')
  })

  it('조회 실패 시에도 페이지는 렌더링된다', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValue(new Error('down'))
    render(await NoticeListPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('공지 상세', () => {
  beforeEach(() => jest.clearAllMocks())
  const props = (id: string) => ({ params: Promise.resolve({ id }) })

  it('본문을 서버에서 렌더링한다', async () => {
    mockFetch.mockResolvedValue(notice)
    render(await NoticeDetailPage(props('5')))
    expect(screen.getByRole('heading', { level: 1, name: '휴무 안내' })).toBeInTheDocument()
    expect(screen.getByText(/추석 연휴/)).toBeInTheDocument()
  })

  it('없는 id 는 notFound 를 호출한다', async () => {
    mockFetch.mockResolvedValue(null)
    await expect(NoticeDetailPage(props('999'))).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })

  it('숫자가 아닌 id 는 백엔드 호출 없이 notFound', async () => {
    await expect(NoticeDetailPage(props('abc'))).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('메타데이터는 제목, 본문 발췌, canonical 을 담는다', async () => {
    mockFetch.mockResolvedValue(notice)
    const meta = await generateMetadata(props('5'))
    expect(meta.title).toEqual({ absolute: '휴무 안내 | 느티나무병원 협동조합' })
    expect((meta.description as string).length).toBeLessThanOrEqual(160)
    expect(meta.description).toContain('추석 연휴')
    expect(meta.alternates?.canonical).toBe('/notice/5')
  })

  it('메타데이터 생성 시 없는 글이면 notFound 메타를 돌려준다', async () => {
    mockFetch.mockResolvedValue(null)
    const meta = await generateMetadata(props('999'))
    expect(meta.title).toBeDefined()
    expect(meta.robots).toMatchObject({ index: false })
  })
})
