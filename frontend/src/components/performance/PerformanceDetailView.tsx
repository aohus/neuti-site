'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Calendar,
  User,
  Trash2,
  Edit,
  Info,
  Map,
  Tag,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { performanceApi } from '@/lib/performanceApi'
import type { Performance } from '@/types/performance'
import { formatKoreanDate } from './formatDate'
import UploadPicture from '@/components/common/UploadPicture'

interface Props {
  performance: Performance
  /** 서버에서 렌더링한 본문(PerformanceBody) */
  children: ReactNode
}

const DEFAULT_CLIENT = '느티나무병원 협동조합'

function ConstructionTime({ performance }: { performance: Performance }) {
  const { construction_date: date, year } = performance
  if (date) {
    return <time dateTime={date.slice(0, 10)}>{formatKoreanDate(date)}</time>
  }
  if (year) return <time dateTime={String(year)}>{year}년</time>
  return <>시기 미지정</>
}

function AdminControls({ id }: { id: number }) {
  const router = useRouter()
  const { isAdmin } = useAuth()
  if (!isAdmin) return null

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await performanceApi.deletePerformance(id)
      alert('삭제되었습니다.')
      router.push('/performance')
    } catch (err) {
      console.error('Delete failed', err)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="mb-8 flex justify-end gap-3">
      <Link
        href={`/performance/${id}/edit`}
        className="flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-2.5 font-bold text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md"
      >
        <Edit size={18} /> 수정하기
      </Link>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-2.5 font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
      >
        <Trash2 size={18} /> 삭제하기
      </button>
    </div>
  )
}

function Hero({ performance }: { performance: Performance }) {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
      {performance.thumbnail_url ? (
        <UploadPicture
          src={performance.thumbnail_url}
          alt={performance.title}
          sizes="100vw"
          fetchPriority="high"
          className="h-full w-full object-cover opacity-70"
        />
      ) : (
        <div className="h-full w-full bg-green-900/30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <Link
            href="/performance"
            className="group mb-10 inline-flex items-center text-white/80 transition-colors hover:text-white"
          >
            <ChevronLeft
              size={24}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-base font-bold tracking-tight">
              시공 사례 목록으로
            </span>
          </Link>
          <h1 className="mb-5 text-4xl leading-tight font-black tracking-tighter text-white drop-shadow-2xl md:text-6xl">
            {performance.title}
          </h1>
          {performance.subtitle && (
            <p className="mb-10 max-w-3xl text-lg leading-snug font-bold text-white/80 drop-shadow-lg md:text-2xl">
              {performance.subtitle}
            </p>
          )}
          <div
            className={`flex flex-wrap items-center gap-10 text-white/90 ${
              performance.subtitle ? '' : 'mt-10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-lg">
                <User size={28} className="text-white" />
              </div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest text-white/60">
                  발주처
                </p>
                <p className="text-lg font-black">
                  {performance.client || DEFAULT_CLIENT}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-md">
                <Calendar size={28} className="text-white" />
              </div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest text-white/60">
                  시공 시기
                </p>
                <p className="text-lg font-black">
                  <ConstructionTime performance={performance} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-1 text-[10px] font-black tracking-widest text-gray-400">
      {children}
    </p>
  )
}

function Sidebar({ performance }: { performance: Performance }) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-green-600">
          <Info size={14} /> 공사 개요
        </h2>

        <div className="space-y-8">
          <div>
            <InfoLabel>발주처</InfoLabel>
            <p className="font-black text-gray-900">{performance.client || '-'}</p>
          </div>

          {performance.year && (
            <div>
              <InfoLabel>연도</InfoLabel>
              <p className="font-black text-gray-900">{performance.year}년</p>
            </div>
          )}

          {(performance.job_main_category || performance.job_sub_category) && (
            <div>
              <InfoLabel>
                <Tag size={10} /> 작업분류
              </InfoLabel>
              <p className="font-black text-gray-900">
                {performance.job_main_category || '-'}
              </p>
              {performance.job_sub_category && (
                <p className="mt-1 text-sm font-bold text-gray-500">
                  {performance.job_sub_category}
                </p>
              )}
            </div>
          )}

          {(performance.site_type || performance.site_location) && (
            <div>
              <InfoLabel>
                <Map size={10} /> 대상지
              </InfoLabel>
              <p className="font-black text-gray-900">
                {performance.site_location || '-'}
              </p>
              {performance.site_type && (
                <span className="mt-2 inline-block rounded-lg bg-green-100 px-3 py-1 text-[10px] font-black text-green-700">
                  {performance.site_type}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PerformanceDetailView({ performance, children }: Props) {
  return (
    <div className="min-h-screen bg-white pb-24">
      <Hero performance={performance} />

      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8 lg:px-10">
        <div className="mb-16 grid gap-12 lg:grid-cols-4">
          {/* min-w-0 필수 — 그리드 아이템의 기본값 min-width:auto 는 내용의
              min-content 너비 밑으로 줄어들길 거부한다. 본문에 min-w-[28rem]
              테이블이 있어서, 이게 없으면 감싼 overflow-x-auto 가 무력해지고
              모바일에서 페이지 전체가 가로로 밀린다(375px 화면에서 504px). */}
          <div className="min-w-0 lg:col-span-3">
            <AdminControls id={performance.id} />
            <div className="performance-content">{children}</div>
          </div>

          <Sidebar performance={performance} />
        </div>

        <div className="mt-24 flex flex-col items-center border-t border-gray-100 pt-16">
          <p className="mb-8 text-xs font-bold tracking-widest text-gray-400">
            다른 시공사례도 살펴보세요
          </p>
          <Link
            href="/performance"
            className="rounded-2xl bg-green-700 px-10 py-5 text-lg font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-green-800 hover:shadow-2xl"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
