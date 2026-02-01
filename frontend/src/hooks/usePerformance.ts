import { useState, useEffect, useCallback } from 'react'
import { Performance } from '@/types/performance'
import { performanceApi } from '@/lib/performanceApi'

export function usePerformances(filters?: {
  category?: string,
  year?: number,
  job_main?: string,
  site_type?: string,
  q?: string
}) {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformances = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await performanceApi.getPerformances(0, 100, filters)
      setPerformances(data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch performances', err)
      setError('시공 사례를 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [filters?.category, filters?.year, filters?.job_main, filters?.site_type, filters?.q])

  useEffect(() => {
    fetchPerformances()
  }, [fetchPerformances])

  return { performances, isLoading, error, refresh: fetchPerformances }
}

export function usePerformance(id: number | null) {
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPerformance = async () => {
      setIsLoading(true)
      try {
        const data = await performanceApi.getPerformance(id)
        setPerformance(data)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch performance detail', err)
        setError('상세 내용을 불러오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformance()
  }, [id])

  return { performance, isLoading, error }
}
