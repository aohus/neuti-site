import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PerformancePage from '@/app/performance/page'
import { Project } from '@/types/project'

// Mock data
const mockProjects: Project[] = [
  { id: 1, title: 'Project A', category: 'Cat 1', client: 'Client A', role: 'Role 1', tags: [], image: '/img.jpg' },
  { id: 2, title: 'Project B', category: 'Cat 2', client: 'Client B', role: 'Role 2', tags: [], image: '/img.jpg' },
]

jest.mock('@/lib/projects', () => ({
  getAllProjects: () => mockProjects,
  getProjectCategories: () => ['Cat 1', 'Cat 2']
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('PerformancePage', () => {
  it('renders page and filters projects', async () => {
    render(<PerformancePage />)
    
    expect(screen.getByText('주요 실적')).toBeInTheDocument()
    expect(screen.getByText('Project A')).toBeInTheDocument()
    expect(screen.getByText('Project B')).toBeInTheDocument()
    
    // Filter by Cat 1 (Click the button)
    const filterButton = screen.getByRole('button', { name: 'Cat 1' })
    fireEvent.click(filterButton)
    
    expect(screen.getByText('Project A')).toBeInTheDocument()
    expect(screen.queryByText('Project B')).not.toBeInTheDocument()
  })
})
