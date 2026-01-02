import { RankLayout } from '@/components/layout/table-layout'
import { GenericRankTable } from '@/components/ui/table'
import { soccerColumns, sumoColumns } from '@/lib'

export function GroupRank({ data, category }: { data: IGroupData[]; category: 'SUMO' | 'SOCCER' }) {
  const filteredData = data?.filter((group) => group.teams.some((t) => t.team.category === category))
  const columns = category === 'SOCCER' ? soccerColumns : sumoColumns

  return (
    <RankLayout title="GROUP RANK" highlight={category} isEmpty={!filteredData || filteredData.length === 0}>
      <div className="grid gap-8 w-full grid-cols-1 xl:grid-cols-2">
        {filteredData?.map((group, i) => (
          <GenericRankTable key={i} title={group.name} subtitle="Standings" data={group.teams} columns={columns} />
        ))}
      </div>
    </RankLayout>
  )
}
