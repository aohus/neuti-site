import { buildExcerpt, buildSeoTitle } from '@/components/performance/content'

const blocks = (...b: object[]) => JSON.stringify(b)

describe('buildExcerpt', () => {
  it('제목·표·이미지·마크다운 기호를 제거한 본문 발췌를 만든다', () => {
    const content = blocks(
      { type: 'text', value: '# 제목은 제외\n\n**도촌동** 녹지대 [예초](http://x) 작업을 했습니다.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n---\n\n![alt](/a.jpg)' },
      { type: 'image', value: '{"url":"/a.jpg","alt":"사진 설명"}' }
    )
    const out = buildExcerpt(content, 'sub', 150)
    expect(out).toBe('도촌동 녹지대 예초 작업을 했습니다.')
  })

  it('길면 150자 이내로 말줄임한다', () => {
    const content = blocks({ type: 'text', value: '가'.repeat(400) })
    const out = buildExcerpt(content, null, 150)
    expect(out.length).toBeLessThanOrEqual(150)
    expect(out.endsWith('…')).toBe(true)
  })

  it('본문이 비면 부제목으로 대체한다', () => {
    expect(buildExcerpt(blocks({ type: 'image', value: '/a.jpg' }), '부제', 150)).toBe('부제')
  })

  it('JSON 이 아닌 HTML 본문도 태그를 제거한다', () => {
    expect(buildExcerpt('<p>안녕 <b>하세요</b></p>', null, 150)).toBe('안녕 하세요')
  })

  it('아무것도 없으면 빈 문자열', () => {
    expect(buildExcerpt('', null, 150)).toBe('')
  })
})

describe('buildSeoTitle', () => {
  it('부제목이 있고 길지 않으면 이어 붙인다', () => {
    expect(buildSeoTitle('A 공사', '고사지 제거')).toBe('A 공사 - 고사지 제거')
  })
  it('너무 길면 제목만', () => {
    expect(buildSeoTitle('가'.repeat(30), '나'.repeat(40))).toBe('가'.repeat(30))
  })
  it('부제목이 없으면 제목만', () => {
    expect(buildSeoTitle('A', null)).toBe('A')
  })
})
