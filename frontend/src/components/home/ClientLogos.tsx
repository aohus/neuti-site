'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Container from '../common/Container'
import { clientLogos, getOtherClientNames } from '@/data/clients'

const otherClients = getOtherClientNames()

/**
 * 함께 일한 발주처.
 *
 * 규모가 큰 기관만 골라 보여주지 않는다. 학교·행정복지센터까지 계약한 곳을
 * 모두 적는 편이, 방문자가 자기 상황과 비슷한 사례를 발견할 확률이 높다.
 * 목록은 `contract-projects.ts` 원장에서 파생되므로 실적을 추가하면 따라온다.
 */
export default function ClientLogos() {
  return (
    <section
      data-section="clients"
      className="border-b border-gray-100 bg-white py-20 md:py-28"
    >
      <Container>
        <div className="mb-14 text-center md:mb-16">
          <p className="mb-3 text-xs font-black tracking-widest text-green-600 uppercase">
            Our Clients
          </p>
          <h2 className="text-[2rem] font-black tracking-tighter text-gray-900 md:text-[3rem]">
            발주처
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-gray-500 md:text-base">
            관공서와 공공기관부터 동 행정복지센터, 학교, 아파트까지
            <br className="hidden md:block" />
            규모를 가리지 않고 현장을 맡아왔습니다.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-8 md:gap-14"
        >
          {clientLogos.map((client) => (
            <Image
              key={client.name}
              src={client.src}
              alt={client.name}
              width={200}
              height={70}
              className="h-8 w-auto object-contain md:h-12"
            />
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2"
        >
          {otherClients.map((name) => (
            <li
              key={name}
              className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-500 md:text-sm"
            >
              {name}
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  )
}
