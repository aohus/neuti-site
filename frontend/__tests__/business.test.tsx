import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BusinessPage from '@/app/business/page'

describe('BusinessPage', () => {
  it('renders business overview page content', () => {
    render(<BusinessPage />)
 
    expect(screen.getByText(/주요 사업/i)).toBeInTheDocument()
    expect(screen.getByText(/나무병원 사업/i)).toBeInTheDocument()
    expect(screen.getByText(/조경식재 사업/i)).toBeInTheDocument()
  })
})
