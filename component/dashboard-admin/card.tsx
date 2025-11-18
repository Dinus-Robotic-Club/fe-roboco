// Card.tsx
import { IGetAllTournaments } from '@/lib/types'

const Card = ({ data }: { data: IGetAllTournaments }) => {
    return (
        <div className="bg-white rounded-2xl hover:shadow-sm hover:cursor-pointer border border-gray-100 overflow-hidden shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full">
            {/* Thumbnail Placeholder (Clean Yellow Accent) */}
            <div className="w-full h-48 bg-yellow-50 flex items-center justify-center">
                <div className="bg-yellow-100 rounded-full p-4 text-yellow-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">{data.name}</h2>

                {/* Subtle Details */}
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        15 Nov 2025 • 14:00 WIB
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Stadion Utama
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
