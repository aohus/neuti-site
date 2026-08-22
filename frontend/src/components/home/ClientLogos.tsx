'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Container from '../common/Container'
import { clientLogos, getOtherClientNames } from '@/data/clients'

const otherClients = getOtherClientNames()

/**
 * 모바일에서 처음에 보여줄 발주처 칩 개수.
 *
 * 원장이 커지면서 칩이 30개를 넘어섰고, 360px 화면에서 10줄 가까이 쌓여
 * 섹션 하나가 화면 두 개 분량을 차지했다. 데스크탑은 가로로 넉넉히 퍼지므로
 * 접지 않고 전부 보여준다.
 */
const MOBILE_VISIBLE_COUNT = 10

/**
 * 함께 일한 발주처.
 *
 * 규모가 큰 기관만 골라 보여주지 않는다. 학교·행정복지센터까지 계약한 곳을
 * 모두 적는 편이, 방문자가 자기 상황과 비슷한 사례를 발견할 확률이 높다.
 * 목록은 `contract-projects.ts` 원장에서 파생되므로 실적을 추가하면 따라온다.
 */
export default function ClientLogos() {
  const [isExpanded, setIsExpanded] = useState(false)
  const hiddenCount = otherClients.length - MOBILE_VISIBLE_COUNT

  return (
    <section
      data-section="clients"
      className="border-b border-gray-100 bg-white py-12 sm:py-16 md:py-28"
    >
      <Container>
        <div className="mb-8 text-center sm:mb-10 md:mb-16">
          <p className="mb-2 text-xs font-black tracking-widest text-green-600 uppercase md:mb-3">
            Our Clients
          </p>
          <h2 className="text-[1.75rem] font-black tracking-tighter text-gray-900 md:text-[3rem]">
            발주처
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-gray-500 md:mt-4 md:text-base">
            관공서와 공공기관부터 동 행정복지센터, 학교, 아파트까지
            <br className="hidden md:block" />
            규모를 가리지 않고 현장을 맡아왔습니다.
          </p>
        </div>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-14"
        >
          {clientLogos.map((client) => (
            <Image
              key={client.name}
              src={client.src}
              alt={client.name}
              width={200}
              height={70}
              sizes="(min-width: 768px) 140px, 90px"
              className="h-7 w-auto object-contain sm:h-8 md:h-12"
            />
          ))}
        </motion.div>

        <motion.ul
          data-reveal
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-1.5 md:mt-12 md:gap-2"
        >
          {otherClients.map((name, index) => (
            <li
              key={name}
              // 모바일에서만 접는다. md 이상에서는 항상 전부 보인다.
              className={`rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-gray-500 md:px-3.5 md:py-1.5 md:text-sm ${
                !isExpanded && index >= MOBILE_VISIBLE_COUNT
                  ? 'hidden md:block'
                  : ''
              }`}
            >
              {name}
            </li>
          ))}
        </motion.ul>

        {hiddenCount > 0 && (
          <div className="mt-4 text-center md:hidden">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="rounded-full px-4 py-2 text-xs font-black text-green-700 underline underline-offset-4"
            >
              {isExpanded ? '접기' : `발주처 ${hiddenCount}곳 더 보기`}
            </button>
          </div>
        )}
      </Container>
    </section>
  )
}
