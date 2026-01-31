'use client'

import { useState } from 'react'
import { performanceApi } from '@/lib/performanceApi'
import { PerformanceCreate, ContentBlock } from '@/types/performance'
import { X, Upload, Image as ImageIcon, Type, Plus, Trash2, ArrowUp, ArrowDown, LayoutGrid } from 'lucide-react'

interface PerformanceFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function PerformanceForm({ onClose, onSuccess }: PerformanceFormProps) {
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [constructionDate, setConstructionDate] = useState(new Date().toISOString().split('T')[0])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { type: 'text', value: '' }
  ])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
      const url = await performanceApi.uploadImage(file)
      setThumbnailUrl(url)
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const addBlock = (type: 'text' | 'image' | 'image_row') => {
    const newValue = type === 'image_row' ? JSON.stringify([]) : ''
    setBlocks([...blocks, { type, value: newValue }])
  }

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index))
  }

  const updateBlock = (index: number, value: string) => {
    const newBlocks = [...blocks]
    newBlocks[index].value = value
    setBlocks(newBlocks)
  }

  const handleBlockImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await performanceApi.uploadImage(file)
      updateBlock(index, url)
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleRowImageUpload = async (blockIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await performanceApi.uploadImage(file)
      const currentImages = JSON.parse(blocks[blockIndex].value)
      updateBlock(blockIndex, JSON.stringify([...currentImages, url]))
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const removeImageFromRow = (blockIndex: number, imgIndex: number) => {
    const currentImages = JSON.parse(blocks[blockIndex].value)
    const newImages = currentImages.filter((_: any, i: number) => i !== imgIndex)
    updateBlock(blockIndex, JSON.stringify(newImages))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return
    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    setBlocks(newBlocks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return alert('제목을 입력해주세요.')
    setIsSubmitting(true)

    try {
      const data: PerformanceCreate = {
        title,
        client,
        construction_date: constructionDate,
        thumbnail_url: thumbnailUrl,
        content: JSON.stringify(blocks)
      }
      await performanceApi.createPerformance(data)
      onSuccess()
      onClose()
    } catch (err) {
      alert('등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl my-8 overflow-hidden">
        <div className="flex justify-between items-center p-10 border-b bg-gray-50/50">
          <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">시공 사례 상세 기록</h3>
            <p className="text-sm text-gray-500 font-bold mt-2">풍부한 사진과 글로 전문성을 보여주세요.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-all">
            <X size={32} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Project Title</label>
                <input
                  type="text"
                  placeholder="공사 제목을 입력하세요"
                  className="w-full px-8 py-5 rounded-[2rem] border-4 border-gray-50 focus:border-green-500 bg-gray-50 focus:bg-white outline-none font-black text-2xl transition-all"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Client</label>
                  <input
                    type="text"
                    placeholder="발주처"
                    className="w-full px-6 py-4 rounded-2xl border-4 border-gray-50 focus:border-green-500 bg-gray-50 focus:bg-white outline-none font-bold"
                    value={client}
                    onChange={e => setClient(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Construction Date</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 rounded-2xl border-4 border-gray-50 focus:border-green-500 bg-gray-50 focus:bg-white outline-none font-bold"
                    value={constructionDate}
                    onChange={e => setConstructionDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Thumbnail</label>
              <div className="relative aspect-square rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden hover:border-green-300 transition-all group bg-gray-50">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={48} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm font-black text-gray-300">대표 이미지</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b-4 border-gray-50 pb-6">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Storytelling Blocks</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-green-600 hover:text-white transition-all">
                  <Type size={18} /> 글
                </button>
                <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-green-600 hover:text-white transition-all">
                  <ImageIcon size={18} /> 큰 사진
                </button>
                <button type="button" onClick={() => addBlock('image_row')} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-green-600 hover:text-white transition-all">
                  <LayoutGrid size={18} /> 사진 그룹
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {blocks.map((block, index) => (
                <div key={index} className="group relative bg-gray-50 rounded-[2.5rem] p-8 border-4 border-transparent hover:border-green-100 transition-all">
                  {/* Toolbar */}
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button type="button" onClick={() => moveBlock(index, 'up')} className="p-3 bg-white shadow-xl rounded-full text-gray-400 hover:text-green-600 hover:scale-110 transition-all"><ArrowUp size={20} /></button>
                    <button type="button" onClick={() => removeBlock(index)} className="p-3 bg-white shadow-xl rounded-full text-red-400 hover:bg-red-50 hover:scale-110 transition-all"><Trash2 size={20} /></button>
                    <button type="button" onClick={() => moveBlock(index, 'down')} className="p-3 bg-white shadow-xl rounded-full text-gray-400 hover:text-green-600 hover:scale-110 transition-all"><ArrowDown size={20} /></button>
                  </div>

                  {block.type === 'text' ? (
                    <textarea
                      placeholder="이곳에 시공 이야기를 들려주세요..."
                      rows={5}
                      className="w-full bg-transparent border-none outline-none font-bold text-gray-700 placeholder-gray-300 resize-none text-xl leading-relaxed"
                      value={block.value}
                      onChange={e => updateBlock(index, e.target.value)}
                    />
                  ) : block.type === 'image' ? (
                    <div className="relative aspect-[21/9] rounded-3xl border-4 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center overflow-hidden group/img">
                      {block.value ? (
                        <img src={block.value.startsWith('http') ? block.value : `http://localhost:8000${block.value}`} alt="Content" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Upload size={40} className="mx-auto mb-3 text-gray-200" />
                          <p className="text-sm font-black text-gray-300">클릭하여 와이드 이미지 업로드</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={e => handleBlockImageUpload(index, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Image Grid (Max 3 per row)</p>
                        <div className="relative">
                           <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-green-600 font-bold text-xs shadow-sm hover:shadow-md transition-all">
                            <Plus size={14} /> 사진 추가
                          </button>
                          <input type="file" accept="image/*" onChange={e => handleRowImageUpload(index, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {JSON.parse(block.value).map((imgUrl: string, imgIdx: number) => (
                          <div key={imgIdx} className="relative aspect-square rounded-2xl overflow-hidden group/subimg">
                            <img src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:8000${imgUrl}`} alt="Row" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeImageFromRow(index, imgIdx)}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover/subimg:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {JSON.parse(block.value).length < 3 && (
                          <div className="relative aspect-square rounded-2xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white/50">
                            <Plus size={24} className="text-gray-200" />
                            <input type="file" accept="image/*" onChange={e => handleRowImageUpload(index, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-10 border-t-4 border-gray-50">
            <button type="button" onClick={onClose} className="px-10 py-5 rounded-2xl font-black text-gray-400 hover:text-gray-600 transition-all text-lg">취소</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-5 rounded-[2rem] bg-green-700 text-white font-black text-xl hover:bg-green-800 transition-all shadow-2xl hover:shadow-green-200/50 hover:-translate-y-1 disabled:bg-gray-300"
            >
              {isSubmitting ? '기록 저장 중...' : '시공 사례 발행하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
