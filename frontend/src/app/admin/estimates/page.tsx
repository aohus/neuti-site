'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Container from '@/components/common/Container'
import axios from 'axios'
import { ClipboardList, Phone, Mail, MapPin, Calendar, Building2, Briefcase, ChevronDown, ChevronUp, CheckCircle2, Trash2, Clock, CircleDot } from 'lucide-react'

interface EstimateRequest {
  id: number
  org_type: string
  org_name: string
  contact_name: string
  contact_phone: string
  contact_email: string | null
  work_type: string
  work_location: string
  desired_date: string | null
  budget_range: string | null
  details: string | null
  image_url: string | null
  status: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: '새 요청', color: 'text-blue-700', bg: 'bg-blue-50' },
  in_progress: { label: '처리중', color: 'text-amber-700', bg: 'bg-amber-50' },
  completed: { label: '처리완료', color: 'text-green-700', bg: 'bg-green-50' },
}

const FILTER_TABS = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '새 요청' },
  { key: 'in_progress', label: '처리중' },
  { key: 'completed', label: '처리완료' },
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

export default function AdminEstimatesPage() {
  const { isAdmin, token } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<EstimateRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/login')
      return
    }
    fetchRequests()
  }, [isAdmin])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('/backend-api/estimate/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(res.data)
    } catch (err) {
      console.error('Failed to fetch estimate requests', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/backend-api/estimate/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
    } catch (err) {
      console.error('Failed to update status', err)
      alert('상태 변경에 실패했습니다.')
    }
  }

  const deleteRequest = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    try {
      await axios.delete(`/backend-api/estimate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests((prev) => prev.filter((r) => r.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch (err) {
      console.error('Failed to delete request', err)
      alert('삭제에 실패했습니다.')
    }
  }

  const filteredRequests = useMemo(
    () => filter === 'all' ? requests : requests.filter((r) => r.status === filter),
    [requests, filter]
  )

  const counts = useMemo(() => ({
    all: requests.length,
    new: requests.filter((r) => r.status === 'new').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  }), [requests])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.new
    return (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.color} ${config.bg}`}>
        {config.label}
      </span>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white min-h-screen">
      <Container>
        <div className="mb-8">
          <span className="text-label">Admin</span>
          <p className="mt-2 text-3xl font-black text-deep tracking-tight sm:text-4xl">
            견적 요청 관리
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === tab.key
                  ? 'bg-deep text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-white/70' : 'text-gray-400'}`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <div className="border-green-600 mb-6 inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-b-2" />
            <p className="font-bold text-gray-400">불러오는 중...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-24 text-center">
            <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-400">
              {filter === 'all' ? '접수된 견적 요청이 없습니다' : `${FILTER_TABS.find(t => t.key === filter)?.label} 상태의 요청이 없습니다`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isExpanded = expandedId === req.id
              return (
                <div
                  key={req.id}
                  className={`border-2 rounded-2xl overflow-hidden transition-colors ${
                    req.status === 'new' ? 'border-blue-100 hover:border-blue-200' :
                    req.status === 'in_progress' ? 'border-amber-100 hover:border-amber-200' :
                    'border-gray-100 hover:border-green-200'
                  }`}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        req.status === 'new' ? 'bg-blue-50 text-blue-600' :
                        req.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-deep">{req.org_name}</span>
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{req.org_type}</span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{req.work_type}</span>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="text-sm text-gray-400 font-bold mt-1 truncate">
                          {req.contact_name} · {req.contact_phone} · {formatDate(req.created_at)}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-300 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                  </button>

                  {/* Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 md:p-6 bg-gray-50/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-gray-500">기관:</span>
                            <span className="font-bold text-deep">{req.org_name} ({req.org_type})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-gray-500">연락처:</span>
                            <a href={`tel:${req.contact_phone}`} className="font-bold text-green-700 hover:underline">
                              {req.contact_name} / {req.contact_phone}
                            </a>
                          </div>
                          {req.contact_email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="font-bold text-gray-500">이메일:</span>
                              <a href={`mailto:${req.contact_email}`} className="font-bold text-green-700 hover:underline">
                                {req.contact_email}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-gray-500">작업위치:</span>
                            <span className="font-bold text-deep">{req.work_location}</span>
                          </div>
                          {req.desired_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-bold text-gray-500">희망시기:</span>
                              <span className="font-bold text-deep">{req.desired_date}</span>
                            </div>
                          )}
                          {req.budget_range && (
                            <div className="flex items-center gap-2 text-sm">
                              <ClipboardList className="w-4 h-4 text-gray-400" />
                              <span className="font-bold text-gray-500">예산규모:</span>
                              <span className="font-bold text-deep">{req.budget_range}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {req.details && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">상세 요청사항</p>
                          <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {req.details}
                          </p>
                        </div>
                      )}

                      {req.image_url && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">첨부 사진</p>
                          <img
                            src={req.image_url}
                            alt="첨부 사진"
                            className="max-w-sm rounded-xl border border-gray-100"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                        {req.status !== 'in_progress' && (
                          <button
                            onClick={() => updateStatus(req.id, 'in_progress')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          >
                            <Clock className="w-4 h-4" />
                            처리중
                          </button>
                        )}
                        {req.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(req.id, 'completed')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            처리완료
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <button
                            onClick={() => updateStatus(req.id, 'new')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <CircleDot className="w-4 h-4" />
                            새 요청으로
                          </button>
                        )}
                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}
