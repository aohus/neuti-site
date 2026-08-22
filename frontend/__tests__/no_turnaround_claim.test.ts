import fs from 'fs'
import path from 'path'

/**
 * 견적 소요 기간을 약속하는 문구가 다시 새어들어오는 것을 막는다.
 *
 * 견적은 현장 답사를 거쳐야 나오므로 "즉일 발급" "1영업일 이내" 같은 표현은
 * 지킬 수 없는 약속이다. 본문뿐 아니라 검색 결과에 그대로 노출되는
 * metadata 에도 들어가 있어서, 소스 전체를 훑어 한 곳도 남기지 않는다.
 */
const SRC_DIR = path.join(__dirname, '..', 'src')
const FORBIDDEN = /즉일|영업일/

function collectSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectSourceFiles(full)
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : []
  })
}

describe('견적 소요 기간 약속', () => {
  it('소스 어디에도 즉일·영업일 발급 문구가 없다', () => {
    const offenders = collectSourceFiles(SRC_DIR).filter((file) =>
      FORBIDDEN.test(fs.readFileSync(file, 'utf8'))
    )

    expect(
      offenders.map((f) => path.relative(SRC_DIR, f))
    ).toEqual([])
  })
})
