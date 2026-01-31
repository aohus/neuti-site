import axios from 'axios'
import { Performance, PerformanceCreate, PerformanceUpdate } from '@/types/performance'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const performanceApi = {
  // 목록 조회
  getPerformances: async (skip = 0, limit = 100): Promise<Performance[]> => {
    const response = await axios.get(`${API_URL}/api/v1/performance/`, {
      params: { skip, limit }
    })
    return response.data.map((p: Performance) => ({
      ...p,
      thumbnail_url: p.thumbnail_url ? (p.thumbnail_url.startsWith('http') ? p.thumbnail_url : `${API_URL}${p.thumbnail_url}`) : p.thumbnail_url
    }))
  },

  // 상세 조회
  getPerformance: async (id: number): Promise<Performance> => {
    const response = await axios.get(`${API_URL}/api/v1/performance/${id}`)
    const p = response.data
    return {
      ...p,
      thumbnail_url: p.thumbnail_url ? (p.thumbnail_url.startsWith('http') ? p.thumbnail_url : `${API_URL}${p.thumbnail_url}`) : p.thumbnail_url
    }
  },

  // 이미지 업로드
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post(`${API_URL}/api/v1/performance/upload-image`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    })
    const imageUrl = response.data
    return imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`
  },

  // 등록
  createPerformance: async (data: PerformanceCreate): Promise<Performance> => {
    const response = await axios.post(`${API_URL}/api/v1/performance/`, data, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // 수정
  updatePerformance: async (id: number, data: PerformanceUpdate): Promise<Performance> => {
    const response = await axios.patch(`${API_URL}/api/v1/performance/${id}`, data, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // 삭제
  deletePerformance: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/performance/${id}`, {
      headers: getAuthHeader()
    })
  }
}
