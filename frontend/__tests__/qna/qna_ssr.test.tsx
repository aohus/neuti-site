import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import QnAListPage, { dynamic } from '@/app/qna/page'
import { serverFetch } from '@/lib/serverApi'

jest.mock('@/lib/serverApi', () => ({ serverFetch: jest.fn() }))
jest.mock('@/context/AuthContext', () => ({ useAuth: () => ({ isAdmin: false, token: null }) }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

const mockFetch = serverFetch as jest.Mock

describe('문의 목록', () => {
  beforeEach(() => jest.clearAllMocks())

  it('빌드 시점 프리렌더를 막는다', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  it('제목을 서버에서 렌더링하고 h1 이 있다', async () => {
    // 백엔드 목록 응답(InquiryListItem)은 본문 없이 has_answer 만 준다
    mockFetch.mockResolvedValue([
      { id: 2, title: '비밀 문의', author: '홍길동', is_secret: true, created_at: '2026-09-01T00:00:00', has_answer: true },
    ])
    const { container } = render(await QnAListPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('비밀 문의')).toBeInTheDocument()
    expect(screen.getByText('답변완료')).toBeInTheDocument()
  })

  it('응답에 예상 밖 필드가 섞여도 화면 필드만 클라이언트로 넘긴다', async () => {
    mockFetch.mockResolvedValue([
      { id: 2, title: '비밀 문의', content: 'SECRET-BODY', author: '홍길동', is_secret: true,
        created_at: '2026-09-01T00:00:00', has_answer: true },
    ])
    const el = await QnAListPage()
    // 클라이언트 컴포넌트로 넘어가는 props 에 본문이 없어야 한다 (RSC payload 로 노출됨)
    expect(JSON.stringify(el, (k, v) => (typeof v === 'function' ? undefined : v))).not.toMatch(/SECRET-/)
  })
})
