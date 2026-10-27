import { thumbUrl, uploadSrcSet } from '@/lib/thumb'

describe('thumbUrl', () => {
  it('uploads 이미지는 백엔드 썸네일 API 경로로 바꾼다', () => {
    expect(thumbUrl('/uploads/2026_현장/IMG_01.jpeg', 480)).toBe(
      '/backend-api/thumb/480/2026_현장/IMG_01.jpeg',
    )
  })

  it('uploads 가 아닌 이미지는 그대로 둔다', () => {
    expect(thumbUrl('/images/hero/hero_1.jpg', 480)).toBe('/images/hero/hero_1.jpg')
    expect(thumbUrl('https://example.com/uploads/a.jpg', 480)).toBe(
      'https://example.com/uploads/a.jpg',
    )
  })

  it('썸네일을 만들 수 없는 확장자는 그대로 둔다', () => {
    expect(thumbUrl('/uploads/brochure.pdf', 960)).toBe('/uploads/brochure.pdf')
    expect(thumbUrl('/uploads/anim.gif', 960)).toBe('/uploads/anim.gif')
  })

  it('빈 값은 빈 문자열', () => {
    expect(thumbUrl('', 480)).toBe('')
  })
})

describe('uploadSrcSet', () => {
  it('썸네일 폭들을 w 서술자로 나열한다', () => {
    expect(uploadSrcSet('/uploads/a.jpg')).toBe(
      '/backend-api/thumb/480/a.jpg 480w, /backend-api/thumb/960/a.jpg 960w',
    )
  })

  it('withOriginal 이면 원본(장변 1600px)을 가장 큰 후보로 붙인다', () => {
    expect(uploadSrcSet('/uploads/a.jpg', { withOriginal: true })).toBe(
      '/backend-api/thumb/480/a.jpg 480w, /backend-api/thumb/960/a.jpg 960w, /uploads/a.jpg 1600w',
    )
  })

  it('uploads 이미지가 아니면 undefined 라 srcSet 속성이 빠진다', () => {
    expect(uploadSrcSet('/images/a.jpg')).toBeUndefined()
    expect(uploadSrcSet('')).toBeUndefined()
  })
})
