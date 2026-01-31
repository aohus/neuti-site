import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

describe('Page', () => {
  it('renders the homepage with Neuti title', () => {
    render(<Page />)
 
    // Check if at least one of the carousel titles is present
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings.length).toBeGreaterThan(0)
    expect(headings[0]).toHaveTextContent(/자연과 사람이 함께 누리는/i)
  })
})
