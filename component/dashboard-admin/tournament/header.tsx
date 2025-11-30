import { Edit3, MapPin, Share2, Trophy } from 'lucide-react'
import { TabItem, TabId } from '@/lib/types/type'
import { ITournamentData } from '@/lib/types/tournament'

interface HeaderProps {
    data: ITournamentData
    activeTab: TabId
    onTabChange: (id: TabId) => void
    tabs: TabItem[]
}

export default function DashboardHeader({ data, activeTab, onTabChange, tabs }: HeaderProps) {
    return (
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
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#FBFF00] text-black uppercase shadow-[0_0_10px_rgba(251,255,0,0.5)]"></span>
                                <span className="text-slate-300 text-xs flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                                    <MapPin className="w-3 h-3" /> {data?.location}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{data?.name}</h1>
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
                            key={tab?.id}
                            onClick={() => onTabChange(tab?.id)}
                            className={`group flex items-center gap-2 px-2 pb-4 text-sm font-medium border-b-[3px] transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'border-[#FBFF00] text-black' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black text-[#FBFF00]' : 'bg-slate-100 text-slate-500'}`}>
                                    {tab?.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
