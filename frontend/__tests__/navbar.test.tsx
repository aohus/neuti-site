import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'

// Mock useAuth
jest.mock('@/context/AuthContext', () => ({
  ...jest.requireActual('@/context/AuthContext'),
  useAuth: () => ({
    isAdmin: false,
    logout: jest.fn()
  })
}))

describe('Navbar', () => {
  it('renders all navigation links', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )
 
    const links = [
      { name: '홈', href: '/' },
      { name: '회사소개', href: '/about' },
      { name: '주요사업', href: '/business' },
      { name: '시공 사례', href: '/performance' },
    ]

    links.forEach((link) => {
      const element = screen.getByText(link.name)
      expect(element).toBeInTheDocument()
      expect(element.closest('a')).toHaveAttribute('href', link.href)
    })
  })

  it('renders call-to-action links', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    const ctas = [
      { name: '수의계약', href: '/contract' },
      { name: '견적·상담문의', href: '/request' },
    ]

    ctas.forEach((cta) => {
      const element = screen.getByText(cta.name)
      expect(element).toBeInTheDocument()
      expect(element.closest('a')).toHaveAttribute('href', cta.href)
    })
  })

  it('hides admin-only links when not authenticated', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.queryByText('문의 관리')).not.toBeInTheDocument()
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument()
  })
})
