import { useState, useMemo } from 'react'
import { Search, Filter, Download, Printer, CheckCircle2, XCircle, MoreHorizontal, FileText } from 'lucide-react'
import Image from 'next/image' // Pastikan sudah config domain di next.config.js
import { Registration, RegistrationStatus, FilterType, RegistrationsTabProps } from '@/lib/types/type'
import { DetailModal } from './modal-team'

// --- HELPER COMPONENTS ---

export const StatusBadge = ({ status }: { status: RegistrationStatus }) => {
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

export default function TeamsTab({ data, onUpdateStatus, formatDate, onShowToast }: RegistrationsTabProps) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<FilterType>('ALL')
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

    const filteredRegistrations = useMemo(() => {
        return data.registrations.filter((reg) => {
            const matchesSearch =
                reg.team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.team.community.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = statusFilter === 'ALL' || reg.status === statusFilter
            return matchesSearch && matchesFilter
        })
    }, [data.registrations, searchQuery, statusFilter])

    const handleExportCSV = () => {
        const headers = ['UID,Team Name,Community,Category,Leader Name,Participants Count,Status,Registered At']
        const rows = filteredRegistrations.map((reg) => {
            const leader = reg.team.participants.find((p) => p.roleInTeam === 'LEADER')?.name || 'N/A'
            return `${reg.uid},"${reg.team.name}","${reg.team.community.name}",${reg.team.category},"${leader}",${reg.team.participants.length},${reg.status},${formatDate(
                reg.registeredAt,
            )}`
        })
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onShowToast('Exported to CSV successfully!')
    }

    const handleUpdateStatus = (uid: string, status: RegistrationStatus) => {
        onUpdateStatus(uid, status)
        if (selectedRegistration) {
            setSelectedRegistration((prev) => (prev ? { ...prev, status } : null))
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="hidden print-only p-8 text-center border-b">
                <h1 className="text-2xl font-bold">{data.name} - Participant List</h1>
                <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50 no-print">
                <div className="relative w-full xl:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#d4b904] transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Team, UID, or School..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FBFF00] focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full xl:w-auto">
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
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
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
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                </div>
            </div>

            {/* Summary Bar */}
            <div className="bg-[#FBFF00]/5 px-4 py-2 text-xs font-medium text-slate-700 border-b border-[#FBFF00]/10 flex justify-between items-center no-print">
                <span>Showing {filteredRegistrations.length} team(s)</span>
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-900 underline decoration-slate-300 underline-offset-2">
                        Clear Search
                    </button>
                )}
            </div>

            {/* Table View (Desktop) */}
            <div className="hidden md:block overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 w-[35%]">Team Info</th>
                            <th className="px-6 py-4 w-[20%]">Community</th>
                            <th className="px-6 py-4 w-[15%]">Date</th>
                            <th className="px-6 py-4 w-[15%]">Status</th>
                            <th className="px-6 py-4 w-[15%] text-right no-print">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg.uid} onClick={() => setSelectedRegistration(reg)} className="group hover:bg-[#FBFF00]/5 transition-colors cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-white group-hover:scale-110 transition-transform">
                                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${reg.team.logo}`} alt={reg.team.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-[#d4b904] transition-colors">{reg.team.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">ID: {reg.uid.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-medium">{reg.team.community?.name || '-'}</span>
                                        <span className="text-xs text-slate-400">{reg.team.category}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{formatDate(reg.registeredAt)}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={reg.status} />
                                </td>
                                <td className="px-6 py-4 text-right no-print" onClick={(e) => e.stopPropagation()}>
                                    {reg.status === 'PENDING' ? (
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleUpdateStatus(reg.uid, 'APPROVED')}
                                                className="p-2 bg-white text-emerald-600 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg shadow-sm transition-all"
                                                title="Approve"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(reg.uid, 'REJECTED')}
                                                className="p-2 bg-white text-rose-600 border border-gray-200 hover:bg-rose-50 hover:border-rose-200 rounded-lg shadow-sm transition-all"
                                                title="Reject"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end">
                                            <button className="text-slate-400 hover:text-slate-600 transition-colors p-2">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRegistrations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <FileText className="w-12 h-12 mb-3 text-slate-200" />
                        <p className="font-medium">No registrations found</p>
                        <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Mobile View (Tetap sederhana tapi clickable) */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50/50 flex-1 overflow-y-auto no-print">
                {filteredRegistrations.map((reg) => (
                    <div
                        key={reg.uid}
                        onClick={() => setSelectedRegistration(reg)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.98] transition-transform"
                    >
                        {/* Mobile Content same as logic above but simplified */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                    <Image src={`${process.env.NEXT_PUBLIC_API_URL}${reg.team.logo}`} alt={reg.team.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{reg.team.name}</p>
                                    <p className="text-xs text-slate-400">{reg.team.community.name}</p>
                                </div>
                            </div>
                            <StatusBadge status={reg.status} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400">{formatDate(reg.registeredAt)}</span>
                            <span className="text-xs font-bold text-blue-600">View Details &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Modal */}
            {selectedRegistration && (
                <DetailModal registration={selectedRegistration} onClose={() => setSelectedRegistration(null)} onUpdateStatus={handleUpdateStatus} formatDate={formatDate} />
            )}
        </div>
    )
}
