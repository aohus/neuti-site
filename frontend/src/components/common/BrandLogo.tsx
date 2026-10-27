import Image from 'next/image'

/**
 * 공식 로고(assets/logo/로고 원본.jpg)를 벡터로 옮긴 public/brand/*.svg 를 쓴다.
 * 텍스트로 상호를 흉내 내지 말고 이 컴포넌트를 쓸 것 — 헤더·푸터·로그인이 같은 로고를 공유한다.
 *
 * - horizontal: 심볼 + 워드마크 가로 배치. 헤더·푸터처럼 높이가 낮은 자리
 * - stacked: 원본과 같은 세로 배치. 여백이 넉넉한 단독 영역
 * - symbol: 나무 심볼만. 아이콘·워터마크 자리
 *
 * SVG 는 최적화 대상이 아니라 unoptimized 로 원본을 그대로 내려보낸다.
 */
const LOGOS = {
  horizontal: { src: '/brand/logo-horizontal.svg', width: 1148, height: 211 },
  'horizontal-white': { src: '/brand/logo-horizontal-white.svg', width: 1148, height: 211 },
  stacked: { src: '/brand/logo.svg', width: 850, height: 833 },
  symbol: { src: '/brand/logo-symbol.svg', width: 840, height: 653 },
  'symbol-white': { src: '/brand/logo-symbol-white.svg', width: 840, height: 653 },
} as const

export type BrandLogoVariant = keyof typeof LOGOS

interface BrandLogoProps {
  variant?: BrandLogoVariant
  /** 높이는 className(h-*)으로 정하고 너비는 비율대로 따라간다. */
  className?: string
  priority?: boolean
  /** 장식용(옆에 상호 텍스트가 이미 있음)이면 빈 alt 로 스크린리더에서 숨긴다. */
  decorative?: boolean
}

export default function BrandLogo({
  variant = 'horizontal',
  className = '',
  priority = false,
  decorative = false,
}: BrandLogoProps) {
  const { src, width, height } = LOGOS[variant]
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={decorative ? '' : '협동조합 느티나무병원'}
      priority={priority}
      unoptimized
      className={`w-auto ${className}`}
    />
  )
}

/**
 * 브랜드 색 배경(CTA 등) 오른쪽 아래에 깔리는 흰 심볼 워터마크.
 * 부모 섹션에 relative + overflow-hidden 이, 본문에는 relative z-10 이 있어야 한다.
 */
export function BrandWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-16 -bottom-20 opacity-[0.07] md:-right-10 md:-bottom-24"
    >
      <BrandLogo variant="symbol-white" decorative className="h-64 md:h-[28rem]" />
    </div>
  )
}
