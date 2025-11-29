'use client'
import Certificate from '@/component/dashboard-user/Certificate'
import TeamDashboard from '@/component/dashboard-user/TeamDashboard'
import TeamProfile from '@/component/dashboard-user/TeamProfile'
import Loader from '@/component/ui/Global/loader'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { useDashboardProfile } from '@/hooks/function/useDashboardProfile'
import { nav_dashboard } from '@/lib'
import { useMounted } from '@/lib/useMounted'
import { useState } from 'react'
import EmptyState from '@/component/ui/Global/not-found-data'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

function Dashboard() {
    const { dashboard, isLoading, profile } = useDashboardProfile()
    const [activeNav, setActiveNav] = useState('team-dashboard')
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
    if (isLoading) return <Loader show />

    if (!dashboard || !profile) return <EmptyState />
    let ComponentToRender

    if (activeNav === 'team-dashboard') {
        ComponentToRender = <TeamDashboard data={dashboard!.data!} />
    } else if (activeNav === 'team-profile') {
        ComponentToRender = <TeamProfile data={profile!.data!} />
    } else if (activeNav === 'certificate') {
        ComponentToRender = <Certificate />
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
                            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
                                activeNav === data.key ? 'bg-[#FBFF00]' : 'bg-transparent'
                            }`}
                            onClick={() => handleClickNav(data.key)}
                        >
                            {data.label}
                        </p>
                    ))}
                </nav>
                <div className="w-full h-auto flex flex-col items-center gap-20 my-20">{ComponentToRender}</div>
            </div>
        </>
    )
}

export default Dashboard
