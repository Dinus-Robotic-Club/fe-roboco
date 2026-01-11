'use client'

import { MatchListView } from '@/components/templates/match/match-list-view'
import { TabNavigation } from '@/components/templates/tab/tab-navigation'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { useMatchManager } from '@/hooks/custom-hooks/useMatchManager'
import { useSocket } from '@/hooks/useSocket'
import { TABS } from '@/lib'
import { getNavByRole } from '@/lib/statis-data'

function MatchAdmin() {
  const { user, isLoading, state, setters, filteredData, tournamentId } = useMatchManager()
  const nav = getNavByRole(user?.role)

  // Connect to WebSocket for real-time updates
  useSocket(tournamentId)

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
          {state.activeNav === TABS.ONGOING ? <MatchListView data={filteredData} user={user} /> : <MatchListView data={filteredData} user={user} />}
        </div>
      </main>
    </div>
  )
}

const MatchAdminPage = () => {
  return <MatchAdmin />
}

export default MatchAdminPage
