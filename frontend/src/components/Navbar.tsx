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
]

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 z-[100] w-full border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-md transition-all">
      <Container className="flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link href="/" className="group flex flex-shrink-0 items-center">
          <span className="text-deep text-xl font-black tracking-tighter transition-opacity group-hover:opacity-70 md:text-2xl">
            느티나무병원 협동조합
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 lg:flex">
          <nav className="flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[15px] font-black transition-all ${
                    isActive ? 'text-primary' : 'hover:text-deep text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/contract"
              className="flex items-center rounded-full border-2 border-green-700 px-5 py-2 text-sm font-black text-green-700 transition-all hover:bg-green-50 active:scale-95"
            >
              수의계약
            </Link>
            <Link
              href="/request"
              className="bg-deep shadow-deep/10 flex items-center rounded-full px-5 py-2.5 text-sm font-black text-white shadow-xl transition-all hover:bg-black active:scale-95"
            >
              견적·상담문의
            </Link>

            {isAdmin && (
              <button
                onClick={logout}
                className="px-4 py-2 text-xs font-bold text-gray-400 transition-colors hover:text-red-600"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-900"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 md:top-20 z-[90] border-t border-gray-100 bg-white p-6 lg:hidden overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block border-b border-gray-100 px-6 py-4 text-lg font-bold text-gray-800"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contract"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-2xl border-2 border-green-600 px-6 py-4 text-center text-lg font-bold text-green-700"
            >
              수의계약
            </Link>
            <Link
              href="/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-2xl bg-green-600 px-6 py-4 text-center text-lg font-bold text-white shadow-lg"
            >
              견적·상담문의
            </Link>
            {isAdmin && (
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full rounded-2xl bg-red-50 px-6 py-4 text-lg font-bold text-red-600"
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
