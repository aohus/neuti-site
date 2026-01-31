'use client'

import React from 'react'
import Container from './Container'
import Image from 'next/image'
import Link from 'next/link'

export function MissionSection() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <Container className="text-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
          &quot;느티나무병원은 최고의 기술력과 전문성으로 <span className="text-green-600">사람과 나무에 모두 안전한 공간</span>을 만들어갑니다.&quot;
        </h3>
      </Container>
    </section>
  )
}

export function LandscapingSection() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="mb-8">
              <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Landscaping & Garden</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-6">조경/정원 사업</h2>
              <h4 className="text-xl text-gray-500 font-light mb-6">환경 조건에 맞는 수목과 식재공간 제안</h4>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                공간에 적합한 조경계획을 제안하고, 생육환경에 맞는 수종의 계획과 설계를 통해 
                지속가능하고 아름다운 공간을 조성합니다. 
                대형목 이식부터 도시재생구역 환경개선까지 전문가가 함께합니다.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10">
              {[
                '조경/정원 계획, 설계 및 컨설팅',
                '조경/정원 시공 (식재, 시설물)',
                '체계적인 조경 유지관리'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-lg text-gray-700">
                  <svg className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <Link 
              href="/business"
              className="inline-block border-2 border-green-600 text-green-700 px-8 py-3 font-bold hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              사업분야 자세히 보기
            </Link>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/home/landscaping.jpg"
                alt="Landscaping Service"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl z-20 hidden md:block max-w-[250px] rounded-sm">
              <p className="font-bold text-green-600 mb-1">Professional Touch</p>
              <p className="text-sm text-gray-500 leading-relaxed">전문가의 손길로 완성되는<br/>품격있는 공간</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function TreeHospitalSection() {
  const services = [
    { title: "수목피해 진단/처방", icon: "📋", desc: "전문 장비를 활용한 정확한 피해 원인 분석 및 처방전 발급" },
    { title: "수목 정밀/안전진단", icon: "🔍", desc: "보호수, 노거수 등 주요 수목에 대한 정밀 진단 및 위험도 평가" },
    { title: "병해충 방제", icon: "🐛", desc: "친환경 약제 및 물리적 방법을 통한 효과적인 병해충 방제" },
    { title: "생육환경 개선", icon: "🌱", desc: "토양 개량, 통기성 확보 등 수목 활력 증진을 위한 환경 개선" },
    { title: "외과수술", icon: "🩹", desc: "부패부 제거, 살균/방부 처리 및 인공수피 처리를 통한 수명 연장" },
    { title: "영양주사/수간주사", icon: "💉", desc: "부족한 영양분 공급 및 약제 주입을 통한 신속한 회복 도모" },
  ]

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Tree Hospital</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-6">나무병원 (1종)</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">농약 오·남용 없는 안전한 관리, 나무의사 주치의 서비스</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, idx) => (
            <div key={idx} className="group p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {item.desc}
              </p>
              <Link 
                href="/request" 
                className="text-green-600 font-bold text-sm inline-flex items-center hover:text-green-700 transition-colors"
              >
                자세히 보기
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/request"
            className="inline-block bg-green-600 text-white px-10 py-4 text-lg font-bold hover:bg-green-700 transition-all rounded-sm shadow-md"
          >
            진단 및 치료 문의하기
          </Link>
        </div>
      </Container>
    </section>
  )
}
