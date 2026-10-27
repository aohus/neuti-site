// 네이버 서치어드바이저 RSS 제출용 피드. app/rss.xml/route.ts 가 사용한다.
import type { NoticeFeedItem, PerformanceFeedItem } from '@/lib/feed'
import { markdownToPlainText } from '@/lib/plainText'
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo'

const RSS_ITEM_LIMIT = 50
const DESCRIPTION_MAX_LENGTH = 200

export interface RssItem {
  title: string
  link: string
  description: string
  pubDate: string
  category?: string
}

/** 공지 본문(마크다운)을 RSS 설명용 평문으로 바꾼다. */
function noticeDescription(markdown: string): string {
  const text = markdownToPlainText(markdown)
  return text.length > DESCRIPTION_MAX_LENGTH ? `${text.slice(0, DESCRIPTION_MAX_LENGTH)}…` : text
}

function performanceToItem(p: PerformanceFeedItem): RssItem {
  return {
    title: p.subtitle ? `${p.title} — ${p.subtitle}` : p.title,
    link: absoluteUrl(`/performance/${p.id}`),
    description: p.summary ?? p.subtitle ?? '',
    pubDate: p.created_at,
    ...(p.job_main_category ? { category: p.job_main_category } : {}),
  }
}

function noticeToItem(n: NoticeFeedItem): RssItem {
  return {
    title: n.title,
    link: absoluteUrl(`/notice/${n.id}`),
    description: noticeDescription(n.content),
    pubDate: n.created_at,
  }
}

/** 시공사례와 공지를 최신순으로 합쳐 상위 RSS_ITEM_LIMIT 건을 돌려준다. */
export function collectRssItems(performances: PerformanceFeedItem[], notices: NoticeFeedItem[]): RssItem[] {
  return [...performances.map(performanceToItem), ...notices.map(noticeToItem)]
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate))
    .slice(0, RSS_ITEM_LIMIT)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function renderItem(item: RssItem): string {
  const link = escapeXml(item.link)
  return [
    '<item>',
    `<title>${escapeXml(item.title)}</title>`,
    `<link>${link}</link>`,
    `<guid isPermaLink="true">${link}</guid>`,
    `<description>${escapeXml(item.description)}</description>`,
    `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>`,
    item.category ? `<category>${escapeXml(item.category)}</category>` : '',
    '</item>',
  ].join('')
}

export function buildRssXml(items: RssItem[]): string {
  const lastBuild = items[0] ? new Date(items[0].pubDate).toUTCString() : new Date(0).toUTCString()
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${SITE_URL}</link>`,
    `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`,
    '<description>산림청 등록 1종 나무병원 · 조경·수목관리 시공사례와 소식</description>',
    '<language>ko</language>',
    `<lastBuildDate>${lastBuild}</lastBuildDate>`,
    ...items.map(renderItem),
    '</channel>',
    '</rss>',
  ].join('\n')
}
