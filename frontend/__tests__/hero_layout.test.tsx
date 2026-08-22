import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MainCarousel from '../src/components/common/MainCarousel'

type NextImageMockProps = React.ComponentProps<'img'> & {
  fill?: boolean
  priority?: boolean
}

// Mock Next/Image — fill/priority 는 DOM 속성이 아니므로 걷어낸다
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill, priority, ...props }: NextImageMockProps) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('MainCarousel Layout', () => {
  it('has correct top padding to avoid navbar overlap', () => {
    render(<MainCarousel />)

    // 히어로 제목을 기준으로 Container 를 거슬러 올라간다.
    // 중간에 래퍼가 추가되어도 깨지지 않도록 parentElement 대신 closest 를 쓴다.
    const title = screen.getByRole('heading', { name: /나무를 살리는 기술/ })
    const container = title.closest('[class*="pt-20"]')

    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('pt-20')
    expect(container).toHaveClass('md:pt-24')
  })
})
