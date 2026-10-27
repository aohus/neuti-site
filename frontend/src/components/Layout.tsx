import Navbar from './Navbar'
import MobileBottomCTA from './common/MobileBottomCTA'
import Container from './common/Container'
import BrandLogo from './common/BrandLogo'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <MobileBottomCTA />
      <footer className="bg-surface border-t border-black/5 py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-8">
            <div className="space-y-8 md:col-span-2">
              <Link
                href="/"
                aria-label="느티나무병원 협동조합 홈"
                className="inline-block transition-opacity hover:opacity-80"
              >
                <BrandLogo className="h-10 md:h-12" />
              </Link>
              <div className="space-y-4 text-sm leading-relaxed font-bold text-gray-400">
                <p>
                  산림청 등록 1종 나무병원 · 느티나무병원 협동조합 <br />
                  본점: 성남시 수정구 태평로 104 <br />
                  <a href="tel:031-752-6000" className="hover:text-deep transition-colors">
                    031-752-6000
                  </a>
                  <span className="mx-2 text-gray-300">|</span>
                  <a href="mailto:coopneuti@naver.com" className="hover:text-deep transition-colors">
                    coopneuti@naver.com
                  </a>
                </p>
                <p>
                © 2026 느티나무병원 협동조합. All rights reserved.
                <span className="mx-2 text-gray-300">|</span>
                <Link href="/login" className="text-gray-300 hover:text-gray-500 transition-colors">
                  관리자
                </Link>
              </p>
              </div>
            </div>

            <div>
              <h4 className="text-primary mb-6 text-[11px] font-black tracking-[0.2em] uppercase">
                Navigation
              </h4>
              <ul className="space-y-4">
                {[
                  { name: '회사소개', href: '/about' },
                  { name: '주요사업', href: '/business' },
                  { name: '시공 사례', href: '/performance' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-deep text-sm font-bold text-gray-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-primary mb-6 text-[11px] font-black tracking-[0.2em] uppercase">
                Support
              </h4>
              <ul className="space-y-4">
                {[
                  { name: '공지사항', href: '/notice' },
                  { name: '시공/견적문의', href: '/qna' },
                  { name: '수목진단의뢰', href: '/request' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-deep text-sm font-bold text-gray-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
