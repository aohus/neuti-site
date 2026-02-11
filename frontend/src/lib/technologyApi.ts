import axios from 'axios'

const API_URL = '/backend-api'

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface TechnologyImageData {
  src: string
  tag: string
  alt: string
}

export interface TechnologyItemData {
  id: number
  item_key: string
  title: string
  description: string | null
  doctor_note: string | null
  key_points: string[] | null
  images: TechnologyImageData[] | null
  sort_order: number
  created_at: string
  updated_at: string | null
}

export interface TechnologyItemUpdateData {
  title?: string
  description?: string | null
  doctor_note?: string | null
  key_points?: string[] | null
  images?: TechnologyImageData[] | null
  sort_order?: number
}

export const technologyApi = {
  getItems: async (): Promise<TechnologyItemData[]> => {
    const response = await axios.get(`${API_URL}/technology-item`)
    return response.data
  },

  updateItem: async (id: number, data: TechnologyItemUpdateData): Promise<TechnologyItemData> => {
    const response = await axios.patch(`${API_URL}/technology-item/${id}`, data, {
      headers: getAuthHeader()
    })
    return response.data
  },
}
