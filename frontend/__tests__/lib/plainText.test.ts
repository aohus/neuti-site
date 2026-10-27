import { markdownToPlainText } from '@/lib/plainText'

describe('markdownToPlainText', () => {
  it('소제목과 표는 라벨이라 빼고 본문 문장만 남긴다', () => {
    const md = '## 공사 개요\n\n| 구분 | 내용 |\n|---|---|\n| 대상지 | 성남시 |\n\n새벽에 **살포**했다.'
    expect(markdownToPlainText(md)).toBe('새벽에 살포했다.')
  })

  it('링크는 글자만, 이미지와 HTML 태그·코드 펜스는 지운다', () => {
    const md = '[상세](http://x.y) 확인 ![사진](/a.jpg) <b>굵게</b>\n```\ncode\n```\n끝'
    expect(markdownToPlainText(md)).toBe('상세 확인 굵게 끝')
  })

  it('인용·목록 기호를 걷어낸다', () => {
    expect(markdownToPlainText('> 인용\n- 하나\n- 둘')).toBe('인용 하나 둘')
  })
})
