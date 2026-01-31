import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

describe('AboutPage', () => {
  it('renders about us page content', () => {
    render(<AboutPage />)
 
    expect(screen.getByText(/느티나무병원 협동조합 소개/i)).toBeInTheDocument()
    expect(screen.getByText(/미션/i)).toBeInTheDocument()
    expect(screen.getByText(/비전/i)).toBeInTheDocument()
    expect(screen.getByText(/권정미/i)).toBeInTheDocument()
  })
})
