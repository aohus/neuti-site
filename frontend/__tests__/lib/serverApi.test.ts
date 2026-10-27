import { serverFetch, BackendError } from '@/lib/serverApi'

const mockFetch = jest.fn()

beforeEach(() => {
  mockFetch.mockReset()
  global.fetch = mockFetch as unknown as typeof fetch
})

describe('serverFetch', () => {
  it('백엔드 내부 주소의 /api/v1 경로를 호출하고 JSON 을 돌려준다', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 1 }) })

    const data = await serverFetch<{ id: number }>('/performance/1')

    expect(data).toEqual({ id: 1 })
    expect(mockFetch.mock.calls[0][0]).toBe('http://backend:8000/api/v1/performance/1')
  })

  it('revalidate 초를 next 옵션으로 넘긴다', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

    await serverFetch('/performance/feed', { revalidate: 60 })

    expect(mockFetch.mock.calls[0][1]).toMatchObject({ next: { revalidate: 60 } })
  })

  it('404 면 null 을 돌려준다', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })

    await expect(serverFetch('/performance/999')).resolves.toBeNull()
  })

  it('그 밖의 오류 상태는 BackendError 로 던진다', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })

    await expect(serverFetch('/performance/1')).rejects.toBeInstanceOf(BackendError)
  })
})
