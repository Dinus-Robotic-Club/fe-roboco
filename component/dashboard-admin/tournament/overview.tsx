import { TabId, TournamentData } from '@/lib/types/type'
import { ShieldAlert, Users, Settings } from 'lucide-react'

interface OverviewProps {
    data: TournamentData
    onChangeTab: (tab: TabId) => void
    formatDate: (date: string) => string
}

export default function OverviewTab({ data, onChangeTab, formatDate }: OverviewProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stat Cards */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Teams</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-extrabold text-slate-900">{data.registrations.length}</h3>
                            {/* <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">+2 today</span> */}
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Start Date</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-slate-900">{formatDate(data.startDate)}</h3>
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
                            onClick={() => onChangeTab('registrations')}
                            className="group text-left p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#FBFF00] hover:shadow-md transition-all relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#FBFF00]/0 group-hover:to-[#FBFF00]/5 transition-all"></div>
                            <div className="relative">
                                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#FBFF00] group-hover:text-black transition-colors text-slate-700">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-900">Review Registrations</h4>
                                <p className="text-sm text-slate-500 mt-1">{data.registrations.filter((r) => r.status === 'PENDING').length} teams are waiting for approval.</p>
                            </div>
                        </button>
                        <button
                            onClick={() => onChangeTab('settings')}
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
    )
}
