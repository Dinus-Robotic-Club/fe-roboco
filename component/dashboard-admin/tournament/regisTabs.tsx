import { useState, useMemo } from 'react'
import { Search, Filter, Download, Printer, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react'
import { FilterType, RegistrationStatus, TournamentData } from '@/lib/types/type'

interface RegistrationsTabProps {
    data: TournamentData
    onUpdateStatus: (uid: string, newStatus: RegistrationStatus) => void
    formatDate: (date: string) => string
    onShowToast: (message: string) => void
}

export default function RegistrationsTab({ data, onUpdateStatus, formatDate, onShowToast }: RegistrationsTabProps) {
    // Local State untuk Filter & Search agar Parent tidak re-render
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<FilterType>('ALL')
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)

    // Logic Filtering
    const filteredRegistrations = useMemo(() => {
        return data.registrations.filter((reg) => {
            const matchesSearch = reg.team.name.toLowerCase().includes(searchQuery.toLowerCase()) || reg.uid.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = statusFilter === 'ALL' || reg.status === statusFilter
            return matchesSearch && matchesFilter
        })
    }, [data.registrations, searchQuery, statusFilter])

    // Handler Export CSV
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
        onShowToast('Exported to CSV successfully!')
    }

    // Helper Badge
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
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
                        placeholder="Search by Team Name or UID..."
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
            <div className="bg-[#FBFF00]/10 px-4 py-2 text-xs font-medium text-slate-700 border-b border-[#FBFF00]/10 flex justify-between items-center no-print">
                <span>Showing {filteredRegistrations.length} result(s)</span>
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-900 underline">
                        Clear Search
                    </button>
                )}
            </div>

            {/* Mobile View */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50/50 min-h-[500px] no-print">
                {filteredRegistrations.map((reg) => (
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
                                    <button onClick={() => onUpdateStatus(reg.uid, 'REJECTED')} className="flex-1 py-2 text-xs font-bold text-rose-700 bg-rose-50 rounded-lg">
                                        Reject
                                    </button>
                                    <button onClick={() => onUpdateStatus(reg.uid, 'APPROVED')} className="flex-1 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                                        Approve
                                    </button>
                                </>
                            ) : (
                                <button className="text-sm text-slate-500 font-medium">View Details</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View */}
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
                        {filteredRegistrations.map((reg) => (
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
                                            <button onClick={() => onUpdateStatus(reg.uid, 'APPROVED')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onUpdateStatus(reg.uid, 'REJECTED')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="text-slate-400 hover:text-slate-900">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
