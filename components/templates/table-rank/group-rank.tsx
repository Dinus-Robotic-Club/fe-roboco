'use client'

import { useState } from 'react'
import { GenericRankTable } from '@/components/ui/table' // Sesuaikan import
import { RankLayout } from '@/components/layout/table-layout'
import { soccerColumns, sumoColumns } from '@/lib'

type CategoryFilter = 'ALL' | 'SOCCER' | 'SUMO'
interface GroupRankProps {
  data: IGroupData[]
  defaultCategory?: CategoryFilter
}

export function GroupRank({ data, defaultCategory = 'ALL' }: GroupRankProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(defaultCategory)

  const filteredData = data?.filter((group) => {
    if (activeFilter === 'ALL') return true

    return group.teams.some((t) => t.team.category === activeFilter)
  })

  return (
    <RankLayout title="GROUP RANK" highlight={activeFilter === 'ALL' ? undefined : activeFilter} isEmpty={!filteredData || filteredData.length === 0}>
      <div className="flex items-center justify-start gap-2 mb-6">
        {['ALL', 'SOCCER', 'SUMO'].map((item) => (
          <button
            key={item}
            onClick={() => setActiveFilter(item as CategoryFilter)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 border
              ${activeFilter === item ? 'bg-[#FBFF00] border-[#FBFF00] text-black shadow-sm' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'}
            `}>
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-8 w-full grid-cols-1 xl:grid-cols-2">
        {filteredData?.map((group, i) => {
          const isSoccerGroup = group.teams.some((t) => t.team.category === 'SOCCER')
          const columns = isSoccerGroup ? soccerColumns : sumoColumns
          const categoryLabel = isSoccerGroup ? 'Soccer' : 'Sumo'

          return <GenericRankTable key={i} title={group.name} subtitle={`${categoryLabel} Standings`} data={group.teams} columns={columns} />
        })}
      </div>
    </RankLayout>
  )
}
