import { useAuth } from '@/context/auth-context'
import { useMemo, useState } from 'react'
import { useGetOnGoingMatch } from '../useGetOnGoingMatch'
import { useGetHistoryMatch } from '../useGetHistoryMatch'
import { useGetMatchReferee } from '../useGetMatchReferee'
import { CATEGORIES, TABS } from '@/lib'

export const useMatchManager = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [activeNav, setActiveNav] = useState(TABS.ONGOING)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES.ALL)

  const isReferee = user?.role === 'REFREE'
  const { data: ongoingData, isLoading: ongoingLoading } = useGetOnGoingMatch(!isReferee)
  const { data: historyData, isLoading: historyLoading } = useGetHistoryMatch(!isReferee)
  const { data: refereeData, isLoading: refereeLoading } = useGetMatchReferee()

  // [🪝 HOOK TRIGGER] Logger

  // Centralized Loading State
  const isLoading = authLoading || (user?.role === 'REFREE' ? refereeLoading : activeNav === TABS.ONGOING ? ongoingLoading : historyLoading)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(5) // Show 5 items per page

  // Memoized Filtering Logic
  const filteredList = useMemo(() => {
    let list: ICardMatch[] = []

    if (user?.role === 'REFREE') {
      const allRefereeMatches = (refereeData?.data as ICardMatch[]) || []
      if (activeNav === TABS.ONGOING) {
        list = allRefereeMatches.filter((m) => m.status !== 'FINISHED' && m.status !== 'CANCELLED' && m.status !== 'WALKOUT')
      } else {
        list = allRefereeMatches.filter((m) => m.status === 'FINISHED' || m.status === 'CANCELLED' || m.status === 'WALKOUT')
      }
    } else {
      const rawData = activeNav === TABS.ONGOING ? ongoingData?.data : historyData?.data
      list = (rawData as ICardMatch[]) || []
    }

    return list
      .filter((item) => {
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
      .sort((a, b) => {
        // Helper to check if a match is TBD
        const isTbdA = !a.teamA || !a.teamB
        const isTbdB = !b.teamA || !b.teamB

        // 1. TBD logic: TBD matches go to the bottom
        if (isTbdA && !isTbdB) return 1
        if (!isTbdA && isTbdB) return -1

        // 2. Ascending logic (from start) - using createdAt
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
  }, [activeNav, ongoingData, historyData, refereeData, category, search, user?.role])

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit])

  const totalPages = Math.ceil(filteredList.length / limit)

  // Get tournamentId from first match data for WebSocket
  const tournamentId = useMemo(() => {
    if (user?.role === 'REFREE') {
      const rawData = refereeData?.data
      if (rawData && rawData.length > 0) return rawData[0].tournamentId
    }
    const rawData = ongoingData?.data || historyData?.data
    if (rawData && rawData.length > 0) {
      return rawData[0].tournamentId
    }
    return undefined
  }, [ongoingData, historyData, refereeData, user?.role])

  return {
    user,
    isLoading,
    state: { activeNav, search, category, page, limit, totalPages, totalItems: filteredList.length },
    setters: { setActiveNav, setSearch, setCategory, setPage },
    filteredData: paginatedData,
    tournamentId,
  }
}
