// 시공사례 본문(JSON 블록 문자열)을 다루는 순수 함수들.
import { markdownToPlainText } from '@/lib/plainText'

export interface ParsedBlock {
  type: string
  value: string
}

const MAX_SEO_TITLE = 60
const SUBTITLE_SEPARATOR = ' - '

export function parseBlocks(content: string): ParsedBlock[] | null {
  try {
    const parsed: unknown = JSON.parse(content)
    return Array.isArray(parsed) ? (parsed as ParsedBlock[]) : null
  } catch {
    return null
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

/** 본문 텍스트 발췌. 본문이 비면 부제목으로 대체한다. */
export function buildExcerpt(
  content: string,
  subtitle: string | null | undefined,
  max = 150
): string {
  const blocks = parseBlocks(content)
  const raw = blocks
    ? blocks
        .filter((b) => b.type === 'text' && typeof b.value === 'string')
        .map((b) => b.value)
        .join('\n\n')
    : content ?? ''
  const plain = markdownToPlainText(raw)
  if (plain) return truncate(plain, max)
  return subtitle ? truncate(subtitle.trim(), max) : ''
}

/** `제목 - 부제목`이 너무 길면 제목만 쓴다. */
export function buildSeoTitle(title: string, subtitle?: string | null): string {
  if (!subtitle) return title
  const combined = `${title}${SUBTITLE_SEPARATOR}${subtitle}`
  return combined.length <= MAX_SEO_TITLE ? combined : title
}
