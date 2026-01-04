import { useState, useMemo } from 'react'

export function useTeamList(initialData: IRegistrationData[], itemsPerPage = 10) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePaymentChange = (value: string) => {
    setPaymentFilter(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Memoized Filtered Data
  const filteredData = useMemo(() => {
    if (!initialData) return []

    return initialData.filter((team) => {
      const matchSearch = team.team?.name.toLowerCase().includes(searchQuery.toLowerCase())

      const isPresent = team.attendeance?.isPresent

      let matchStatus = true
      if (statusFilter === 'present') matchStatus = isPresent === true
      else if (statusFilter === 'absent') matchStatus = isPresent === false

      // Kategori
      let matchCategory = true
      if (categoryFilter !== 'all') matchCategory = team.team?.category.toLowerCase() === categoryFilter.toLowerCase()

      // Status Pembayaran (Payment)
      // Asumsi: team.registrations[0].status
      const payStatus = team.status
      let matchPayment = true
      if (paymentFilter !== 'all') matchPayment = payStatus === paymentFilter

      return matchStatus && matchCategory && matchPayment && matchSearch
    })
  }, [initialData, searchQuery, statusFilter, categoryFilter, paymentFilter])

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  return {
    filters: {
      status: statusFilter,
      payment: paymentFilter,
      category: categoryFilter,
      search: searchQuery,
    },
    handlers: {
      setStatus: handleStatusChange,
      setPayment: handlePaymentChange,
      setCategory: handleCategoryChange,
      setSearch: handleSearch,
      nextPage: goToNextPage,
      prevPage: goToPrevPage,
    },
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      indexOfFirstItem,
    },
    data: {
      filtered: filteredData, // Data full hasil filter (buat download excel)
      paginated: currentItems, // Data per page (buat tabel)
    },
  }
}
