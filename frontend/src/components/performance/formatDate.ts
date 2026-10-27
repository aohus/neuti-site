/** 'YYYY-MM-DD...' 를 '2025년 9월 16일' 로. 타임존·로캘에 의존하지 않아 SSR/CSR 결과가 같다. */
export function formatKoreanDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return iso
  return `${match[1]}년 ${Number(match[2])}월 ${Number(match[3])}일`
}
