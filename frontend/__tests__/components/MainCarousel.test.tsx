import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MainCarousel from '@/components/common/MainCarousel'

type NextImageMockProps = React.ComponentProps<'img'> & {
  fill?: boolean
  priority?: boolean
}

// Mock Next.js Image — fill/priority 는 DOM 속성이 아니므로 걷어낸다
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill, priority, ...props }: NextImageMockProps) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))

describe('MainCarousel', () => {
  it('renders the hero copy', () => {
    render(<MainCarousel />)

    expect(screen.getByText('산림청 지정 1종 나무병원')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /나무를 살리는 기술/ })
    ).toBeInTheDocument()
  })

  it('renders both call-to-action links', () => {
    render(<MainCarousel />)

    const inquiry = screen.getByRole('link', { name: /견적·상담 문의/ })
    expect(inquiry).toHaveAttribute('href', '/request')

    const contract = screen.getByRole('link', { name: /수의계약 안내/ })
    expect(contract).toHaveAttribute('href', '/contract')
  })
})
