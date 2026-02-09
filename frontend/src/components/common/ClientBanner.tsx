'use client'

import React from 'react'
import Image from 'next/image'

const clients = [
  { name: 'gyeonggi', src: '/images/clients/gyeonggi.jpg' },
  { name: 'gongsuchco', src: '/images/clients/gongsuchco.jpg' },
  { name: 'seongnam_dev', src: '/images/clients/seongnam_dev.jpg' },
  { name: 'seongnam_city', src: '/images/clients/seongnam_city.png' },
  { name: 'gov_complex', src: '/images/clients/gov-complex.png' },
]

export default function ClientBanner() {
  return (
    <section className="py-6 bg-white overflow-hidden border-b border-gray-50">
      <div className="relative">
        {/* Rolling Banner */}
        <div 
          className="flex whitespace-nowrap animate-marquee"
          style={{ 
            display: 'flex',
            width: 'max-content'
          }}
        >
          {/* 첫 번째 세트 */}
          <div className="flex items-center px-4">
            {clients.map((client, index) => (
              <div 
                key={`c1-${index}`} 
                className="flex-shrink-0 mx-8 md:mx-12 min-w-[140px] md:min-w-[180px] flex justify-center transition-all duration-500"
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={160}
                  height={60}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          {/* 두 번째 세트 (무한 스크롤용) */}
          <div className="flex items-center px-4">
            {clients.map((client, index) => (
              <div 
                key={`c2-${index}`} 
                className="flex-shrink-0 mx-8 md:mx-12 min-w-[140px] md:min-w-[180px] flex justify-center transition-all duration-500"
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={160}
                  height={60}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  )
}