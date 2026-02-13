import type { Metadata } from 'next'
import Container from '@/components/common/Container'
import DiagnosisForm from '@/components/diagnosis/DiagnosisForm'

export const metadata: Metadata = {
  title: '수목 진단 의뢰',
  description:
    '1종 나무병원 전문 수목 진단 의뢰. 수목 진단·처방·치료·방제. 온라인 접수 및 HWP 양식 다운로드. 느티나무병원 협동조합 031-752-6000.',
  openGraph: {
    title: '수목 진단 의뢰 | 느티나무병원 협동조합',
    description:
      '산림청 등록 1종 나무병원의 전문 수목 진단. 온라인 간편 접수.',
  },
}

export default function RequestPage() {
  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
      <Container>
        <div className="text-center mb-20">
          <span className="text-label">Request</span>
          <p className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">수목 진단 의뢰</p>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto font-bold leading-relaxed">
            아픈 나무를 위한 전문적인 진단과 처방을 약속드립니다. <br className="hidden md:block" />
            아래 폼을 작성하시거나 양식을 다운로드하여 접수해 주세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Download Section */}
          <div className="lg:w-1/3 space-y-10">
            <div className="bg-surface p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
              <h3 className="text-xl font-black text-deep mb-4 text-center">오프라인 접수</h3>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center font-bold">
                수동 작성이 필요하신 분은 아래 버튼을 눌러 한글(HWP) 양식을 다운로드 하세요.
              </p>
              <a
                href="/downloads/수목진단의뢰.hwp"
                download
                className="flex items-center justify-center w-full bg-deep text-white px-6 py-4 rounded-2xl font-black hover:bg-black transition-all gap-3 shadow-xl shadow-deep/10 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                양식 다운로드
              </a>
            </div>

            <div className="p-10 border-2 border-dashed border-black/5 rounded-[2.5rem] text-center bg-white">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-6 block">Contact Info</span>
              <ul className="text-[15px] text-gray-500 space-y-4 font-bold">
                <li><span className="text-deep mr-2">팩스:</span> 031-752-6001</li>
                <li><span className="text-deep mr-2">전화:</span> 031-752-6000</li>
                <li><span className="text-deep mr-2">이메일:</span> coopneuti@naver.com</li>
                <li><span className="text-deep mr-2">방문:</span> 성남시 태평로 104, 느티나무병원협동조합</li>
              </ul>
            </div>
          </div>

          {/* Right: Online Form Section */}
          <div className="lg:w-2/3">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-black/5">
              <div className="flex items-center mb-12 pb-6 border-b border-black/5">
                <div className="w-2 h-8 bg-primary rounded-full mr-4 opacity-20"></div>
                <h3 className="text-2xl font-black text-deep">온라인 의뢰 접수</h3>
              </div>
              <DiagnosisForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

