'use client'

import MatchList from '@/components/templates/match/match-list'
import { TabNavigation } from '@/components/templates/tab/tab-navigation'
import { FilterBar } from '@/components/templates/tools/filter'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { useMatchManager } from '@/hooks/custom-hooks/useMatchManager'
import { TABS } from '@/lib'
import { nav_admin } from '@/lib/statis-data'
import { Suspense } from 'react'

function MatchAdmin() {
  const { user, isLoading, state, setters, filteredData } = useMatchManager()

  if (isLoading) return <Loader show />

  return (
    <div className="w-full min-h-screen flex flex-col bg-grid">
      <Navbar left={nav_admin.left} right={nav_admin.right} />
      <HeaderDashboard title="Match Lists 🎮" name="Admin" />

      <main className="w-full p-4 md:p-6 mb-20 items-center flex flex-col">
        {/* Navigation Tabs */}
        <TabNavigation activeTab={state.activeNav} onTabChange={setters.setActiveNav} />

        {/* Filters */}
        <FilterBar search={state.search} category={state.category} onSearchChange={setters.setSearch} onCategoryChange={setters.setCategory} />

        {/* Content List */}
        <div className="w-full h-auto flex flex-col items-center gap-10 mt-16 mb-20 font-plus-jakarta-sans">
          {state.activeNav === TABS.ONGOING ? <MatchList data={filteredData} user={user} /> : <MatchList data={filteredData} user={user} />}
        </div>
      </main>
    </div>
  )
}

const MatchAdminPage = () => {
  return (
    <Suspense fallback={<Loader show />}>
      <MatchAdmin />
    </Suspense>
  )
}

export default MatchAdminPage
