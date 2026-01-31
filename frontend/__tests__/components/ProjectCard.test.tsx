import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProjectCard from '@/components/performance/ProjectCard'
import { Project } from '@/types/project'

const mockProject: Project = {
  id: 1,
  title: '테스트 공사',
  category: '나무병원',
  client: '테스트 발주처',
  role: '원도급',
  year: '2024',
  description: '테스트 설명입니다.',
  tags: ['나무병원'],
  image: '/images/projects/placeholder.jpg'
}

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)
 
    expect(screen.getByText(mockProject.title)).toBeInTheDocument()
    expect(screen.getByText(mockProject.client)).toBeInTheDocument()
    expect(screen.getByText(mockProject.category)).toBeInTheDocument()
  })
})
