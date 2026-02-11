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
      <section className="bg-surface relative overflow-hidden pt-40 pb-24">
        <Container>
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="text-label">About Us</span>
            <h1 className="text-deep mb-10 text-4xl leading-[1.2] font-black tracking-tighter md:text-6xl">
              자연과 사람이 <br className="md:hidden" /> 함께 건강한 세상
            </h1>
            <p className="text-lg leading-relaxed font-bold text-gray-500 md:text-xl">
              느티나무병원 협동조합은 도시의 회복탄력성을 높이고{' '}
              <br className="hidden md:block" />
              지속 가능한 녹색 문화를 선도하는 수목 진료 전문가 그룹입니다.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro Section */}
      <section className="section-py" id="intro">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-start gap-20 md:flex-row">
              <div className="md:w-2/5">
                <h3 className="text-deep text-3xl leading-tight font-black md:text-4xl">
                  나무를 치료하는 병원, <br />
                  도시 생태를 지키는 <br />
                  <span className="text-primary">진정한 전문가</span>
                </h3>
              </div>
              <div className="md:w-3/5">
                <div className="space-y-8 text-lg leading-loose font-bold text-gray-600 md:text-xl">
                  <p>
                    자연과 사람이 함께 건강한 녹지를 누리는 세상을 꿈꾸는 병원이
                    있습니다. 바로{' '}
                    <span className="text-primary border-primary/20 border-b-4">
                      느티나무병원 협동조합
                    </span>
                    입니다.
                  </p>
                  <p>
                    우리는 단순한 수목 진료 기관을 넘어, 자연과 공존하는 건강한
                    도시 생태를 꿈꾸며 수목복지문화의 선도자로서 다양한 사회적
                    가치를 실현하고자 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section
        className="bg-surface mx-4 rounded-[3rem] py-24 md:mx-10"
        id="vision"
      >
        <Container>
          <div className="mb-16 text-center">
            <span className="text-label">Philosophy</span>
            <p className="text-deep text-3xl font-black tracking-tight md:text-4xl">
              미션과 비전
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-10 transition-all hover:shadow-xl md:p-12">
              <div className="text-primary/5 group-hover:text-primary/10 pointer-events-none absolute top-0 right-0 p-6 text-[10rem] font-black transition-colors">
                M
              </div>
              <h4 className="text-primary mb-6 flex items-center text-xs font-black tracking-widest">
                MISSION
              </h4>
              <p className="text-deep text-xl leading-tight font-black tracking-tight md:text-2xl">
                자연과 사람이 함께 누리는 <br />
                건강한 녹지를 만든다
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-10 transition-all hover:shadow-xl md:p-12">
              <div className="text-primary/5 group-hover:text-primary/10 pointer-events-none absolute top-0 right-0 p-6 text-[10rem] font-black transition-colors">
                V
              </div>
              <h4 className="text-primary mb-6 flex items-center text-xs font-black tracking-widest">
                VISION
              </h4>
              <p className="text-deep text-xl leading-tight font-black tracking-tight md:text-2xl">
                수목복지문화를 선도하는 <br />
                대한민국 최고의 나무병원
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-12 border-t border-black/5 pt-16 sm:grid-cols-3">
            {[
              { title: '기술력 기반', desc: '맞춤형 수목관리' },
              { title: '고객 중심', desc: '신뢰와 정성 서비스' },
              { title: '지속가능성', desc: '협동조합 모델 운영' }
            ].map((item) => (
              <div key={item.title} className="group text-center">
                <p className="text-primary mb-4 text-xl font-black transition-transform group-hover:scale-110 md:text-2xl">
                  {item.title}
                </p>
                <div className="bg-primary/20 mx-auto mb-4 h-1 w-8" />
                <p className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* History Section */}
      <section className="section-py" id="history">
        <Container>
          <div className="mb-20 text-center">
            <span className="text-label">Milestones</span>
            <p className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              느티나무병원 협동조합의 발자취
            </p>
          </div>
          <HistoryTimeline />
        </Container>
      </section>

      {/* Certifications Section */}
      <section
        className="section-py rounded-[4rem] bg-gray-50"
        id="certifications"
      >
        <Container>
          <div className="mb-20 text-center">
            <span className="text-label">Authority</span>
            <p className="text-center text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              신뢰할 수 있는 전문 기술력
            </p>
          </div>
          <Certifications />
        </Container>
      </section>

      {/* Location Section */}
      <section className="section-py" id="location">
        <Container>
          <div className="mb-20 text-center">
            <span className="text-label">Find Us</span>
            <p className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              오시는 길
            </p>
          </div>

          <div className="grid items-center gap-20 lg:grid-cols-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[3.5rem] border-[12px] border-white bg-white shadow-2xl lg:col-span-2">
              <KakaoMap />
            </div>

            <div className="space-y-12">
              <div className="group">
                <h4 className="mb-4 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
                  Head Office
                </h4>
                <div className="rounded-[2.5rem] border-2 border-green-100 bg-green-50 p-8 transition-colors group-hover:bg-green-100">
                  <p className="mb-2 text-xl font-black text-green-900">본점</p>
                  <p className="text-sm leading-relaxed font-bold text-green-800/60">
                    성남시 수정구 태평로 104
                  </p>
                  <p className="mt-4 text-lg font-black text-green-900">
                    031-752-6000
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://map.naver.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-[2rem] bg-gray-900 py-6 text-center text-xl font-black text-white shadow-2xl transition-all hover:bg-black hover:shadow-black/20"
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
