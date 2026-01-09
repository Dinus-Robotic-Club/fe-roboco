import { useAuth } from '@/context/auth-context'
import { useMemo, useState } from 'react'
import { useGetOnGoingMatch } from '../useGetOnGoingMatch'
import { useGetHistoryMatch } from '../useGetHistoryMatch'
import { CATEGORIES, TABS } from '@/lib'

export const useMatchManager = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [activeNav, setActiveNav] = useState(TABS.ONGOING)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES.ALL)

  const { data: ongoingData, isLoading: ongoingLoading } = useGetOnGoingMatch()
  const { data: historyData, isLoading: historyLoading } = useGetHistoryMatch()

  // [🪝 HOOK TRIGGER] Logger

  // Centralized Loading State
  const isLoading = authLoading || (activeNav === TABS.ONGOING ? ongoingLoading : historyLoading)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(5) // Show 5 items per page

  // Memoized Filtering Logic
  const filteredList = useMemo(() => {
    const rawData = activeNav === TABS.ONGOING ? ongoingData?.data : historyData?.data
    const list = (rawData as ICardMatch[]) || []

    return list.filter((item) => {
      // Category Filter
      if (category !== CATEGORIES.ALL) {
        if (item.category?.toLowerCase() !== category.toLowerCase()) return false
      }

      // Search Filter - handle null teams
      const q = search.toLowerCase()
      const teamAName = item.teamA?.name?.toLowerCase() ?? ''
      const teamBName = item.teamB?.name?.toLowerCase() ?? ''
      return teamAName.includes(q) || teamBName.includes(q) || (item.roundLabel?.toLowerCase().includes(q) ?? false)
    })
  }, [activeNav, ongoingData, historyData, category, search])

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit])

  const totalPages = Math.ceil(filteredList.length / limit)

  // Get tournamentId from first match data for WebSocket
  const tournamentId = useMemo(() => {
    const rawData = ongoingData?.data || historyData?.data
    if (rawData && rawData.length > 0) {
      return rawData[0].tournamentId
    }
    return undefined
  }, [ongoingData, historyData])

  return {
    user,
    isLoading,
    state: { activeNav, search, category, page, limit, totalPages, totalItems: filteredList.length },
    setters: { setActiveNav, setSearch, setCategory, setPage },
    filteredData: paginatedData,
    tournamentId,
  }
}
