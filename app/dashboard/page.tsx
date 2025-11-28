'use client'
import Certificate from '@/component/dashboard-user/Certificate'
import TeamDashboard from '@/component/dashboard-user/TeamDashboard'
import TeamProfile from '@/component/dashboard-user/TeamProfile'
import Loader from '@/component/ui/Global/loader'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { useDashboardProfile } from '@/hooks/function/useDashboardProfile'
import { nav_dashboard } from '@/lib'
import { useMounted } from '@/lib/useMounted'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function Dashboard() {
    const router = useRouter()
    const { status } = useSession()
    const { dashboard, isLoading, isError, isSucces, profile } = useDashboardProfile()
    const [activeNav, setActiveNav] = useState('team-dashboard')
    const isMounted = useMounted()

    if (status === 'unauthenticated') {
        router.push('/auth/login')
    }

    if (!isMounted) return null
    if (isLoading) return <Loader show />
    if (isError) toast.error('Gagal mengambil data dashboard')
    if (isSucces) toast.success('Sukses mengambil data dashboard')

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
