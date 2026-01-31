import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const links = [
  { name: '홈', href: '/' },
  { name: '회사소개', href: '/about' },
  { name: '주요사업', href: '/business' },
  { name: '주요실적', href: '/performance' },
  { name: '공지사항', href: '/notice' },
  { name: '수목진단의뢰', href: '/request' },
  { name: '시공/견적문의', href: '/qna' },
]

export default function Navbar() {
  const { isAdmin, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-700">
              느티나무 나무병원
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-green-500 hover:text-green-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin ? (
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-500 hover:text-green-700 border border-gray-200 rounded-full hover:bg-gray-50"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-500 hover:text-green-700 border border-gray-200 rounded-full hover:bg-gray-50"
              >
                관리자
              </Link>
            )}
          </div>
          {/* Mobile menu button (Simplified for now) */}
          <div className="flex items-center sm:hidden">
            <button className="text-gray-500 hover:text-green-700">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
