'use client'

import { GenericRankTable } from '@/components/ui/table'
import { RankLayout } from '@/components/layout/table-layout'
import { soccerColumns, sumoColumns } from '@/lib'
import { Trophy } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty'

// --- Types ---
export type CategoryFilter = 'ALL' | 'SOCCER' | 'SUMO'

interface GroupRankProps {
  data: IGroupData[]
  activeFilter?: CategoryFilter
  onFilterChange?: (filter: CategoryFilter) => void
  onCreate?: () => void
  type?: 'user' | 'admin'
  title: string
}

export function GroupRank({ data, activeFilter, onFilterChange, onCreate, type = 'user', title }: GroupRankProps) {
  const getEmptyDescription = () => {
    if (type === 'admin') {
      return activeFilter === 'ALL' ? 'Belum ada grup yang dibuat. Buat grup baru untuk memulai klasemen.' : `Belum ada grup untuk kategori ${activeFilter}. Tambahkan grup baru sekarang.`
    }
    return 'Belum ada data klasemen grup yang tersedia saat ini.'
  }

  return (
    <RankLayout title={type === 'admin' ? `GROUP RANK` : `GROUP RANK - ${title}`} highlight={activeFilter === 'ALL' ? undefined : activeFilter}>
      {type === 'admin' && (
        <div className="flex items-center justify-start gap-2 mb-6">
          {['ALL', 'SOCCER', 'SUMO'].map((item) => (
            <button
              key={item}
              onClick={() => onFilterChange && onFilterChange(item as CategoryFilter)}
              className={`
            px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 border
            ${activeFilter === item ? 'bg-[#FBFF00] border-[#FBFF00] text-black shadow-sm' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'}
            `}>
              {item}
            </button>
          ))}
        </div>
      )}

      {/* 2. Content View */}
      {data && data.length > 0 ? (
        <div className="grid gap-8 w-full grid-cols-1 xl:grid-cols-2 animate-in fade-in duration-500">
          {data.map((group, i) => {
            // Logic visual: Menentukan kolom berdasarkan isi data
            const isSoccerGroup = group.teams.some((t) => t.team.category === 'SOCCER')
            const columns = isSoccerGroup ? soccerColumns : sumoColumns
            const categoryLabel = isSoccerGroup ? 'Soccer' : 'Sumo'

            return <GenericRankTable key={i} title={group.name} subtitle={`${categoryLabel} Standings`} data={group.teams} columns={columns} />
          })}
        </div>
      ) : (
        // 3. Empty State View
        <EmptyState
          title={activeFilter === 'ALL' ? 'Data Grup Kosong' : `Tidak ada Grup ${activeFilter}`}
          description={getEmptyDescription()}
          icon={Trophy}
          onCreate={type === 'admin' ? onCreate : undefined}
          createLabel="Buat Grup Baru"
          className="min-h-100"
        />
      )}
    </RankLayout>
  )
}
