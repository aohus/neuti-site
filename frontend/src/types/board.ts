export interface Notice {
  id: number
  title: string
  content: string
  created_at: string
  views: number
}

export interface Answer {
  id: number
  inquiry_id: number
  content: string
  created_at: string
}

export interface Inquiry {
  id: number
  title: string
  content: string
  author: string
  is_secret: boolean
  created_at: string
  answer?: Answer
}
