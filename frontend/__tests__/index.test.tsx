import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

// Mock components that use fetch or framer-motion animations
jest.mock('@/components/home/StatisticsDashboard', () => {
  return function MockStats() { return <div data-testid="stats-dashboard">Stats</div> }
})

describe('Home Page', () => {
  it('renders all strategic sections correctly', () => {
    render(<Page />)
 
    // Hero check (Carousel)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings.length).toBeGreaterThan(0)

    // Strategic sections check
    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument()
    expect(screen.getByText(/맞춤형 관리로/i)).toBeInTheDocument()
    expect(screen.getByText(/데이터와 과학으로/i)).toBeInTheDocument()
  })
})
