'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Maximize2, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Container from '../common/Container'
import { technologyItems, TechnologyItem, TechnologyImage } from '@/data/home-content'
import { performanceApi } from '@/lib/performanceApi'
import { Performance } from '@/types/performance'

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
  const beforeImg = images.find((img) => img.tag.toLowerCase() === 'before')
  const afterImg = images.find((img) => img.tag.toLowerCase() === 'after')
  const extraImages = images.filter(
    (img) => img.tag.toLowerCase() !== 'before' && img.tag.toLowerCase() !== 'after'
  )

  return (
    <div>
      {/* Before / After side-by-side */}
      {beforeImg && afterImg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {[beforeImg, afterImg].map((img) => {
            const idx = images.indexOf(img)
            return (
              <div
                key={img.tag}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in group bg-gray-100"
                onClick={() => onImageClick(idx)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg ${
                      img.tag.toLowerCase() === 'before'
                        ? 'bg-black/80 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {img.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Maximize2 size={16} />
                  </div>
                </div>
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
              <div
                key={idx}
                className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-zoom-in group bg-gray-100"
                onClick={() => onImageClick(idx)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider bg-white/90 text-gray-900 border border-gray-200 shadow">
                    {img.tag}
                  </span>
                </div>
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
        <div
          key={idx}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in group bg-gray-100"
          onClick={() => onImageClick(idx)}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-white/90 text-gray-900 border border-gray-200 shadow-lg">
              {img.tag}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
              <Maximize2 size={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// --- Filtered Performance Cards ---
const FilteredPerformanceCards = ({ tabTitle }: { tabTitle: string }) => {
  const [performances, setPerformances] = useState<Performance[]>([])

  useEffect(() => {
    performanceApi.getPerformances(0, 3, { job_main: tabTitle }).then((data) => {
      setPerformances(data)
    }).catch(() => {
      setPerformances([])
    })
  }, [tabTitle])

  if (performances.length === 0) return null

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-gray-900">관련 시공사례</h4>
        <Link
          href={`/performance?job_main=${encodeURIComponent(tabTitle)}`}
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
    item.images.some((img) => img.tag.toLowerCase() === 'before') &&
    item.images.some((img) => img.tag.toLowerCase() === 'after')

  return (
    <div>
      {/* Images */}
      {hasBeforeAfter ? (
        <BeforeAfterLayout item={item} onImageClick={onImageClick} />
      ) : (
        <PhotoGridLayout item={item} onImageClick={onImageClick} />
      )}

      {/* "더 보기" link — 이미지 바로 아래 */}
      <div className="mt-4 mb-6">
        <Link
          href={`/performance?job_main=${encodeURIComponent(item.title)}`}
          className="group inline-flex items-center text-green-700 font-black text-sm hover:text-green-900 transition-colors"
        >
          {item.title} 사례 더 보기
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Description + Key Points */}
      <div>
        {item.description && (
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 font-medium">
            {item.description}
          </p>
        )}

        {item.keyPoints && item.keyPoints.length > 0 && (
          <div className="space-y-3 mb-6">
            {item.keyPoints.map((text, i) => (
              <div key={i} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                <p className="text-gray-700 font-bold text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        )}

        {item.doctorNote && (
          <div className="flex items-start p-5 bg-green-50/50 rounded-2xl border border-green-100/50 shadow-sm">
            <CheckCircle2 className="text-green-600 mr-3 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-900 text-xs font-black mb-1">나무의사의 한마디</p>
              <p className="text-gray-600 text-[11px] md:text-xs leading-relaxed font-medium">
                &ldquo;{item.doctorNote}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Performance Cards */}
      <FilteredPerformanceCards tabTitle={item.title} />
    </div>
  )
}

export default function TechnologySection() {
  const [activeTabId, setActiveTabId] = useState(technologyItems[0].id)
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 })

  const activeItem = technologyItems.find(item => item.id === activeTabId) || technologyItems[0]

  const openLightbox = (index: number) => setLightbox({ isOpen: true, index })
  const closeLightbox = () => setLightbox({ isOpen: false, index: 0 })

  return (
    <section id="services" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-4">Evidence of Excellence</h2>
          <p className="text-[2rem] md:text-[3rem] font-black text-gray-900 mb-12 tracking-tighter">결과로 증명하는 기술력</p>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 px-2 md:px-4">
            {technologyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
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
    </section>
  )
}
