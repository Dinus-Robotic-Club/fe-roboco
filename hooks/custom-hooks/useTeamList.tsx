import { useMemo, useState } from 'react'

export function useTeamList(initialData: IRegistrationData[] | ITeam[], itemsPerPage = 10, type: 'user' | 'admin' = 'user') {
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const resetPage = () => setCurrentPage(1)

  const handlers = {
    setStatus: (val: string) => {
      setStatusFilter(val)
      resetPage()
    },
    setPayment: (val: string) => {
      setPaymentFilter(val)
      resetPage()
    },
    setCategory: (val: string) => {
      setCategoryFilter(val)
      resetPage()
    },
    setSearch: (val: string) => {
      setSearchQuery(val)
      resetPage()
    },
    nextPage: () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)),
    prevPage: () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)),
  }

  // --- CORE LOGIC: Filtering & Normalization ---
  const filteredData = useMemo(() => {
    if (!initialData || initialData.length === 0) return []

    return initialData.filter((item: IRegistrationData | ITeam) => {
      let name = ''
      let category = ''
      let paymentStatus = ''
      let isPresent: boolean | undefined = false

      if (type === 'admin') {
        const reg = item as IRegistrationData
        name = reg.team?.name || ''
        category = reg.team?.category || ''
        paymentStatus = reg.status
        isPresent = reg.attendance?.isPresent
      } else {
        const team = item as ITeam
        name = team.name || ''
        category = team.category || ''
        paymentStatus = team.registrations?.[0]?.status || ''
        isPresent = team.registrations?.[0]?.attendance?.isPresent
      }

      const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase())

      let matchAttendance = true
      if (statusFilter === 'present') matchAttendance = isPresent === true
      else if (statusFilter === 'absent') matchAttendance = isPresent === false

      let matchCategory = true
      if (categoryFilter !== 'all') {
        matchCategory = category.toLowerCase() === categoryFilter.toLowerCase()
      }

      let matchPayment = true
      if (paymentFilter !== 'all') {
        matchPayment = paymentStatus.toLowerCase() === paymentFilter.toLowerCase()
      }

      return matchSearch && matchAttendance && matchCategory && matchPayment
    })
  }, [initialData, searchQuery, statusFilter, categoryFilter, paymentFilter, type])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  return {
    filters: {
      status: statusFilter,
      payment: paymentFilter,
      category: categoryFilter,
      search: searchQuery,
    },
    handlers,
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      indexOfFirstItem,
      totalItems: filteredData.length,
    },
    data: {
      filtered: filteredData,
      paginated: currentItems,
    },
  }
}
