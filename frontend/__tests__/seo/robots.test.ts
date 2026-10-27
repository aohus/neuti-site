import robots from '@/app/robots'
import { SITE_URL } from '@/lib/seo'

describe('robots', () => {
  const result = robots()
  const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules

  it('모든 크롤러(네이버 Yeti 포함)에 사이트를 연다', () => {
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toBe('/')
  })

  it('관리·작성·수정 화면은 막는다', () => {
    expect(rule.disallow).toEqual(
      expect.arrayContaining([
        '/login',
        '/admin',
        '/backend-api/',
        '/notice/write',
        '/notice/edit',
        '/qna/write',
        '/performance/*/edit',
      ])
    )
  })

  it('이미지 경로(/uploads)는 막지 않는다', () => {
    expect(rule.disallow).not.toContain('/uploads')
    expect(rule.disallow).not.toContain('/uploads/')
  })

  it('sitemap 위치를 알린다', () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
