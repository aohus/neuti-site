'use client'

import Image from 'next/image'

const clients = [
  { name: '경기도', src: '/images/clients/gyeonggi.jpg' },
  { name: '공수처', src: '/images/clients/gongsuchco.jpg' },
  { name: '성남도시개발공사', src: '/images/clients/seongnam_dev.jpg' },
  { name: '성남시', src: '/images/clients/seongnam_city.png' },
  { name: '정부청사관리본부', src: '/images/clients/gov-complex.png' },
]

// 매끄러운 무한 롤링을 위해 리스트를 3번 반복
const repeated = [...clients, ...clients, ...clients]

export default function RollingClients() {
  return (
    <section className="py-5 md:py-6 bg-white border-b border-gray-100 overflow-hidden">
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex animate-scroll-x">
          {repeated.map((client, i) => (
            <div key={`${client.name}-${i}`} className="flex-shrink-0 mx-6 md:mx-10">
              <Image
                src={client.src}
                alt={client.name}
                width={140}
                height={50}
                className="h-6 md:h-8 w-auto object-contain grayscale opacity-40"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
