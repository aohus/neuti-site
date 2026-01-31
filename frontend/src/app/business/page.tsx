export default function BusinessPage() {
  const businessItems = [
    {
      title: '나무병원 사업',
      description: '전문적인 진단과 처방을 통해 수목의 건강을 회복시킵니다.',
      features: [
        '수목 진단·처방: 병해충, 생육 이상 등 원인 분석',
        '수목 치료·방제: 예방·치료를 위한 약제 처리 및 관리',
        '생육환경 개선: 토양 개량, 통풍 및 관수 시스템 개선',
        '위험수목 진단: 구조적 위험성을 과학적으로 분석',
      ],
    },
    {
      title: '조경식재 사업',
      description: '아름답고 조화로운 녹지 공간을 설계하고 시공합니다.',
      features: [
        '조경 설계·시공: 환경 조건에 맞는 수목 식재',
        '유지관리: 사계절 건강한 녹지 유지',
        '대형목 이식: 특수 장비를 통한 고난도 이식 수행',
        '도시재생 구역 녹지 개선: 마을정원 프로젝트 등 참여',
      ],
    },
  ]

  return (
    <div className="space-y-16 pb-20">
      <section className="text-center py-12">
        <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Business</h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">주요 사업</p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          느티나무병원 협동조합은 전문 기술력을 바탕으로 체계적인 수목 관리 서비스를 제공합니다.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {businessItems.map((business) => (
          <div key={business.title} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{business.title}</h3>
              <p className="text-gray-500 mb-8">{business.description}</p>
              <ul className="space-y-4">
                {business.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 px-8 py-4 border-t border-green-100">
              <button className="text-green-700 font-bold text-sm hover:underline">
                상세 정보 보기 &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-green-700 rounded-3xl p-12 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">수목 진단이나 시공 문의가 필요하신가요?</h3>
        <p className="text-green-100 mb-8">전문 나무의사가 직접 방문하여 정확한 상태를 진단해 드립니다.</p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors">
            진단의뢰 하기
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">
            견적 문의
          </button>
        </div>
      </section>
    </div>
  )
}
