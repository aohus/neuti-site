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

/** GET /inquiry 목록 응답. 비밀글 보호를 위해 본문·답변은 없다. */
export interface InquirySummary {
  id: number
  title: string
  author: string
  is_secret: boolean
  created_at: string
  has_answer: boolean
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
