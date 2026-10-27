import { serverFetch } from '@/lib/serverApi'
import { InquirySummary } from '@/types/board'
import QnAList, { InquiryListItem } from './QnAList'

// CI 의 docker build 에는 백엔드가 없다. 빌드 시점 프리렌더로 빈 목록이 굳지 않게 한다.
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

// 백엔드 목록은 본문 없이 내려온다. 그래도 클라이언트 props(RSC payload)에는
// 화면이 쓰는 필드만 골라 넘긴다.
function toListItem(i: InquirySummary): InquiryListItem {
  return {
    id: i.id,
    title: i.title,
    author: i.author,
    is_secret: i.is_secret,
    created_at: i.created_at,
    hasAnswer: i.has_answer,
  }
}

export default async function QnAListPage() {
  let inquiries: InquiryListItem[] = []
  try {
    const data = await serverFetch<InquirySummary[]>(`/inquiry?skip=0&limit=${PAGE_SIZE}`, { revalidate: 60 })
    inquiries = (data ?? []).map(toListItem)
  } catch (err) {
    console.error('Failed to fetch inquiries', err)
  }
  return <QnAList inquiries={inquiries} />
}
