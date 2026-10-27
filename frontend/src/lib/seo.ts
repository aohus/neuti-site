import type { Metadata } from 'next'

export const SITE_NAME = '느티나무병원 협동조합'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xn--910b90bw7nhubu9w9vr.com'

// 공유 썸네일(로고 카드). 하위 layout/page 가 metadata.openGraph 를 선언하면
// 상위 openGraph 가 통째로 교체되므로, 페이지 메타데이터는 buildMetadata 로 만든다.
export const DEFAULT_OG_IMAGE = {
  url: '/brand/og-image.png',
  width: 1200,
  height: 630,
  alt: '협동조합 느티나무병원 로고',
}

/** 상대 경로(/uploads/...)를 사이트 절대 URL 로 바꾼다. JSON-LD·RSS 처럼 metadataBase 가 적용되지 않는 곳에서 쓴다. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

interface PageMetadataInput {
  title: string
  description: string
  /** 사이트 루트 기준 경로. canonical 과 og:url 이 된다. */
  path: string
  /** og:image. 없으면 DEFAULT_OG_IMAGE */
  image?: string
  ogType?: 'website' | 'article'
  ogTitle?: string
  ogDescription?: string
  keywords?: string[]
}

/**
 * 페이지 메타데이터. canonical 과 OG 공통 필드(siteName·locale·url)를 항상 채운다.
 * 상대 URL 은 루트 layout 의 metadataBase 로 절대 URL 이 된다.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  ogType = 'website',
  ogTitle,
  ogDescription,
  keywords,
}: PageMetadataInput): Metadata {
  return {
    // 섹션 layout 이 title 문자열을 정하면 루트의 title.template 이 그 아래 상세 페이지까지 내려가지 않는다.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      locale: 'ko_KR',
      siteName: SITE_NAME,
      url: path,
      title: ogTitle ?? `${title} | ${SITE_NAME}`,
      description: ogDescription ?? description,
      images: [image ? { url: image } : DEFAULT_OG_IMAGE],
    },
  }
}
