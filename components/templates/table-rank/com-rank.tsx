import { RankLayout } from '@/components/layout/table-layout'
import { GenericRankTable } from '@/components/ui/table'
import { basisColumns } from '@/lib'

export function BasisRank({ data }: { data?: ICommunity[] }) {
  return (
    <RankLayout title="BASIS RANK" isEmpty={!data || data.length === 0}>
      <GenericRankTable data={data || []} columns={basisColumns} />
    </RankLayout>
  )
}
