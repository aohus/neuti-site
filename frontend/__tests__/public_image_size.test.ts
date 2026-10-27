import fs from 'fs'
import path from 'path'

/**
 * public/images 에 무압축 원본(장당 4~7MB, 4000px)이 다시 들어오는 것을 막는다.
 *
 * next/image 가 폭별로 변환해 주긴 하지만, 프론트 컨테이너는 CPU 0.5 개라
 * 원본이 크면 첫 변환이 장당 0.5~1초 걸려 모바일에서 사진이 늦게 뜬다.
 * 2026-10-27 에 109MB → 37MB 로 재압축했다. 새 사진은 아래로 줄여서 커밋할 것:
 *   backend/.venv/bin/python scripts/compress_images.py frontend/public/images --max-edge 2560 --quality 85
 */
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function collectImages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectImages(full)
    return /\.(jpe?g|png|webp)$/i.test(entry.name) ? [full] : []
  })
}

describe('public/images 용량', () => {
  it(`모든 이미지가 ${MAX_IMAGE_BYTES / 1024 / 1024}MB 이하다`, () => {
    const oversized = collectImages(IMAGES_DIR)
      .filter((file) => fs.statSync(file).size > MAX_IMAGE_BYTES)
      .map((file) => path.relative(IMAGES_DIR, file))

    expect(oversized).toEqual([])
  })
})
