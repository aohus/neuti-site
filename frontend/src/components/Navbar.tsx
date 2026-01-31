'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, ArrowRight } from 'lucide-react'
import Container from './common/Container'

const links = [
  { name: '홈', href: '/' },
  { name: '회사소개', href: '/about' },
      { name: '주요사업', href: '/business' },
      { name: '시공 사례', href: '/performance' },
      { name: '공지사항', href: '/notice' },
  { name: '시공/견적문의', href: '/qna' },
]

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 w-full z-[100] bg-white border-b border-gray-100 shadow-sm">
      <Container className="flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-black tracking-tighter text-green-800">
            느티나무<span className="text-green-600">병원</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          <nav className="flex items-center space-x-1 mr-6">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-gray-500 hover:text-green-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center space-x-3 border-l border-gray-100 pl-6">
            <Link
              href="/request"
              className="flex items-center bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-600/10 active:scale-95"
            >
              수목진단의뢰
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>

            {isAdmin && (
              <button
                onClick={logout}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-900 p-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[90] p-6 animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-4 text-lg font-bold text-gray-800 bg-gray-50 rounded-2xl"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-4 text-lg font-bold text-white bg-green-600 rounded-2xl text-center shadow-lg"
            >
              수목진단의뢰
            </Link>
            {isAdmin && (
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full px-6 py-4 text-lg font-bold text-red-600 bg-red-50 rounded-2xl"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
