'use client'

import { useState } from 'react'
import { LayoutGrid, Users, Settings as SettingsIcon, Trophy, Swords, CheckCircle2, ShieldAlert, Users2Icon } from 'lucide-react'
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

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// --- 1. PARENT COMPONENT (Data Fetcher) ---
// Tugas: Handle Loading & Error, lalu lempar data matang ke Child
export default function TournamentAdminDashboard() {
    const params = useParams()
    const slug = params.slug as string

    // Fetch Data
    const { data, isLoading, isError } = useDetailTournaments(slug)

    // A. Handle Loading
    if (isLoading) {
        return <Loader show />
    }

    // B. Handle Error / Empty Data
    if (isError || !data?.data) {
        return <div className="flex h-screen items-center justify-center text-rose-600 font-bold">Failed to load tournament data.</div>
    }

    // C. Render Content HANYA jika data sudah ada
    // Ini kuncinya: DashboardContent baru di-mount sekarang,
    // jadi useState di dalamnya akan langsung dapat data asli, bukan undefined.
    return <DashboardContent initialData={data.data as ITournamentData} />
}

// --- 2. CHILD COMPONENT (UI Logic) ---
// Tugas: Handle State Lokal, Tab, & Interaksi UI
function DashboardContent({ initialData }: { initialData: ITournamentData }) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // State ini aman sekarang karena initialData DIJAMIN ada isinya
    const [tournamentData, setTournamentData] = useState<ITournamentData>(initialData)

    const [settings, setSettings] = useState<TournamentSettings>({
        defaultBestOf: 3,
        groupBestOf: 3,
        upperBestOf: 3,
        lowerBestOf: 3,
        grandFinalBestOf: 5,
        roundDurationSoccer: 3,
        roundDurationSumo: 5,
    })

    const tabs: TabItem[] = [
        { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
        { id: 'registrations', label: 'Participants', icon: Users, count: tournamentData?.registrations?.length || 0 },
        { id: 'teams', label: 'Teams', icon: Users2Icon },
        { id: 'settings', label: 'Configuration', icon: SettingsIcon },
        { id: 'brackets', label: 'Brackets', icon: Trophy },
        { id: 'matches', label: 'Matches', icon: Swords },
    ]

    // --- ACTIONS ---
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleUpdateStatus = (uid: string, newStatus: RegistrationStatus) => {
        // Optimistic Update Lokal
        setTournamentData((prev) => ({
            ...prev,
            registrations: prev.registrations.map((reg) => (reg.uid === uid ? { ...reg, status: newStatus } : reg)),
        }))

        // TODO: Disini sebaiknya panggil API Mutation ke Backend untuk save status
        showToast(`Team status updated to ${newStatus}`)
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-10 print:bg-white print:pb-0">
            {/* CSS Print & Global Styles */}
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

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300 no-print">
                    <div
                        className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 ${
                            toast.type === 'success' ? 'bg-slate-900 text-white border-slate-700' : 'bg-rose-600 text-white border-rose-700'
                        }`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#FBFF00]" /> : <ShieldAlert className="w-5 h-5" />}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <DashboardHeader data={tournamentData} activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 print-container">
                {activeTab === 'overview' && <OverviewTab data={tournamentData} onChangeTab={setActiveTab} formatDate={formatDate} />}

                {activeTab === 'registrations' && <RegistrationsTab data={tournamentData} onUpdateStatus={handleUpdateStatus} formatDate={formatDate} onShowToast={showToast} />}

                {activeTab === 'teams' && <TeamsTab data={tournamentData} onUpdateStatus={handleUpdateStatus} formatDate={formatDate} onShowToast={showToast} />}

                {activeTab === 'settings' && <SettingsTab settings={settings} onUpdateSettings={setSettings} onShowToast={showToast} />}

                {['brackets', 'matches'].includes(activeTab) && <EmptyState activeTab={activeTab} setActiveTab={setActiveTab} />}
            </main>
        </div>
    )
}

// Simple Empty State
function EmptyState({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (id: TabId) => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed animate-in fade-in zoom-in-95 duration-300 no-print">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FBFF00]/10 to-transparent rounded-full flex items-center justify-center mb-6 shadow-sm">
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
