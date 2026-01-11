'use client'

import MatchList from '@/components/templates/match/match-list'
import { FilterBar } from '@/components/templates/tools/filter'
import { TabNavigation } from '@/components/templates/tab/tab-navigation'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { Pagination } from '@/components/ui/pagination'
import { useMatchManager } from '@/hooks/custom-hooks/useMatchManager'
import { useRegistrationSocket } from '@/hooks/custom-hooks/useRegistrationSocket'
import { useSocket } from '@/hooks/useSocket'
import { getNavByRole } from '@/lib/statis-data'

function MatchAdmin() {
  const { user, isLoading, state, setters, filteredData, tournamentId } = useMatchManager()
  const nav = getNavByRole(user?.role)

  // Connect to WebSocket for real-time updates
  useSocket(tournamentId)
  useRegistrationSocket(tournamentId)

  if (isLoading) return <Loader show />

  return (
    <div className="w-full min-h-screen flex flex-col bg-grid">
      <Navbar left={nav.left} right={nav.right} />
      <HeaderDashboard title="Match Lists 🎮" name={user?.name || 'Admin'} />

      <main className="w-full p-4 md:p-6 mb-20 items-center flex flex-col">
        {/* Navigation Tabs */}
        <TabNavigation activeTab={state.activeNav} onTabChange={setters.setActiveNav} />

        {/* Content List with integrated filtering, sorting, pagination */}
        <div className="w-full h-auto flex flex-col items-center gap-6 mt-8 mb-20 font-plus-jakarta-sans">
          <FilterBar search={state.search} category={state.category} onSearchChange={setters.setSearch} onCategoryChange={setters.setCategory} />

          <MatchList data={filteredData} user={user} />

          <Pagination currentPage={state.page} totalPages={state.totalPages} onPageChange={setters.setPage} totalItems={state.totalItems} itemsPerPage={state.limit} />
        </div>
      </main>
    </div>
  )
}

const MatchAdminPage = () => {
  return <MatchAdmin />
}

export default MatchAdminPage
