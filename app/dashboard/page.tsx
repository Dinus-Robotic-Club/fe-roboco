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
import { useQueryClient } from '@tanstack/react-query'

import { nav_dashboard } from '@/lib/statis-data'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MissingDataModal, MissingField } from '@/components/ui/missing-data-modal'
import { updateParticipant, updateTeamProfile } from '@/lib/api/team'

const Dashboard = () => {
  const params = useSearchParams()
  const viewParam = params.get('view')

  const [activeNav, setActiveNav] = useState(() => {
    if (viewParam && ['team-dashboard', 'team-profile', 'certificate'].includes(viewParam)) {
      return viewParam
    }
    return 'team-dashboard'
  })

  // Sync active nav with query param update
  useEffect(() => {
    if (viewParam && ['team-dashboard', 'team-profile', 'certificate'].includes(viewParam)) {
      if (activeNav !== viewParam) {
        setActiveNav(viewParam)
      }
    }
  }, [viewParam, activeNav])

  const { data: dashboard, isLoading: isDashboardLoading } = useTeamDashboard()
  const { data: profile, isLoading: isProfileLoading } = useTeamProfile()
  const queryClient = useQueryClient()
  const isMounted = useMounted()
  const error = params.get('error')
  const router = useRouter()

  const isLoading = isDashboardLoading || isProfileLoading

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

  const participantsWithCerts = profile.data?.participants?.filter((p: IParticipant) => p.certificate) || []

  let ComponentToRender

  if (activeNav === 'team-dashboard') {
    ComponentToRender = <TeamDashboard data={dashboard!.data!} />
  } else if (activeNav === 'team-profile') {
    ComponentToRender = <TeamProfile data={profile!.data!} />
  } else if (activeNav === 'certificate') {
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

  const teamDetail = profile?.data

  const missingFields: MissingField[] = []

  console.log(teamDetail)

  if (teamDetail) {
    if (!teamDetail.logo) {
      missingFields.push({ type: 'logo' })
    }

    if (teamDetail.registrations.length > 0 && !teamDetail.registrations[0].invoice) {
      missingFields.push({ type: 'invoice' })
    }

    teamDetail.participants.forEach((p: IParticipant) => {
      if (!p.image) {
        missingFields.push({ type: 'participant_image', participantId: p.uid, participantName: p.name })
      }
      if (!p.identityCardImage) {
        missingFields.push({ type: 'identity_card', participantId: p.uid, participantName: p.name })
      }
    })
  }

  const handleUpload = async (type: 'identity_card' | 'participant_image' | 'logo' | 'invoice', file: File, participantId?: string) => {
    const formData = new FormData()

    if (type === 'logo') {
      formData.append('logo', file)
      formData.append('name', teamDetail!.name)
      await updateTeamProfile(formData)
      await updateTeamProfile(formData)
      // defer invalidation to onComplete
    } else if (type === 'invoice') {
      formData.append('invoice', file)
      formData.append('name', teamDetail!.name)
      await updateTeamProfile(formData)
      // defer invalidation to onComplete
    } else if ((type === 'participant_image' || type === 'identity_card') && participantId) {
      const pName = teamDetail!.participants.find((p) => p.uid === participantId)?.name || ''
      formData.append('name', pName)

      if (type === 'participant_image') {
        formData.append('image', file)
      } else {
        formData.append('identityCardImage', file)
      }
      await updateParticipant(participantId, formData)
      // defer invalidation to onComplete
    }
  }

  const handleComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['team-profile'] })
    queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
    window.location.reload()
  }

  return (
    <>
      {teamDetail && <MissingDataModal missingFields={missingFields} onUpload={handleUpload} onComplete={handleComplete} />}
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
