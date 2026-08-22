/**
 * 한국어 본문에서 CommonMark 강조(`**...**`)가 깨지는 문제를 보정한다.
 *
 * CommonMark 는 강조 마커 양옆 문자로 "열기/닫기 가능 여부"를 판단한다(flanking rule).
 * 닫는 마커는 앞이 문장부호이면서 뒤가 공백/문장부호가 아니면 닫기 마커로 인정되지 않는다.
 * 한국어는 조사가 공백 없이 붙기 때문에 아래 형태가 그대로 `**` 로 노출된다.
 *
 *   **'관리 공백'**의   → 닫는 `**` 앞이 `'`, 뒤가 `의` → 강조 실패
 *   전형적인**"공백"**  → 여는 `**` 앞이 `인`, 뒤가 `"` → 강조 실패
 *
 * 마커 안쪽에 zero-width space 를 넣으면 마커 양옆이 "문장부호도 공백도 아닌 문자"가 되어
 * flanking 조건을 만족한다. ZWSP 는 폭이 없어 렌더링 결과에는 보이지 않는다.
 */

const ZWSP = '\u200B'

// 코드 펜스 시작/종료 라인 (``` 또는 ~~~, 들여쓰기 3칸까지 허용)
const FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/

// 인라인 코드 스팬. split 시 캡처되어 홀수 인덱스로 들어온다.
const INLINE_CODE_PATTERN = /(`+[^`]*`+)/

// `**...**` 한 쌍.
// - 앞뒤로 별표가 더 붙은 경우(`***bold italic***`)는 건드리지 않는다
// - 내용이 공백/별표/ZWSP 로 시작하거나 끝나면 강조가 아니거나 이미 보정된 것이다
const BOLD_PATTERN =
  /(^|[^*])\*\*(?![\s*\u200B])((?:(?!\*\*)[\s\S])*?[^\s*\u200B])\*\*(?!\*)/g

const padBoldMarkers = (text: string): string =>
  text.replace(
    BOLD_PATTERN,
    (_match, before: string, content: string) =>
      `${before}**${ZWSP}${content}${ZWSP}**`
  )

const padOutsideInlineCode = (text: string): string =>
  text
    .split(INLINE_CODE_PATTERN)
    .map((part, index) => (index % 2 === 1 ? part : padBoldMarkers(part)))
    .join('')

/**
 * 마크다운 원문을 렌더링 직전에 보정한다. 저장된 원문은 바꾸지 않는다.
 * 코드 펜스와 인라인 코드 안쪽은 그대로 둔다.
 */
export function normalizeMarkdown(source: string): string {
  if (typeof source !== 'string' || source.length === 0) return ''

  const output: string[] = []
  let buffer: string[] = []
  let openFence: string | null = null

  const flushBuffer = () => {
    if (buffer.length === 0) return
    output.push(padOutsideInlineCode(buffer.join('\n')))
    buffer = []
  }

  for (const line of source.split('\n')) {
    const marker = line.match(FENCE_PATTERN)?.[1]

    if (openFence === null) {
      if (marker) {
        flushBuffer()
        openFence = marker
        output.push(line)
      } else {
        buffer.push(line)
      }
      continue
    }

    output.push(line)
    // 닫는 펜스는 같은 문자로 시작하고 여는 펜스보다 짧지 않아야 한다
    if (
      marker &&
      marker[0] === openFence[0] &&
      marker.length >= openFence.length
    ) {
      openFence = null
    }
  }

  flushBuffer()

  return output.join('\n')
}
