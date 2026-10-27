import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BusinessPage from '@/app/business/page'

describe('BusinessPage', () => {
  it('renders business overview page content', () => {
    render(<BusinessPage />)
 
    expect(screen.getByText(/주요 사업/i)).toBeInTheDocument()
    expect(screen.getByText(/나무병원 사업/i)).toBeInTheDocument()
    expect(screen.getByText(/조경식재 사업/i)).toBeInTheDocument()
  })
})

describe('TreeHospitalSection 재선충 스포트라이트', () => {
  it('나무병원 섹션에서 재선충 현장진단 페이지로 연결한다', () => {
    render(<BusinessPage />)

    expect(
      screen.getByRole('link', { name: /소나무재선충병 현장진단/ })
    ).toHaveAttribute('href', '/pine-wilt')
  })

  it('사진 그리드에 2025년 공원 방제 현장 사진을 쓴다', () => {
    render(<BusinessPage />)

    expect(
      screen.getByAltText('2025년 수정·중원구 공원 산림·돌발해충 방제 현장')
    ).toBeInTheDocument()
  })
})
