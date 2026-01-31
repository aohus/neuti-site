'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import axios from 'axios'

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  contact: z.string().min(1, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다').optional().or(z.literal('')),
  address: z.string().min(1, '주소를 입력해주세요'),
  symptom: z.string().min(1, '증상을 입력해주세요'),
  image: z.any().optional()
})

type FormData = z.infer<typeof schema>

export default function DiagnosisForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('contact', data.contact)
      formData.append('address', data.address)
      formData.append('symptom', data.symptom)
      if (data.email) formData.append('email', data.email)
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.post(`${apiUrl}/api/v1/diagnosis/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setIsSuccess(true)
      reset()
    } catch (error: any) {
      console.error('Submission failed', error)
      const errorMsg = error.response?.data?.detail 
        ? (typeof error.response.data.detail === 'string' ? error.response.data.detail : JSON.stringify(error.response.data.detail))
        : '제출에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
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
        <h3 className="text-2xl font-bold text-green-800 mb-4">의뢰가 정상적으로 접수되었습니다.</h3>
        <p className="text-green-700 mb-8 font-medium">내용 확인 후 전문가가 곧 연락드리겠습니다.</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg"
        >
          새로운 의뢰 작성하기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">이름 / 업체명 *</label>
        <input
          {...register('name')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="성함 또는 업체명을 입력하세요"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">연락처 *</label>
        <input
          {...register('contact')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="010-0000-0000"
        />
        {errors.contact && <p className="text-red-500 text-xs mt-1 font-medium">{errors.contact.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
        <input
          {...register('email')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="example@email.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">대상 수목 위치 (주소) *</label>
        <input
          {...register('address')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="나무가 위치한 주소를 입력하세요"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">주요 증상 및 의뢰 내용 *</label>
        <textarea
          {...register('symptom')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="나무의 상태나 궁금하신 점을 자세히 적어주세요"
        />
        {errors.symptom && <p className="text-red-500 text-xs mt-1 font-medium">{errors.symptom.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">사진 첨부</label>
        <input
          type="file"
          {...register('image')}
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:bg-gray-400"
      >
        {isSubmitting ? '제출 중...' : '의뢰하기'}
      </button>
    </form>
  )
}