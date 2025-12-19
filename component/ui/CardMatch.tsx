'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ValidationModal from '../match-admin/validationModal'
import { MatchDetailContent } from '../match/matchDetail'

// --- PASTIKAN INTERFACE INI SESUAI ---
// (Bisa dipindah ke file types.d.ts)
// ... (Interface ICardMatch, IAuthUser, dll)

// --- KOMPONEN DETAIL MATCH (Embedded untuk kemudahan) ---
// Kamu bisa memisahkan ini ke file sendiri: components/match/MatchDetailContent.tsx

export default function CardMatch({ data, user }: { data: ICardMatch; user: IAuthUser | null }) {
  const route = useRouter()
  const [showModalStart, setShowModalStart] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false) // State untuk dropdown

  const goToMatch = () => {
    route.push(`/admin/match/${data.uid}`)
  }

  const isAdmin = user?.role === 'ADMIN'
  const isLive = data?.status === 'ONGOING' || data?.status === 'LIVE'
  const isFinished = data?.status === 'FINISHED'

  // --- LOGIKA UTAMA KLIK ---
  const handleCardClick = () => {
    // 1. Jika Admin DAN Match belum selesai (Scheduled/Live) -> Buka Modal Admin
    if (isAdmin && !isFinished) {
      setShowModalStart(true)
      return
    }

    // 2. Selain kondisi di atas (User biasa ATAU Admin & Finished) -> Toggle Detail
    setIsDetailOpen((prev) => !prev)
  }

  return (
    <div className="w-full transition-all duration-300">
      <div
        className={`
          relative w-full max-w-7xl mx-auto rounded-xl border bg-white overflow-hidden transition-all duration-300 cursor-pointer group
          ${isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : isDetailOpen ? 'border-slate-300 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}
        `}>
        {/* Klik wrapper hanya pada bagian header/body, bukan detailnya jika ingin menutup */}
        <div onClick={handleCardClick}>
          {/* --- LIVE PULSE BG --- */}
          {isLive && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0"></div>}

          {/* --- HEADER: STATUS --- */}
          <div
            className={`
            relative z-10 flex items-center justify-between px-4 py-2 border-b text-xs font-semibold tracking-wider uppercase transition-colors
            ${isLive ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-500'}
            `}>
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span>SEDANG BERLANGSUNG</span>
                </>
              ) : isFinished ? (
                <span>🏁 SELESAI</span>
              ) : (
                <span>YANG AKAN DATANG</span>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-75">
              <span>
                {data?.category} • {data?.roundLabel}
              </span>
            </div>
          </div>

          {/* --- BODY CONTENT --- */}
          <div className="relative z-10 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between lg:gap-8">
              {/* TEAM A */}
              <div className="flex items-center justify-start w-full lg:w-1/3 gap-3 lg:gap-4 order-1">
                <div className="flex lg:flex-row-reverse items-center w-full gap-3 lg:gap-4">
                  <div className="relative w-12 h-12 lg:w-16 lg:h-16 shrink-0">
                    <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamA.logo}`} alt={data?.teamA.name} fill className="object-contain drop-shadow-sm" unoptimized />
                  </div>
                  <div className="flex flex-col lg:items-end grow">
                    <h3 className="font-bold text-slate-800 text-lg lg:text-xl leading-tight line-clamp-1">{data?.teamA.name}</h3>
                    <p className="text-slate-500 text-xs lg:text-sm font-medium">{data?.teamA.community?.name}</p>
                  </div>
                </div>
              </div>

              {/* SCOREBOARD */}
              <div className="flex flex-col items-center justify-center gap-2 w-full lg:w-auto py-4 lg:py-0 order-2">
                <div
                  className={`
                            flex items-center justify-center px-4 py-2 rounded-lg min-w-[100px] lg:min-w-[140px] gap-3
                            ${isLive ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-800'}
                        `}>
                  <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tighter tabular-nums">{data?.scoreA}</span>
                  <span className={`text-sm font-light opacity-60 ${isLive ? 'text-red-100' : 'text-slate-400'}`}>-</span>
                  <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tighter tabular-nums">{data?.scoreB}</span>
                </div>

                {/* Indikator "Click to expand" untuk User atau Admin Finished */}
                {(!isAdmin || isFinished) && (
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 group-hover:text-slate-600 transition-colors">
                    Details
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDetailOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
                {/* Indikator "Manage" untuk Admin Ongoing/Scheduled */}
                {isAdmin && !isFinished && <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-1">Manage Match</div>}
              </div>

              {/* TEAM B */}
              <div className="flex items-center justify-end w-full lg:w-1/3 gap-3 lg:gap-4 order-3">
                <div className="flex flex-row-reverse lg:flex-row items-center w-full gap-3 lg:gap-4">
                  <div className="flex flex-col items-start lg:items-start grow">
                    <h3 className="font-bold text-slate-800 text-lg lg:text-xl leading-tight text-right lg:text-left line-clamp-1 w-full">{data?.teamB.name}</h3>
                    <p className="text-slate-500 text-xs lg:text-sm font-medium w-full text-right lg:text-left">{data?.teamB.community?.name}</p>
                  </div>
                  <div className="relative w-12 h-12 lg:w-16 lg:h-16 shrink-0">
                    <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamB.logo}`} alt={data?.teamB.name} fill className="object-contain drop-shadow-sm" unoptimized />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DROPDOWN DETAIL (CSS GRID ANIMATION) --- */}
        <div
          className={`
            grid transition-all duration-300 ease-in-out
            ${isDetailOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
          `}>
          <div className="overflow-hidden">
            <MatchDetailContent data={data} />
          </div>
        </div>
      </div>

      {showModalStart && (
        <ValidationModal
          setShowModalStart={setShowModalStart}
          action={goToMatch}
          title="Masuk ke Panel Admin?"
          desc="Pertandingan ini belum selesai. Kamu akan diarahkan ke halaman kontrol admin."
          confirm_text="Ya, Kelola Match"
        />
      )}
    </div>
  )
}
