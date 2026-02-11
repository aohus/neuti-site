'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import { TechnologyItemData, TechnologyImageData, TechnologyItemUpdateData, technologyApi } from '@/lib/technologyApi'
import { performanceApi } from '@/lib/performanceApi'

interface Props {
  item: TechnologyItemData
  isOpen: boolean
  onClose: () => void
  onSaved: (updated: TechnologyItemData) => void
}

export default function TechnologyEditModal({ item, isOpen, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')
  const [doctorNote, setDoctorNote] = useState(item.doctor_note || '')
  const [keyPoints, setKeyPoints] = useState<string[]>(item.key_points || [])
  const [images, setImages] = useState<TechnologyImageData[]>(item.images || [])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!isOpen) return null

  const handleAddKeyPoint = () => setKeyPoints([...keyPoints, ''])
  const handleRemoveKeyPoint = (idx: number) => setKeyPoints(keyPoints.filter((_, i) => i !== idx))
  const handleKeyPointChange = (idx: number, value: string) => {
    const updated = [...keyPoints]
    updated[idx] = value
    setKeyPoints(updated)
  }

  const handleRemoveImage = (idx: number) => setImages(images.filter((_, i) => i !== idx))
  const handleImageTagChange = (idx: number, value: string) => {
    const updated = [...images]
    updated[idx] = { ...updated[idx], tag: value, alt: value }
    setImages(updated)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const url = await performanceApi.uploadImage(file)
        setImages(prev => [...prev, { src: url, tag: file.name.replace(/\.[^.]+$/, ''), alt: file.name.replace(/\.[^.]+$/, '') }])
      }
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.')
      console.error(err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data: TechnologyItemUpdateData = {
        title,
        description: description || null,
        doctor_note: doctorNote || null,
        key_points: keyPoints.filter(kp => kp.trim() !== ''),
        images,
      }
      const updated = await technologyApi.updateItem(item.id, data)
      onSaved(updated)
      onClose()
    } catch (err) {
      alert('저장에 실패했습니다.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-black text-gray-900">기술력 항목 편집</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Doctor Note */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">나무의사의 한마디</label>
            <textarea
              value={doctorNote}
              onChange={e => setDoctorNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Key Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">핵심 포인트</label>
              <button
                onClick={handleAddKeyPoint}
                className="text-xs text-green-600 hover:text-green-800 font-bold flex items-center gap-1"
              >
                <Plus size={14} /> 추가
              </button>
            </div>
            <div className="space-y-2">
              {keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={kp}
                    onChange={e => handleKeyPointChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleRemoveKeyPoint(idx)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">이미지</label>
              <label className={`text-xs text-green-600 hover:text-green-800 font-bold flex items-center gap-1 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={14} /> {uploading ? '업로드 중...' : '이미지 추가'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={img.src} alt={img.alt} className="w-24 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 truncate mb-1">{img.src}</p>
                    <input
                      type="text"
                      value={img.tag}
                      onChange={e => handleImageTagChange(idx, e.target.value)}
                      placeholder="태그 (예: 전, 후, 작업명)"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">이미지가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
