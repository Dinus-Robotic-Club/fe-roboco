import { IMatchHistory } from '@/lib/types/team'
import { Calendar, MapPin } from 'lucide-react'

// Komponen isi detail (Statistik, Tanggal, dll)
export const MatchDetailContent = ({ data }: { data: IMatchHistory }) => {
    return (
        <div className="p-6 bg-gray-50 border-t border-dashed border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">Match Details</h3>
                    <div className="flex items-center text-sm text-gray-500 gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(data.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{data.category} Arena</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">Statistics</h3>
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Knockout</span>
                        <div className="flex gap-8 font-mono font-bold">
                            <span>{data.teamA.score?.[0]?.knockout ? 'YES' : 'NO'}</span>
                            <span>{data.teamB.score?.[0]?.knockout ? 'YES' : 'NO'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
