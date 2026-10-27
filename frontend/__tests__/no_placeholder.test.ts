import fs from 'fs'
import path from 'path'

/**
 * 시안의 대괄호 자리표시 문구가 화면에 새어 나가는 것을 막는다.
 *
 * 디자인 시안은 확정되지 않은 내용을 `[진단 방식 확정 필요 …]`, `[본수 기입]`
 * 처럼 대괄호로 표시해 두었다. 구현에서는 해당 값을 null 로 두고 대체 문구를
 * 쓰거나 숨기기로 했으므로, 소스 어디에도 이런 문구가 남아 있으면 안 된다.
 *
 * 줄 단위로 검사한다. 파일 전체에 걸면 `[^\]]` 가 줄바꿈을 넘어가서
 * "횟수를 정합니다" 같은 정상 문구가 든 배열 리터럴 `[ … ]` 까지 잡힌다.
 */
const SRC_DIR = path.join(__dirname, '..', 'src')
const PLACEHOLDER = /\[(?:[^\]]*(확정 필요|기입|교체|견적 기준|횟수))[^\]]*\]/

function collectSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectSourceFiles(full)
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : []
  })
}

describe('시안 자리표시 문구', () => {
  it('소스 어디에도 대괄호 자리표시 문구가 없다', () => {
    const offenders = collectSourceFiles(SRC_DIR).filter((file) =>
      fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .some((line) => PLACEHOLDER.test(line))
    )

    expect(
      offenders.map((f) => path.relative(SRC_DIR, f))
    ).toEqual([])
  })
})
