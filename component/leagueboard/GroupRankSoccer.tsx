import Image from 'next/image'
import EmptyState from '../ui/Global/not-found-data'
import { IGroupData } from '@/lib/types/group'

function GroupRankSoccer({ data }: { data: IGroupData[] }) {
  const filteredData = data.filter((group) => group.teams.map((team) => team.team.category === 'SOCCER').includes(true))

  if (!filteredData || filteredData.length === 0) {
    return <EmptyState variant="public" className="w-full max-w-4xl h-auto " title="COMING SOON" description="Arena Pertandingan Robot Segera Tiba... " />
  }

  return (
    <div className="w-full flex flex-col items-center font-plus-jakarta-sans overflow-x-auto">
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">GROUP RANK SOCCER</h1>
      </div>

      <div className="grid gap-10 w-full max-w-7xl mt-16 grid-cols-1 xl:grid-cols-2">
        {filteredData.map((group, i) => (
          <div key={i} className="w-full mb-5">
            <h2 className="text-lg font-bold mb-4">{group.name}</h2>

            <div className="overflow-x-auto">
              <div className="min-w-[700px] lg:min-w-auto">
                <div className="grid grid-cols-12 px-3 py-3 text-xs font-semibold bg-[#FBFF00]">
                  <div className="col-span-7">TEAM</div>
                  <div className="col-span-1 text-center">MP</div>
                  <div className="col-span-1 text-center">GS</div>
                  <div className="col-span-1 text-center">GC</div>
                  <div className="col-span-1 text-center">GD</div>
                  <div className="col-span-1 text-center">P</div>
                </div>

                {group.teams.map((team, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-3 py-3 items-center border-b hover:bg-gray-50 transition">
                    <div className="col-span-7 flex items-center gap-3">
                      <div className="flex bg-logo-team w-14 h-14 items-center justify-center">
                        <Image src={`${process.env.NEXT_PUBLIC_API_URL}${team.team.logo || ''}`} alt="logo" width={1000} height={1000} className="w-full h-full p-2 object-contain" unoptimized />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{team.team.name}</p>
                        <p className="text-xs text-gray-500 leading-tight">{team.team.community?.name}</p>
                      </div>
                    </div>

                    <div className="col-span-1 text-center">{team.matchPlay}</div>
                    <div className="col-span-1 text-center">{team.golScore}</div>
                    <div className="col-span-1 text-center">{team.golConceded}</div>
                    <div className="col-span-1 text-center">{team.golDifferent}</div>
                    <div className="col-span-1 text-center font-bold">{team.point}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupRankSoccer
