'use client'

import { useState, useMemo } from 'react'
import { Search, Trophy, Zap, Hash, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ITournamentData, Match, Team, MatchStatus } from '@/lib/types/tournament'
import Image from 'next/image'

// --- ASSETS & HELPERS ---

const formatCompactDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase()} • ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
}

const getTeamInitial = (name: string) => name.substring(0, 2).toUpperCase()

// --- SUB-COMPONENT: TEAM AVATAR ---
const TechAvatar = ({ team, size = 'md', isWinner = false }: { team: Team | undefined; size?: 'sm' | 'md'; isWinner?: boolean }) => {
    const hasLogo = team?.logo && team.logo.length > 0
    const logoUrl = team?.logo.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${team?.logo}` : team?.logo

    return (
        <div
            className={cn(
                'relative shrink-0 flex items-center justify-center transition-all duration-300',
                size === 'md' ? 'w-14 h-14' : 'w-10 h-10',
                isWinner ? 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'grayscale-[0.5] group-hover:grayscale-0',
            )}
        >
            <div
                className={cn('w-full h-full overflow-hidden bg-gray-100 border-2', isWinner ? 'border-emerald-500' : 'border-gray-300 group-hover:border-gray-400', 'rounded-xl')}
            >
                {hasLogo ? (
                    <Image
                        src={logoUrl as string}
                        alt={team?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                        width={1080}
                        height={1080}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 font-mono font-bold">{team ? getTeamInitial(team.name) : '?'}</div>
                )}

                <div className="hidden w-full h-full items-center justify-center bg-gray-50 text-gray-600 font-mono font-bold">{team ? getTeamInitial(team.name) : '?'}</div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: MATCH CARD ---
const TechMatchCard = ({ match, teamA, teamB }: { match: Match; teamA?: Team; teamB?: Team }) => {
    const isFinished = match.status === 'FINISHED'
    const isScheduled = match.status === 'SCHEDULED'

    const isWinA = isFinished && (match.winnerId === match.teamAId || match.scoreA > match.scoreB)
    const isWinB = isFinished && (match.winnerId === match.teamBId || match.scoreB > match.scoreA)

    return (
        <div className="group relative w-full backdrop-blur-md border border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/20 bg-white">
            {/* Decorative Gradient Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />

            {/* CARD HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        <Hash className="w-3 h-3" /> {match.roundLabel}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{formatCompactDate(match.updatedAt)}</span>
                </div>
            </div>

            {/* CARD BODY */}
            <div className="p-5 flex items-center justify-between relative z-10">
                {/* TEAM A */}
                <div className={cn('flex-1 flex flex-col items-start gap-3 transition-all', isWinB && 'opacity-50')}>
                    <TechAvatar team={teamA} isWinner={isWinA} />
                    <div>
                        <h3 className={cn('text-sm font-bold leading-tight uppercase tracking-tight', isWinA ? 'text-gray-900' : 'text-gray-600')}>{teamA?.name || 'TBD'}</h3>
                        {isWinA && <span className="text-[9px] font-black text-emerald-600 mt-1 block">WINNER</span>}
                    </div>
                </div>

                {/* CENTER: VS / SCORE */}
                <div className="shrink-0 flex flex-col items-center justify-center px-4">
                    {isScheduled ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-10"></div>
                            <span className="relative text-2xl font-black italic text-gray-400 group-hover:text-gray-500 transition-colors">VS</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className={cn('text-4xl font-mono font-bold tracking-tighter', isWinA ? 'text-gray-900 drop-shadow-lg' : 'text-gray-400')}>{match.scoreA}</span>
                            <div className="h-8 w-px bg-gray-300 rotate-12"></div>
                            <span className={cn('text-4xl font-mono font-bold tracking-tighter', isWinB ? 'text-gray-900 drop-shadow-lg' : 'text-gray-400')}>{match.scoreB}</span>
                        </div>
                    )}
                </div>

                {/* TEAM B */}
                <div className={cn('flex-1 flex flex-col items-end gap-3 text-right transition-all', isWinA && 'opacity-50')}>
                    <TechAvatar team={teamB} isWinner={isWinB} />
                    <div>
                        <h3 className={cn('text-sm font-bold leading-tight uppercase tracking-tight', isWinB ? 'text-gray-900' : 'text-gray-600')}>{teamB?.name || 'TBD'}</h3>
                        {isWinB && <span className="text-[9px] font-black text-emerald-600 mt-1 block">WINNER</span>}
                    </div>
                </div>
            </div>

            {/* HOVER ACTION */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </div>
    )
}

// --- MAIN PAGE ---

export default function TournamentMatchPage({ data }: { data: ITournamentData }) {
    const [filter, setFilter] = useState<'ALL' | MatchStatus>('ALL')
    const [search, setSearch] = useState('')

    const teamLookup = useMemo(() => {
        const lookup: Record<string, Team> = {}
        data.registrations.forEach((reg) => {
            if (reg.team?.uid) lookup[reg.team.uid] = reg.team
        })
        return lookup
    }, [data.registrations])

    const filteredMatches = useMemo(() => {
        return data.matches.filter((match) => {
            const matchesStatus = filter === 'ALL' || match.status === filter
            const teamA = teamLookup[match.teamAId]
            const teamB = teamLookup[match.teamBId]
            const query = search.toLowerCase()

            const matchesSearch =
                search === '' || teamA?.name.toLowerCase().includes(query) || teamB?.name.toLowerCase().includes(query) || match.roundLabel.toLowerCase().includes(query)

            return matchesStatus && matchesSearch
        })
    }, [data.matches, filter, search, teamLookup])

    const stats = {
        total: data.matches.length,
        finished: data.matches.filter((m) => m.status === 'FINISHED').length,
    }

    return (
        <div className="h-full text-gray-900 font-sans selection:bg-blue-200/50 ">
            {/* Background Grid Pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.02]"
                style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* HERO SECTION */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
                                Live Tournament
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">{data.name}</h1>
                        <p className="text-gray-600 max-w-lg text-sm leading-relaxed">
                            Official match schedule and real-time results.
                            <br />
                            Location: <span className="text-gray-900">{data.location}</span>
                        </p>
                    </div>

                    {/* STATS HUD */}
                    <div className="flex gap-4">
                        <div className="border border-gray-200 p-4 rounded-xl min-w-[140px] backdrop-blur-sm bg-gray-50/50">
                            <div className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mb-1">Total Matches</div>
                            <div className="text-3xl font-mono font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-xl min-w-[140px] backdrop-blur-sm relative overflow-hidden bg-gray-50/50">
                            <div className="absolute top-0 right-0 p-2">
                                <Zap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mb-1">Completed</div>
                            <div className="text-3xl font-mono font-bold text-emerald-600">{stats.finished}</div>
                        </div>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="sticky top-4 z-30 mb-8 bg-white/90 backdrop-blur-xl border border-gray-200 p-2 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3">
                    {/* Custom Segmented Control */}
                    <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                        {(['ALL', 'SCHEDULED', 'FINISHED'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    'px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300',
                                    filter === f ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50',
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium"
                            placeholder="Search team, bracket, or match ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* MATCH GRID */}
                {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredMatches.map((match) => (
                            <TechMatchCard key={match.uid} match={match} teamA={teamLookup[match.teamAId]} teamB={teamLookup[match.teamBId]} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-300 rounded-3xl bg-gray-50/50">
                        <Trophy className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No Matches Found</h3>
                        <p className="text-gray-600 text-sm mt-2 max-w-xs text-center">Adjust filters or check back later for new schedules.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
