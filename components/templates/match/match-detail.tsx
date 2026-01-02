import { InsightCard } from '@/components/ui/card'
import { MetadataItem } from '@/components/ui/metadata'
import { StatBar } from '@/components/ui/stats'
import { TimelineMatch } from '@/components/ui/timeline'
import { formatDate, getCategoryTheme } from '@/lib/function'
import { IThemeConfig } from '@/lib/types'
import { Activity, Calendar, CircleDot, Clock, Flag, Info, Layers, TrendingUp, Trophy, Zap } from 'lucide-react'

export const MatchDetailContent = ({ data }: { data: ICardMatch }) => {
  const theme = getCategoryTheme(data.category) as IThemeConfig

  // Data Processing
  const sortedEvents = [...data.events].sort((a, b) => a.minute - b.minute)
  const hasEvents = sortedEvents.length > 0
  const scoreA = Number(data.scoreA) || 0
  const scoreB = Number(data.scoreB) || 0
  const totalScore = scoreA + scoreB
  const firstEvent = sortedEvents[0]
  const openingTime = firstEvent ? (data.category === 'SUMO' ? `Ronde ${firstEvent.minute}` : `${firstEvent.minute}'`) : '-'

  return (
    <div className="bg-white rounded-b-xl border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
        <MetadataItem icon={Calendar} label="Jadwal" value={formatDate(data.createdAt)} />

        <MetadataItem
          icon={Layers}
          label="Kategori"
          value={data.category}
          subValue={<span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">{data.roundLabel}</span>}
        />

        <MetadataItem icon={Trophy} label="Sistem" value={`Best Of ${data.bestOf}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-100">
        <div className="lg:col-span-4 p-6 lg:p-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="sticky top-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Statistik Match
            </h3>

            <div className="space-y-8">
              {/* Insight Cards */}
              <div className="grid grid-cols-2 gap-3">
                <InsightCard icon={TrendingUp} value={totalScore} label="Total Skor" />
                <InsightCard icon={Zap} value={openingTime} label="Poin Pertama" />
              </div>

              {/* Progress Bars */}
              <div className="space-y-6 pt-2">
                <StatBar label="Skor Akhir" valueA={scoreA} valueB={scoreB} total={totalScore} theme={theme} />
                <StatBar
                  label="Dominasi Event"
                  valueA={data.events.filter((e) => e.teamId === data.teamA.uid).length}
                  valueB={data.events.filter((e) => e.teamId === data.teamB.uid).length}
                  total={data.events.length}
                  theme={theme}
                />
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-slate-500 text-[11px] leading-relaxed">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p>Data statistik ini dikalkulasi secara otomatis berdasarkan log aktivitas pertandingan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TIMELINE (Area Utama Kanan) */}
        <div className="lg:col-span-8 p-6 lg:p-8 bg-slate-50/30">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2 justify-center lg:justify-start">
              <Clock className="w-4 h-4 text-emerald-500" />
              Timeline Pertandingan
            </h3>

            <div className="relative pl-4 md:pl-0">
              {/* Garis Vertikal */}
              <div className="absolute left-4.75 md:left-1/2 top-4 bottom-4 w-px bg-slate-200 -translate-x-1/2 md:translate-x-0" />

              {/* Start Flag */}
              <div className="relative z-10 flex md:justify-center mb-10">
                <div className="bg-white text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 uppercase tracking-wide">
                  <Flag className="w-3 h-3 text-emerald-500" /> Mulai
                </div>
              </div>

              {/* Timeline Content */}
              {!hasEvents ? (
                <div className="py-16 text-center relative z-10">
                  <div className="inline-flex flex-col items-center justify-center opacity-40 hover:opacity-60 transition-opacity">
                    <CircleDot className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Belum ada event tercatat</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedEvents.map((event) => (
                    <TimelineMatch key={event.uid} event={event} teamA={data.teamA} teamB={data.teamB} category={data.category} theme={theme} />
                  ))}
                </div>
              )}

              {/* Finish Flag */}
              {data.status === 'FINISHED' && (
                <div className="relative z-10 flex md:justify-center mt-10">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-5 py-2 rounded-full shadow-lg tracking-wider uppercase border-4 border-slate-50">Selesai</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
