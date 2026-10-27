// 메타 description·RSS 설명용 평문 변환. 시공사례·공지 본문이 같은 규칙을 쓰도록 한 곳에 둔다.
// (백엔드 app/utils/text_summary.py 도 소제목·표를 빼는 같은 원칙을 따른다)
const ZWSP = /​/g

/** 마크다운을 한 줄 평문으로. 소제목·표는 라벨이라 뺀다. */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n')
    .filter((line) => !/^\s*(#{1,6}\s|\||-{3,}\s*$|!\[)/.test(line))
    .join('\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*([-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]+/g, '')
    .replace(ZWSP, '')
    .replace(/\s+/g, ' ')
    .trim()
}
