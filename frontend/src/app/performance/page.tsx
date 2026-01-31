'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePerformances } from '@/hooks/usePerformance'
import useProjects from '@/hooks/useProjects'
import PerformanceForm from '@/components/performance/PerformanceForm'
import ProjectGrid from '@/components/performance/ProjectGrid'
import CategoryFilter from '@/components/performance/CategoryFilter'
import SearchBar from '@/components/common/SearchBar'
import Pagination from '@/components/common/Pagination'
import { getProjectCategories } from '@/lib/projects'
import { Plus } from 'lucide-react'

export default function PerformancePage() {
  const { isAdmin } = useAuth()
  const { performances, isLoading: isBackLoading, refresh } = usePerformances()
  const { projects: localProjects } = useProjects()
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  // Combine back-end data and local data
  const allCombinedItems = useMemo(() => {
    // Convert back-end Performance to Project-like type
    const adaptedBackItems = performances.map(p => ({
      id: p.id,
      title: p.title,
      client: p.client || '느티나무협동조합',
      category: '시공사례',
      image: p.thumbnail_url || '/images/hero-bg.jpg',
      year: p.construction_date ? new Date(p.construction_date).getFullYear().toString() : '',
      tags: ['나무병원', '수목관리'],
      content: p.content,
      isBackend: true
    }))

    // Mark local items
    const markedLocalItems = localProjects.map(p => ({
      ...p,
      isBackend: false
    }))

    // Backend items first
    return [...adaptedBackItems, ...markedLocalItems]
  }, [performances, localProjects])

  // Filter combined data
  const filteredItems = useMemo(() => {
    return allCombinedItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }, [allCombinedItems, category, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const categories = useMemo(() => getProjectCategories(), [])

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Portfolio</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">시공 사례</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              느티나무협동조합이 걸어온 건강한 녹지 관리의 발자취입니다.
            </p>
          </div>
          
          {isAdmin && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                새 사례 등록
              </button>
            </div>
          )}
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <CategoryFilter 
          categories={categories} 
          selected={category} 
          onSelect={setCategory} 
        />

        {isBackLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700 mb-4"></div>
            <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
          </div>
        ) : (
          <ProjectGrid projects={paginatedItems as any} />
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
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
