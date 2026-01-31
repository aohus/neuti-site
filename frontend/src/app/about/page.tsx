export default function AboutPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">회사소개</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            자연과 사람이 함께 건강한 세상을 만듭니다
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            도시의 회복탄력성을 키우는 전문가, 느티나무병원 협동조합입니다.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section>
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">느티나무병원 협동조합 소개</h3>
            <div className="prose prose-green text-gray-500 space-y-4">
              <p>
                자연과 사람이 함께 건강한 녹지를 누리는 세상을 꿈꾸는 병원이 있습니다.
                바로 느티나무병원 협동조합입니다.
              </p>
              <p>
                우리는 단순한 수목 진료 기관을 넘어, 자연과 공존하는 건강한 도시 생태를 꿈꾸며
                수목복지문화의 선도자로서 다양한 사회적 가치를 실현하고자 합니다.
              </p>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 bg-green-50 rounded-3xl p-8 border border-green-100">
            <blockquote className="text-lg font-medium text-green-800 italic">
              &quot;나무는 우리 삶의 동반자입니다. 아끼고 보호해줘야 합니다. <br />
              수목을 돌보는 마음으로 사람의 삶까지 돌보는 것이 우리의 소명입니다.&quot;
            </blockquote>
            <div className="mt-6 flex items-center">
              <div className="ml-3">
                <p className="text-base font-bold text-gray-900">권정미</p>
                <p className="text-sm text-gray-500">이사장 / 나무의사</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 rounded-3xl p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">M</span>
              미션
            </h3>
            <p className="text-gray-600">자연과 사람이 함께 누리는 건강한 녹지를 만든다</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">V</span>
              비전
            </h3>
            <p className="text-gray-600">수목복지문화를 선도하는 대한민국 최고의 나무병원</p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6">핵심 전략</h3>
          <ul className="grid sm:grid-cols-3 gap-6">
            <li className="bg-white p-6 rounded-xl shadow-sm">
              <p className="font-bold text-green-700 mb-2">기술력 기반</p>
              <p className="text-sm text-gray-500">맞춤형 수목관리</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-sm">
              <p className="font-bold text-green-700 mb-2">고객 중심</p>
              <p className="text-sm text-gray-500">신뢰와 정성 서비스</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-sm">
              <p className="font-bold text-green-700 mb-2">지속가능성</p>
              <p className="text-sm text-gray-500">협동조합 모델 운영</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Competitiveness */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">느티나무병원의 경쟁력</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: '공공기관', desc: '공원·학교 등 공공 녹지의 건강한 관리' },
            { title: '공동주택', desc: '주민 반려목 보호 및 안전성 점검' },
            { title: '기업체', desc: '쾌적한 환경 제공을 위한 조경관리' },
            { title: '주택', desc: '개인 특성에 맞춘 정원 관리 서비스' },
          ].map((item) => (
            <div key={item.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900 mb-2">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="border-t border-gray-100 pt-16">
        <div className="grid md:grid-cols-2 gap-12 text-sm text-gray-500">
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase">Contact</h4>
            <p>본점: 성남시 수정구 공원로 445번길 8</p>
            <p>지점: 성남시 분당구 성남대로 331번길 8, 킨스타워 2층</p>
            <p>전화: 031-752-6000</p>
          </div>
          <div className="text-right md:text-left">
            <h4 className="font-bold text-gray-900 mb-4 uppercase">Social Value</h4>
            <p>사회적 기업 인증 및 취약계층 고용</p>
            <p>마을 환경 개선 프로젝트 참여</p>
          </div>
        </div>
      </section>
    </div>
  )
}
