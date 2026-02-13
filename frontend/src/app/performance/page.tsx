'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { usePerformances } from '@/hooks/usePerformance'
import PerformanceForm from '@/components/performance/PerformanceForm'
import ProjectGrid from '@/components/performance/ProjectGrid'
import Pagination from '@/components/common/Pagination'
import { Plus, MapPin, Wrench, Building2 } from 'lucide-react'

function PerformanceContent() {
  const { isAdmin } = useAuth()
  const searchParams = useSearchParams()

  const [jobMain, setJobMain] = useState<string | undefined>(undefined)
  const [siteType, setSiteType] = useState<string | undefined>(undefined)
  const [clientType, setClientType] = useState<string | undefined>(undefined)

  // Read URL query params on mount
  useEffect(() => {
    const jobMainParam = searchParams.get('job_main')
    if (jobMainParam) {
      setJobMain(jobMainParam)
    }
  }, [searchParams])

  const [currentPage, setPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  const {
    performances,
    isLoading: isBackLoading,
    refresh
  } = usePerformances()

  const [isFormOpen, setIsFormOpen] = useState(false)

  // Derive filter options from all data
  const jobCategories = useMemo(() => {
    const values = performances.map(p => p.job_main_category).filter(Boolean) as string[]
    return [...new Set(values)].sort()
  }, [performances])

  const siteTypes = useMemo(() => {
    const values = performances.map(p => p.site_type).filter(Boolean) as string[]
    return [...new Set(values)].sort()
  }, [performances])

  const clientTypes = useMemo(() => {
    const values = performances.map(p => p.client_type).filter(Boolean) as string[]
    return [...new Set(values)].sort()
  }, [performances])

  // Client-side filtering
  const filteredItems = useMemo(() => {
    return performances
      .filter((p) => !jobMain || p.job_main_category === jobMain)
      .filter((p) => !siteType || p.site_type === siteType)
      .filter((p) => !clientType || p.client_type === clientType)
      .map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client || '느티나무병원 협동조합',
        category: p.job_main_category || '시공사례',
        image: p.thumbnail_url || '/images/hero-bg.jpg',
        year:
          p.year?.toString() ||
          (p.construction_date
            ? new Date(p.construction_date).getFullYear().toString()
            : ''),
        tags: [p.job_main_category, p.site_type].filter(Boolean) as string[],
        content: p.content,
        isBackend: true
      }))
  }, [performances, jobMain, siteType, clientType])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="flex flex-col items-center">
            <span className="text-label">Portfolio</span>
            <p className="text-deep mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              시공 사례
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed font-bold text-gray-500">
              느티나무병원 협동조합이 걸어온 건강한 녹지 관리의 발자취입니다.
            </p>
          </div>

          {isAdmin && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-deep shadow-deep/10 flex items-center gap-2 rounded-2xl px-8 py-3.5 font-black text-white shadow-xl transition-all hover:bg-black"
              >
                <Plus size={20} />
                사례 등록하기
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-16">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <Wrench size={14} /> 작업분류
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-2xl border-2 border-black/5 bg-surface/30 px-6 py-4 font-bold shadow-sm transition-all outline-none focus:bg-white focus:ring-2"
                value={jobMain || ''}
                onChange={(e) => { setJobMain(e.target.value || undefined); setPage(1) }}
              >
                <option value="">전체 작업</option>
                {jobCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <MapPin size={14} /> 대상지분류
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-2xl border-2 border-black/5 bg-surface/30 px-6 py-4 font-bold shadow-sm transition-all outline-none focus:bg-white focus:ring-2"
                value={siteType || ''}
                onChange={(e) => { setSiteType(e.target.value || undefined); setPage(1) }}
              >
                <option value="">전체 대상지</option>
                {siteTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <Building2 size={14} /> 발주처 유형
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-2xl border-2 border-black/5 bg-surface/30 px-6 py-4 font-bold shadow-sm transition-all outline-none focus:bg-white focus:ring-2"
                value={clientType || ''}
                onChange={(e) => { setClientType(e.target.value || undefined); setPage(1) }}
              >
                <option value="">전체 발주처</option>
                {clientTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isBackLoading ? (
          <div className="py-24 text-center">
            <div className="border-primary mb-6 inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-b-2"></div>
            <p className="font-bold tracking-tight text-gray-400">
              기록을 불러오고 있습니다...
            </p>
          </div>
        ) : (
          <ProjectGrid projects={paginatedItems as any} />
        )}

        <div className="mt-16">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {isFormOpen && (
        <PerformanceForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            refresh()
            alert('성공적으로 등록되었습니다.')
          }}
        />
      )}
    </div>
  )
}

export default function PerformancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="py-24 text-center">
          <div className="border-green-600 mb-6 inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-b-2" />
        </div>
      </div>
    }>
      <PerformanceContent />
    </Suspense>
  )
}
