import { serverFetch } from '@/lib/serverApi'
import { Notice } from '@/types/board'
import NoticeList from './NoticeList'

// CI 의 docker build 에는 백엔드가 없다. 빌드 시점 프리렌더로 빈 목록이 굳지 않게 한다.
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function NoticeListPage() {
  let notices: Notice[] = []
  try {
    notices = (await serverFetch<Notice[]>(`/notice?skip=0&limit=${PAGE_SIZE}`, { revalidate: 60 })) ?? []
  } catch (err) {
    console.error('Failed to fetch notices', err)
  }
  return <NoticeList notices={notices} />
}
