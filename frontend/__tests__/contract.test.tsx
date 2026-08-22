import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import { render, screen, fireEvent } from '@testing-library/react'
import ContractContent from '@/app/contract/ContractContent'
import {
  contractProjects,
  VISIBLE_PROJECT_COUNT,
} from '@/data/contract-projects'

// Mock Next/Image — 로고 렌더링만 확인하면 되므로 alt/src 만 넘긴다
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

/** '녹지관리' 는 실적이 가장 많아(20건) 접기/펼치기 검증에 쓴다. */
const MANY = contractProjects.녹지관리
/** '위험목제거' 는 3건뿐이라 더보기 버튼이 없어야 한다. */
const FEW = contractProjects.위험목제거

describe('ContractContent 실적 목록', () => {
  it('접힌 상태에서는 카테고리별로 상위 N건만 노출한다', () => {
    render(<ContractContent />)

    expect(screen.getByText(MANY[VISIBLE_PROJECT_COUNT - 1].name)).toBeInTheDocument()
    expect(
      screen.queryByText(MANY[VISIBLE_PROJECT_COUNT].name)
    ).not.toBeInTheDocument()
  })

  it('실적이 N건을 넘으면 남은 건수를 표시한 더보기 버튼을 보여준다', () => {
    render(<ContractContent />)

    const remaining = MANY.length - VISIBLE_PROJECT_COUNT
    expect(
      screen.getByRole('button', { name: `녹지관리 실적 ${remaining}건 더보기` })
    ).toBeInTheDocument()
  })

  it('더보기를 누르면 해당 카테고리의 나머지 실적이 모두 펼쳐진다', () => {
    render(<ContractContent />)

    fireEvent.click(
      screen.getByRole('button', {
        name: `녹지관리 실적 ${MANY.length - VISIBLE_PROJECT_COUNT}건 더보기`,
      })
    )

    for (const project of MANY) {
      expect(screen.getAllByText(project.name).length).toBeGreaterThan(0)
    }
  })

  it('펼친 뒤 접기를 누르면 다시 상위 N건만 남는다', () => {
    render(<ContractContent />)

    fireEvent.click(
      screen.getByRole('button', {
        name: `녹지관리 실적 ${MANY.length - VISIBLE_PROJECT_COUNT}건 더보기`,
      })
    )
    fireEvent.click(screen.getByRole('button', { name: '녹지관리 실적 접기' }))

    expect(
      screen.queryByText(MANY[VISIBLE_PROJECT_COUNT].name)
    ).not.toBeInTheDocument()
  })

  it('한 카테고리를 펼쳐도 다른 카테고리는 접힌 상태를 유지한다', () => {
    render(<ContractContent />)

    const flowers = contractProjects.꽃식재
    fireEvent.click(
      screen.getByRole('button', {
        name: `녹지관리 실적 ${MANY.length - VISIBLE_PROJECT_COUNT}건 더보기`,
      })
    )

    expect(
      screen.queryByText(flowers[VISIBLE_PROJECT_COUNT].name)
    ).not.toBeInTheDocument()
  })

  it('실적이 N건 이하인 카테고리에는 더보기 버튼이 없다', () => {
    render(<ContractContent />)

    expect(FEW.length).toBeLessThanOrEqual(VISIBLE_PROJECT_COUNT)
    expect(
      screen.queryByRole('button', { name: /위험목 제거 실적 .*더보기/ })
    ).not.toBeInTheDocument()
  })
})

describe('ContractContent 시공사례 링크', () => {
  it('모든 서비스 카드가 job_main 필터가 붙은 시공사례 링크를 가진다', () => {
    render(<ContractContent />)

    const links = screen
      .getAllByRole('link', { name: /시공 사례 보기/ })
      .map((a) => a.getAttribute('href'))

    expect(links).toHaveLength(Object.keys(contractProjects).length)
    for (const href of links) {
      expect(href).toMatch(/^\/performance\?job_main=/)
    }
  })

  // 링크 형태만 맞고 값이 틀리면 필터 결과가 빈 목록이 된다. 값 자체를 고정한다.
  it('링크의 job_main 값이 전부 실제 카테고리 키다', () => {
    render(<ContractContent />)

    const keys = screen
      .getAllByRole('link', { name: /시공 사례 보기/ })
      .map((a) =>
        decodeURIComponent(a.getAttribute('href')!.split('job_main=')[1])
      )

    for (const key of keys) {
      expect(Object.keys(contractProjects)).toContain(key)
    }
  })
})

describe('contractProjects 데이터 무결성', () => {
  it('같은 카테고리 안에 name+year 가 겹치는 실적이 없다', () => {
    // 리스트 key 를 `name-year` 로 만들기 때문에 겹치면 React key 가 충돌한다.
    for (const [category, projects] of Object.entries(contractProjects)) {
      const keys = projects.map((p) => `${p.name}-${p.year}`)
      expect(new Set(keys).size).toBe(keys.length)
      expect(category).toBeTruthy()
    }
  })

  it('모든 실적이 이름·발주처·연도를 갖춘다', () => {
    for (const projects of Object.values(contractProjects)) {
      for (const p of projects) {
        expect(p.name.trim()).not.toBe('')
        expect(p.client.trim()).not.toBe('')
        expect(p.year).toMatch(/^20\d{2}$/)
      }
    }
  })
})

/**
 * 이 페이지가 한 번 무너졌던 지점이다. 카드 키와 시공사례 md 의
 * job_main_category 가 어긋나면 "시공 사례 보기" 가 조용히 빈 목록으로 간다.
 * 프론트 타입만으로는 백엔드 쪽 값을 볼 수 없어 md 를 직접 읽어 고정한다.
 */
describe('카드 키 ↔ 시공사례 job_main_category 정합성', () => {
  const PERFORMANCES_DIR = path.join(
    __dirname,
    '..',
    '..',
    'backend',
    'data',
    'performances'
  )

  function readJobMainCategories(): string[] {
    return fs
      .readdirSync(PERFORMANCES_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => fs.readFileSync(path.join(PERFORMANCES_DIR, f), 'utf-8'))
      .map((text) => text.match(/^job_main_category:\s*(.+)$/m)?.[1].trim())
      .filter((v): v is string => Boolean(v))
  }

  it('시공사례 md 디렉터리를 찾을 수 있다', () => {
    expect(fs.existsSync(PERFORMANCES_DIR)).toBe(true)
    expect(readJobMainCategories().length).toBeGreaterThan(0)
  })

  it('md 의 모든 job_main_category 가 카드 키에 존재한다', () => {
    const cardKeys = Object.keys(contractProjects)

    for (const category of new Set(readJobMainCategories())) {
      expect(cardKeys).toContain(category)
    }
  })

  it('모든 카드 키가 최소 1건의 시공사례를 가진다', () => {
    const categories = new Set(readJobMainCategories())

    for (const key of Object.keys(contractProjects)) {
      expect(Array.from(categories)).toContain(key)
    }
  })
})

describe('ContractContent 발주처', () => {
  it('로고가 없는 주요 발주처를 텍스트로 함께 노출한다', () => {
    render(<ContractContent />)

    expect(screen.getByText('서울동부지방검찰청')).toBeInTheDocument()
    expect(screen.getByText('서울강남구청')).toBeInTheDocument()
    expect(screen.getByText('성남교육지원청')).toBeInTheDocument()
  })
})
