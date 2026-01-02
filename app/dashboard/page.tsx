'use client'

import TeamDashboard from '@/components/dashboard-user/team-dashboard'
import { TeamProfile } from '@/components/profile/team-profile'
import { Certificate } from '@/components/templates/certificate/certificate'
import { EmptyState } from '@/components/ui/empty'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import { useAuth } from '@/context/auth-context'
import { useMounted } from '@/hooks/useMounted'
import { useTeamDashboard } from '@/hooks/useTeamDashboard'
import { useTeamProfile } from '@/hooks/useTeamProfile'
import { nav_dashboard } from '@/lib/statis-data'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('team-dashboard')
  const { data: dashboard } = useTeamDashboard()
  const { data: profile } = useTeamProfile()
  const isMounted = useMounted()
  const params = useSearchParams()
  const error = params.get('error')
  const router = useRouter()

  if (error === 'unauthorized') {
    toast.error('UNAUTHORIZED: Kamu tidak dapat mengakses halaman tersebut')

    const newParams = new URLSearchParams(params.toString())
    newParams.delete('error')

    router.replace(`?${newParams.toString()}`)
  }

  if (!isMounted) return null

  if (!dashboard || !profile) return <EmptyState />
  let ComponentToRender

  if (activeNav === 'team-dashboard') {
    ComponentToRender = <TeamDashboard data={dashboard!.data!} />
  } else if (activeNav === 'team-profile') {
    ComponentToRender = <TeamProfile data={profile!.data!} />
  } else if (activeNav === 'certificate') {
    ComponentToRender = <Certificate fileName="/public/certificate.pdf" />
  } else {
    ComponentToRender = null
  }

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }
  return (
    <>
      <HeaderDashboard title="DASHBOARD TEAM" name={dashboard?.data?.team.name as string} />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          {nav_dashboard.map((data) => (
            <p
              key={data.key}
              className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === data.key ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
              onClick={() => handleClickNav(data.key)}>
              {data.label}
            </p>
          ))}
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-20 my-20">{ComponentToRender}</div>
      </div>
    </>
  )
}

const DashboardPage = () => {
  const { isLoading } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<></>}>
      <Dashboard />
    </Suspense>
  )
}

export default DashboardPage
