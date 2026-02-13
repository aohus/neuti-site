'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/common/Container'
import DiagnosisForm from '@/components/diagnosis/DiagnosisForm'
import EstimateForm from '@/components/estimate/EstimateForm'
import { FileText, Calculator } from 'lucide-react'

const tabs = [
  { key: 'estimate', label: '수의계약 견적 요청', icon: Calculator },
  { key: 'diagnosis', label: '수목 진단 의뢰', icon: FileText },
] as const

type TabKey = (typeof tabs)[number]['key']

function RequestTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabKey>('estimate')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'diagnosis') setActiveTab('diagnosis')
    else setActiveTab('estimate')
  }, [searchParams])

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
      <Container>
        <div className="text-center mb-12">
          <span className="text-label">Request</span>
          <p className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">
            견적·상담 문의
          </p>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto font-bold leading-relaxed">
            수의계약 견적 요청 또는 수목 진단 의뢰를 접수해 주세요.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-gray-100 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-green-700 shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'estimate' ? (
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left: Info */}
            <div className="lg:w-1/3 space-y-10">
              <div className="bg-green-50 p-10 rounded-[2.5rem] border border-green-100 shadow-sm">
                <h3 className="text-xl font-black text-green-900 mb-4 text-center">빠른 견적 안내</h3>
                <ul className="text-sm text-green-800 space-y-4 font-bold leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">&#10003;</span>
                    견적서 즉일~1영업일 발급
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">&#10003;</span>
                    실적증명서·자격증빙 함께 발송
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">&#10003;</span>
                    전화 견적도 가능합니다
                  </li>
                </ul>
                <a
                  href="tel:031-752-6000"
                  className="flex items-center justify-center w-full mt-8 bg-green-700 text-white px-6 py-4 rounded-2xl font-black hover:bg-green-800 transition-all gap-3 shadow-xl shadow-green-700/10 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  031-752-6000
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

            {/* Right: Estimate Form */}
            <div className="lg:w-2/3">
              <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-black/5">
                <div className="flex items-center mb-12 pb-6 border-b border-black/5">
                  <div className="w-2 h-8 bg-green-600 rounded-full mr-4 opacity-40"></div>
                  <h3 className="text-2xl font-black text-deep">수의계약 간편 견적 요청</h3>
                </div>
                <EstimateForm />
              </div>
            </div>
          </div>
        ) : (
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

            {/* Right: Diagnosis Form */}
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
        )}
      </Container>
    </div>
  )
}

export default function RequestContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="py-24 text-center">
            <div className="border-green-600 mb-6 inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-b-2" />
          </div>
        </div>
      }
    >
      <RequestTabs />
    </Suspense>
  )
}
