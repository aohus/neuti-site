'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Maximize2, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Container from '../common/Container'
import { technologyItems, TechnologyItem, TechnologyImage } from '@/data/home-content'

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

  React.useEffect(() => {
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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

// --- Image Item Component (Thumbnail) ---
const ThumbnailImage = ({ 
  image, 
  className = "", 
  onClick,
  showPlus = false,
  plusCount = 0,
  isActive = false
}: { 
  image: TechnologyImage, 
  className?: string, 
  onClick?: () => void,
  showPlus?: boolean,
  plusCount?: number,
  isActive?: boolean
}) => {
  return (
    <motion.div
      className={`relative w-full h-full rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 bg-gray-50 border cursor-pointer ${
        isActive ? 'ring-2 ring-green-500 border-green-500 opacity-100' : 'border-gray-100 opacity-70 hover:opacity-100'
      } ${className}`}
      onClick={onClick}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {showPlus && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-20 hover:bg-black/40 transition-colors">
          <Plus size={20} className="mb-0.5" />
          <span className="text-xs font-black">+{plusCount}</span>
        </div>
      )}
    </motion.div>
  )
}

// --- Interactive Gallery Viewer Component ---
const InteractiveGallery = ({ 
  item, 
  onMainClick 
}: { 
  item: TechnologyItem, 
  onMainClick: (index: number) => void 
}) => {
  const images = item.images;
  const beforeIdx = images.findIndex(img => img.tag.toLowerCase() === 'before');
  const afterIdx = images.findIndex(img => img.tag.toLowerCase() === 'after');
  
  const hasBeforeAfter = beforeIdx !== -1 && afterIdx !== -1;
  const [activeViewIdx, setActiveViewIdx] = useState(hasBeforeAfter ? afterIdx : 0);

  React.useEffect(() => {
    setActiveViewIdx(hasBeforeAfter ? afterIdx : 0);
  }, [item.id, hasBeforeAfter, afterIdx]);

  const priorityIndices: number[] = [];
  if (beforeIdx !== -1) priorityIndices.push(beforeIdx);
  if (afterIdx !== -1) priorityIndices.push(afterIdx);
  
  images.forEach((_, idx) => {
    if (idx !== beforeIdx && idx !== afterIdx) {
      priorityIndices.push(idx);
    }
  });

  const activeImage = images[activeViewIdx];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
      
      {/* LEFT: Main Frame (7/12) */}
      <div className="w-full xl:col-span-7">
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl bg-gray-100 group border border-gray-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeViewIdx}
              src={activeImage.src}
              alt={activeImage.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              onClick={() => onMainClick(activeViewIdx)}
            />
          </AnimatePresence>

          <div className="absolute top-5 left-5 z-20">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-md ${
              activeImage.tag.toLowerCase() === 'before'
                ? 'bg-black/80 text-white border border-white/20'
                : activeImage.tag.toLowerCase() === 'after'
                ? 'bg-green-600 text-white'
                : 'bg-white/90 text-gray-900 border border-gray-200'
            }`}>
              {activeImage.tag}
            </span>
          </div>

          {hasBeforeAfter && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveViewIdx(beforeIdx); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeViewIdx === beforeIdx ? 'bg-white text-black shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                Before
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveViewIdx(afterIdx); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeViewIdx === afterIdx ? 'bg-green-500 text-white shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                After
              </button>
            </div>
          )}

          <div className="absolute bottom-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
              <Maximize2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Text & Thumbnails (5/12) */}
      <div className="flex flex-col w-full xl:col-span-5 h-full justify-center">
        <div className="flex items-center space-x-3 mb-5">
          <div className="h-[1.5px] w-6 bg-green-600" />
          <span className="text-green-600 text-[10px] font-black uppercase tracking-[0.2em]">Our Performance</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">
          {item.title}
        </h3>
        
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 font-medium">
          {item.description}
        </p>
        
        <div className="space-y-3 mb-8">
          {item.keyPoints?.map((text, i) => (
            <div key={i} className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0" />
              <p className="text-gray-700 font-bold text-xs md:text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Gallery Preview */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gallery Preview</p>
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {priorityIndices.map((originalIdx, displayIdx) => {
              if (displayIdx > 4) return null;
              const isLastVisible = displayIdx === 4 && priorityIndices.length > 5;
              const hiddenCount = priorityIndices.length - 5;
              
              return (
                <ThumbnailImage 
                  key={originalIdx} 
                  image={images[originalIdx]} 
                  isActive={activeViewIdx === originalIdx}
                  onClick={() => {
                    if (isLastVisible) {
                      onMainClick(originalIdx);
                    } else {
                      setActiveViewIdx(originalIdx);
                    }
                  }}
                  showPlus={isLastVisible}
                  plusCount={hiddenCount}
                  className="aspect-square"
                />
              )
            })}
          </div>
        </div>
        
        {item.doctorNote && (
          <div className="flex items-start p-4 bg-green-50/50 rounded-xl border border-green-100/50">
             <CheckCircle2 className="text-green-600 mr-3 w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="text-gray-900 text-xs font-black mb-1">나무의사의 한마디</p>
               <p className="text-gray-600 text-[11px] md:text-xs leading-relaxed font-medium">
                 "{item.doctorNote}"
               </p>
             </div>
          </div>
        )}

      </div>
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
    <section className="py-40 bg-white overflow-hidden">
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-green-600 tracking-widest uppercase mb-4">Evidence of Excellence</h2>
          <p className="text-3xl md:text-5xl font-black text-gray-900 mb-12 tracking-tighter">결과로 증명하는 기술력</p>
          
          {/* Tabs - Single Row with Wrap, no drag scroll */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4">
            {technologyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
                className={`px-6 py-3 rounded-full text-xs md:text-sm font-black transition-all duration-300 shadow-sm ${
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

        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <InteractiveGallery item={activeItem} onMainClick={openLightbox} />
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
