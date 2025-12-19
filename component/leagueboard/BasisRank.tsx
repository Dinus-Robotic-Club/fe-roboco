import Image from 'next/image'
import EmptyState from '../ui/Global/not-found-data'
import { ICommunity } from '@/lib/types/community'

function BasisRank({ data }: { data?: ICommunity[] }) {
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
              <div className="col-span-1 text-center">Total team</div>
              <div className="col-span-1 text-center">Komunitas Point</div>
            </div>

            {data?.map((item, i) => (
              <div key={i} className="grid grid-cols-9 px-4 py-4 items-center hover:bg-gray-50 transition border-b ">
                <div className="col-span-7 flex items-center gap-4">
                  <span className="text-lg font-semibold w-6">{item.rank}.</span>
                  <div className="flex bg-logo-team w-15 h-15 items-center justify-center">
                    <Image src={`${process.env.NEXT_PUBLIC_API_URL}${item.team[0]?.logo || ''}`} alt="logo" width={1000} height={1000} className="w-full h-full p-2 object-contain" unoptimized />
                  </div>

                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.team[0]?.name || ''}</p>
                  </div>
                </div>

                <div className="col-span-1 text-center">{item.team.length}</div>
                <div className="col-span-1 text-center">{item.comPoint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default BasisRank
