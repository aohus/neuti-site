'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, MapPin, Wrench, Building2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { performanceApi } from '@/lib/performanceApi'
import type { Performance } from '@/types/performance'
import type { Project } from '@/types/project'
import PerformanceForm from './PerformanceForm'
import PerformanceFilterSelect from './PerformanceFilterSelect'
import ProjectGrid from './ProjectGrid'
import Pagination from '@/components/common/Pagination'

interface Props {
  /** 서버에서 받은 목록. 서버 fetch 가 실패했으면 null 이고 마운트 후 클라이언트에서 받는다. */
  initialPerformances: Performance[] | null
}

const ITEMS_PER_PAGE = 9
const FETCH_LIMIT = 100

const distinct = (values: Array<string | null | undefined>): string[] =>
  [...new Set(values.filter(Boolean) as string[])].sort()

function toProject(p: Performance): Project {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    client: p.client || '느티나무병원 협동조합',
    role: '',
    category: p.job_main_category || '시공사례',
    image: p.thumbnail_url || '/images/hero-bg.jpg',
    year:
      p.year?.toString() ||
      (p.construction_date ? p.construction_date.slice(0, 4) : ''),
    tags: [p.job_main_category, p.site_type].filter(Boolean) as string[],
  }
}

function PerformanceListContent({ initialPerformances }: Props) {
  const { isAdmin } = useAuth()
  const searchParams = useSearchParams()

  const [performances, setPerformances] = useState<Performance[]>(initialPerformances ?? [])
  const [isLoading, setIsLoading] = useState(initialPerformances === null)
  // ?job_main= 은 첫 렌더부터 반영해 서버 HTML 과 필터 결과가 어긋나지 않게 한다
  const [jobMain, setJobMain] = useState<string | undefined>(() => searchParams.get('job_main') ?? undefined)
  const [siteType, setSiteType] = useState<string | undefined>(undefined)
  const [clientType, setClientType] = useState<string | undefined>(undefined)
  const [currentPage, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      setPerformances(await performanceApi.getPerformances(0, FETCH_LIMIT))
    } catch (err) {
      console.error('Failed to fetch performances', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 서버 fetch 가 실패한 경우에만 클라이언트에서 받아온다
  useEffect(() => {
    if (initialPerformances === null) refresh()
  }, [initialPerformances, refresh])

  useEffect(() => {
    const jobMainParam = searchParams.get('job_main')
    if (jobMainParam) setJobMain(jobMainParam)
  }, [searchParams])

  const jobCategories = useMemo(() => distinct(performances.map((p) => p.job_main_category)), [performances])
  const siteTypes = useMemo(() => distinct(performances.map((p) => p.site_type)), [performances])
  const clientTypes = useMemo(() => distinct(performances.map((p) => p.client_type)), [performances])

  const filteredItems = useMemo(
    () =>
      performances
        .filter((p) => !jobMain || p.job_main_category === jobMain)
        .filter((p) => !siteType || p.site_type === siteType)
        .filter((p) => !clientType || p.client_type === clientType)
        .map(toProject),
    [performances, jobMain, siteType, clientType]
  )

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const onFilter = (setter: (v: string | undefined) => void) => (v: string | undefined) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-white page-py">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-16">
          <div className="flex flex-col items-center">
            <span className="text-label">Portfolio</span>
            <h1 className="text-deep mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              시공 사례
            </h1>
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

        <div className="mb-8 md:mb-16">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <PerformanceFilterSelect
              icon={<Wrench size={14} />}
              label="작업분류"
              allLabel="전체 작업"
              value={jobMain}
              options={jobCategories}
              onChange={onFilter(setJobMain)}
            />
            <PerformanceFilterSelect
              icon={<MapPin size={14} />}
              label="대상지분류"
              allLabel="전체 대상지"
              value={siteType}
              options={siteTypes}
              onChange={onFilter(setSiteType)}
            />
            <PerformanceFilterSelect
              icon={<Building2 size={14} />}
              label="발주처 유형"
              allLabel="전체 발주처"
              value={clientType}
              options={clientTypes}
              onChange={onFilter(setClientType)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <div className="border-primary mb-6 inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-b-2"></div>
            <p className="font-bold tracking-tight text-gray-400">
              기록을 불러오고 있습니다...
            </p>
          </div>
        ) : (
          <ProjectGrid projects={paginatedItems} />
        )}

        <div className="mt-10 md:mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
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

export default function PerformanceList(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white page-py" />}>
      <PerformanceListContent {...props} />
    </Suspense>
  )
}
