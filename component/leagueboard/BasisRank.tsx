import { leaderboard_dumy } from '@/lib'
import Image from 'next/image'
import React from 'react'
import EmptyState from '../ui/Global/not-found-data'

export interface IBasisRankStats {
    comPoint: number
    team: number
}

function BasisRank({ data }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return <EmptyState variant="public" className="w-full max-w-4xl h-auto " title="COMING SOON" description="Arena Pertandingan Robot Segera Tiba... " />
    }
    return (
        <>
            <div className="">
                <h1 className="text-2xl lg:text-3xl font-bold">BASIS RANK</h1>
            </div>
            <div className="w-full max-w-6xl 2xl:max-w-7xl">
                <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                        <div className="grid grid-cols-9 px-4 py-4 font-semibold text-sm bg-[#FBFF00]">
                            <div className="col-span-7">Komunitas</div>
                            <div className="col-span-1 text-center">Komunitas Point</div>
                            <div className="col-span-1 text-center">Total team</div>
                        </div>

                        {data.map((item, i) => (
                            <div key={i} className="grid grid-cols-9 px-4 py-4 items-center hover:bg-gray-50 transition border-b ">
                                <div className="col-span-7 flex items-center gap-4">
                                    <span className="text-lg font-semibold w-6">{item.rank}.</span>
                                    <div className="flex bg-logo-team w-12 h-12 items-center justify-center">
                                        <Image src={item.logo} alt="logo" width={1000} height={1000} className="w-full h-full p-2" />
                                    </div>

                                    <div>
                                        <p className="font-semibold">{item.team}</p>
                                        <p className="text-xs text-gray-500">{item.school}</p>
                                    </div>
                                </div>

                                <div className="col-span-1 text-center">{item.stats.comPoint}</div>
                                <div className="col-span-1 text-center">{item.stats.team}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BasisRank
