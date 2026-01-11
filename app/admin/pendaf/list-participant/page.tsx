'use client'

import { ParticipantsList } from '@/components/templates/table-list/list-participants'
import { TeamList } from '@/components/templates/table-list/list-team'
import { Footer } from '@/components/ui/footer'
import { HeaderDashboard } from '@/components/ui/header'
import Navbar from '@/components/ui/navbar'
import { useGetAllTeams } from '@/hooks/useGetAllCommunity'
import { getNavByRole } from '@/lib/statis-data'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/ui/loader'
import React, { useMemo, useState } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useRegistrationSocket } from '@/hooks/custom-hooks/useRegistrationSocket'

const ListPage = () => {
  useSocket()
  useRegistrationSocket()

  const { user } = useAuth()
  const nav = getNavByRole(user?.role)
  const [activeNav, setActiveNav] = useState('team-list')
  const { data: teams, isLoading } = useGetAllTeams()

  // Transform ITeam[] to IRegistrationData[] format for admin modal
  const registrationData = useMemo(() => {
    if (!teams?.data) return []

    return (teams.data as ITeam[]).map((team) => {
      const registration = team.registrations?.[0]
      return {
        uid: registration?.uid || team.uid,
        teamId: team.uid,
        tournamentId: registration?.tournamentId || '',
        status: registration?.status || 'PENDING',
        registeredAt: registration?.registeredAt || team.createdAt,
        invoice: registration?.invoice || null,
        qrUrl: registration?.qrUrl || null,
        verifiedAt: registration?.verifiedAt || null,
        updatedAt: team.updatedAt,
        attendance: registration?.attendance || null,
        createdAt: team.createdAt,
        team: {
          uid: team.uid,
          name: team.name,
          logo: team.logo,
          category: team.category,
          email: team.email,
          community: team.community,
          participants: team.participants || [],
        },
      } as IRegistrationData
    })
  }, [teams])

  let ComponentToRender
  if (activeNav === 'team-list') {
    ComponentToRender = <TeamList data={registrationData} type="admin" />
  } else if (activeNav === 'member-list') {
    ComponentToRender = <ParticipantsList data={teams?.data as ITeam[]} />
  } else {
    ComponentToRender = null
  }

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }

  return (
    <div className="bg-grid">
      <Loader show={isLoading} />
      <Navbar left={nav.left} right={nav.right} />
      <HeaderDashboard title="PARTICIPANTS" name={user?.name || 'Pendaf'} />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20 ">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'team-list' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => handleClickNav('team-list')}>
            TEAM LIST
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'member-list' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => handleClickNav('member-list')}>
            MEMBER LIST
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-20 mt-20 ">{ComponentToRender}</div>
      </div>
      <Footer />
    </div>
  )
}

const Page = () => {
  return <ListPage />
}

export default Page
