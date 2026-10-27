import { serverFetch } from '@/lib/serverApi'
import { Inquiry } from '@/types/board'
import QnAList, { InquiryListItem } from './QnAList'

// CI 의 docker build 에는 백엔드가 없다. 빌드 시점 프리렌더로 빈 목록이 굳지 않게 한다.
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

// 백엔드 목록 응답에는 비밀글 본문과 답변이 그대로 들어 있다. 현재 화면이 공개하는
// 필드(제목·작성자·작성일·답변 여부·비밀글 표시)만 골라 넘긴다.
function toListItem(i: Inquiry): InquiryListItem {
  return {
    id: i.id,
    title: i.title,
    author: i.author,
    is_secret: i.is_secret,
    created_at: i.created_at,
    hasAnswer: Boolean(i.answer),
  }
}

export default async function QnAListPage() {
  let inquiries: InquiryListItem[] = []
  try {
    const data = await serverFetch<Inquiry[]>(`/inquiry?skip=0&limit=${PAGE_SIZE}`, { revalidate: 60 })
    inquiries = (data ?? []).map(toListItem)
  } catch (err) {
    console.error('Failed to fetch inquiries', err)
  }
  return <QnAList inquiries={inquiries} />
}
