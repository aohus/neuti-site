'use client'

import { useMemo } from 'react'
import useProjects from '@/hooks/useProjects'
import ProjectGrid from '@/components/performance/ProjectGrid'
import CategoryFilter from '@/components/performance/CategoryFilter'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { getProjectCategories } from '@/lib/projects'

export default function PerformancePage() {
  const {
    paginatedProjects,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setPage,
    totalPages
  } = useProjects()

  // In a real app, this might be fetched server-side or statically
  const categories = useMemo(() => getProjectCategories(), [])

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Portfolio</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">주요 실적</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            느티나무협동조합이 걸어온 건강한 녹지 관리의 발자취입니다.
          </p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <CategoryFilter 
          categories={categories} 
          selected={category} 
          onSelect={setCategory} 
        />

        <ProjectGrid projects={paginatedProjects} />

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  )
}
