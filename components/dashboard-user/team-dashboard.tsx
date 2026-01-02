import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { getImageUrl } from '@/lib/function'
import { StatItem } from '@/components/ui/stats'
import { ParticipantCard } from '@/components/ui/card'
import { CardMatch } from '../templates/match/match'
import { EmptyMatchHistory } from '@/components/ui/empty'

function TeamDashboard({ data }: { data: DashboardTeamData }) {
  const { user } = useAuth()

  const statsConfig = [
    { label: 'Community Standings', value: `# ${data?.communityStanding?.rank ?? '-'}` },
    { label: 'Group Standings', value: `# ${data?.groupStanding?.groupRank ?? '-'}` },
    { label: 'Game Win', value: data.stats.matchWins },
    { label: 'Game Lose', value: data.stats.matchLoses },
    { label: 'Goal Scored', value: data.stats.totalGolScore },
    { label: 'Goal Conceded', value: data.stats.totalGolConceded },
  ]

  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">TEAM DASHBOARD</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex flex-col justify-between gap-16 md:gap-20 lg:gap-0 md:h-100">
          <div className="flex w-full gap-2 justify-center lg:justify-start">
            <div className="bg-logo-team w-17.5 h-17.5">
              <Image src={getImageUrl(data.team.logo as string)} alt="team-logo" height={10000} width={10000} className="w-full h-full p-2" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl lg:text-4xl font-bold">{data?.team?.name}</h1>
              <p className="text-base lg:text-xl">{data?.team?.community?.name}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-col gap-10">
            <div className="w-full grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
              {statsConfig.map((stat, index) => (
                <StatItem key={index} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Participants */}
        <div className="flex gap-12 items-end justify-center flex-wrap lg:flex-nowrap">
          {data.team.participants?.map((pt) => (
            <ParticipantCard key={pt.uid} participant={pt} />
          ))}
        </div>
      </div>

      {/* Match History Section */}
      <div className="flex flex-col gap-20 mt-8 py-5 w-full items-center justify-center">
        <h1 className="text-xl">MATCH HISTORY</h1>
        <div className="w-full flex flex-col items-center gap-6">
          {data.matchHistory.length > 0 ? (
            <>
              <div className="w-full flex flex-col items-center justify-center gap-7">
                {data.matchHistory.map((match) => (
                  <CardMatch key={match.uid} data={match} user={user} />
                ))}
              </div>

              <Link
                href="/dashboard/match?tab=history"
                className="group flex items-center gap-2 mt-2 font-plus-jakarta-sans text-sm md:text-base font-bold text-slate-500 hover:text-black transition-all">
                LIHAT RIWAYAT LENGKAP
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          ) : (
            <EmptyMatchHistory />
          )}
        </div>
      </div>
    </>
  )
}

export default TeamDashboard
