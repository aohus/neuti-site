// 서버 컴포넌트·라우트 핸들러 전용 백엔드 호출.
// 브라우저 코드는 /backend-api 상대 경로(rewrite)를 쓰고, 서버에서는 Docker 내부 주소로 직접 붙는다.
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://backend:8000'

/** 기본 캐시 수명(초). 시공사례는 배포 시 동기화되므로 10분이면 충분하다. */
const DEFAULT_REVALIDATE_SECONDS = 600

export class BackendError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number
  ) {
    super(`Backend ${path} responded ${status}`)
    this.name = 'BackendError'
  }
}

/** `/api/v1{path}` 를 호출한다. 404 는 null, 그 밖의 실패는 BackendError. */
export async function serverFetch<T>(
  path: string,
  { revalidate = DEFAULT_REVALIDATE_SECONDS }: { revalidate?: number } = {}
): Promise<T | null> {
  const res = await fetch(`${BACKEND_URL}/api/v1${path}`, { next: { revalidate } })
  if (res.status === 404) return null
  if (!res.ok) throw new BackendError(path, res.status)
  return (await res.json()) as T
}
