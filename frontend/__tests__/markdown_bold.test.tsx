import { render, screen } from '@testing-library/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { normalizeMarkdown } from '../src/lib/markdown'

const renderMarkdown = (source: string) =>
  render(
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
      {normalizeMarkdown(source)}
    </ReactMarkdown>
  )

// 강조 구간의 zero-width space 를 제거해 육안 텍스트만 비교한다.
const visibleText = (el: HTMLElement | null) =>
  (el?.textContent ?? '').replace(/\u200B/g, '')

describe('normalizeMarkdown - 한국어 볼드 렌더링', () => {
  it('닫는 ** 앞이 따옴표이고 뒤에 조사가 붙어도 볼드로 렌더링한다', () => {
    // 시공사례 본문에서 실제로 깨진 케이스 (동부검찰청_관리.md)
    const { container } = renderMarkdown(
      "작업 전 소나무들은 전형적인 **'관리 공백'**의 징후를 보이고 있었습니다."
    )

    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(visibleText(strong)).toBe("'관리 공백'")
    expect(container.textContent).not.toContain('**')
  })

  it('여는 ** 앞에 한글이 붙어 있어도 볼드로 렌더링한다', () => {
    const { container } = renderMarkdown('전형적인**"관리 공백"**입니다.')

    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(visibleText(strong)).toBe('"관리 공백"')
    expect(container.textContent).not.toContain('**')
  })

  it('마침표로 끝나는 강조 뒤에 조사가 붙어도 볼드로 렌더링한다', () => {
    const { container } = renderMarkdown('결과는 **정상 회복.**이었습니다.')

    expect(container.querySelector('strong')).not.toBeNull()
    expect(container.textContent).not.toContain('**')
  })

  it('기존에 정상 동작하던 볼드는 그대로 유지한다', () => {
    const { container } = renderMarkdown('이것은 **정상 강조** 입니다.')

    expect(visibleText(container.querySelector('strong'))).toBe('정상 강조')
    expect(container.textContent).not.toContain('**')
  })
})

describe('normalizeMarkdown - 변환 대상 제외', () => {
  it('인라인 코드 안의 **는 건드리지 않는다', () => {
    const source = '마크다운에서 `**굵게**` 로 씁니다.'

    expect(normalizeMarkdown(source)).toBe(source)

    const { container } = renderMarkdown(source)
    expect(container.querySelector('code')?.textContent).toBe('**굵게**')
  })

  it('펜스 코드 블록 안의 **는 건드리지 않는다', () => {
    const source = ['```md', "**'관리 공백'**의", '```'].join('\n')

    expect(normalizeMarkdown(source)).toBe(source)
  })

  it('짝이 맞지 않는 **는 그대로 둔다', () => {
    expect(normalizeMarkdown('별표 하나 ** 만 있음')).toBe(
      '별표 하나 ** 만 있음'
    )
  })

  it('공백으로 시작하거나 끝나는 구간은 강조로 보지 않는다', () => {
    expect(normalizeMarkdown('a ** not emphasis ** b')).toBe(
      'a ** not emphasis ** b'
    )
  })

  it('이미 정규화된 문자열을 다시 넣어도 결과가 같다 (idempotent)', () => {
    const once = normalizeMarkdown("**'관리 공백'**의")

    expect(normalizeMarkdown(once)).toBe(once)
  })

  it('빈 값이나 비문자열은 빈 문자열로 처리한다', () => {
    expect(normalizeMarkdown('')).toBe('')
    expect(normalizeMarkdown(undefined as unknown as string)).toBe('')
  })
})
