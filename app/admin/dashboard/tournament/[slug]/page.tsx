'use client'

import { useState, useMemo } from 'react'
import {
    MapPin,
    Users,
    Settings,
    Trophy,
    Swords,
    LayoutGrid,
    Edit3,
    Share2,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Clock,
    ShieldAlert,
    LucideIcon,
    Download,
    Printer,
    Save,
    Loader2,
} from 'lucide-react'

// --- 1. DEFINISI TIPE DATA (STRICT TYPES) ---

type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
type TournamentStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED'
type TabId = 'overview' | 'registrations' | 'settings' | 'brackets' | 'matches'
type FilterType = 'ALL' | RegistrationStatus

interface Team {
    name: string
    logo: string | null
}

interface Registration {
    uid: string
    status: RegistrationStatus
    team: Team
    registeredAt: string
}

interface TournamentData {
    name: string
    status: TournamentStatus
    description: string
    startDate: string
    endDate: string
    location: string
    registrations: Registration[]
}

interface TournamentSettings {
    defaultBestOf: number
    groupBestOf: number
    upperBestOf: number
    lowerBestOf: number
    grandFinalBestOf: number
    roundDurationSoccer: number
    roundDurationSumo: number
}

interface TabItem {
    id: TabId
    label: string
    icon: LucideIcon
    count?: number
}

// --- 2. HELPER UTILITIES ---

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// --- 3. COMPONENT UTAMA ---

