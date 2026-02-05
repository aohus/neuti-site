export interface ContentBlock {
  type: 'text' | 'image' | 'image_row'
  value: string // text일 경우 문자열, image_row일 경우 JSON stringified string[]
}

export interface Performance {
  id: number
  title: string
  content: string // JSON stringified ContentBlock[]
  category?: string | null
  thumbnail_url?: string | null
  client?: string | null
  year?: number | null
  job_main_category?: string | null
  job_sub_category?: string | null
  site_type?: string | null
  site_location?: string | null
  construction_date?: string | null
  created_at: string
}

export interface PerformanceCreate {
  title: string
  content: string
  category?: string | null
  thumbnail_url?: string | null
  client?: string | null
  year?: number | null
  job_main_category?: string | null
  job_sub_category?: string | null
  site_type?: string | null
  site_location?: string | null
  construction_date?: string | null
}

export interface PerformanceUpdate extends Partial<PerformanceCreate> {}

export interface PerformanceStats {
  total_count: number
  public_client_count: number
  categories: Record<string, number>
  job_categories: Record<string, number>
  years: Record<string, number>
}
