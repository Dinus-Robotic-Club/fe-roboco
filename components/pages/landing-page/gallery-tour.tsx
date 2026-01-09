'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Bot, Trophy, Users, Cpu, Gamepad2, Medal, Zap, Settings, Cog, Camera } from 'lucide-react'

interface GalleryItem {
  id: number
  span: string
  aspectRatio: string
  icon: React.ElementType
  color: string
}

const galleryItems: GalleryItem[] = [
  { id: 1, span: 'col-span-2 row-span-2', aspectRatio: 'aspect-square', icon: Bot, color: 'from-gray-200 to-gray-300' },
  { id: 2, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Trophy, color: 'from-stone-200 to-stone-300' },
  { id: 3, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Users, color: 'from-neutral-200 to-neutral-300' },
  { id: 4, span: 'col-span-1 row-span-2', aspectRatio: 'aspect-[2/3]', icon: Cpu, color: 'from-gray-100 to-gray-200' },
  { id: 5, span: 'col-span-2 row-span-1', aspectRatio: 'aspect-video', icon: Gamepad2, color: 'from-stone-100 to-stone-200' },
  { id: 6, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Medal, color: 'from-zinc-200 to-zinc-300' },
  { id: 7, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Settings, color: 'from-gray-200 to-gray-300' },
  { id: 8, span: 'col-span-2 row-span-1', aspectRatio: 'aspect-video', icon: Zap, color: 'from-neutral-100 to-neutral-200' },
  { id: 9, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Cog, color: 'from-stone-200 to-stone-300' },
  { id: 10, span: 'col-span-1 row-span-2', aspectRatio: 'aspect-[2/3]', icon: Bot, color: 'from-zinc-100 to-zinc-200' },
  { id: 11, span: 'col-span-2 row-span-1', aspectRatio: 'aspect-video', icon: Trophy, color: 'from-gray-100 to-gray-200' },
  { id: 12, span: 'col-span-1 row-span-1', aspectRatio: 'aspect-square', icon: Camera, color: 'from-stone-100 to-stone-200' },
]

const GalleryItemCard = ({ item }: { item: GalleryItem }) => {
  const IconComponent = item.icon
  return (
    <div className={`${item.span} relative overflow-hidden rounded-xl border border-black/5`}>
      <div className={`w-full h-full ${item.aspectRatio} bg-linear-to-br ${item.color} relative flex items-center justify-center`}>
        {/* Icon */}
        <IconComponent className="w-12 h-12 lg:w-16 lg:h-16 text-black/10" />

        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        </div>
      </div>
    </div>
  )
}

const GalleryTour = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0

    const scroll = () => {
      if (!scrollContainer) return

      scrollPosition += 0.8

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section className="relative w-full flex flex-col items-center py-16 lg:py-24 overflow-hidden bg-white" id="gallery">
      {/* Auto-scrolling Background Images */}
      <div ref={scrollRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid grid-rows-3 grid-flow-col gap-3 lg:gap-4 auto-cols-[120px] sm:auto-cols-[150px] lg:auto-cols-[180px] min-w-max h-full opacity-60 blur-[2px]">
          {galleryItems.map((item) => (
            <GalleryItemCard key={item.id} item={item} />
          ))}
          {/* Duplicate for seamless loop */}
          {galleryItems.map((item) => (
            <GalleryItemCard key={`dup-${item.id}`} item={item} />
          ))}
          {galleryItems.map((item) => (
            <GalleryItemCard key={`dup2-${item.id}`} item={item} />
          ))}
        </div>
      </div>

      {/* White Overlay */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Coming Soon Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[500px] w-full px-4">
        {/* Large Coming Soon Text - Italic */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center relative">
          {/* Decorative top line */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex items-center gap-4">
            <div className="w-16 lg:w-32 h-0.5 bg-black" />
            <div className="w-3 h-3 bg-[#FBFF00] rotate-45" />
            <div className="w-16 lg:w-32 h-0.5 bg-black" />
          </div>

          {/* Main Text */}
          <div className="relative">
            <h2
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black italic uppercase tracking-tight leading-none"
              style={{
                WebkitTextStroke: '2px black',
                color: 'transparent',
              }}>
              COMING
            </h2>
            <h2
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black italic uppercase tracking-tight leading-none -mt-2 lg:-mt-4"
              style={{
                background: 'linear-gradient(135deg, #FBFF00 0%, #FFD700 50%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.2))',
              }}>
              SOON
            </h2>
          </div>

          {/* Decorative bottom line */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-8 lg:w-12 h-1 bg-[#FBFF00] rounded-full" />
            <div className="w-3 h-3 bg-black rotate-45" />
            <div className="w-20 lg:w-32 h-1 bg-black rounded-full" />
            <div className="w-3 h-3 bg-black rotate-45" />
            <div className="w-8 lg:w-12 h-1 bg-[#FBFF00] rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GalleryTour
