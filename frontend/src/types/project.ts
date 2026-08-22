export interface Project {
  id: number
  title: string
  subtitle?: string | null // 주제목 아래에 노출되는 부제목
  category: string // 공종 (e.g., '조경식재공사업', '나무병원')
  client: string // 발주처
  role: string // 원도급/하도급
  year?: string // 년도 (Extracted from title if possible)
  description?: string
  image?: string
  tags: string[]
}
