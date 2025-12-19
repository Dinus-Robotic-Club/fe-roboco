'use client'

import { Suspense, useState } from 'react'
import { LayoutGrid, Users, Settings as SettingsIcon, Trophy, Swords, Users2Icon } from 'lucide-react'
import { TournamentSettings, TabItem, TabId, RegistrationStatus } from '@/lib/types/type'
import DashboardHeader from '@/component/dashboard-admin/tournament/header'
import OverviewTab from '@/component/dashboard-admin/tournament/overview'
import RegistrationsTab from '@/component/dashboard-admin/tournament/regisTabs'
import SettingsTab from '@/component/dashboard-admin/tournament/settingTabs'
import TeamsTab from '@/component/dashboard-admin/tournament/team'
import { useParams } from 'next/navigation'
import { useDetailTournaments } from '@/hooks/queries/useTournaments'
import Loader from '@/component/ui/Global/loader'
import { ITournamentData } from '@/lib/types/tournament'
import { useUpdateStatus } from '@/hooks/mutations/teams-mutation'
import { toast } from 'sonner'
import TournamentMatchPage from '@/component/dashboard-admin/tournament/match'

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TournamentAdminDashboard() {
    const params = useParams()
    const slug = params.slug as string

    return (
        <Suspense fallback={<Loader show />}>
            <DashboardContentWrapper key={slug} slug={slug} />
        </Suspense>
    )
}

function DashboardContentWrapper({ slug }: { slug: string }) {
    const { data } = useDetailTournaments(slug)

    return <DashboardContent initialData={data?.data as ITournamentData} />
}

function DashboardContent({ initialData }: { initialData: ITournamentData }) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [tournamentData, setTournamentData] = useState<ITournamentData>(initialData)
    const [settings, setSettings] = useState<TournamentSettings>(initialData?.settings)

    const tabs: TabItem[] = [
        { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
        { id: 'registrations', label: 'Participants', icon: Users, count: tournamentData?.registrations?.length || 0 },
        { id: 'teams', label: 'Teams', icon: Users2Icon },
        { id: 'settings', label: 'Configuration', icon: SettingsIcon },
        { id: 'brackets', label: 'Brackets', icon: Trophy },
        { id: 'matches', label: 'Matches', icon: Swords },
    ]
    const { mutate: updateStatus, isPending, isSuccess } = useUpdateStatus()

    const handleUpdateStatus = (uid: string, newStatus: RegistrationStatus) => {
        setTournamentData((prev) => ({
            ...prev,
            registrations: prev.registrations.map((reg) => (reg.uid === uid ? { ...reg, status: newStatus } : reg)),
        }))

        updateStatus({
            status: newStatus,
            uid: uid,
        })
    }

    if (isPending) return <Loader show />
    if (isSuccess) toast.success('Succes update status')

    return (
        <div className="h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-10 print:bg-white print:pb-0">
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    body {
                        background: white;
                    }
                    .print-container {
                        padding: 0;
                        margin: 0;
                        max-width: 100%;
                    }
                }
            `}</style>

            {/* HEADER */}
            <DashboardHeader data={tournamentData} activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 print-container">
                {activeTab === 'overview' && <OverviewTab data={tournamentData} onChangeTab={setActiveTab} formatDate={formatDate} />}

                {activeTab === 'registrations' && <RegistrationsTab data={tournamentData} formatDate={formatDate} />}

                {activeTab === 'teams' && <TeamsTab data={tournamentData} onUpdateStatus={handleUpdateStatus} formatDate={formatDate} />}

                {activeTab === 'settings' && <SettingsTab settings={settings} onUpdateSettings={setSettings} />}

                {activeTab === 'matches' && <TournamentMatchPage data={tournamentData} />}

                {['brackets'].includes(activeTab) && <EmptyState activeTab={activeTab} setActiveTab={setActiveTab} />}
            </main>
        </div>
    )
}

function EmptyState({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (id: TabId) => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed animate-in fade-in zoom-in-95 duration-300 no-print">
            <div className="w-20 h-20 bg-linear-to-br from-[#FBFF00]/10 to-transparent rounded-full flex items-center justify-center mb-6 shadow-sm">
                {activeTab === 'brackets' ? <Trophy className="w-10 h-10 text-slate-400" /> : <Swords className="w-10 h-10 text-slate-400" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Required</h3>
            <p className="text-slate-500 max-w-sm text-center mb-8 leading-relaxed">
                You need to finalize registrations and close the participant list before generating {activeTab}.
            </p>
            <button
                onClick={() => setActiveTab('registrations')}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold shadow-lg shadow-slate-900/20"
            >
                Go to Participants
            </button>
        </div>
    )
}
