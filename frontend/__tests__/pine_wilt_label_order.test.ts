import { pineWiltSeo } from '@/data/pine-wilt-content'
import {
  pineWiltBreadcrumbJsonLd,
  pineWiltServiceJsonLd
} from '@/components/pine-wilt/pineWiltJsonLd'
import { localBusinessJsonLd } from '@/lib/structuredData'
import { findRelatedService } from '@/components/performance/relatedService'
import type { Performance } from '@/types/performance'

// 재선충 서비스 이름에 진단과 예방주사·방제가 함께 나오면 예방나무주사가 먼저 온다.
function injectionFirst(label: string) {
  const injection = label.indexOf('예방나무주사')
  const diagnosis = label.search(/진단/)
  expect(injection).toBeGreaterThanOrEqual(0)
  expect(injection).toBeLessThan(diagnosis)
}

describe('재선충 서비스 이름 순서', () => {
  it('페이지 제목·OG 설명', () => {
    injectionFirst(pineWiltSeo.title)
    injectionFirst(pineWiltSeo.ogDescription)
  })

  it('Service·Breadcrumb JSON-LD', () => {
    const service = pineWiltServiceJsonLd()
    injectionFirst(service.name)
    injectionFirst(service.serviceType)
    const crumbs = pineWiltBreadcrumbJsonLd().itemListElement
    injectionFirst(crumbs[crumbs.length - 1].name)
  })

  it('LocalBusiness 서비스 목록', () => {
    const offers = JSON.stringify(localBusinessJsonLd())
    expect(offers).toContain('소나무재선충 예방나무주사·진단')
    expect(offers).not.toContain('소나무재선충 진단·예방나무주사')
  })

  it('시공사례 관련 서비스 카드', () => {
    const service = findRelatedService({
      title: '대모산 소나무재선충병 예방나무주사',
      job_sub_category: '예방나무주사'
    } as Performance)
    injectionFirst(service!.title)
    injectionFirst(service!.body)
  })
})
