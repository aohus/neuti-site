'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import axios from 'axios'

const ORG_TYPES = ['시청/구청', '행정복지센터', '공공기관', '학교', '기타 공공', '민간'] as const
const WORK_TYPES = ['조경식재', '녹지관리', '수목전정', '병충해방제', '위험목제거', '수목진단치료', '기타'] as const
const BUDGET_RANGES = ['500만원 이하', '500~1,000만원', '1,000~2,000만원', '2,000만원 이상', '미정/협의'] as const

const schema = z.object({
  org_type: z.string().min(1, '기관 유형을 선택해주세요'),
  org_name: z.string().min(1, '기관/업체명을 입력해주세요'),
  contact_name: z.string().min(1, '담당자명을 입력해주세요'),
  contact_phone: z.string().min(1, '연락처를 입력해주세요'),
  contact_email: z.string().email('올바른 이메일 형식이 아닙니다').optional().or(z.literal('')),
  work_type: z.string().min(1, '작업 유형을 선택해주세요'),
  work_location: z.string().min(1, '작업 위치를 입력해주세요'),
  desired_date: z.string().optional(),
  budget_range: z.string().optional(),
  details: z.string().optional(),
  image: z.any().optional(),
})

type FormData = z.infer<typeof schema>

export default function EstimateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('org_type', data.org_type)
      formData.append('org_name', data.org_name)
      formData.append('contact_name', data.contact_name)
      formData.append('contact_phone', data.contact_phone)
      if (data.contact_email) formData.append('contact_email', data.contact_email)
      formData.append('work_type', data.work_type)
      formData.append('work_location', data.work_location)
      if (data.desired_date) formData.append('desired_date', data.desired_date)
      if (data.budget_range) formData.append('budget_range', data.budget_range)
      if (data.details) formData.append('details', data.details)
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      await axios.post('/backend-api/estimate/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setIsSuccess(true)
      reset()
    } catch (error: any) {
      console.error('Estimate submission failed', error)
      const errorMsg = error.response?.data?.detail
        ? typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail)
        : '제출에 실패했습니다. 잠시 후 다시 시도해주세요.'
      alert(`제출 실패: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-8 rounded-3xl text-center border border-green-100 shadow-inner">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">견적 요청이 접수되었습니다</h3>
        <p className="text-green-700 mb-2 font-medium">1영업일 이내 견적서를 보내드리겠습니다.</p>
        <p className="text-green-600 mb-8 text-sm">실적증명서·자격증빙도 함께 발송됩니다.</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg"
        >
          새로운 견적 요청
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
  const labelClass = 'block text-sm font-bold text-gray-700 mb-2'
  const errorClass = 'text-red-500 text-xs mt-1 font-medium'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기관 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>소속 기관 유형 *</label>
          <select {...register('org_type')} className={inputClass}>
            <option value="">선택해주세요</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.org_type && <p className={errorClass}>{errors.org_type.message}</p>}
        </div>
        <div>
          <label className={labelClass}>기관/업체명 *</label>
          <input {...register('org_name')} className={inputClass} placeholder="OO시청, OO구청 등" />
          {errors.org_name && <p className={errorClass}>{errors.org_name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>담당자명 *</label>
          <input {...register('contact_name')} className={inputClass} placeholder="성함을 입력하세요" />
          {errors.contact_name && <p className={errorClass}>{errors.contact_name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>연락처 *</label>
          <input {...register('contact_phone')} className={inputClass} placeholder="010-0000-0000" />
          {errors.contact_phone && <p className={errorClass}>{errors.contact_phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>이메일</label>
        <input {...register('contact_email')} className={inputClass} placeholder="example@email.com (견적서 발송용)" />
        {errors.contact_email && <p className={errorClass}>{errors.contact_email.message}</p>}
      </div>

      {/* 작업 정보 */}
      <div className="pt-2 border-t border-gray-100" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>작업 유형 *</label>
          <select {...register('work_type')} className={inputClass}>
            <option value="">선택해주세요</option>
            {WORK_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.work_type && <p className={errorClass}>{errors.work_type.message}</p>}
        </div>
        <div>
          <label className={labelClass}>예산 규모</label>
          <select {...register('budget_range')} className={inputClass}>
            <option value="">선택해주세요</option>
            {BUDGET_RANGES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>작업 위치 *</label>
        <input {...register('work_location')} className={inputClass} placeholder="작업 대상지 주소 또는 건물명" />
        {errors.work_location && <p className={errorClass}>{errors.work_location.message}</p>}
      </div>

      <div>
        <label className={labelClass}>희망 시기</label>
        <input {...register('desired_date')} className={inputClass} placeholder="예: 2026년 3월 중, 가능한 빨리 등" />
      </div>

      <div>
        <label className={labelClass}>상세 요청사항</label>
        <textarea
          {...register('details')}
          rows={4}
          className={inputClass}
          placeholder="작업 규모, 수량, 특이사항 등을 자유롭게 적어주세요"
        />
      </div>

      <div>
        <label className={labelClass}>참고 사진</label>
        <input
          type="file"
          {...register('image')}
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer"
        />
      </div>

      {/* 안내 문구 */}
      <div className="bg-green-50 rounded-2xl p-5 space-y-2">
        <p className="text-sm font-bold text-green-800 flex items-center gap-2">
          <span className="text-green-600">&#10003;</span> 견적서 발급: 접수 후 1영업일 이내
        </p>
        <p className="text-sm font-bold text-green-800 flex items-center gap-2">
          <span className="text-green-600">&#10003;</span> 실적증명서·자격증빙 견적서와 함께 발송
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:bg-gray-400"
      >
        {isSubmitting ? '제출 중...' : '견적 요청하기'}
      </button>
    </form>
  )
}
