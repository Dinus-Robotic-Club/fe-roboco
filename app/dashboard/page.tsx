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
import { useSocket } from '@/hooks/useSocket'
import { nav_dashboard } from '@/lib/statis-data'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('team-dashboard')
  const { data: dashboard, isLoading: isDashboardLoading } = useTeamDashboard()
  const { data: profile, isLoading: isProfileLoading } = useTeamProfile()
  const isMounted = useMounted()
  const params = useSearchParams()
  const error = params.get('error')
  const router = useRouter()

  const isLoading = isDashboardLoading || isProfileLoading

  // Connect to WebSocket for real-time updates (using team's tournament if available)
  useSocket()

  if (error === 'unauthorized') {
    toast.error('UNAUTHORIZED: Kamu tidak dapat mengakses halaman tersebut')

    const newParams = new URLSearchParams(params.toString())
    newParams.delete('error')

    router.replace(`?${newParams.toString()}`)
  }

  if (!isMounted) return null

  if (isLoading) return <Loader show />

  if (!dashboard || !profile) return <EmptyState />

  // Get all participants with certificates
  const participantsWithCerts = profile.data?.participants?.filter((p: IParticipant) => p.certificate) || []

  let ComponentToRender

  if (activeNav === 'team-dashboard') {
    ComponentToRender = <TeamDashboard data={dashboard!.data!} />
  } else if (activeNav === 'team-profile') {
    ComponentToRender = <TeamProfile data={profile!.data!} />
  } else if (activeNav === 'certificate') {
    // Show certificates for all participants
    if (participantsWithCerts.length === 0) {
      ComponentToRender = <Certificate pdfUrl={null} fileName="" role="PARTICIPANTS" />
    } else if (participantsWithCerts.length === 1) {
      const p = participantsWithCerts[0]
      const certUrl = p.certificate?.startsWith('http') ? p.certificate : `${process.env.NEXT_PUBLIC_API_URL}${p.certificate}`
      ComponentToRender = <Certificate pdfUrl={certUrl} fileName={`certificate-${p.name}.${certUrl.split('.').pop()}`} role="PARTICIPANTS" />
    } else {
      // Multiple participants with certificates - show all
      ComponentToRender = (
        <div className="w-full max-w-4xl space-y-8">
          {participantsWithCerts.map((p: IParticipant) => {
            const certUrl = p.certificate?.startsWith('http') ? p.certificate : `${process.env.NEXT_PUBLIC_API_URL}${p.certificate}`
            return (
              <div key={p.uid} className="border-b border-slate-200 pb-8 last:border-0">
                <p className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">{p.name}</p>
                <Certificate pdfUrl={certUrl} fileName={`certificate-${p.name}.${certUrl.split('.').pop()}`} role="PARTICIPANTS" />
              </div>
            )
          })}
        </div>
      )
    }
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
    <Suspense fallback={<Loader show />}>
      <Dashboard />
    </Suspense>
  )
}

export default DashboardPage
