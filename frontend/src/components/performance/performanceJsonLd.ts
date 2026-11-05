import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo'
import { breadcrumbJsonLd } from '@/lib/structuredData'
import type { Performance } from '@/types/performance'

const LOGO_PATH = '/brand/logo.svg'

export function buildArticleJsonLd(p: Performance, description: string) {
  const url = absoluteUrl(`/performance/${p.id}`)
  const organization = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    ...(description ? { description } : {}),
    ...(p.thumbnail_url ? { image: [absoluteUrl(p.thumbnail_url)] } : {}),
    datePublished: p.created_at,
    dateModified: p.updated_at ?? p.created_at,
    author: organization,
    publisher: { ...organization, logo: { '@type': 'ImageObject', url: absoluteUrl(LOGO_PATH) } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

export function buildBreadcrumbJsonLd(p: Performance) {
  return breadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '시공사례', path: '/performance' },
    { name: p.title, path: `/performance/${p.id}` },
  ])
}
