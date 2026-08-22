/**
 * 수의계약 페이지(/contract)에 노출되는 공사 실적 원장.
 *
 * 정본 문서: assets/content_text/공사실적.md — 실적을 추가/수정하면 두 곳을 함께 고칠 것.
 * (`__tests__/contract.test.tsx` 가 건수·중복·분류 정합성을 검사한다)
 *
 * 수록 규칙
 * - 계약 단위로 센다. 한 계약에 방제·전정·예초가 묶이면 1건이고, 수행 공종은 실적명에 적는다.
 * - 카테고리는 1실적 1건만 배정한다. 복합 공사를 여러 카드에 중복 노출하지 않는다.
 * - 배정 우선순위: 실적명에 명시된 공종 > 특수 공종(고사목제거·진단·수간주사)
 *   > 원부 `작업분류` 최빈값.
 * - 카테고리 키는 시공사례 md 의 job_main_category 와 같은 값이어야 한다.
 *   어긋나면 "시공 사례 보기" 필터가 빈 목록이 된다.
 */

export type ContractProject = {
  name: string
  client: string
  year: string
}

/** 카드에 접힌 상태로 노출되는 실적 수. 나머지는 `+더보기`로 펼친다. */
export const VISIBLE_PROJECT_COUNT = 5

/**
 * 서비스 카드 키 → 실적 목록 (최신순).
 *
 * `Record<string, ...>` 로 **애노테이션하지 않는다**. 애노테이션하면 인덱스 시그니처가
 * 붙어 `keyof typeof contractProjects` 가 `string` 으로 붕괴하고, 카드 키 오타가
 * 컴파일 에러 없이 빈 목록으로 새어나간다. `satisfies` 는 값 형태는 그대로 검증하면서
 * 키 리터럴 유니온은 보존한다.
 */
