import { FlatParticipant } from "@/lib/types/tournament";
import { BadgeCheck, Building2, ExternalLink, FileImage, Phone, User, X } from "lucide-react";
import Image from "next/image";



export const ParticipantDetailModal = ({ data, onClose }: { data: FlatParticipant; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-500" />
                        Participant Details
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div className="relative h-32 w-32 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-100 shrink-0 mx-auto sm:mx-0">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.image}`} alt={data.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-3">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                                    {data.name}
                                    {data.role === 'LEADER' && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    {data.role} of <span className="text-slate-900 font-bold">{data.teamName}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{data.phone}</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{data.communityName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ID Card Section */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                            <FileImage className="w-4 h-4 text-slate-500" />
                            Identity Card / Student ID
                        </h4>
                        <div className="relative w-full aspect-video bg-slate-100 rounded-xl border border-gray-200 overflow-hidden group">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.idCard}`} alt="ID Card" fill className="object-contain p-2" />
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}${data.idCard}`}
                                target="_blank"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded-lg font-bold text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-white"
                            >
                                <ExternalLink className="w-4 h-4" /> Open Fullsize
                            </a>
                        </div>
                    </div>

                    {/* Twibbon Link */}
                    {data.twibbon && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Twibbon URL</h4>
                            <a
                                href={data.twibbon}
                                target="_blank"
                                className="text-blue-600 hover:underline text-sm truncate block bg-blue-50 p-3 rounded-lg border border-blue-100"
                            >
                                {data.twibbon}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
