import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ClientLogos from '@/components/home/ClientLogos'
import { clientLogos, getOtherClientNames } from '@/data/clients'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

describe('ClientLogos', () => {
  it('발주처 로고를 중복 없이 모두 노출한다', () => {
    render(<ClientLogos />)
    for (const client of clientLogos) {
      expect(screen.getByAltText(client.name)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('img')).toHaveLength(clientLogos.length)
  })

  it('로고가 없는 발주처를 하나도 빠뜨리지 않고 병기한다', () => {
    render(<ClientLogos />)
    for (const name of getOtherClientNames()) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('실적 건수는 노출하지 않는다', () => {
    const { container } = render(<ClientLogos />)
    expect(container.textContent).not.toMatch(/\d+건/)
  })

  it('견적 소요 기간을 약속하지 않는다', () => {
    const { container } = render(<ClientLogos />)
    expect(container.textContent).not.toMatch(/즉일|영업일/)
  })
})
