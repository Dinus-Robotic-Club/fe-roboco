import { useState, useMemo } from 'react'
import { Search, Filter, Download, Printer, CheckCircle2, XCircle, User, Phone, Building2, BadgeCheck, X, FileImage, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { RegistrationStatus, FilterType } from '@/lib/types/type' 
import { ITournamentData, TeamRole } from '@/lib/types/tournament'

// --- HELPER TYPES (Untuk Data yang sudah di-flatten) ---
interface FlatParticipant {
    // Participant Data
    participantUid: string
    name: string
    role: TeamRole
    image: string
    idCard: string
    phone: string
    twibbon: string
    // Team/Registration Context
    teamName: string
    teamLogo: string
    category: string
    communityName: string
    registrationStatus: RegistrationStatus
    registrationUid: string
    registeredAt: string
}

interface ParticipantsTabProps {
    data: ITournamentData
    onUpdateStatus: (uid: string, newStatus: RegistrationStatus) => void
    formatDate: (date: string) => string
    onShowToast: (message: string) => void
}

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status }: { status: RegistrationStatus }) => {
    const styles = {
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
        APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
        REJECTED: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ring-1 ring-inset ${styles[status]}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    )
}

const ParticipantDetailModal = ({ data, onClose }: { data: FlatParticipant; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-500" />
                        Participant Details
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div className="relative h-32 w-32 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-100 flex-shrink-0 mx-auto sm:mx-0">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.image}`} alt={data.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-3">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                                    {data.name}
                                    {data.role === 'LEADER' && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    {data.role} of <span className="text-slate-900 font-bold">{data.teamName}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{data.phone}</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{data.communityName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ID Card Section */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                            <FileImage className="w-4 h-4 text-slate-500" />
                            Identity Card / Student ID
                        </h4>
                        <div className="relative w-full aspect-video bg-slate-100 rounded-xl border border-gray-200 overflow-hidden group">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.idCard}`} alt="ID Card" fill className="object-contain p-2" />
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}${data.idCard}`}
                                target="_blank"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded-lg font-bold text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-white"
                            >
                                <ExternalLink className="w-4 h-4" /> Open Fullsize
                            </a>
                        </div>
                    </div>

                    {/* Twibbon Link */}
                    {data.twibbon && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Twibbon URL</h4>
                            <a
                                href={data.twibbon}
                                target="_blank"
                                className="text-blue-600 hover:underline text-sm truncate block bg-blue-50 p-3 rounded-lg border border-blue-100"
                            >
                                {data.twibbon}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---

export default function ParticipantsTab({ data, onUpdateStatus, formatDate, onShowToast }: ParticipantsTabProps) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<FilterType>('ALL')
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'LEADER' | 'MEMBER'>('ALL')
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)
    const [selectedParticipant, setSelectedParticipant] = useState<FlatParticipant | null>(null)

    // 1. Flatten Data: Convert Nested Structure to Flat List of Participants
    const flatParticipants: FlatParticipant[] = useMemo(() => {
        if (!data?.registrations) return []

        return data.registrations.flatMap((reg) =>
            reg.team.participants.map((participant) => ({
                participantUid: participant.uid,
                name: participant.name,
                role: participant.roleInTeam,
                image: participant.image,
                idCard: participant.identityCardImage,
                phone: participant.phone,
                twibbon: participant.twibbon,
                // Context Data
                teamName: reg.team.name,
                teamLogo: reg.team.logo,
                category: reg.team.category,
                communityName: reg.team.community?.name || '-',
                registrationStatus: reg.status,
                registrationUid: reg.uid,
                registeredAt: reg.registeredAt,
            })),
        )
    }, [data])

    // 2. Filter Logic
    const filteredParticipants = useMemo(() => {
        return flatParticipants.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.communityName.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === 'ALL' || p.registrationStatus === statusFilter
            const matchesRole = roleFilter === 'ALL' || p.role === roleFilter

            return matchesSearch && matchesStatus && matchesRole
        })
    }, [flatParticipants, searchQuery, statusFilter, roleFilter])

    const handleExportCSV = () => {
        const headers = ['Name,Role,Phone,Team Name,Category,School/Community,Status']
        const rows = filteredParticipants.map((p) => `"${p.name}",${p.role},'${p.phone},"${p.teamName}",${p.category},"${p.communityName}",${p.registrationStatus}`)
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
        const link = document.createElement('a')
        link.setAttribute('href', encodeURI(csvContent))
        link.setAttribute('download', `participants_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onShowToast('Participants exported to CSV!')
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="hidden print-only p-8 text-center border-b">
                <h1 className="text-2xl font-bold">{data.name} - All Participants</h1>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50 no-print">
                <div className="relative w-full xl:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#d4b904] transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Name, Team, or School..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FBFF00] focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as TeamRole)}
                        className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-[#FBFF00] outline-none"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="LEADER">Leaders Only</option>
                        <option value="MEMBER">Members Only</option>
                    </select>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={`px-3 py-2 text-sm font-medium border rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                                statusFilter !== 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            {statusFilter === 'ALL' ? 'Status' : statusFilter}
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
                    <button
                        onClick={handleExportCSV}
                        className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">CSV</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Summary Bar */}
            <div className="bg-[#FBFF00]/5 px-4 py-2 text-xs font-medium text-slate-700 border-b border-[#FBFF00]/10 flex justify-between items-center no-print">
                <span>Showing {filteredParticipants.length} participant(s)</span>
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-900 underline">
                        Clear
                    </button>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4">Participant Info</th>
                            <th className="px-6 py-4">Team Info</th>
                            <th className="px-6 py-4">School / Community</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right no-print">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredParticipants.map((p) => (
                            <tr key={p.participantUid} onClick={() => setSelectedParticipant(p)} className="group hover:bg-[#FBFF00]/5 transition-colors cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-slate-100 group-hover:scale-110 transition-transform">
                                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${p.image}`} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-900">{p.name}</p>
                                                {p.role === 'LEADER' && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                                            </div>
                                            <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400 bg-slate-100 inline-block px-1.5 py-0.5 rounded mt-0.5">
                                                {p.role}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-8 w-8 rounded overflow-hidden opacity-80">
                                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${p.teamLogo}`} alt={p.teamName} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-xs">{p.teamName}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{p.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium text-xs">{p.communityName}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={p.registrationStatus} />
                                </td>
                                <td className="px-6 py-4 text-right no-print" onClick={(e) => e.stopPropagation()}>
                                    {/* Action affects the REGISTRATION (Team), not just the user */}
                                    {p.registrationStatus === 'PENDING' ? (
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onUpdateStatus(p.registrationUid, 'APPROVED')}
                                                className="p-1.5 bg-white text-emerald-600 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 rounded shadow-sm"
                                                title={`Approve Team ${p.teamName}`}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onUpdateStatus(p.registrationUid, 'REJECTED')}
                                                className="p-1.5 bg-white text-rose-600 border border-gray-200 hover:bg-rose-50 hover:border-rose-200 rounded shadow-sm"
                                                title={`Reject Team ${p.teamName}`}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredParticipants.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <User className="w-12 h-12 mb-3 text-slate-200" />
                        <p>No participants found.</p>
                    </div>
                )}
            </div>

            {/* Mobile View */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50/50 flex-1 overflow-y-auto no-print">
                {filteredParticipants.map((p) => (
                    <div key={p.participantUid} onClick={() => setSelectedParticipant(p)} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-slate-100 flex-shrink-0">
                                <Image src={`${process.env.NEXT_PUBLIC_API_URL}${p.image}`} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-900 truncate pr-2">{p.name}</h4>
                                    <StatusBadge status={p.registrationStatus} />
                                </div>
                                <p className="text-xs text-slate-500 mb-1">
                                    {p.role} • {p.teamName}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{p.communityName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedParticipant && <ParticipantDetailModal data={selectedParticipant} onClose={() => setSelectedParticipant(null)} />}
        </div>
    )
}
