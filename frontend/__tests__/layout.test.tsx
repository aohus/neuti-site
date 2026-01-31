import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Layout from '@/components/Layout'

// Mock Navbar to focus on Layout functionality
jest.mock('@/components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>
  }
})

describe('Layout', () => {
  it('renders navbar and children', () => {
    render(
      <Layout>
        <div data-testid="child">Content</div>
      </Layout>
    )
 
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
