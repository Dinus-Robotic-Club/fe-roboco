'use client'

import { Toolbar } from '@/components/templates/tools/searchTournament'
import { FormInputTurney } from '@/components/templates/tournament/form-tour'
import { TournamentCard } from '@/components/ui/card'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyStateTournament } from '@/components/ui/empty'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { useTournamentLogic } from '@/hooks/custom-hooks/useTournament'
import { nav_admin } from '@/lib/statis-data'
import { Dialog, DialogContent, DialogDescription } from '@radix-ui/react-dialog'
import { Suspense } from 'react'

const DashboardContent = () => {
  const { isAuthLoading, filteredData, searchQuery, setSearchQuery, isDialogOpen, setIsDialogOpen, formState, mutation } = useTournamentLogic()

  if (isAuthLoading) return <Loader show />

  return (
    <div className="w-full min-h-screen bg-grid flex flex-col font-plus-jakarta-sans">
      <Navbar left={nav_admin.left} right={nav_admin.right} />

      <HeaderDashboard title="ADMIN DASHBOARD" name="Administrator" />

      <main className="w-full max-w-7xl mx-auto flex-1 p-4 md:p-8 mb-20">
        {/* Toolbar & Create Dialog Trigger */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Toolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenDialog={setIsDialogOpen} />

          <DialogContent className="sm:max-w-162.5 bg-white p-0 gap-0 overflow-hidden rounded-2xl border-slate-200">
            <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <DialogTitle className="text-xl font-bold text-slate-900">Buat Turnamen Baru</DialogTitle>
              <DialogDescription className="text-slate-500">Isi detail informasi turnamen di bawah ini.</DialogDescription>
            </DialogHeader>

            <div className="p-1">
              {/* Form Input Component */}
              <FormInputTurney
                isForm={formState.isForm}
                setIsForm={formState.setIsForm}
                isStage={formState.isStage}
                setIsStage={formState.setIsStage}
                submitForm={mutation.handleSubmit}
                isPending={mutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Content Grid */}
        <section className="w-full">
          {filteredData && filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredData.map((t) => (
                <TournamentCard data={t} key={t.uid} />
              ))}
            </div>
          ) : (
            <EmptyStateTournament isSearching={!!searchQuery} />
          )}
        </section>
      </main>
    </div>
  )
}

const Page = () => (
  <Suspense fallback={<Loader show />}>
    <DashboardContent />
  </Suspense>
)

export default Page
