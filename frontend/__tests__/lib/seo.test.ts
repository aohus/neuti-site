import { buildMetadata, absoluteUrl, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo'

describe('absoluteUrl', () => {
  it('상대 경로에 사이트 주소를 붙인다', () => {
    expect(absoluteUrl('/uploads/a.jpg')).toBe(`${SITE_URL}/uploads/a.jpg`)
  })

  it('이미 절대 주소면 그대로 둔다', () => {
    expect(absoluteUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg')
  })

  it('슬래시 없는 경로도 올바르게 합친다', () => {
    expect(absoluteUrl('uploads/a.jpg')).toBe(`${SITE_URL}/uploads/a.jpg`)
  })
})

describe('buildMetadata', () => {
  it('섹션 layout 아래 상세 페이지에서도 사이트명이 붙도록 절대 제목을 쓴다', () => {
    // 섹션 layout 이 title 문자열을 정하면 루트 template 이 손자 세그먼트에 적용되지 않는다
    const meta = buildMetadata({ title: '순환로 가로수 방제', description: 'd', path: '/performance/4' })
    expect(meta.title).toEqual({ absolute: `순환로 가로수 방제 | ${SITE_NAME}` })
  })

  it('경로로 canonical 을 만든다', () => {
    const meta = buildMetadata({ title: '시공사례', description: '설명', path: '/performance' })
    expect(meta.alternates?.canonical).toBe('/performance')
  })

  it('하위 페이지에서도 OG 공통 필드(siteName·locale·url)를 유지한다', () => {
    const meta = buildMetadata({ title: '시공사례', description: '설명', path: '/performance' })
    expect(meta.openGraph).toMatchObject({
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      url: '/performance',
      title: `시공사례 | ${SITE_NAME}`,
      description: '설명',
    })
  })

  it('이미지가 없으면 기본 OG 이미지를 쓴다', () => {
    const meta = buildMetadata({ title: 't', description: 'd', path: '/' })
    expect(meta.openGraph?.images).toEqual([DEFAULT_OG_IMAGE])
  })

  it('이미지와 OG 타입을 지정할 수 있다', () => {
    const meta = buildMetadata({
      title: 't',
      description: 'd',
      path: '/performance/1',
      image: '/uploads/x.jpg',
      ogType: 'article',
    })
    expect(meta.openGraph).toMatchObject({ type: 'article', images: [{ url: '/uploads/x.jpg' }] })
  })

  it('ogTitle/ogDescription 으로 OG 문구만 따로 줄 수 있다', () => {
    const meta = buildMetadata({
      title: 't',
      description: 'd',
      path: '/',
      ogTitle: 'OG 제목',
      ogDescription: 'OG 설명',
    })
    expect(meta.openGraph).toMatchObject({ title: 'OG 제목', description: 'OG 설명' })
  })

  it('keywords 를 그대로 넘긴다', () => {
    const meta = buildMetadata({ title: 't', description: 'd', path: '/', keywords: ['a'] })
    expect(meta.keywords).toEqual(['a'])
  })
})
