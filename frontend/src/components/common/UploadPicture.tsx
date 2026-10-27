import type { ImgHTMLAttributes } from 'react'
import { uploadSrcSet } from '@/lib/thumb'

// 이 폭 이하(휴대폰)에서는 썸네일(최대 960w)만 후보로 준다. 3배 밀도 화면은
// 원본(1600px)을 고르는데, 히어로·본문 사진은 960px 로도 충분히 선명하고
// 용량은 3분의 1 이하라 모바일 체감 속도를 우선한다.
const MOBILE_MEDIA = '(max-width: 767px)'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string
  alt: string
}

/** uploads 사진용 `<img>`. 모바일은 썸네일, 넓은 화면은 원본까지 후보로 쓴다. */
export default function UploadPicture({ src, alt, sizes, ...img }: Props) {
  const mobileSrcSet = uploadSrcSet(src)
  if (!mobileSrcSet) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} sizes={sizes} {...img} />
  }
  return (
    // display: contents — 감싼 picture 가 레이아웃에 끼어들지 않게 해 img 의
    // h-full·object-cover 가 부모 박스를 기준으로 그대로 동작하게 한다.
    <picture className="contents">
      <source media={MOBILE_MEDIA} srcSet={mobileSrcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={uploadSrcSet(src, { withOriginal: true })}
        sizes={sizes}
        alt={alt}
        {...img}
      />
    </picture>
  )
}
