export interface HistoryItem {
  year: string
  title: string
  description: string
}

export interface CertificationItem {
  id: number
  title: string
  category: 'License' | 'Patent' | 'Award' | 'Social'
  image?: string
}
