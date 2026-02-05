'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePerformances } from '@/hooks/usePerformance'
import PerformanceForm from '@/components/performance/PerformanceForm'
import ProjectGrid from '@/components/performance/ProjectGrid'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { Plus, Calendar, MapPin, Wrench, Search, Filter } from 'lucide-react'

export default function PerformancePage() {
  const { isAdmin } = useAuth()

  const [category, setCategory] = useState('All')
  const [year, setYear] = useState<number | undefined>(undefined)
  const [jobMain, setJobMain] = useState<string | undefined>(undefined)
  const [siteType, setSiteType] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  const {
    performances,
    isLoading: isBackLoading,
    refresh
  } = usePerformances({
    category: category === 'All' ? undefined : category,
    year,
    job_main: jobMain === 'All' ? undefined : jobMain,
    site_type: siteType === 'All' ? undefined : siteType,
    q: searchQuery || undefined
  })

  const [isFormOpen, setIsFormOpen] = useState(false)

  // Combine back-end data
  const allCombinedItems = useMemo(() => {
    console.log('Performances from API:', performances)
    return performances.map((p) => {
      const item = {
        id: p.id,
        title: p.title,
        client: p.client || '느티나무병원 협동조합',
        category: p.category || '시공사례',
        image: p.thumbnail_url || '/images/hero-bg.jpg',
        year:
          p.year?.toString() ||
          (p.construction_date
            ? new Date(p.construction_date).getFullYear().toString()
            : ''),
        tags: [p.job_main_category, p.site_type].filter(Boolean) as string[],
        content: p.content,
        isBackend: true
      }
      console.log('Mapped item:', item.title, 'Image:', item.image)
      return item
    })
  }, [performances])

  // Pagination
  const totalPages = Math.ceil(allCombinedItems.length / ITEMS_PER_PAGE) || 1
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return allCombinedItems.slice(start, start + ITEMS_PER_PAGE)
  }, [allCombinedItems, currentPage])

  const years = [2025, 2024, 2023, 2022, 2021, 2020]
  const jobCategories = ['고사목제거', '관리', '조경공사', '진단']
  const siteTypes = ['공공기관', '공원', '아파트', '기업', '개인정원']

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

        {/* Search & Advanced Filters */}
        <div className="mb-16 space-y-8">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="작업명, 발주처, 대상지 등으로 검색하세요"
              className="border-surface bg-surface/50 focus:border-primary focus:shadow-primary/5 w-full rounded-[2rem] border-2 py-5 pr-6 pl-14 text-lg font-bold shadow-sm transition-all outline-none focus:bg-white focus:shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-surface/30 mx-auto grid max-w-4xl grid-cols-2 gap-4 rounded-[2.5rem] border border-black/5 p-8 md:grid-cols-4">
            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <Calendar size={14} /> 연도
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-xl border-none bg-white px-4 py-3.5 font-bold shadow-sm transition-all outline-none focus:ring-2"
                value={year || ''}
                onChange={(e) =>
                  setYear(e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <option value="">전체</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <Wrench size={14} /> 작업분류
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-xl border-none bg-white px-4 py-3.5 font-bold shadow-sm transition-all outline-none focus:ring-2"
                value={jobMain || ''}
                onChange={(e) => setJobMain(e.target.value || undefined)}
              >
                <option value="">전체</option>
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
                className="text-deep focus:ring-primary w-full rounded-xl border-none bg-white px-4 py-3.5 font-bold shadow-sm transition-all outline-none focus:ring-2"
                value={siteType || ''}
                onChange={(e) => setSiteType(e.target.value || undefined)}
              >
                <option value="">전체</option>
                {siteTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <Filter size={14} /> 사업분야
              </label>
              <select
                className="text-deep focus:ring-primary w-full rounded-xl border-none bg-white px-4 py-3.5 font-bold shadow-sm transition-all outline-none focus:ring-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">전체</option>
                <option value="나무병원">나무병원</option>
                <option value="조경식재">조경식재</option>
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
