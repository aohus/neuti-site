// 루트 layout 의 사이트 공통 JSON-LD.
// 업체명·주소·전화(NAP)는 네이버 플레이스·카카오맵 등록값과 글자 하나까지 같아야 한다.
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'

export const SITE_DESCRIPTION =
  '산림청 등록 1종 나무병원 · 수목진단·치료 · 조경수/관목 식재 · 계절꽃 화단 조성 · 녹지관리 전문. 수의계약 견적 문의. 031-752-6000'

const NAVER_BLOG_URL = 'https://blog.naver.com/coopneuti'

const SERVICES = ['조경식재', '녹지관리', '소나무 전정', '병충해 방제', '위험목 제거', '수목 진단·치료']

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    telephone: '031-752-6000',
    email: 'coopneuti@naver.com',
    sameAs: [NAVER_BLOG_URL],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '태평로 104',
      addressLocality: '성남시 수정구',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    areaServed: [
      { '@type': 'City', name: '성남시' },
      { '@type': 'AdministrativeArea', name: '경기도' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '조경·수목관리 서비스',
      itemListElement: SERVICES.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }
}

/** 검색 결과에 표시될 사이트 이름 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'ko-KR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/** <script type="application/ld+json"> 용 직렬화. 값 안의 `</script>` 로 태그를 탈출하지 못하게 < 를 이스케이프한다. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
