import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProjectGrid from '@/components/performance/ProjectGrid'
import { Project } from '@/types/project'

const mockProjects: Project[] = [
  { id: 1, title: 'Project 1', category: 'Cat 1', client: 'Client 1', role: 'Role 1', tags: [], image: '' },
  { id: 2, title: 'Project 2', category: 'Cat 2', client: 'Client 2', role: 'Role 2', tags: [], image: '' },
]

describe('ProjectGrid', () => {
  it('renders a grid of project cards', () => {
    render(<ProjectGrid projects={mockProjects} />)
    
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })

  it('renders a message when the project list is empty', () => {
    render(<ProjectGrid projects={[]} />)
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument()
  })
})
