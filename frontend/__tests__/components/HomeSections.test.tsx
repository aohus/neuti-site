import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MissionSection, LandscapingSection, TreeHospitalSection } from '@/components/common/HomeSections'

// Mock Next.js Image and Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('HomeSections', () => {
  it('renders MissionSection', () => {
    render(<MissionSection />)
    expect(screen.getByText(/최고의 기술력과 전문성으로/i)).toBeInTheDocument()
  })

  it('renders LandscapingSection', () => {
    render(<LandscapingSection />)
    expect(screen.getByText('조경/정원 사업')).toBeInTheDocument()
  })

  it('renders TreeHospitalSection', () => {
    render(<TreeHospitalSection />)
    expect(screen.getByText('나무병원 (1종)')).toBeInTheDocument()
    expect(screen.getByText('수목피해 진단/처방')).toBeInTheDocument()
  })
})
