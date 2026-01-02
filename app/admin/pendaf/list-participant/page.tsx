'use client'

import { ParticipantsList } from '@/components/templates/table-list/list-participants'
import { TeamList } from '@/components/templates/table-list/list-team'
import { Footer } from '@/components/ui/footer'
import { HeaderDashboard } from '@/components/ui/header'
import Navbar from '@/components/ui/navbar'
import { useGetAllTeams } from '@/hooks/useGetAllCommunity'
import { nav_admin } from '@/lib/statis-data'
import React, { Suspense, useState } from 'react'

const ListPage = () => {
  const [activeNav, setActiveNav] = useState('team-list')
  let ComponentToRender
  const { data: teams } = useGetAllTeams()

  if (activeNav === 'team-list') {
    ComponentToRender = <TeamList data={teams.data as ITeam[]} />
  } else if (activeNav === 'member-list') {
    ComponentToRender = <ParticipantsList data={teams.data as ITeam[]} />
  } else {
    ComponentToRender = null
  }

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }
  return (
    <div className="bg-grid">
      <Navbar left={nav_admin.left} right={nav_admin.right} />
      <HeaderDashboard title="PARTICIPANTS" name="Admin" />
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
  return (
    <Suspense fallback={<></>}>
      <ListPage />
    </Suspense>
  )
}

export default Page
