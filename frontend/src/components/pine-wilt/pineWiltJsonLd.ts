import { SITE_URL, absoluteUrl } from '@/lib/seo'
import { breadcrumbJsonLd } from '@/lib/structuredData'
import {
  PINE_WILT_PATH,
  PINE_WILT_PHONE,
  pineWiltSeo
} from '@/data/pine-wilt-content'

// 같은 서비스를 다른 말로 찾는 검색어. Service.alternateName 으로 알린다.
const ALTERNATE_NAMES = [
  '소나무재선충 진단',
  '소나무재선충병 방제',
  '재선충 방제',
  '재선충 예방주사',
  '소나무 나무주사',
  '예방나무주사'
]

/** 사이트 공통 LocalBusiness(@id)를 제공자로 가리키는 서비스 정보 */
export function pineWiltServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '소나무재선충병 예방나무주사·현장진단',
    alternateName: ALTERNATE_NAMES,
    serviceType: '소나무재선충병 예방나무주사·진단',
    description: pineWiltSeo.description,
    url: absoluteUrl(PINE_WILT_PATH),
    image: absoluteUrl(pineWiltSeo.image.url),
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City', name: '성남시' },
      { '@type': 'AdministrativeArea', name: '경기도' },
      { '@type': 'AdministrativeArea', name: '서울특별시' },
      { '@type': 'AdministrativeArea', name: '인천광역시' }
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: PINE_WILT_PHONE }
    }
  }
}

export function pineWiltBreadcrumbJsonLd() {
  return breadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '주요사업', path: '/business' },
    { name: '소나무재선충 예방나무주사·진단', path: PINE_WILT_PATH }
  ])
}
