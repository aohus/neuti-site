import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ClientBanner from '../src/components/common/ClientBanner'

// Mock Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('ClientBanner Component', () => {
  it('renders all client logos', () => {
    render(<ClientBanner />)
    
    const logos = [
      'gyeonggi.jpg',
      'gongsuchco.jpg',
      'seongnam_dev.jpg',
      'seongnam_city.png',
      'gov_complex.png'
    ]
    
    logos.forEach(logo => {
      const img = screen.getAllByAltText(new RegExp(logo.split('.')[0], 'i'))
      expect(img.length).toBeGreaterThan(0)
    })
  })

  it('contains duplicates for infinite scrolling effect', () => {
    const { container } = render(<ClientBanner />)
    // 무한 스크롤을 위해 최소 2번 이상 반복되어야 함
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThanOrEqual(10) // 5개 로고 * 2세트 이상
  })
})
