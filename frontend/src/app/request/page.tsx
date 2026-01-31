import DiagnosisForm from '@/components/diagnosis/DiagnosisForm'

export default function RequestPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Request</h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">수목 진단 의뢰</p>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          아픈 나무를 위한 전문적인 진단과 처방을 약속드립니다. <br />
          아래 폼을 작성하시거나 양식을 다운로드하여 접수해 주세요.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Download Section */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">오프라인 접수</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center">
              수동 작성이 필요하신 분은 아래 버튼을 눌러 한글(HWP) 양식을 다운로드 하세요.
            </p>
            <a
              href="/downloads/수목진단의뢰.hwp"
              download
              className="flex items-center justify-center w-full bg-white border-2 border-green-600 text-green-700 px-4 py-3 rounded-xl font-bold hover:bg-green-50 transition-all gap-2 shadow-sm active:scale-95"
            >
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              양식 다운로드
            </a>
          </div>

          <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center bg-white">
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest text-green-700">접수처 안내</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li><span className="font-bold text-gray-700">팩스:</span> 031-752-6001</li>
              <li><span className="font-bold text-gray-700">이메일:</span> info@neuti.co.kr</li>
              <li><span className="font-bold text-gray-700">방문:</span> 경기도 성남시 수정구 공원로 445번길 8</li>
            </ul>
          </div>
        </div>

        {/* Right: Online Form Section */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center mb-10 pb-4 border-b border-gray-100">
              <div className="w-2 h-8 bg-green-600 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-900">온라인 의뢰 접수</h3>
            </div>
            <DiagnosisForm />
          </div>
        </div>
      </div>
    </div>
  )
}
