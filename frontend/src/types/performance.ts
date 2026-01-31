export interface ContentBlock {
  type: 'text' | 'image' | 'image_row'
  value: string // text일 경우 문자열, image_row일 경우 JSON stringified string[]
}

export interface Performance {
  id: number
  title: string
  content: string // JSON stringified ContentBlock[]
  category?: string
  thumbnail_url?: string
  client?: string
  construction_date?: string
  created_at: string
}

export interface PerformanceCreate {
  title: string
  content: string
  category?: string
  thumbnail_url?: string
  client?: string
  construction_date?: string
}

export interface PerformanceUpdate extends Partial<PerformanceCreate> {}
