'use client'

import { Phone, FileText } from 'lucide-react'
import Link from 'next/link'

export default function MobileBottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] border-t border-black/10 bg-white/95 backdrop-blur-md px-4 py-3 lg:hidden">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <a
          href="tel:031-752-6000"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-black text-white shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" />
          전화 견적
        </a>
        <Link
          href="/request"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-700 py-3 text-sm font-black text-green-700 active:scale-95 transition-transform"
        >
          <FileText className="w-4 h-4" />
          온라인 문의
        </Link>
      </div>
    </div>
  )
}
