import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import QnAWritePage from '@/app/qna/write/page'
import QnADetailPage from '@/app/qna/[id]/page'

jest.mock('axios')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ id: '7' }),
}))
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false, token: null }),
}))

const mockAxios = axios as jest.Mocked<typeof axios>

function httpError(status: number, detail = '') {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status, data: { detail } } })
}

beforeEach(() => jest.clearAllMocks())

describe('문의 작성 폼', () => {
  it('허니팟 값과 작성 시간을 함께 보낸다', async () => {
    mockAxios.post.mockResolvedValue({ data: {} })
    render(<QnAWritePage />)

    fireEvent.change(screen.getByPlaceholderText('성함 또는 업체명'), { target: { value: '홍길동' } })
    fireEvent.change(screen.getByPlaceholderText('제목을 입력하세요'), { target: { value: '견적 문의' } })
    fireEvent.change(screen.getByPlaceholderText('문의하실 내용을 자세히 적어주세요'), { target: { value: '내용' } })
    fireEvent.submit(screen.getByRole('button', { name: /문의/ }).closest('form')!)

    await waitFor(() => expect(mockAxios.post).toHaveBeenCalled())
    const [url, body] = mockAxios.post.mock.calls[0]
    expect(url).toBe('/backend-api/inquiry/')
    expect(body).toMatchObject({ title: '견적 문의', website: '' })
    expect(typeof (body as { elapsed_ms: unknown }).elapsed_ms).toBe('number')
  })
})

describe('비밀글 상세', () => {
  async function openPasswordForm() {
    mockAxios.get.mockRejectedValue(httpError(401))
    render(<QnADetailPage />)
    return screen.findByPlaceholderText('비밀번호')
  }

  it('비밀번호를 쿼리스트링이 아니라 본문으로 보낸다', async () => {
    const input = await openPasswordForm()
    mockAxios.post.mockResolvedValue({
      data: { id: 7, title: '비밀 문의', content: '본문', author: 'a', is_secret: true, created_at: '2026-09-01T00:00:00' },
    })

    fireEvent.change(input, { target: { value: 'pw1234' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() =>
      expect(mockAxios.post).toHaveBeenCalledWith('/backend-api/inquiry/7/access', { password: 'pw1234' }, expect.anything())
    )
    expect(mockAxios.get.mock.calls.every(([url]) => !String(url).includes('password'))).toBe(true)
    expect(await screen.findByText('본문')).toBeInTheDocument()
  })

  it('비밀번호가 틀리면 안내한다', async () => {
    const input = await openPasswordForm()
    mockAxios.post.mockRejectedValue(httpError(401, 'Invalid password'))

    fireEvent.change(input, { target: { value: 'nope' } })
    fireEvent.submit(input.closest('form')!)

    expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument()
  })

  it('여러 번 틀려 막히면 서버 안내 문구를 보여준다', async () => {
    const input = await openPasswordForm()
    mockAxios.post.mockRejectedValue(httpError(429, '비밀번호를 여러 번 틀렸습니다. 잠시 후 다시 시도해주세요.'))

    fireEvent.change(input, { target: { value: 'nope' } })
    fireEvent.submit(input.closest('form')!)

    expect(await screen.findByText('비밀번호를 여러 번 틀렸습니다. 잠시 후 다시 시도해주세요.')).toBeInTheDocument()
  })
})
