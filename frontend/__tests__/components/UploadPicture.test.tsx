import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UploadPicture from '@/components/common/UploadPicture'

describe('UploadPicture', () => {
  it('모바일에는 썸네일만, 넓은 화면에는 원본까지 후보로 준다', () => {
    const { container } = render(
      <UploadPicture src="/uploads/현장/a.jpg" alt="전경" sizes="100vw" />,
    )

    const source = container.querySelector('picture > source')
    expect(source).toHaveAttribute('media', '(max-width: 767px)')
    expect(source).toHaveAttribute(
      'srcset',
      '/backend-api/thumb/480/현장/a.jpg 480w, /backend-api/thumb/960/현장/a.jpg 960w',
    )
    const img = screen.getByAltText('전경')
    expect(img).toHaveAttribute('src', '/uploads/현장/a.jpg')
    expect(img.getAttribute('srcset')).toContain('/uploads/현장/a.jpg 1600w')
    expect(img).toHaveAttribute('sizes', '100vw')
  })

  it('uploads 이미지가 아니면 picture 없이 그냥 img 를 그린다', () => {
    const { container } = render(
      <UploadPicture src="https://cdn.example.com/a.jpg" alt="외부" loading="lazy" />,
    )

    expect(container.querySelector('picture')).toBeNull()
    const img = screen.getByAltText('외부')
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/a.jpg')
    expect(img).not.toHaveAttribute('srcset')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
