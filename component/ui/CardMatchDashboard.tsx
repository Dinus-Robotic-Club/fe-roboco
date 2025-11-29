import { IMatchHistory } from '@/lib/types/team'
import { Minus, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog' // Sesuaikan import Shadcn kamu
import { useMediaQuery } from '@/hooks/function/useMobile'
import { MatchDetailContent } from '../match/matchDetail'

// Props ditambah isActive dan onToggle
interface CardProps {
    data: IMatchHistory
    isActive: boolean // Apakah card ini sedang terbuka?
    onToggle: () => void // Fungsi untuk buka/tutup
}

function CardMatchDashboard({ data, isActive, onToggle }: CardProps) {
    // Deteksi layar desktop (min-width: 768px adalah md tailwind)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    // Helper Score & Image
    const scoreA = data.teamA.score?.[0]?.golScore ?? 0
    const scoreB = data.teamB.score?.[0]?.golScore ?? 0
    const getImageUrl = (path: string | null | undefined) => (path ? `${process.env.NEXT_PUBLIC_API_URL}${path}` : '/logo-only.svg')

    // Handler Klik
    const handleClick = () => {
        onToggle()
    }

    return (
        <>
            <div
                onClick={handleClick}
                className={`max-w-6xl w-full flex flex-col bg-transparent  
                 transition-all cursor-pointer overflow-hidden group
                ${isActive && isDesktop ? 'ring-2 ring-black' : ''}`}
            >
                {/* --- MAIN CARD CONTENT --- */}
                <div className="flex flex-col w-full py-8 lg:py-7 px-3 sm:px-5 md:px-10 lg:px-3 gap-5">
                    <div className="w-full flex gap-5 flex-col lg:flex-row justify-center lg:grid grid-cols-5 items-center relative">
                        {/* Indikator Chevron (Opsional - Pemanis UI) */}
                        <div className={`absolute right-0 top-0 lg:hidden transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                            <ChevronDown className="text-gray-400" />
                        </div>

                        {/* --- TEAM A --- */}
                        <div className="flex w-auto gap-3 sm:gap-5 lg:flex-row-reverse justify-start col-span-2">
                            <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center overflow-hidden">
                                <Image src={getImageUrl(data.teamA.logo)} alt={data.teamA.name} height={30} width={30} className="w-full h-full object-contain p-2" unoptimized />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-xl md:text-2xl font-extrabold lg:text-end line-clamp-1 uppercase">{data.teamA.name}</h1>
                                <p className="text-base lg:text-lg text-[#888888] text-start lg:text-end line-clamp-1 capitalize">
                                    {data.teamA.community?.name ?? 'Unknown Community'}
                                </p>
                            </div>
                        </div>

                        {/* --- SCORE (DESKTOP) --- */}
                        <div className="gap-5 items-center font-fira-code hidden lg:flex col-span-1 justify-center">
                            <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] flex items-center justify-center">{scoreA}</p>
                            <Minus />
                            <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] flex items-center justify-center">{scoreB}</p>
                        </div>

                        {/* --- TEAM B --- */}
                        <div className="flex gap-3 sm:gap-5 justify-start col-span-2">
                            <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center overflow-hidden">
                                <Image src={getImageUrl(data.teamB.logo)} alt={data.teamB.name} height={30} width={30} className="w-full h-full object-contain p-2" unoptimized />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-xl md:text-2xl font-extrabold text-start line-clamp-1 uppercase">{data.teamB.name}</h1>
                                <p className="text-base lg:text-lg text-[#888888] text-start line-clamp-1 capitalize">{data.teamB.community?.name ?? 'Unknown Community'}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- SCORE (MOBILE) --- */}
                    <div className="flex flex-col justify-between lg:hidden font-plus-jakarta-sans text-lg sm:text-2xl md:text-3xl items-center gap-2">
                        <div className="flex gap-4">
                            <p className="font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">{scoreA}</p>
                            <p className="font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">{scoreB}</p>
                        </div>
                    </div>
                </div>

                {isDesktop && (
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <MatchDetailContent data={data} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* --- MODAL DIALOG (MOBILE ONLY) --- */}
            {/* Logic: Render dialog hanya jika TIDAK desktop dan sedang Active */}
            {!isDesktop && (
                <Dialog open={isActive} onOpenChange={(open) => !open && onToggle()}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-center font-bold uppercase">Match Summary</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center items-center gap-4 py-4 border-b border-gray-100 mb-4">
                            {/* Score Header di Modal */}
                            <div className="text-center">
                                <div className="font-bold text-xl">{data.teamA.name}</div>
                                <div className="text-4xl font-mono font-bold">{scoreA}</div>
                            </div>
                            <div className="text-gray-400">VS</div>
                            <div className="text-center">
                                <div className="font-bold text-xl">{data.teamB.name}</div>
                                <div className="text-4xl font-mono font-bold">{scoreB}</div>
                            </div>
                        </div>
                        {/* Reuse Content Component */}
                        <MatchDetailContent data={data} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default CardMatchDashboard
