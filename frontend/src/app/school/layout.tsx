import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  path: '/school',
  title: '학교 수목관리·병해충 방제',
  description:
    '학교 교정 수목 병해충 방제와 화단·수목 연간관리. 나무의사가 직접 예찰·처방하고 같은 1종 나무병원이 방제까지 맡습니다. 수업 없는 날로 일정을 잡고 사진대지·완료보고 등 행정실 서류를 함께 드립니다. 느티나무병원 협동조합.',
  keywords: [
    '학교 방제',
    '학교 수목관리',
    '학교 나무 소독',
    '교정 수목 관리',
    '나무의사 학교'
  ],
  ogTitle: '학교 수목관리·병해충 방제 | 느티나무병원 협동조합',
  ogDescription:
    '나무의사 예찰·처방부터 방제 시공, 학교 회계연도에 맞춘 연간관리까지. 상담 문의 031-752-6000.',
})

export default function SchoolLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
