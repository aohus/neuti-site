import { contractProjects } from '@/data/contract-projects'
import { clientLogos, getOtherClientNames } from '@/data/clients'

const ledgerClients = new Set(
  Object.values(contractProjects)
    .flat()
    .map((p) => p.client)
)

describe('clientLogos', () => {
  it('같은 로고를 중복 배치하지 않는다', () => {
    const srcs = clientLogos.map((c) => c.src)
    expect(new Set(srcs).size).toBe(srcs.length)
  })

  it('로고가 대표하는 발주처 이름은 원장에 실제로 존재한다', () => {
    for (const logo of clientLogos) {
      for (const name of logo.ledgerNames) {
        expect(ledgerClients.has(name)).toBe(true)
      }
    }
  })
})

describe('getOtherClientNames', () => {
  const others = getOtherClientNames()

  it('로고로 이미 노출한 발주처는 제외한다', () => {
    const covered = new Set(clientLogos.flatMap((c) => c.ledgerNames))
    for (const name of others) {
      expect(covered.has(name)).toBe(false)
    }
  })

  it('로고분을 뺀 나머지 발주처를 하나도 빠뜨리지 않는다', () => {
    const covered = new Set(clientLogos.flatMap((c) => c.ledgerNames))
    const expected = [...ledgerClients].filter((name) => !covered.has(name))
    expect(new Set(others)).toEqual(new Set(expected))
  })

  it('중복 없이 반환한다', () => {
    expect(new Set(others).size).toBe(others.length)
  })

  it('실적이 많은 발주처부터 정렬한다', () => {
    const countOf = (client: string) =>
      Object.values(contractProjects)
        .flat()
        .filter((p) => p.client === client).length

    for (let i = 1; i < others.length; i++) {
      expect(countOf(others[i - 1])).toBeGreaterThanOrEqual(countOf(others[i]))
    }
  })

  it('학교·행정복지센터 등 소규모 발주처도 포함한다', () => {
    expect(others.some((n) => /초등학교|여자고등학교|고등학교/.test(n))).toBe(true)
    expect(others.some((n) => /행정복지센터/.test(n))).toBe(true)
    expect(others.filter((n) => /동$|동 /.test(n)).length).toBeGreaterThanOrEqual(6)
  })
})
