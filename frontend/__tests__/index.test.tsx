import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

describe('Page', () => {
  it('renders the homepage with Neuti title', () => {
    render(<Page />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('느티나무 협동조합 나무병원')
  })
})
