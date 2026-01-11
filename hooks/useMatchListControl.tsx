import { useState, useMemo } from 'react'
import { CATEGORIES } from '@/lib'

export const useMatchListControl = (initialData: ICardMatch[]) => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES.ALL)
  const [page, setPage] = useState(1)
  const [limit] = useState(5) // Default 5 items per page

  const filteredAndSortedData = useMemo(() => {
    let processData = [...initialData]

    // 1. Filter by Category
    if (category !== CATEGORIES.ALL) {
      processData = processData.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
    }

    // 2. Filter by Search
    if (search) {
      const q = search.toLowerCase()
      processData = processData.filter((item) => {
        const teamAName = item.teamA?.name?.toLowerCase() ?? ''
        const teamBName = item.teamB?.name?.toLowerCase() ?? ''
        return teamAName.includes(q) || teamBName.includes(q) || (item.roundLabel?.toLowerCase().includes(q) ?? false)
      })
    }

    // 3. Sort (TBD Last, then Date Ascending)
    processData.sort((a, b) => {
      const isTbdA = !a.teamA || !a.teamB
      const isTbdB = !b.teamA || !b.teamB

      if (isTbdA && !isTbdB) return 1
      if (!isTbdA && isTbdB) return -1

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    // 4. Pagination
    const totalItems = processData.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedData = processData.slice(startIndex, startIndex + limit)

    return { data: paginatedData, totalPages, totalItems }
  }, [initialData, search, category, page, limit])

  return {
    state: { search, category, page, limit, ...filteredAndSortedData },
    setters: { setSearch, setCategory, setPage },
  }
}
