'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, ChevronLeft, ChevronRight, ArrowRight, Pencil } from 'lucide-react'
import Link from 'next/link'
import Container from '../common/Container'
import { technologyItems as staticItems, TechnologyItem, TechnologyImage } from '@/data/home-content'
import { performanceApi } from '@/lib/performanceApi'
import { Performance } from '@/types/performance'
import { technologyApi, TechnologyItemData } from '@/lib/technologyApi'
import { useAuth } from '@/context/AuthContext'
import TechnologyEditModal from './TechnologyEditModal'

// 홈 탭 title → 시공사례 DB job_main_category 매핑
const TAB_TO_FILTER: Record<string, string> = {
  '조경식재': '대형목이식',
  '소나무 전정': '소나무전정',
  '계절꽃 식재': '꽃식재',
  '녹지관리': '잔디깎이',
  '병충해 방제': '병해충방제',
  '수목수세회복': '수세회복',
  '위험목 제거': '고사목제거',
}

// Convert API data to frontend TechnologyItem format
function apiToLocal(apiItem: TechnologyItemData): TechnologyItem {
  return {
    id: apiItem.item_key,
    title: apiItem.title,
    description: apiItem.description || undefined,
    doctorNote: apiItem.doctor_note || undefined,
    keyPoints: apiItem.key_points || undefined,
    images: (apiItem.images || []).map(img => ({
      src: img.src,
      tag: img.tag,
      alt: img.alt,
    })),
  }
}

