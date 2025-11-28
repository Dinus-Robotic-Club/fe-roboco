import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, ChevronRight, Trophy } from 'lucide-react'
import { IGetAllTournaments } from '@/lib/types/type'

// Helper untuk format tanggal (bisa dipindah ke utils)
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const TournamentCard = ({ data }: { data: IGetAllTournaments }) => {
    const router = useRouter()

    // Simulasi status (karena di interface IGetAllTournaments belum ada, kita mock logic-nya)
    // Nanti bisa diganti dengan field asli dari API: data.status
    const isUpcoming = new Date(data.startDate) > new Date()
    const status = isUpcoming ? 'UPCOMING' : 'ONGOING'
    const teamCount = 12 // Mock data, nanti ambil dari data.registrations.length

    return (
        <div
            onClick={() => router.push(`dashboard/tournament/${data.uid}`)}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#FBFF00] transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {data.image ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${data.image}`}
                        alt={data.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <Trophy className="w-12 h-12 text-slate-300" />
                    </div>
                )}

                {/* Status Badge - Floating */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                            status === 'UPCOMING' ? 'bg-slate-900 text-white border-slate-900' : 'bg-[#FBFF00] text-black border-[#FBFF00]'
                        }`}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-slate-700 transition-colors">{data.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{'No description provided.'}</p>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {formatDate(data.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="truncate">{data.location}</span>
                        </div>
                    </div>
                </div>

                {/* Footer: Stats & Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{teamCount} Teams</span>
                    </div>

                    <div className="flex items-center text-sm font-bold text-slate-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Manage <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TournamentCard
