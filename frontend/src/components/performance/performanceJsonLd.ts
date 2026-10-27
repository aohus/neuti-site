import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo'
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
  const crumbs = [
    { name: '홈', url: absoluteUrl('/') },
    { name: '시공사례', url: absoluteUrl('/performance') },
    { name: p.title, url: absoluteUrl(`/performance/${p.id}`) },
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}
