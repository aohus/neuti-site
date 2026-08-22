import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

describe('AboutPage', () => {
  it('renders the hero heading', () => {
    render(<AboutPage />)

    expect(
      screen.getByText('자연과 사람이 함께 건강한 세상')
    ).toBeInTheDocument()
  })

  it('renders every section heading', () => {
    render(<AboutPage />)

    const headings = [
      '미션과 비전',
      '느티나무병원 협동조합의 발자취',
      '신뢰할 수 있는 전문 기술력',
      '오시는 길',
    ]

    headings.forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument()
    })
  })

  it('renders the mission and vision cards', () => {
    render(<AboutPage />)

    expect(screen.getByText('MISSION')).toBeInTheDocument()
    expect(screen.getByText('VISION')).toBeInTheDocument()
    expect(
      screen.getByText('자연과 사람이 함께 누리는 건강한 녹지를 만든다')
    ).toBeInTheDocument()
  })
})
