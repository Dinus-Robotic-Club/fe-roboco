import { IRankLayoutProps } from '@/lib/types'

export function RankLayout({ title, highlight, children, isEmpty }: IRankLayoutProps) {
  return (
    <div className="w-full flex flex-col items-center font-plus-jakarta-sans">
      {/* Title Section */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          {title} {highlight && <span className="text-yellow-500">{highlight}</span>}
        </h1>
        <div className="h-1 w-20 bg-[#FBFF00] mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="w-full max-w-7xl">{isEmpty ? <p className="text-center text-slate-500 py-8">No data available</p> : children}</div>
    </div>
  )
}
