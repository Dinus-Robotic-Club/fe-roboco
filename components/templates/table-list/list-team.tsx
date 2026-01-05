import { useMemo, useState } from 'react'
import { GenericRankTable } from '@/components/ui/table'
import { useTeamList } from '@/hooks/custom-hooks/useTeamList'
import { useMounted } from '@/hooks/useMounted'
import { TeamColumns, teamExcelMapper } from '@/lib'
import { IFilterConfig } from '@/lib/types'
import { formatCapitalize, generateOptions } from '@/lib/function/func'
import { FilterControls } from '../tools/filter'
import { DownloadButton } from '../tools/download'
import { TeamDetailModal } from '@/components/ui/modal'
import { useUpdateStatusRegistration } from '@/hooks/useUpdateStatusRegistration'
import Loader from '@/components/ui/loader'

// Ensure these interfaces match your global types
interface TeamListProps {
  data: IRegistrationData[] | ITournamentData | ITeam[]
  type?: 'user' | 'admin'
  slug?: string
}

export function TeamList({ data, type = 'user', slug }: TeamListProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<IRegistrationData | null>(null)
  const mounted = useMounted()
  const { mutate, isPending } = useUpdateStatusRegistration(slug as string)

  const normalizedData = useMemo(() => {
    if (type === 'admin') {
      if (data && 'registrations' in data) {
        const tournament = data as ITournamentData
        return tournament.registrations || []
      }
      return (data as IRegistrationData[]) || []
    }

    return (data as ITeam[]) || []
  }, [data, type])

  const { filters, handlers, pagination, data: listData } = useTeamList(normalizedData, 10, type)

  const handleViewTeam = (item: IRegistrationData | ITeam) => {
    if (type === 'admin') {
      const regData = item as IRegistrationData

      setSelectedRegistration(regData)
    } else {
      const team = item as ITeam
      console.log('User viewing team:', team.name)
    }
  }

  const handleApprove = async (id: string) => {
    mutate({ status: 'APPROVED', uid: id })
    setSelectedRegistration(null)
  }

  const handleReject = async (id: string) => {
    mutate({ status: 'REJECTED', uid: id })
    setSelectedRegistration(null)
  }

  // 3. OPTION GENERATORS (Updated to use normalizedData safely)
  const categoryOptions = useMemo(() => {
    return generateOptions(
      normalizedData,
      (item: IRegistrationData | ITeam) => (type === 'admin' ? (item as IRegistrationData).team?.category : (item as ITeam).category),
      (val) => val?.toUpperCase() || '',
    )
  }, [normalizedData, type])

  const paymentOptions = useMemo(() => {
    return generateOptions(
      normalizedData,
      (item: IRegistrationData | ITeam) => (type === 'admin' ? (item as IRegistrationData).status : (item as ITeam).registrations?.[0]?.status),
      (val) => formatCapitalize(val || ''),
    )
  }, [normalizedData, type])

  const statusOptions = useMemo(() => {
    return generateOptions(
      normalizedData,
      (item: IRegistrationData | ITeam) => {
        const isPresent = type === 'admin' ? (item as IRegistrationData).attendeance?.isPresent : (item as ITeam).registrations?.[0]?.attendeance?.isPresent
        return isPresent ? 'Present' : 'Absent'
      },
      (val) => formatCapitalize(val),
    )
  }, [normalizedData, type])

  const filterConfigs: IFilterConfig[] = [
    {
      key: 'category',
      value: filters.category,
      onChange: handlers.setCategory,
      options: categoryOptions,
      placeholder: 'All Categories',
    },
    {
      key: 'payment',
      value: filters.payment,
      onChange: handlers.setPayment,
      options: paymentOptions,
      placeholder: 'All Status',
    },
    {
      key: 'status',
      value: filters.status,
      onChange: handlers.setStatus,
      options: statusOptions,
      placeholder: 'All Attendance',
    },
  ]

  if (!mounted) return null

  return (
    <>
      <Loader show={isPending} />

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-slate-900">{type === 'admin' ? 'TOURNAMENT PARTICIPANTS' : 'TEAM LIST'}</h1>
        <div className="h-1 w-20 bg-[#FBFF00] mt-2 rounded-full"></div>
      </div>

      <div className="w-full max-w-7xl">
        {/* Filter Bar */}
        <FilterControls
          filters={filterConfigs}
          search={{
            value: filters.search,
            onChange: handlers.setSearch,
            placeholder: 'Search teams...',
          }}
          action={<DownloadButton data={listData.filtered} mapper={teamExcelMapper} fileName={type === 'admin' ? 'Data_Peserta' : 'Data_Tim'} />}
          type={type}
        />

        <GenericRankTable
          data={listData.paginated}
          columns={TeamColumns} // Make sure your Columns handle both types or use conditional columns
          onRowClick={type === 'admin' ? handleViewTeam : undefined}
          rowClassName={type === 'admin' ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
        />

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              onClick={handlers.prevPage}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-[#FBFF00] rounded disabled:opacity-50 text-sm font-medium hover:bg-yellow-300 transition-colors">
              Prev
            </button>

            <span className="font-semibold text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={handlers.nextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-[#FBFF00] rounded disabled:opacity-50 text-sm font-medium hover:bg-yellow-300 transition-colors">
              Next
            </button>
          </div>
        )}
      </div>

      {selectedRegistration && type === 'admin' && (
        <TeamDetailModal isOpen={!!selectedRegistration} onClose={() => setSelectedRegistration(null)} data={selectedRegistration} onApprove={handleApprove} onReject={handleReject} />
      )}
    </>
  )
}
