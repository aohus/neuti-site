import type { Metadata } from 'next'
import RequestContent from './RequestContent'

export const metadata: Metadata = {
  title: '견적·상담 문의',
  description:
    '조경 수의계약 간편 견적 요청 및 수목 진단 의뢰. 견적서 즉일~1영업일 발급, 실적증명서·자격증빙 함께 제공. 느티나무병원 협동조합 031-752-6000.',
  openGraph: {
    title: '견적·상담 문의 | 느티나무병원 협동조합',
    description:
      '수의계약 간편 견적 요청 및 수목 진단 의뢰. 1영업일 이내 견적서 발급.',
  },
}

export default function RequestPage() {
  return <RequestContent />
}
