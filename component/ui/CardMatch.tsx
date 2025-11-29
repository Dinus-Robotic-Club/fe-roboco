import Image from 'next/image'

export type statusType = 'FINISHED' | 'PENDING' | 'SCHEDULE' | 'ONGOING' | 'CANCELLED'
export interface ICardMatch {
    uid: string
    bestOf: number
    scoreA: number
    scoreB: number
    status: statusType
    roundLabel: string
    category: string
    teamA: ITeamMatch
    teamB: ITeamMatch
    group: IGroupMatch
}

export interface ITeamMatch {
    name: string
    logo: string
    community: ICommunityMatch
}

export interface ICommunityMatch {
    name: string
}
export interface IGroupMatch {
    name: string
}

export interface ICardMatchResp {
    data: ICardMatch[]
}

export default function CardMatch({ data }: { data: ICardMatch }) {
    return (
        <>
            <div className="w-full py-6 px-3 flex-col items-center justify-between rounded-2xl bg-white shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] lg:bg-transparent lg:shadow-none">
                <p className="mb-6 text-gray-700 font-medium tracking-wide text-center block lg:hidden">
                    {data?.roundLabel} | {data?.category}
                </p>
                <div className="w-full flex lg:flex-col items-center justify-between">
                    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 items-center lg:w-full lg:max-w-6xl">
                        <div className="flex flex-row-reverse lg:flex-row items-center gap-4 justify-end col-span-2">
                            <div className="flex flex-col lg:text-right">
                                <h1 className="text-xl font-bold line-clamp-1">{data?.teamA.name}</h1>
                                <p className="text-sm text-gray-600 line-clamp-1">{data?.teamA.community.name}</p>
                            </div>

                            <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamA.logo}`}
                                    alt={data?.teamA.name as string}
                                    height={30}
                                    width={30}
                                    className="w-auto h-auto p-2"
                                />
                            </div>

                            <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">{data?.scoreA}</p>
                        </div>

                        <div className="hidden lg:flex justify-center col-span-1">
                            <Image src="/logo-only.svg" alt="Center Logo" width={50} height={50} className="w-20" />
                        </div>

                        <div className="flex items-center gap-4 justify-start col-span-2 ">
                            <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">{data?.scoreB}</p>

                            <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamB.logo}`}
                                    alt={data?.teamB.name as string}
                                    height={30}
                                    width={30}
                                    className="w-auto h-auto p-2"
                                />
                            </div>

                            <div className="flex flex-col text-left">
                                <h1 className="text-xl font-bold line-clamp-1">{data?.teamB.name}</h1>
                                <p className="text-sm text-gray-600 line-clamp-1">{data?.teamB.community.name}</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-gray-700 font-medium  tracking-wider hidden lg:flex">
                        {data?.roundLabel} | {data?.category}
                    </p>
                    <div className="flex flex-col justify-between lg:hidden font-plus-jakarta-sans text-lg sm:text-2xl md:text-3xl gap-6">
                        <p className=" font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">{data?.scoreA}</p>
                        <p className=" font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">{data?.scoreB}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
