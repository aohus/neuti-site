// 공유 썸네일(로고 카드). 하위 layout/page 가 metadata.openGraph 를 선언하면
// 상위 openGraph 가 통째로 교체되므로, openGraph 를 쓰는 곳마다 images 에 이걸 넣어야 한다.
export const DEFAULT_OG_IMAGE = {
  url: '/brand/og-image.png',
  width: 1200,
  height: 630,
  alt: '협동조합 느티나무병원 로고',
}
