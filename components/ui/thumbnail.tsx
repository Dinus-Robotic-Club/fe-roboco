import { Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/function'

export const ImageThumbnail = ({ src, alt, label, onClick }: { src?: string | null; alt: string; label: string; onClick: () => void }) => (
  <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 aspect-video md:aspect-4/3" onClick={onClick}>
    {/* Next Image dengan fill */}
    <Image src={getImageUrl(src)} alt={alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 300px" unoptimized />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center z-10">
      <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-2 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
        <Maximize2 className="w-3 h-3" />
        View {label}
      </div>
    </div>
  </div>
)
