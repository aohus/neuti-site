'use client'

import Container from '@/components/common/Container'
import Link from 'next/link'
import HistoryTimeline from '@/components/about/HistoryTimeline'
import Certifications from '@/components/about/Certifications'
import KakaoMap from '@/components/about/KakaoMap'
import { ChevronLeft, Calendar, User } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-surface">
        <Container>
          <div className="relative text-center max-w-4xl mx-auto">
            <span className="text-label">About Us</span>
            <h1 className="text-4xl md:text-6xl font-black text-deep tracking-tighter leading-[1.2] mb-10">
              자연과 사람이 <br className="md:hidden" /> 함께 건강한 세상
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed">
              느티나무병원은 도시의 회복탄력성을 높이고 <br className="hidden md:block" /> 
              지속 가능한 녹색 문화를 선도하는 수목 진료 전문가 그룹입니다.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro Section */}
      <section className="section-py" id="intro">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-20 items-start">
              <div className="md:w-2/5">
                <h3 className="text-3xl md:text-4xl font-black text-deep leading-tight">
                  나무를 치료하는 병원, <br />
                  도시 생태를 지키는 <br />
                  <span className="text-primary">진정한 전문가</span>
                </h3>
              </div>
              <div className="md:w-3/5">
                <div className="text-gray-600 space-y-8 text-lg md:text-xl font-bold leading-loose">
                  <p>
                    자연과 사람이 함께 건강한 녹지를 누리는 세상을 꿈꾸는 병원이 있습니다.
                    바로 <span className="text-primary border-b-4 border-primary/20">느티나무병원 협동조합</span>입니다.
                  </p>
                  <p>
                    우리는 단순한 수목 진료 기관을 넘어, 자연과 공존하는 건강한 도시 생태를 꿈꾸며
                    수목복지문화의 선도자로서 다양한 사회적 가치를 실현하고자 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-surface rounded-[3rem] mx-4 md:mx-10" id="vision">
        <Container>
          <div className="text-center mb-16">
            <span className="text-label">Philosophy</span>
            <p className="text-3xl md:text-4xl font-black text-deep tracking-tight">미션과 비전</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-white border border-black/5 overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-6 text-[10rem] font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">M</div>
              <h4 className="text-xs font-black text-primary mb-6 flex items-center tracking-widest">
                MISSION
              </h4>
              <p className="text-xl md:text-2xl font-black text-deep leading-tight tracking-tight">자연과 사람이 함께 누리는 <br />건강한 녹지를 만든다</p>
            </div>
            <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-white border border-black/5 overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-6 text-[10rem] font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">V</div>
              <h4 className="text-xs font-black text-primary mb-6 flex items-center tracking-widest">
                VISION
              </h4>
              <p className="text-xl md:text-2xl font-black text-deep leading-tight tracking-tight">수목복지문화를 선도하는 <br />대한민국 최고의 나무병원</p>
            </div>
          </div>
          
          <div className="mt-12 pt-16 border-t border-black/5 grid sm:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { title: '기술력 기반', desc: '맞춤형 수목관리' },
              { title: '고객 중심', desc: '신뢰와 정성 서비스' },
              { title: '지속가능성', desc: '협동조합 모델 운영' },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <p className="text-xl md:text-2xl font-black text-primary mb-4 group-hover:scale-110 transition-transform">{item.title}</p>
                <div className="w-8 h-1 bg-primary/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* History Section */}
      <section className="section-py" id="history">
        <Container>
          <div className="text-center mb-20">
            <span className="text-label">Milestones</span>
            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">느티나무병원의 발자취</p>
          </div>
          <HistoryTimeline />
        </Container>
      </section>

      {/* Certifications Section */}
      <section className="section-py bg-gray-50 rounded-[4rem]" id="certifications">
        <Container>
          <div className="text-center mb-20">
            <span className="text-label">Authority</span>
            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-center">신뢰할 수 있는 전문 기술력</p>
          </div>
          <Certifications />
        </Container>
      </section>

      {/* Location Section */}
      <section className="section-py" id="location">
        <Container>
          <div className="text-center mb-20">
            <span className="text-label">Find Us</span>
            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">오시는 길</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-20 items-center">
            <div className="lg:col-span-2 aspect-[16/10] bg-white rounded-[3.5rem] overflow-hidden border-[12px] border-white shadow-2xl relative">
              <KakaoMap />
            </div>
            
            <div className="space-y-12">
              <div className="group">
                <h4 className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-4">Head Office</h4>
                <div className="p-8 rounded-[2.5rem] bg-green-50 border-2 border-green-100 group-hover:bg-green-100 transition-colors">
                  <p className="text-xl font-black text-green-900 mb-2">본점</p>
                  <p className="text-sm font-bold text-green-800/60 leading-relaxed">성남시 수정구 공원로 445번길 8</p>
                  <p className="mt-4 text-lg font-black text-green-900">031-752-6000</p>
                </div>
              </div>
              
              <div className="group">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Branch Office</h4>
                <div className="p-8 rounded-[2.5rem] bg-gray-50 border-2 border-gray-100 group-hover:bg-gray-100 transition-colors">
                  <p className="text-xl font-black text-gray-900 mb-2">분당지점</p>
                  <p className="text-sm font-bold text-gray-500/60 leading-relaxed">성남시 분당구 성남대로 331번길 8, 킨스타워 2층</p>
                  <p className="mt-4 text-lg font-black text-gray-900">031-752-6000</p>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://map.naver.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl text-center hover:bg-black transition-all shadow-2xl hover:shadow-black/20"
                >
                  길찾기 안내
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
