'use client'

import MatchList from '@/components/templates/match/match-list'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import { useAuth } from '@/context/auth-context'
import { useGetHistoryMatchById } from '@/hooks/useHistoryMatchById'
import { useGetOnGoingMatchById } from '@/hooks/useOnGoingMatchById'
import { IAuthUser } from '@/lib/types/auth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function MatchPageContent({ user }: { user: IAuthUser | null }) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab')
  const [activeNav, setActiveNav] = useState(() => {
    return defaultTab === 'history' ? 'match-history' : 'on-going match'
  })

  const { data: onGoing } = useGetOnGoingMatchById()
  const { data: history } = useGetHistoryMatchById()

  let ComponentToRender

  if (activeNav === 'on-going match') {
    ComponentToRender = (
      <MatchList data={onGoing?.data as ICardMatch[]} user={user} emptyTitle="BELUM ADA PERTANDINGAN" emptyDescription="Tim ini belum memiliki list pertandingan yang akan berlangsung." />
    )
  } else if (activeNav === 'match-history') {
    ComponentToRender = <MatchList data={history?.data as ICardMatch[]} user={user} emptyTitle="BELUM ADA RIWAYAT" emptyDescription="Tim ini belum menyelesaikan pertandingan apapun." />
  } else {
    ComponentToRender = null
  }
  return (
    <>
      <HeaderDashboard title="MATCH COLLECTION" />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'on-going match' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => setActiveNav('on-going match')}>
            ON-GOING MATCH
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'match-history' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => setActiveNav('match-history')}>
            MATCH HISTORY
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-10 my-20">{ComponentToRender}</div>
      </div>
    </>
  )
}

const MatchPage = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<></>}>
      <MatchPageContent user={user} />
    </Suspense>
  )
}

export default MatchPage
