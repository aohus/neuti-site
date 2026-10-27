// uploads 이미지의 축소판 URL.
//
// uploads 원본은 장변 1600px 이라 모바일 목록 카드가 장당 300~600KB 를 받았다.
// next/image 는 uploads 에 쓸 수 없어서(RecentPortfolio 주석 참고) 백엔드
// /api/v1/thumb 가 폭을 줄인 WebP 를 만든다. 폭은 backend app/utils/thumbnail.py 의
// THUMB_WIDTHS 와 같아야 한다 — 그 밖의 폭은 404 다.

export const THUMB_WIDTHS = [480, 960] as const
export type ThumbWidth = (typeof THUMB_WIDTHS)[number]

// 원본 업로드 사진의 장변 (커밋 전 압축 기준)
const UPLOAD_ORIGINAL_WIDTH = 1600
const UPLOAD_IMAGE = /^\/uploads\/(.+\.(?:jpe?g|png|webp))$/i

/** 썸네일 경로. uploads 이미지가 아니면 원래 값을 그대로 돌려준다. */
export function thumbUrl(src: string, width: ThumbWidth): string {
  const match = UPLOAD_IMAGE.exec(src)
  return match ? `/backend-api/thumb/${width}/${match[1]}` : src
}

/** `<img srcSet>` 값. uploads 이미지가 아니면 undefined 라 속성 자체가 빠진다. */
export function uploadSrcSet(
  src: string,
  { withOriginal = false }: { withOriginal?: boolean } = {},
): string | undefined {
  if (!UPLOAD_IMAGE.test(src)) return undefined
  const candidates = THUMB_WIDTHS.map((w) => `${thumbUrl(src, w)} ${w}w`)
  const all = withOriginal ? [...candidates, `${src} ${UPLOAD_ORIGINAL_WIDTH}w`] : candidates
  return all.join(', ')
}
