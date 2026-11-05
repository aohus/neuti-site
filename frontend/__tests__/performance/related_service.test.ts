import { findRelatedService } from '@/components/performance/relatedService'

describe('findRelatedService', () => {
  it('재선충 사례나 소나무류 나무주사 사례는 재선충 페이지를 돌려준다', () => {
    expect(findRelatedService({ title: '소나무재선충병 방제' })?.href).toBe('/pine-wilt')
    expect(findRelatedService({ title: '공원 소나무 관리', subtitle: '흉고직경별 나무주사' })?.href).toBe('/pine-wilt')
    expect(findRelatedService({ title: '곰솔 관리', job_sub_category: '예방나무주사' })?.href).toBe('/pine-wilt')
  })

  it('소나무류가 아닌 나무주사 사례에는 붙이지 않는다', () => {
    expect(findRelatedService({ title: '느티나무 영양 나무주사' })).toBeNull()
  })

  it('관련 낱말이 없으면 null', () => {
    expect(findRelatedService({ title: '녹지대 관리공사', subtitle: null, job_sub_category: null })).toBeNull()
  })
})
