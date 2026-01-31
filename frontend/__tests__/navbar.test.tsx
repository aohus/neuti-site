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
      { name: '주요실적', href: '/performance' },
      { name: '공지사항', href: '/notice' },
      { name: '수목진단의뢰', href: '/request' },
      { name: '시공/견적문의', href: '/qna' },
    ]

    links.forEach((link) => {
      const element = screen.getByText(link.name)
      expect(element).toBeInTheDocument()
      expect(element.closest('a')).toHaveAttribute('href', link.href)
    })
  })
})
