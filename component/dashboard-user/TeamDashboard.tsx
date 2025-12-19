import Image from 'next/image'
import { ArrowRight, Swords } from 'lucide-react'
import CardMatch from '../ui/CardMatch'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'

function TeamDashboard({ data }: { data: DashboardTeamData }) {
  const { user } = useAuth()
  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">TEAM DASHBOARD</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex flex-col justify-between gap-16 md:gap-20 lg:gap-0 md:h-[400px]">
          <div className="flex w-full gap-2 justify-center lg:justify-start">
            <div className="bg-logo-team w-[70px] h-[70px]">
              <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.team.logo}`} alt="team-logo" height={10000} width={10000} className="w-full h-full p-2 " />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl lg:text-4xl font-bold">{data?.team?.name}</h1>
              <p className="text-base lg:text-xl">{data?.team?.community?.name} </p>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="w-full grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl"># {data?.communityStanding?.rank}</h1>
                <p className="text-base">Community Standings</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl"># {`${data?.groupStanding?.groupRank ?? '-'} `}</h1>
                <p className="text-base">Group Standings</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl">{data.stats.matchWins}</h1>
                <p className="text-base">Game Win</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl">{data.stats.matchLoses}</h1>
                <p className="text-base">Game Lose</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl">{data.stats.totalGolScore}</h1>
                <p className="text-base">Goal Scored</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="font-bold text-4xl">{data.stats.totalGolConceded}</h1>
                <p className="text-base">Goal Conceded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-12 items-end justify-center flex-wrap lg:flex-nowrap">
          {data.team.participants?.map((pt: IParticipant) => (
            <div key={pt.uid} className="flex flex-col items-center">
              <div className="bg-player h-[215px] w-[215px]">
                <Image className="w-full h-full pb-2 " alt={pt.name} src={`${process.env.NEXT_PUBLIC_API_URL}${pt.image}`} height={1000} width={1000} />
              </div>

              <h1 className="text-2xl font-bold">{pt.name}</h1>
              <p>{pt.roleInTeam === 'LEADER' ? 'Team Leader' : 'Team Member'}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-20 mt-8 py-5 w-full items-center justify-center">
        <h1 className="text-xl">MATCH HISTORY</h1>
        <div className="w-full flex flex-col items-center  gap-6">
          {data.matchHistory.length > 0 ? (
            <>
              <div className="w-full flex flex-col items-center justify-center  gap-7">
                {data.matchHistory.map((dat) => (
                  <CardMatch key={dat.uid} data={dat} user={user} />
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
            <div className="w-full flex flex-col items-center justify-center py-12 px-4 md:py-20 text-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 md:mb-6">
                <Swords className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2">Belum Ada Pertandingan</h3>
              <p className="text-sm md:text-base text-slate-500 max-w-[250px] md:max-w-md leading-relaxed">Tim ini belum memiliki riwayat pertandingan yang tercatat dalam sistem.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TeamDashboard
