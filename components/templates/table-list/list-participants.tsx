'use client'

import { useParticipantsList } from '@/hooks/custom-hooks/useParticipantsList'
import { useMounted } from '@/hooks/useMounted'
import { formatCapitalize, generateOptions } from '@/lib/function/func'
import { IFilterConfig, IParticipantRow } from '@/lib/types'
import { useMemo, useState } from 'react'
import { FilterControls } from '../tools/filter'
import { DownloadButton } from '../tools/download'
import { participantExcelMapper, ParticipantsColumns } from '@/lib'
import { GenericRankTable } from '@/components/ui/table'
import { flattenParticipants } from '@/lib/function'
import { ParticipantDetailModal } from '../participant/participant-detail-modal'
import { useUpdateParticipantCertificate } from '@/hooks/useUpdateParticipantCertificate'

export function ParticipantsList({ data }: { data: ITeam[] }) {
  const mounted = useMounted()
  const [selectedParticipant, setSelectedParticipant] = useState<IParticipantRow | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const flatData = useMemo(() => flattenParticipants(data), [data])

  const { mutateAsync: uploadCertificate, isPending: isUploading } = useUpdateParticipantCertificate()

  // Gunakan hook khusus Participants
  const { filters, handlers, pagination, data: listData } = useParticipantsList(flatData)

  const categoryOptions = useMemo(() => {
    return generateOptions(
      data,
      (team) => team.category,
      (val) => val.toUpperCase(),
    )
  }, [data])

  const paymentOptions = useMemo(() => {
    return generateOptions(
      data,
      (team) => team.registrations?.[0]?.status,
      (val) => formatCapitalize(val),
    )
  }, [data])

  const statusOptions = useMemo(() => {
    return generateOptions(
      data,
      (team) => (team.registrations?.[0].attendeance?.isPresent ? 'Present' : 'Absent'),
      (val) => formatCapitalize(val),
    )
  }, [data])

  // --- Filter Configs ---
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

  const handleRowClick = (participant: IParticipantRow) => {
    setSelectedParticipant(participant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedParticipant(null)
  }

  const handleUploadCertificate = async (participantId: string, file: File) => {
    await uploadCertificate({ participantId, file })
    handleCloseModal()
  }

  if (!mounted) return null

  // Transform selected participant to modal format
  const modalParticipant = selectedParticipant
    ? {
        uid: selectedParticipant.uid,
        name: selectedParticipant.name,
        phone: selectedParticipant.phone,
        roleInTeam: selectedParticipant.roleInTeam,
        image: selectedParticipant.image,
        twibbon: selectedParticipant.twibbon,
        certificate: selectedParticipant.certificate,
        team: {
          name: selectedParticipant.teamName,
          category: selectedParticipant.teamCategory,
          logo: selectedParticipant.teamLogo,
          community: selectedParticipant.communityName ? { name: selectedParticipant.communityName } : null,
        },
      }
    : null

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-slate-900">PARTICIPANTS LIST</h1>
        <div className="h-1 w-20 bg-[#FBFF00] mt-2 rounded-full"></div>
      </div>

      <div className="w-full max-w-7xl">
        {/* Filter Bar */}
        <FilterControls
          filters={filterConfigs}
          search={{
            value: filters.search,
            onChange: handlers.setSearch,
            placeholder: 'Search participants or teams...',
          }}
          action={<DownloadButton data={listData.filtered} mapper={participantExcelMapper} fileName="Data_Peserta" />}
        />

        {/* Generic Table Render */}
        <GenericRankTable data={listData.paginated} columns={ParticipantsColumns} onRowClick={handleRowClick} />

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

      {/* Participant Detail Modal */}
      <ParticipantDetailModal participant={modalParticipant} isOpen={isModalOpen} onClose={handleCloseModal} onUploadCertificate={handleUploadCertificate} isUploading={isUploading} />
    </>
  )
}
