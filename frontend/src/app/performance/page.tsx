'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePerformances } from '@/hooks/usePerformance'
import PerformanceForm from '@/components/performance/PerformanceForm'
import ProjectGrid from '@/components/performance/ProjectGrid'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { getProjectCategories } from '@/lib/projects'
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

  const { performances, isLoading: isBackLoading, refresh } = usePerformances({
    category: category === 'All' ? undefined : category,
    year,
    job_main: jobMain === 'All' ? undefined : jobMain,
    site_type: siteType === 'All' ? undefined : siteType,
    q: searchQuery || undefined
  })
  
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Combine back-end data
  const allCombinedItems = useMemo(() => {
    return performances.map(p => ({
      id: p.id,
      title: p.title,
      client: p.client || '느티나무협동조합',
      category: p.category || '시공사례',
      image: p.thumbnail_url || '/images/hero-bg.jpg',
      year: p.year?.toString() || (p.construction_date ? new Date(p.construction_date).getFullYear().toString() : ''),
      tags: [p.job_main_category, p.site_type].filter(Boolean) as string[],
      content: p.content,
      isBackend: true
    }))
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
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center">
            <span className="text-label">Portfolio</span>
            <p className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">시공 사례</p>
            <p className="mt-6 max-w-2xl text-lg text-gray-500 mx-auto font-bold leading-relaxed">
              느티나무협동조합이 걸어온 건강한 녹지 관리의 발자취입니다.
            </p>
          </div>
          
          {isAdmin && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-deep text-white px-8 py-3.5 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-deep/10"
              >
                <Plus size={20} />
                사례 등록하기
              </button>
            </div>
          )}
        </div>

        {/* Search & Advanced Filters */}
        <div className="mb-16 space-y-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input 
              type="text"
              placeholder="작업명, 발주처, 대상지 등으로 검색하세요"
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-surface bg-surface/50 focus:bg-white focus:border-primary outline-none font-bold text-lg transition-all shadow-sm focus:shadow-xl focus:shadow-primary/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-surface/30 p-8 rounded-[2.5rem] border border-black/5">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                <Calendar size={14} /> 연도
              </label>
              <select 
                className="w-full bg-white border-none rounded-xl px-4 py-3.5 font-bold text-deep shadow-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                value={year || ''}
                onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">전체</option>
                {years.map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                <Wrench size={14} /> 작업분류
              </label>
              <select 
                className="w-full bg-white border-none rounded-xl px-4 py-3.5 font-bold text-deep shadow-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                value={jobMain || ''}
                onChange={(e) => setJobMain(e.target.value || undefined)}
              >
                <option value="">전체</option>
                {jobCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                <MapPin size={14} /> 대상지분류
              </label>
              <select 
                className="w-full bg-white border-none rounded-xl px-4 py-3.5 font-bold text-deep shadow-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                value={siteType || ''}
                onChange={(e) => setSiteType(e.target.value || undefined)}
              >
                <option value="">전체</option>
                {siteTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                <Filter size={14} /> 사업분야
              </label>
              <select 
                className="w-full bg-white border-none rounded-xl px-4 py-3.5 font-bold text-deep shadow-sm outline-none focus:ring-2 focus:ring-primary transition-all"
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-6"></div>
            <p className="text-gray-400 font-bold tracking-tight">기록을 불러오고 있습니다...</p>
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