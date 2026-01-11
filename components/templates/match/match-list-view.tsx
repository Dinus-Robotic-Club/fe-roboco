import { FilterBar } from '@/components/templates/tools/filter'
import { Pagination } from '@/components/ui/pagination'
import { useMatchListControl } from '@/hooks/useMatchListControl'
import { IMatchListProps } from '@/lib/types'
import MatchList from './match-list'

interface MatchListViewProps extends Omit<IMatchListProps, 'data'> {
  data: IMatchListProps['data']
}

export function MatchListView({ data, ...props }: MatchListViewProps) {
  const { state, setters } = useMatchListControl(data || [])

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      {/* Filters */}
      <FilterBar search={state.search} category={state.category} onSearchChange={setters.setSearch} onCategoryChange={setters.setCategory} />

      {/* List */}
      <MatchList data={state.data} {...props} />

      {/* Pagination */}
      <Pagination currentPage={state.page} totalPages={state.totalPages} onPageChange={setters.setPage} totalItems={state.totalItems} itemsPerPage={state.limit} />
    </div>
  )
}
