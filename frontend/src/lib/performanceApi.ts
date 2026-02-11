import axios from 'axios'
import { Performance, PerformanceCreate, PerformanceUpdate } from '@/types/performance'

// 절대 주소 대신 반드시 현재 도메인을 경유하는 상대 경로를 사용합니다.
// next.config.ts rewrite: /backend-api/:path* → http://backend:8000/api/v1/:path*
const API_URL = '/backend-api'

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getFullUrl = (url: string | null | undefined) => {
  if (!url) return url
  if (url.startsWith('http')) return url
  // 도메인 없이 상대 경로(/uploads/...)만 반환
  return url.startsWith('/') ? url : `/${url}`
}

export const performanceApi = {
  // 목록 조회
  getPerformances: async (
    skip = 0, 
    limit = 100, 
    filters?: {
      category?: string,
      year?: number,
      job_main?: string,
      site_type?: string,
      q?: string
    }
  ): Promise<Performance[]> => {
    // 경로 끝에 / 제거
    const response = await axios.get(`${API_URL}/performance`, {
      params: { 
        skip, 
        limit, 
        category: filters?.category,
        year: filters?.year,
        job_main: filters?.job_main,
        site_type: filters?.site_type,
        q: filters?.q
      }
    })
    
    // 디버깅 로그
    console.log('Raw API Response:', response.data);

    if (!Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((p: Performance) => ({
      ...p,
      thumbnail_url: getFullUrl(p.thumbnail_url)
    }))
  },

  // 상세 조회
  getPerformance: async (id: number): Promise<Performance> => {
    const response = await axios.get(`${API_URL}/performance/${id}`)
    return {
      ...response.data,
      thumbnail_url: getFullUrl(response.data.thumbnail_url)
    }
  },

  // 마크다운 파일 업로드
  uploadMarkdown: async (file: File): Promise<Performance> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${API_URL}/performance/upload-md`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 이미지 업로드
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post(`${API_URL}/performance/upload-image`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    })
    const imageUrl = response.data
    return getFullUrl(imageUrl) ?? imageUrl
  },

  // 등록
  createPerformance: async (data: PerformanceCreate): Promise<Performance> => {
    const response = await axios.post(`${API_URL}/performance`, data, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // 수정
  updatePerformance: async (id: number, data: PerformanceUpdate): Promise<Performance> => {
    const response = await axios.patch(`${API_URL}/performance/${id}`, data, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // 삭제
  deletePerformance: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/performance/${id}`, {
      headers: getAuthHeader()
    })
  }
}