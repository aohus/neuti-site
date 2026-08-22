import { contractProjects } from './contract-projects'

/**
 * 발주처 노출 원장.
 *
 * 홈(`ClientLogos`)과 수의계약 페이지(`ContractContent`)가 함께 쓴다.
 * 두 곳에 각각 배열을 두면 한쪽만 갱신돼 실적이 어긋나므로 여기서 단일화한다.
 */

export type ClientLogo = {
  /** 로고에 표기되는 이름 */
  name: string
  src: string
  /**
   * 이 로고가 대표하는 `contract-projects.ts` 원장의 발주처 이름들.
   *
   * 로고와 원장의 표기가 다를 수 있어(공수처 ↔ 고위공직자범죄수사처) 명시한다.
   * 여기 적힌 이름은 텍스트 목록에서 제외되어 같은 기관이 두 번 나오지 않는다.
   */
  ledgerNames: string[]
}

/**
 * CI 를 확보한 발주처.
 *
 * 칸을 채우려고 같은 로고를 두 번 넣지 않는다. 중복 배치는 실적을 부풀린
 * 인상을 준다. (`__tests__/data/clients.test.ts` 가 src 중복을 막는다)
 */
export const clientLogos: ClientLogo[] = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg', ledgerNames: ['경기도'] },
  {
    name: '공수처',
    src: '/images/clients/gongsuchco.jpg',
    ledgerNames: ['고위공직자범죄수사처'],
  },
  {
    name: '성남도시개발공사',
    src: '/images/clients/seongnam_dev.jpg',
    ledgerNames: ['성남도시개발공사'],
  },
  {
    name: '성남시',
    src: '/images/clients/seongnam_city.png',
    ledgerNames: ['성남시청'],
  },
  {
    name: '정부청사관리본부',
    src: '/images/clients/gov-complex.png',
    ledgerNames: ['정부과천청사관리소'],
  },
]

/**
 * 로고로 노출하지 않는 **모든** 발주처 이름 — 실적이 많은 곳부터.
 *
 * 학교·행정복지센터처럼 규모가 작은 곳도 빠뜨리지 않는다. 원장에서 파생하므로
 * 실적을 추가하면 목록이 자동으로 따라오고, 수기 목록처럼 누락될 일이 없다.
 * 건수가 같으면 원장 등장 순서를 유지해 렌더 결과가 안정적으로 재현된다.
 */
export function getOtherClientNames(): string[] {
  const covered = new Set(clientLogos.flatMap((logo) => logo.ledgerNames))

  const counts = new Map<string, number>()
  for (const project of Object.values(contractProjects).flat()) {
    if (covered.has(project.client)) continue
    counts.set(project.client, (counts.get(project.client) ?? 0) + 1)
  }

  return [...counts.keys()].sort(
    (a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
  )
}
