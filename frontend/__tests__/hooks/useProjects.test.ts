import { renderHook, act } from '@testing-library/react'
import useProjects from '@/hooks/useProjects'
import { Project } from '@/types/project'

// Mock data (Create enough for pagination, assuming 9 per page)
const mockProjects: Project[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Project ${i + 1}`,
  category: i % 2 === 0 ? 'Cat A' : 'Cat B',
  client: `Client ${i + 1}`,
  role: 'Role',
  tags: []
}))

// Mock the lib/projects function
jest.mock('@/lib/projects', () => ({
  getAllProjects: () => mockProjects
}))

describe('useProjects', () => {
  it('returns all projects initially (filtered)', () => {
    const { result } = renderHook(() => useProjects())
    expect(result.current.projects.length).toBe(mockProjects.length)
  })

  it('paginates projects', () => {
    const { result } = renderHook(() => useProjects())
    // Default page 1, verify slice
    // Assuming ITEMS_PER_PAGE is defined in hook, let's say 9
    // But implementation might vary. Let's check paginatedProjects
    expect(result.current.paginatedProjects.length).toBe(9)
    expect(result.current.paginatedProjects[0].id).toBe(1)
    
    act(() => {
      result.current.setPage(2)
    })
    
    expect(result.current.paginatedProjects.length).toBe(9)
    expect(result.current.paginatedProjects[0].id).toBe(10)
    
    act(() => {
      result.current.setPage(3)
    })
    
    expect(result.current.paginatedProjects.length).toBe(2) // 20 total, 9+9+2
  })

  it('resets page when filter changes', () => {
    const { result } = renderHook(() => useProjects())
    
    act(() => {
      result.current.setPage(2)
    })
    
    expect(result.current.currentPage).toBe(2)
    
    act(() => {
      result.current.setCategory('Cat A')
    })
    
    expect(result.current.currentPage).toBe(1)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useProjects())
    
    act(() => {
      result.current.setCategory('Cat A')
    })
    
    // Cat A items: 0, 2, 4 ... 18 (10 items)
    expect(result.current.projects.length).toBe(10)
    expect(result.current.paginatedProjects.length).toBe(9)
  })
})