export default function TournamentAdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [isEditingSettings, setIsEditingSettings] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    // State untuk Search & Filter
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<FilterType>('ALL')
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)

    // State untuk Toast Notification
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Show Toast Helper
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // State Settings
    const [settings, setSettings] = useState<TournamentSettings>({
        defaultBestOf: 3,
        groupBestOf: 3,
        upperBestOf: 3,
        lowerBestOf: 3,
        grandFinalBestOf: 5,
        roundDurationSoccer: 3,
        roundDurationSumo: 5,
    })

    // Mock Data (Single Source of Truth)
    const [tournamentData, setTournamentData] = useState<TournamentData>({
        name: 'DNROBOCO Championship 2025',
        status: 'DRAFT',
        description: 'Kompetisi robotik tingkat nasional dengan kategori Soccer dan Sumo. Memperebutkan total hadiah 50 Juta Rupiah.',
        startDate: '2025-11-26T00:00:00.000Z',
        endDate: '2025-11-28T00:00:00.000Z',
        location: 'Dian Nuswantoro University Convention Hall',
        registrations: [
            { uid: 'REG-001', status: 'PENDING', team: { name: 'Udinus Robo', logo: null }, registeredAt: '2025-10-01' },
            { uid: 'REG-002', status: 'APPROVED', team: { name: 'Aseli Cuy Team', logo: null }, registeredAt: '2025-10-02' },
            { uid: 'REG-003', status: 'PENDING', team: { name: 'Last Stand', logo: null }, registeredAt: '2025-10-03' },
            { uid: 'REG-004', status: 'PENDING', team: { name: 'Oke Gas', logo: null }, registeredAt: '2025-10-04' },
            { uid: 'REG-005', status: 'APPROVED', team: { name: 'Cyber Punk', logo: null }, registeredAt: '2025-10-05' },
            { uid: 'REG-006', status: 'REJECTED', team: { name: 'Iyapp Bot', logo: null }, registeredAt: '2025-10-06' },
            { uid: 'REG-007', status: 'PENDING', team: { name: 'Mecha Godzilla', logo: null }, registeredAt: '2025-10-07' },
            { uid: 'REG-008', status: 'APPROVED', team: { name: 'Contoh Squad', logo: null }, registeredAt: '2025-10-08' },
        ],
    })

    const tabs: TabItem[] = [
        { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
        { id: 'registrations', label: 'Participants', icon: Users, count: tournamentData.registrations.length },
        { id: 'settings', label: 'Configuration', icon: Settings },
        { id: 'brackets', label: 'Brackets', icon: Trophy },
        { id: 'matches', label: 'Matches', icon: Swords },
    ]

    // --- LOGIC: FILTERING DATA ---
    // Menggunakan useMemo agar filter hanya berjalan saat dependency berubah
    const filteredRegistrations = useMemo(() => {
        return tournamentData.registrations.filter((reg) => {
            const matchesSearch = reg.team.name.toLowerCase().includes(searchQuery.toLowerCase()) || reg.uid.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesFilter = statusFilter === 'ALL' || reg.status === statusFilter

            return matchesSearch && matchesFilter
        })
    }, [tournamentData.registrations, searchQuery, statusFilter])

    // --- HANDLERS ---

    const handleSettingChange = (field: keyof TournamentSettings, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: parseInt(value) || 1 }))
    }

    const handleSaveSettings = () => {
        setIsSaving(true)
        // Simulate API Call
        setTimeout(() => {
            setIsSaving(false)
            setIsEditingSettings(false)
            showToast('Settings saved successfully!')
        }, 1000)
    }

    const handleUpdateStatus = (uid: string, newStatus: RegistrationStatus) => {
        setTournamentData((prev) => ({
            ...prev,
            registrations: prev.registrations.map((reg) => (reg.uid === uid ? { ...reg, status: newStatus } : reg)),
        }))
        showToast(`Team status updated to ${newStatus}`)
    }

    // Export to Excel (CSV)
    const handleExportCSV = () => {
        const headers = ['UID,Team Name,Registration Date,Status']
        const rows = filteredRegistrations.map((reg) => `${reg.uid},"${reg.team.name}",${formatDate(reg.registeredAt)},${reg.status}`)

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `tournament_participants_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        showToast('Exported to CSV successfully!')
    }

    // Print to PDF (Using Browser Native Print)
    const handlePrintPDF = () => {
        window.print()
    }

    // --- UI HELPERS ---

    const getStatusBadge = (status: RegistrationStatus) => {
        switch (status) {
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Qualified
                    </span>
                )
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-10 print:bg-white print:pb-0">
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

            {/* TOAST NOTIFICATION */}
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

            {/* 1. HERO SECTION & HEADER (Hidden on Print) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 no-print">
                <div className="h-48 w-full bg-slate-900 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-[#FBFF00] opacity-5 -skew-x-12 translate-x-20"></div>

                    <div className="absolute bottom-6 left-0 w-full px-4 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex items-end gap-6">
                            <div className="hidden sm:flex w-24 h-24 bg-white rounded-xl shadow-lg border-4 border-white items-center justify-center transform translate-y-4">
                                <Trophy className="w-10 h-10 text-slate-900" />
                            </div>
                            <div className="mb-1 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#FBFF00] text-black uppercase shadow-[0_0_10px_rgba(251,255,0,0.5)]">
                                        {tournamentData.status}
                                    </span>
                                    <span className="text-slate-300 text-xs flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                                        <MapPin className="w-3 h-3" /> {tournamentData.location}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{tournamentData.name}</h1>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-1">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-sm font-medium">
                                <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Info</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#FBFF00] text-black rounded-lg hover:bg-[#e6eb00] transition-all text-sm font-bold shadow-[0_0_20px_rgba(251,255,0,0.3)] hover:shadow-[0_0_25px_rgba(251,255,0,0.5)]">
                                <Share2 className="w-4 h-4" /> Publish
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-8 mt-4 md:mt-6">
                    <div className="flex gap-2 md:gap-8 overflow-x-auto scrollbar-hide pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex items-center gap-2 px-2 pb-4 text-sm font-medium border-b-[3px] transition-all whitespace-nowrap ${
                                    activeTab === tab.id ? 'border-[#FBFF00] text-black' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black text-[#FBFF00]' : 'bg-slate-100 text-slate-500'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 print-container">
                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Teams</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-3xl font-extrabold text-slate-900">{tournamentData.registrations.length}</h3>
                                        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">+2 today</span>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Start Date</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-xl font-bold text-slate-900">{formatDate(tournamentData.startDate)}</h3>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">in 2 days</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                    <div className="absolute right-0 top-0 w-16 h-16 bg-[#FBFF00]/20 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#FBFF00]/30 transition-colors"></div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                                        <h3 className="text-lg font-bold text-slate-900">Pending Setup</h3>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-amber-500" /> Actions Required
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setActiveTab('registrations')}
                                        className="group text-left p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#FBFF00] hover:shadow-md transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#FBFF00]/0 group-hover:to-[#FBFF00]/5 transition-all"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#FBFF00] group-hover:text-black transition-colors text-slate-700">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-slate-900">Review Registrations</h4>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {tournamentData.registrations.filter((r) => r.status === 'PENDING').length} teams are waiting for approval.
                                            </p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className="group text-left p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#FBFF00] hover:shadow-md transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#FBFF00]/0 group-hover:to-[#FBFF00]/5 transition-all"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#FBFF00] group-hover:text-black transition-colors text-slate-700">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-slate-900">Finalize Rules</h4>
                                            <p className="text-sm text-slate-500 mt-1">Set round duration and best-of series.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Activity Log</h3>
                            <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-8">
                                <div className="relative group">
                                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></span>
                                    <p className="text-xs text-slate-400 mb-0.5">Today, 10:00 AM</p>
                                    <p className="text-sm font-medium text-slate-900">Registration Opened</p>
                                </div>
                                <div className="relative group">
                                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#FBFF00] border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></span>
                                    <p className="text-xs text-slate-400 mb-0.5">Nov 26, 2025</p>
                                    <p className="text-sm font-medium text-slate-900">Group Stage Begins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- REGISTRATIONS TAB (Full Functionality) --- */}
                {activeTab === 'registrations' && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        {/* Header untuk Print Only */}
                        <div className="hidden print-only p-8 text-center border-b">
                            <h1 className="text-2xl font-bold">{tournamentData.name} - Participant List</h1>
                            <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Toolbar (Hidden on Print) */}
                        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50 no-print">
                            {/* Search */}
                            <div className="relative w-full xl:w-96 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#d4b904] transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Team Name or UID..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FBFF00] focus:border-transparent outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                                {/* Filter Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        className={`px-3 py-2 text-sm font-medium border rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                                            statusFilter !== 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Filter className="w-4 h-4" />
                                        {statusFilter === 'ALL' ? 'Filter Status' : statusFilter}
                                    </button>

                                    {showFilterDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1">
                                                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => {
                                                            setStatusFilter(filter as FilterType)
                                                            setShowFilterDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${
                                                            statusFilter === filter ? 'text-[#d4b904] font-bold bg-gray-50' : 'text-slate-600'
                                                        }`}
                                                    >
                                                        {filter.charAt(0) + filter.slice(1).toLowerCase()}
                                                        {statusFilter === filter && <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Export & Print Buttons */}
                                <button
                                    onClick={handleExportCSV}
                                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center gap-2 whitespace-nowrap transition-all"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                                <button
                                    onClick={handlePrintPDF}
                                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 flex items-center gap-2 whitespace-nowrap transition-all"
                                >
                                    <Printer className="w-4 h-4" /> Print PDF
                                </button>
                            </div>
                        </div>

                        {/* Summary Bar */}
                        <div className="bg-[#FBFF00]/10 px-4 py-2 text-xs font-medium text-slate-700 border-b border-[#FBFF00]/10 flex justify-between items-center no-print">
                            <span>Showing {filteredRegistrations.length} result(s)</span>
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-900 underline">
                                    Clear Search
                                </button>
                            )}
                        </div>

                        {/* Mobile View: Card List */}
                        <div className="block md:hidden p-4 space-y-3 bg-slate-50/50 min-h-[500px] no-print">
                            {filteredRegistrations.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">No teams found matching your search.</div>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <div key={reg.uid} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                    {reg.team.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{reg.team.name}</p>
                                                    <p className="text-xs text-slate-400">UID: {reg.uid}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(reg.status)}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50">
                                            {reg.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(reg.uid, 'REJECTED')}
                                                        className="flex-1 py-2 text-xs font-bold text-rose-700 bg-rose-50 rounded-lg"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(reg.uid, 'APPROVED')}
                                                        className="flex-1 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg"
                                                    >
                                                        Approve
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="text-sm text-slate-500 font-medium">View Details</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop View: Table List */}
                        <div className="hidden md:block overflow-x-auto min-h-[500px]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Team Name</th>
                                        <th className="px-6 py-4">Reg Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right no-print">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRegistrations.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-20 text-slate-400">
                                                <div className="flex flex-col items-center">
                                                    <Search className="w-10 h-10 mb-2 opacity-20" />
                                                    <p>No participants found matching {`"${searchQuery}"`}</p>
                                                    <button
                                                        onClick={() => {
                                                            setSearchQuery('')
                                                            setStatusFilter('ALL')
                                                        }}
                                                        className="mt-2 text-[#d4b904] hover:underline"
                                                    >
                                                        Reset Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRegistrations.map((reg) => (
                                            <tr key={reg.uid} className="group hover:bg-[#FBFF00]/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200 group-hover:bg-white group-hover:border-[#FBFF00] transition-colors">
                                                            {reg.team.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{reg.team.name}</p>
                                                            <p className="text-xs text-slate-400 font-mono">UID: {reg.uid}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-medium">{formatDate(reg.registeredAt)}</td>
                                                <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                                                <td className="px-6 py-4 text-right no-print">
                                                    {reg.status === 'PENDING' ? (
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleUpdateStatus(reg.uid, 'APPROVED')}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg hover:scale-110 transition-all"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(reg.uid, 'REJECTED')}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg hover:scale-110 transition-all"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- SETTINGS TAB (Functional Save) --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-4xl mx-auto no-print">
                        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Tournament Rules</h2>
                                <p className="text-slate-500 text-sm mt-1">Configure match mechanics and scoring systems.</p>
                            </div>
                            {isEditingSettings ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditingSettings(false)}
                                        disabled={isSaving}
                                        className="px-5 py-2.5 rounded-lg text-sm font-bold border border-gray-200 bg-white hover:bg-gray-50 text-slate-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving}
                                        className="px-5 py-2.5 rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditingSettings(true)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#FBFF00] text-black hover:bg-[#e6eb00] hover:shadow-lg hover:shadow-[#FBFF00]/20 transition-all shadow-sm"
                                >
                                    Edit Configuration
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: Match Structure */}
                            <div
                                className={`bg-white p-6 rounded-xl border transition-all duration-300 ${
                                    isEditingSettings ? 'border-[#FBFF00] ring-2 ring-[#FBFF00]/10' : 'border-gray-100 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-slate-100 rounded-lg">
                                        <Trophy className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">Match Format (Best Of)</h3>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'groupBestOf', label: 'Group Stage' },
                                        { id: 'upperBestOf', label: 'Upper Bracket' },
                                        { id: 'lowerBestOf', label: 'Lower Bracket' },
                                        { id: 'grandFinalBestOf', label: 'Grand Finals' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    disabled={!isEditingSettings || settings[item.id as keyof TournamentSettings] <= 1}
                                                    onClick={() =>
                                                        handleSettingChange(item.id as keyof TournamentSettings, (settings[item.id as keyof TournamentSettings] - 2).toString())
                                                    }
                                                    className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-slate-900 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FBFF00] hover:bg-[#FBFF00] hover:text-black transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className={`w-8 text-center font-bold text-lg ${isEditingSettings ? 'text-slate-900' : 'text-slate-500'}`}>
                                                    {settings[item.id as keyof TournamentSettings]}
                                                </span>
                                                <button
                                                    disabled={!isEditingSettings}
                                                    onClick={() =>
                                                        handleSettingChange(item.id as keyof TournamentSettings, (settings[item.id as keyof TournamentSettings] + 2).toString())
                                                    }
                                                    className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-slate-900 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FBFF00] hover:bg-[#FBFF00] hover:text-black transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: Game Settings */}
                            <div
                                className={`bg-white p-6 rounded-xl border transition-all duration-300 ${
                                    isEditingSettings ? 'border-[#FBFF00] ring-2 ring-[#FBFF00]/10' : 'border-gray-100 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-slate-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">Round Durations</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-700">Soccer Category</label>
                                            <span className="text-sm font-bold text-black bg-[#FBFF00] px-2 py-0.5 rounded">{settings.roundDurationSoccer} Mins</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={settings.roundDurationSoccer}
                                            disabled={!isEditingSettings}
                                            onChange={(e) => handleSettingChange('roundDurationSoccer', e.target.value)}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-700">Sumo Category</label>
                                            <span className="text-sm font-bold text-black bg-[#FBFF00] px-2 py-0.5 rounded">{settings.roundDurationSumo} Mins</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={settings.roundDurationSumo}
                                            disabled={!isEditingSettings}
                                            onChange={(e) => handleSettingChange('roundDurationSumo', e.target.value)}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PLACEHOLDER FOR EMPTY TABS */}
                {['brackets', 'matches'].includes(activeTab) && (
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
                )}
            </main>
        </div>
    )
}
