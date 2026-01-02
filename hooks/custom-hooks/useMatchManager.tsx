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

  // Centralized Loading State
  const isLoading = authLoading || (activeNav === TABS.ONGOING ? ongoingLoading : historyLoading)

  // Memoized Filtering Logic
  const filteredData = useMemo(() => {
    const rawData = activeNav === TABS.ONGOING ? ongoingData?.data : historyData?.data
    const list = (rawData as ICardMatch[]) || []

    return list.filter((item) => {
      // Category Filter
      if (category !== CATEGORIES.ALL) {
        if (item.category.toLowerCase() !== category.toLowerCase()) return false
      }

      // Search Filter
      const q = search.toLowerCase()
      return item.teamA.name.toLowerCase().includes(q) || item.teamB.name.toLowerCase().includes(q)
    })
  }, [activeNav, ongoingData, historyData, category, search])

  return {
    user,
    isLoading,
    state: { activeNav, search, category },
    setters: { setActiveNav, setSearch, setCategory },
    filteredData,
  }
}
