import type { Metadata } from 'next'
import ContractContent from './ContractContent'

export const metadata: Metadata = {
  title: '조경·수목관리 수의계약',
  description:
    '조경 수의계약 전문. 견적서 즉일 발급, 실적증명서·자격증빙 즉시 제공. 산림청 등록 1종 나무병원, 조경업 면허 보유. 느티나무병원 협동조합 031-752-6000.',
  keywords: [
    '조경 수의계약',
    '나무병원 수의계약',
    '수목 전정 수의계약',
    '가로수 관리 수의계약',
    '병충해 방제 수의계약',
    '녹지관리 용역',
    '위험목 제거 수의계약',
    '성남 조경업체',
    '경기 조경업체',
    '조경 수의계약 견적',
  ],
  openGraph: {
    title: '조경·수목관리 수의계약 | 느티나무병원 협동조합',
    description:
      '견적서 즉일 발급 · 실적증명서·자격증빙 즉시 제공. 관공서 수의계약 다수 실적.',
  },
}

export default function ContractPage() {
  return <ContractContent />
}
