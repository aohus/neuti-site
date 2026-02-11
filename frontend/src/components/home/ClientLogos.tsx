'use client'

import Image from 'next/image'
import Container from '../common/Container'

// 임시 7개 (CI 추가 전까지 중복 배치)
const clients = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처', src: '/images/clients/gongsuchco.jpg' },
  { name: '성남도시개발공사', src: '/images/clients/seongnam_dev.jpg' },
  { name: '성남시', src: '/images/clients/seongnam_city.png' },
  { name: '정부청사관리본부', src: '/images/clients/gov-complex.png' },
  { name: '경기도2', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처2', src: '/images/clients/gongsuchco.jpg' },
]

export default function ClientLogos() {
  return (
    <section className="py-24 md:py-32 bg-white border-b border-gray-100">
      <Container>
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-3">Our Clients</h2>
          <p className="text-[2rem] md:text-[3rem] font-black text-gray-900 tracking-tighter mb-4">함께하는 기관과 기업</p>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg mx-auto">
            정부기관부터 공기업까지, <br />신뢰를 바탕으로 지속적인 파트너십을 이어가고 있습니다.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
          {/* 1줄: 4개 (모바일 2+2) */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-14">
            {clients.slice(0, 4).map((client) => (
              <div key={client.name} className="flex items-center justify-center">
                <Image
                  src={client.src}
                  alt={client.name}
                  width={200}
                  height={70}
                  className="h-8 md:h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          {/* 2줄: 3개 (가운데 정렬) */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-14">
            {clients.slice(4, 7).map((client) => (
              <div key={client.name} className="flex items-center justify-center">
                <Image
                  src={client.src}
                  alt={client.name}
                  width={200}
                  height={70}
                  className="h-8 md:h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
