import Image from 'next/image'
import React from 'react'
import CardMatch from '../ui/CardMatch'
import { DashboardTeamData } from '@/lib/types/team'

function TeamDashboard({ data }: { data: DashboardTeamData }) {
    const items = [1, 2, 3]

    return (
        <>
            <div className="">
                <h1 className="text-2xl lg:text-3xl font-bold">TEAM DASHBOARD</h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-24">
                <div className="flex flex-col justify-between gap-16 md:gap-20 lg:gap-0 md:h-[400px]">
                    <div className="flex w-full gap-2 justify-center lg:justify-start">
                        <div className="bg-logo-team w-[70px] h-[70px]">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.team.logo}`} alt="" height={30} width={30} className="w-full h-full p-2 " />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-3xl lg:text-4xl font-bold">{data?.team?.name}</h1>
                            <p className="text-base lg:text-xl">{data?.team?.community?.name} Community</p>
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
                    {data.team.participants?.map((pt, index) => (
                        <div key={pt.uid} className="flex flex-col items-center">
                            <div className="bg-player min-h-[215px] min-w-[215px]">
                                <Image
                                    className="h-80 w-auto pb-2 pl-3"
                                    alt={pt.name}
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${pt.identityCardImage}`}
                                    height={300}
                                    width={200}
                                    unoptimized
                                />
                            </div>

                            <h1 className="text-2xl font-bold">Player {index + 1}</h1>
                            <p>{pt.roleInTeam === 'LEADER' ? 'Team Leader' : 'Team Member'}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-20 mt-8 py-5 w-full items-center justify-center">
                <h1 className="text-xl">MATCH HISTORY</h1>
                <div className="w-full  flex flex-col items-center justify-center gap-3">
                    {items.map((items) => (
                        <CardMatch key={items} />
                    ))}
                    <a href="/dashboard/match/history" className="font-plus-jakarta-sans mt-7 text-base md:text-xl">
                        WATCH FULL MATCH HISTORY →
                    </a>
                </div>
            </div>
        </>
    )
}

export default TeamDashboard