// --- Lightbox Component ---
const Lightbox = ({
  isOpen,
  onClose,
  images,
  initialIndex
}: {
  isOpen: boolean;
  onClose: () => void;
  images: TechnologyImage[];
  initialIndex: number
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex)
  }, [isOpen, initialIndex])

  if (!isOpen) return null

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-[110] p-2 bg-white/10 rounded-full transition-colors">
        <X size={32} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-black border border-white/20 tracking-wider">
              {images[currentIndex].tag} <span className="mx-2 opacity-30">|</span> {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 p-4 text-white/30 hover:text-white transition-all">
              <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button onClick={next} className="absolute right-0 p-4 text-white/30 hover:text-white transition-all">
              <ChevronRight size={64} strokeWidth={1} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

// --- Before/After Layout ---
const BeforeAfterLayout = ({
  item,
  onImageClick,
}: {
  item: TechnologyItem
  onImageClick: (index: number) => void
}) => {
  const images = item.images
  const beforeImg = images.find((img) => img.tag === '전')
  const afterImg = images.find((img) => img.tag === '후')
  const extraImages = images.filter(
    (img) => img.tag !== '전' && img.tag !== '후'
  )

  return (
    <div>
      {/* Before / After side-by-side */}
      {beforeImg && afterImg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[beforeImg, afterImg].map((img) => {
            const idx = images.indexOf(img)
            return (
              <div key={img.tag}>
                <div
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in group bg-gray-100"
                  onClick={() => onImageClick(idx)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
                <p
                  className={`text-center mt-3 text-sm font-black ${
                    img.tag === '전'
                      ? 'text-gray-400'
                      : 'text-green-600'
                  }`}
                >
                  {img.tag}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Extra images in smaller grid */}
      {extraImages.length > 0 && (
        <div className={`grid grid-cols-2 ${extraImages.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
          {extraImages.map((img) => {
            const idx = images.indexOf(img)
            return (
              <div key={idx}>
                <div
                  className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-zoom-in group bg-gray-100"
                  onClick={() => onImageClick(idx)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <p className="text-center mt-3 text-sm font-black text-gray-400">
                  {img.tag}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Photo Grid Layout (no B/A) ---
const PhotoGridLayout = ({
  item,
  onImageClick,
}: {
  item: TechnologyItem
  onImageClick: (index: number) => void
}) => {
  const images = item.images
  return (
    <div className={`grid grid-cols-2 ${images.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
      {images.map((img, idx) => (
        <div key={idx}>
          <div
            className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in group bg-gray-100"
            onClick={() => onImageClick(idx)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                <Maximize2 size={16} />
              </div>
            </div>
          </div>
          <p className="text-center mt-3 text-sm font-black text-gray-400">
            {img.tag}
          </p>
        </div>
      ))}
    </div>
  )
}

// --- Filtered Performance Cards ---
const FilteredPerformanceCards = ({ tabTitle }: { tabTitle: string }) => {
  const [performances, setPerformances] = useState<Performance[]>([])
  const filterValue = TAB_TO_FILTER[tabTitle] || tabTitle

  useEffect(() => {
    performanceApi.getPerformances(0, 3, { job_main: filterValue }).then((data) => {
      setPerformances(data)
    }).catch(() => {
      setPerformances([])
    })
  }, [filterValue])

  if (performances.length === 0) return null

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-gray-900">관련 시공사례</h4>
        <Link
          href={`/performance?job_main=${encodeURIComponent(filterValue)}`}
          className="group inline-flex items-center text-green-700 font-black text-xs hover:text-green-900 transition-colors"
        >
          전체 보기
          <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performances.map((p) => (
          <Link
            key={p.id}
            href={`/performance/${p.id}`}
            className="group rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-all"
          >
            {p.thumbnail_url && (
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={p.thumbnail_url}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-sm font-black text-gray-900 line-clamp-1">{p.title}</p>
              {p.client && (
                <p className="text-xs text-gray-400 font-medium mt-1">{p.client}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// --- Tab Content ---
const TabContent = ({
  item,
  onImageClick,
}: {
  item: TechnologyItem
  onImageClick: (index: number) => void
}) => {
  const hasBeforeAfter =
    item.images.some((img) => img.tag === '전') &&
    item.images.some((img) => img.tag === '후')

  return (
    <div>
      {/* Images */}
      {hasBeforeAfter ? (
        <BeforeAfterLayout item={item} onImageClick={onImageClick} />
      ) : (
        <PhotoGridLayout item={item} onImageClick={onImageClick} />
      )}

      {/* Description + Key Points */}
      <div className="mt-5">
        {item.description && (
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4 font-medium">
            {item.description}
          </p>
        )}

        {item.keyPoints && item.keyPoints.length > 0 && (
          <div className="space-y-2 mb-4">
            {item.keyPoints.map((text, i) => (
              <div key={i} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                <p className="text-gray-700 font-bold text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        )}

        {item.doctorNote && (
          <div className="relative p-5 md:p-6 bg-gray-50 rounded-2xl mt-4">
            <p className="text-green-600 text-xs font-black tracking-wider uppercase mb-2">나무의사의 한마디</p>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
              &ldquo;{item.doctorNote}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Related Performance Cards */}
      <FilteredPerformanceCards tabTitle={item.title} />
    </div>
  )
}

export default function TechnologySection() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<TechnologyItem[]>(staticItems)
  const [apiItems, setApiItems] = useState<TechnologyItemData[]>([])
  const [activeTabId, setActiveTabId] = useState(staticItems[0].id)
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 })
  const [editModal, setEditModal] = useState<{ isOpen: boolean; apiItem: TechnologyItemData | null }>({ isOpen: false, apiItem: null })

  const fetchItems = useCallback(async () => {
    try {
      const data = await technologyApi.getItems()
      if (data.length > 0) {
        setApiItems(data)
        setItems(data.map(apiToLocal))
      }
    } catch {
      // API failed — keep static fallback
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const activeItem = items.find(item => item.id === activeTabId) || items[0]
  const activeApiItem = apiItems.find(a => a.item_key === activeTabId)

  const openLightbox = (index: number) => setLightbox({ isOpen: true, index })
  const closeLightbox = () => setLightbox({ isOpen: false, index: 0 })

  const handleEdit = () => {
    if (activeApiItem) {
      setEditModal({ isOpen: true, apiItem: activeApiItem })
    }
  }

  const handleSaved = (updated: TechnologyItemData) => {
    setApiItems(prev => prev.map(a => a.id === updated.id ? updated : a))
    setItems(prev => prev.map(item => item.id === updated.item_key ? apiToLocal(updated) : item))
  }

  return (
    <section id="services" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-4">Evidence of Excellence</h2>
          <p className="text-[2rem] md:text-[3rem] font-black text-gray-900 mb-12 tracking-tighter">결과로 증명하는 기술력</p>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 px-2 md:px-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
                onMouseEnter={() => setActiveTabId(item.id)}
                className={`px-3 py-2 md:px-6 md:py-3 rounded-full text-[11px] md:text-sm font-black transition-all duration-300 shadow-sm ${
                  activeTabId === item.id
                    ? 'bg-green-600 text-white shadow-xl scale-105 ring-2 ring-green-600 ring-offset-2'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 hover:shadow-md'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Admin edit button */}
          {isAdmin && activeApiItem && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Pencil size={14} />
                편집
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <TabContent item={activeItem} onImageClick={openLightbox} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>

      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        images={activeItem.images}
        initialIndex={lightbox.index}
      />

      {editModal.isOpen && editModal.apiItem && (
        <TechnologyEditModal
          item={editModal.apiItem}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, apiItem: null })}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
