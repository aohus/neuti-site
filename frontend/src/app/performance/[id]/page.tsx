import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import PerformanceBody from '@/components/performance/PerformanceBody'
import PerformanceDetailView from '@/components/performance/PerformanceDetailView'
import { buildExcerpt, buildSeoTitle } from '@/components/performance/content'
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/components/performance/performanceJsonLd'
import { serializeJsonLd } from '@/lib/structuredData'
import { loadPerformance, parseId } from './loadPerformance'

interface PageProps {
  params: Promise<{ id: string }>
}

const DESCRIPTION_LENGTH = 150

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseId((await params).id)
  if (id === null) return {}
  const performance = await loadPerformance(id)
  if (!performance) return {}

  const description =
    buildExcerpt(performance.content, performance.subtitle, DESCRIPTION_LENGTH) ||
    performance.title

  return buildMetadata({
    title: buildSeoTitle(performance.title, performance.subtitle),
    description,
    path: `/performance/${id}`,
    image: performance.thumbnail_url ?? undefined,
    ogType: 'article',
  })
}

export default async function PerformanceDetailPage({ params }: PageProps) {
  const id = parseId((await params).id)
  if (id === null) notFound()
  const performance = await loadPerformance(id)
  if (!performance) notFound()

  const description = buildExcerpt(
    performance.content,
    performance.subtitle,
    DESCRIPTION_LENGTH
  )

  return (
    <>
      {[buildArticleJsonLd(performance, description), buildBreadcrumbJsonLd(performance)].map(
        (data) => (
          <script
            key={data['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
          />
        )
      )}
      <PerformanceDetailView performance={performance}>
        <PerformanceBody content={performance.content} title={performance.title} />
      </PerformanceDetailView>
    </>
  )
}
