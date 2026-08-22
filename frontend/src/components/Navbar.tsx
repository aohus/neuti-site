'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Menu, X } from 'lucide-react'
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
  // 드로어를 연 시점의 경로를 담아두고, 현재 경로와 같을 때만 열린 것으로 본다.
  // 이렇게 하면 라우트가 바뀌는 순간(뒤로가기 포함) 자동으로 닫히면서도
  // effect 안에서 setState 를 호출하지 않는다.
  // null 비교로 열림을 판정하면 usePathname() 이 null 일 때(테스트 목, 렌더 초기)
  // null === null 이 되어 메뉴가 기본으로 열려버린다. 닫힘을 명시적으로 배제한다.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const isMobileMenuOpen = menuOpenedAt !== null && menuOpenedAt === pathname

  const setIsMobileMenuOpen = (open: boolean) =>
    setMenuOpenedAt(open ? pathname : null)

  // 드로어가 떠 있는 동안 뒤 배경이 스크롤되지 않게 막는다.
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // setIsMobileMenuOpen 은 매 렌더 새로 만들어지는 클로저다. deps 에 넣지 않고
    // 쓰면 stale closure 함정이 되므로 여기서는 setter 를 직접 호출한다.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpenedAt(null)
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 z-[100] w-full border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-md transition-all">
        <Container className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center">
            {/* 320px 화면에서 로고 + 햄버거가 빠듯하다. flex-shrink-0 대신 min-w-0 을
                주고 글자 크기를 한 단계 낮춰 좁은 화면에서도 밀리지 않게 한다. */}
            <span className="text-deep truncate text-lg font-black tracking-tighter transition-opacity group-hover:opacity-70 sm:text-xl md:text-2xl">
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
                <>
                  <Link
                    href="/admin/estimates"
                    className="px-4 py-2 text-xs font-bold text-green-700 bg-green-50 rounded-full transition-colors hover:bg-green-100"
                  >
                    문의 관리
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-xs font-bold text-gray-400 transition-colors hover:text-red-600"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex flex-shrink-0 items-center space-x-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 text-gray-900"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay — header 바깥에 위치해야 backdrop-filter containing block 문제 회피.
          role="dialog" + aria-modal 은 포커스 트랩을 구현했다는 약속이라 쓰지 않는다.
          트랩 없이 선언하면 스크린리더 사용자가 오버레이 뒤 본문으로 Tab 이동해
          오히려 혼란스럽다. 여는 버튼의 aria-expanded 만으로 상태는 충분히 전달된다. */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="모바일 메뉴"
          className="fixed top-16 left-0 right-0 bottom-0 md:top-20 z-[99] border-t border-gray-100 bg-white p-6 lg:hidden overflow-y-auto"
        >
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
              <>
                <Link
                  href="/admin/estimates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-2xl bg-green-50 px-6 py-4 text-center text-lg font-bold text-green-700"
                >
                  문의 관리
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full rounded-2xl bg-red-50 px-6 py-4 text-lg font-bold text-red-600"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  )
}
