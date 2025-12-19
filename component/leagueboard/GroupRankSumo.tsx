import Image from 'next/image'
import EmptyState from '../ui/Global/not-found-data'
import { IGroupData } from '@/lib/types/group'

function GroupRankSumo({ data }: { data: IGroupData[] }) {
  const filteredData = data?.filter((group) => group.teams.map((team) => team.team.category === 'SUMO').includes(true))

  if (!filteredData || filteredData.length === 0) {
    return <EmptyState variant="public" className="w-full max-w-4xl h-auto " title="COMING SOON" description="Arena Pertandingan Robot Segera Tiba... " />
  }
  return (
    <div className="w-full flex flex-col items-center font-plus-jakarta-sans overflow-x-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">GROUP RANK SUMO</h1>
      </div>

      <div className="grid gap-10 w-full max-w-7xl mt-16 grid-cols-1 xl:grid-cols-2">
        {filteredData.map((group, i) => (
          <div key={i} className="w-full mb-5">
            <h2 className="text-lg font-bold mb-4">{group.name}</h2>

            <div className="overflow-x-auto">
              <div className="min-w-[700px] lg:min-w-full">
                {/* HEADER */}
                <div className="grid grid-cols-12 px-3 py-3 text-xs font-semibold bg-[#FBFF00]">
                  <div className="col-span-7">TEAM</div>
                  <div className="col-span-1 text-center">MP</div>
                  <div className="col-span-1 text-center">KS</div>
                  <div className="col-span-1 text-center">KC</div>
                  <div className="col-span-1 text-center">KD</div>
                  <div className="col-span-1 text-center">P</div>
                </div>

                {/* ROWS */}
                {group.teams.map((team, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-3 py-3 items-center border-b hover:bg-gray-50 transition">
                    <div className="col-span-7 flex items-center gap-3">
                      <div className="flex bg-logo-team w-12 h-12 items-center justify-center">
                        <Image src={team.team.logo as string} alt={team.team.name} width={32} height={32} className="w-full h-full p-2 object-contain" />
                      </div>

                      <div>
                        <p className="font-semibold text-sm">{team.team.name}</p>
                        <p className="text-xs text-gray-500 leading-tight">{team.team.community?.name}</p>
                      </div>
                    </div>

                    <div className="col-span-1 text-center">{team.matchPlay}</div>
                    <div className="col-span-1 text-center">{team.knockoutScore}</div>
                    <div className="col-span-1 text-center">{team.knockoutConceded}</div>
                    <div className="col-span-1 text-center">{team.knockoutDifferent}</div>
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

export default GroupRankSumo