export const contractProjects = {
  꽃식재: [
    { name: '성남시차량등록사업소 진입로 화단 조성', client: '성남시차량등록사업소', year: '2026' },
    { name: '도촌동 어울림정원 계절꽃 식재', client: '성남시 도촌동', year: '2026' },
    { name: '태평4동 가로화단 꽃 식재', client: '성남시 태평4동', year: '2026' },
    { name: '태평4동 마을만들기', client: '성남시 태평4동', year: '2026' },
    { name: '상대원3동 아름다운 길목가꾸기', client: '성남시 상대원3동', year: '2026' },
    { name: '수정·중원구 공원 계절꽃 식재 및 유지관리', client: '성남시청', year: '2025' },
    { name: '정자역 광장 꽃 식재', client: '성남시 정자1동', year: '2025' },
    { name: '도촌동 어울림정원 꽃 식재', client: '성남시 도촌동', year: '2025' },
    { name: '태평4동 가로화단 보수 및 초화류 식재', client: '성남시 태평4동', year: '2025' },
    { name: '하대원동 계절꽃 식재', client: '성남시 하대원동', year: '2025' },
    { name: '금곡동 영산홍 식재', client: '성남시 금곡동', year: '2025' },
    { name: '마을정원 조성사업(태평4동)', client: '태평4동 행정복지센터', year: '2024' },
    { name: '마을정원 조성사업(백현동)', client: '백현동 행정복지센터', year: '2024' },
    { name: '마을정원 조성사업(은행1동)', client: '은행1동 행정복지센터', year: '2024' },
    { name: '마을정원 조성사업(백마어린이집)', client: '백마어린이집', year: '2024' },
    { name: '시흥동 거리화분 관리', client: '시흥동 행정복지센터', year: '2022' },
    { name: '사송동 화단 작업', client: '시흥동 행정복지센터', year: '2022' },
  ],
  녹지관리: [
    { name: '금곡공원 수목 종합관리', client: '성남도시개발공사', year: '2026' },
    { name: '황새울체육공원 수목 종합관리', client: '성남도시개발공사', year: '2026' },
    { name: '어린이공원 등 조경수목 보식공사', client: '성남시 분당구청', year: '2026' },
    { name: '늘푸른초등학교 교내 화단조성·수목관리·방제', client: '늘푸른초등학교', year: '2026' },
    { name: '왕남초등학교 화단조성·예초·제초', client: '왕남초등학교', year: '2026' },
    { name: '정부과천청사 옥상미관 관리', client: '정부과천청사관리소', year: '2026' },
    { name: '성남시장례문화사업소 조경수목 정비', client: '성남시장례문화사업소', year: '2026' },
    { name: '녹지대 관리공사(도촌동·갈현동) 전정·제초·방제', client: '성남시 중원구청', year: '2025' },
    { name: '동부검찰청 제초·예초', client: '서울동부지방검찰청', year: '2025' },
    { name: '금곡공원 수목 종합관리', client: '성남도시개발공사', year: '2025' },
    { name: '황새울체육공원 수목 종합관리', client: '성남도시개발공사', year: '2025' },
    { name: '금광2동 유휴부지 녹지대 조성', client: '성남시 금광2동', year: '2025' },
    { name: '과천청사(공수처) 리모델링 조경', client: '고위공직자범죄수사처', year: '2025' },
    { name: '늘푸른초등학교 수목관리 및 예제초', client: '늘푸른초등학교', year: '2025' },
    { name: '과천청사 눈주목 식재', client: '정부과천청사관리소', year: '2025' },
    { name: '녹지대 관리공사', client: '성남시 중원구청', year: '2024' },
    { name: '성남시청 녹지관리공사', client: '성남시청', year: '2023' },
    { name: '하천 보수공사', client: '성남시청', year: '2023' },
    { name: '현충탑 관리공사', client: '성남시청', year: '2022' },
    { name: '분당노인복지회관 관리', client: '분당노인복지회관', year: '2022' },
  ],
  소나무전정: [
    { name: '동부검찰청 수목 전정', client: '서울동부지방검찰청', year: '2026' },
    { name: '동부검찰청 수목 전정', client: '서울동부지방검찰청', year: '2025' },
    { name: '과천청사 소나무 전정', client: '행정안전부', year: '2024' },
    { name: '교육청 학교 전정', client: '성남교육지원청', year: '2022' },
  ],
  병해충방제: [
    { name: '순환로 등 가로수·조경수 병해충 방제공사', client: '성남시 중원구청', year: '2026' },
    { name: '동부검찰청 병해충 방제공사', client: '서울동부지방검찰청', year: '2026' },
    { name: '수도여자고등학교 수목 방제', client: '수도여자고등학교', year: '2026' },
    { name: '정자초등학교 수목 방제', client: '정자초등학교', year: '2026' },
    { name: '성남사회복지관 수목 방제', client: '성남사회복지관', year: '2026' },
    { name: '수정·중원구 산림 돌발해충 방제', client: '성남시청', year: '2025' },
    { name: '동부검찰청 병해충 방제(2·3차)', client: '서울동부지방검찰청', year: '2025' },
    { name: '단대·양지공원 병해충 방제공사', client: '성남시청', year: '2024' },
    { name: '마을정원 조성사업(신구대학교 식물원)', client: '신구대학교 식물원', year: '2024' },
    { name: '마을정원 조성사업(성남여수초)', client: '성남여수초등학교', year: '2024' },
    { name: '마을정원 조성사업(성남사회복지관)', client: '성남사회복지관', year: '2024' },
    { name: '마을정원 조성사업(동부검찰청)', client: '서울동부지방검찰청', year: '2024' },
    { name: '마을정원 조성사업(금곡공원)', client: '성남도시개발공사', year: '2024' },
    { name: '대원공원 병해충 방제', client: '성남시청', year: '2022' },
  ],
  위험목제거: [
    { name: '과천청사 수목 식재 및 위험목 제거', client: '정부과천청사관리소', year: '2025' },
    { name: '하대원동 마을정원 소나무 고사지 제거', client: '하대원동 행정복지센터', year: '2024' },
    { name: '경기도나무은행 고사목 제거', client: '경기도', year: '2024' },
  ],
  수목진단치료: [
    { name: '대모산·구룡산 소나무재선충병 예방나무주사', client: '서울강남구청', year: '2026' },
    { name: '상원초등학교 대형목 이식', client: '상원초등학교', year: '2024' },
    { name: '단대·양지공원 방제 예찰 및 효과분석', client: '성남시청', year: '2024' },
    { name: '평택보성아파트 수목 진단 및 수세 회복', client: '평택보성아파트', year: '2023' },
    { name: '성남아트센터 소나무 수간주사', client: '성남아트센터', year: '2022' },
  ],
} satisfies Record<string, ContractProject[]>

/** 서비스 카드가 쓸 수 있는 카테고리 키. 시공사례 DB의 job_main_category 와 같은 값이다. */
export type ContractCategory = keyof typeof contractProjects

/** 전체 실적 건수. 섹션 안내 문구가 실제 수록 건수와 어긋나지 않도록 파생시킨다. */
export function getTotalProjectCount(): number {
  return getAllProjects().length
}

/** 카테고리 구분 없이 펼친 전체 실적. */
function getAllProjects(): ContractProject[] {
  return Object.values(contractProjects).flat()
}
