import Navbar from './Navbar'
import Container from './common/Container'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-surface border-t border-black/5 py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            <div className="space-y-8 md:col-span-2">
              <Link href="/" className="inline-block">
                <span className="text-deep text-xl font-black tracking-tighter">
                  느티나무병원 협동조합
                </span>
              </Link>
              <div className="space-y-4 text-sm leading-relaxed font-bold text-gray-400">
                <p>
                  느티나무병원 협동조합 <br />
                  본점: 성남시 수정구 공원로 445번길 8 | 031-752-6000 <br />
                  분당지점: 성남시 분당구 성남대로 331번길 8, 킨스타워 2층 |
                  031-752-6000
                </p>
                <p>© 2026 느티나무병원 협동조합. All rights reserved.</p>
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
