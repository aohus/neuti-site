import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import WhyUs, { strengths } from '@/components/home/WhyUs'

describe('WhyUs', () => {
  it('강점 항목을 모두 노출한다', () => {
    render(<WhyUs />)
    for (const item of strengths) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    }
  })

  it('나무의사의 진단·처방을 앞세운다', () => {
    const { container } = render(<WhyUs />)
    expect(container.textContent).toContain('나무의사')
  })

  /**
   * 수목 진료만 하는 회사가 아니다. 실적상 계절꽃 식재·화단 조성이
   * 녹지관리 다음으로 많은 공종이라, 수목에만 치우친 카피는 사업 범위를
   * 실제보다 좁게 보이게 한다.
   */
  it('식재·화단 조성까지 다루는 것을 함께 밝힌다', () => {
    const { container } = render(<WhyUs />)
    for (const term of ['관목', '계절꽃', '화단', '잔디']) {
      expect(container.textContent).toContain(term)
    }
  })

  it('여성기업 협동조합임을 밝힌다', () => {
    const { container } = render(<WhyUs />)
    expect(container.textContent).toContain('여성기업')
  })

  /**
   * 홈은 계약 담당자만 오는 곳이 아니다. 수의계약·증빙 같은 발주 절차 용어는
   * `/contract` 에서 다루고, 홈에서는 나무를 다루는 방식만 이야기한다.
   */
  it('발주 절차 용어를 홈에 노출하지 않는다', () => {
    const { container } = render(<WhyUs />)
    for (const term of ['수의계약', '견적서', '실적증명', '자격증빙', '감사']) {
      expect(container.textContent).not.toContain(term)
    }
  })

  it('견적 소요 기간을 약속하지 않는다', () => {
    const { container } = render(<WhyUs />)
    expect(container.textContent).not.toMatch(/즉일|영업일/)
  })

  it('수의계약 페이지로 유도하지 않는다', () => {
    render(<WhyUs />)
    const contractLinks = screen
      .queryAllByRole('link')
      .filter((el) => el.getAttribute('href') === '/contract')
    expect(contractLinks).toHaveLength(0)
  })
})
