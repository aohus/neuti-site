import { localBusinessJsonLd, websiteJsonLd, serializeJsonLd } from '@/lib/structuredData'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

describe('localBusinessJsonLd', () => {
  const ld = localBusinessJsonLd()

  it('네이버 블로그를 sameAs 로 연결한다', () => {
    expect(ld.sameAs).toContain('https://blog.naver.com/coopneuti')
  })

  it('서비스 지역과 영업시간을 담는다', () => {
    expect(ld.areaServed).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '성남시' })])
    )
    expect(ld.openingHoursSpecification).toMatchObject({
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    })
  })

  it('NAP(이름·주소·전화)를 유지한다', () => {
    expect(ld).toMatchObject({
      name: SITE_NAME,
      url: SITE_URL,
      telephone: '031-752-6000',
      address: { streetAddress: '태평로 104', addressLocality: '성남시 수정구' },
    })
  })
})

describe('websiteJsonLd', () => {
  it('사이트 이름을 알린다', () => {
    expect(websiteJsonLd()).toMatchObject({ '@type': 'WebSite', name: SITE_NAME, url: SITE_URL })
  })
})

describe('serializeJsonLd', () => {
  it('</script> 탈출을 막도록 < 를 이스케이프한다', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(out).not.toContain('</script>')
    expect(JSON.parse(out)).toEqual({ name: '</script><script>alert(1)</script>' })
  })
})
