import { useState, useMemo, useEffect } from 'react'
import { Project } from '@/types/project'
import { getAllProjects } from '@/lib/projects'

const ITEMS_PER_PAGE = 9

export default function useProjects() {
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setPage] = useState(1)
  
  const allProjects = useMemo(() => getAllProjects(), [])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }, [allProjects, category, searchQuery])

  // Reset page when filter changes
  useEffect(() => {
    setPage(1)
  }, [category, searchQuery])

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredProjects.slice(start, end)
  }, [filteredProjects, currentPage])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)

  return {
    projects: filteredProjects,
    paginatedProjects,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setPage,
    totalPages
  }
}
