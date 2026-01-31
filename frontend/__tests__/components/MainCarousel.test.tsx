import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MainCarousel from '@/components/common/MainCarousel'

// Mock Next.js Image and Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('MainCarousel', () => {
  it('renders first slide initially', () => {
    render(<MainCarousel />)
    expect(screen.getByText(/자연과 사람이 함께 누리는/i)).toBeInTheDocument()
    expect(screen.getByText(/조합 소개 바로가기/i)).toBeInTheDocument()
  })
})
