import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import LatestUpdates from '@/components/common/LatestUpdates'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock projects lib
jest.mock('@/lib/projects', () => ({
  getAllProjects: () => [{ id: 1, title: 'Project X', category: 'Cat', client: 'Client', role: 'Role', tags: [], image: '/img.jpg' }]
}))

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('LatestUpdates', () => {
  it('renders project data from lib', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] }) // Empty notices
    render(<LatestUpdates />)
    
    await waitFor(() => {
      expect(screen.getByText('Project X')).toBeInTheDocument()
    })
  })
})
