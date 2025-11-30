import { Registration, RegistrationStatus } from '@/lib/types/type'
import { BadgeCheck, CreditCard, Phone, User, Users, X } from 'lucide-react'
import Image from 'next/image'
import { StatusBadge } from './team'

export const DetailModal = ({
    registration,
    onClose,
    onUpdateStatus,
    formatDate,
}: {
    registration: Registration
    onClose: () => void
    onUpdateStatus: (uid: string, s: RegistrationStatus) => void
    formatDate: (d: string) => string
}) => {
    if (!registration) return null
    const { team } = registration

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${team.logo}`} alt={team.name} fill className="object-cover" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{team.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>UID: {registration.uid.split('-')[0]}...</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{formatDate(registration.registeredAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={registration.status} />
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Team Info & Invoice */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4">
                                    <Users className="w-4 h-4 text-slate-500" />
                                    Team Information
                                </h3>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-slate-500 text-xs">Category</dt>
                                        <dd className="font-medium text-slate-900">{team.category}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 text-xs">Community / School</dt>
                                        <dd className="font-medium text-slate-900">{team.community?.name || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 text-xs">Email Contact</dt>
                                        <dd className="font-medium text-slate-900 truncate">{team.email}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                    Payment Invoice
                                </h3>
                                <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-slate-100 aspect-[3/4] cursor-pointer">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${registration.invoice}`}
                                        alt="Invoice"
                                        fill
                                        className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}${registration.invoice}`}
                                        target="_blank"
                                        className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 text-xs font-bold"
                                    >
                                        View Original
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Participants */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <User className="w-4 h-4 text-slate-500" />
                                    Participants ({team.participants.length})
                                </h3>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Click card for details</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {team.participants.map((member) => (
                                    <div
                                        key={member.uid}
                                        className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FBFF00] hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="relative h-14 w-14 rounded-full overflow-hidden border border-gray-100 bg-slate-50 flex-shrink-0">
                                                <Image src={`${process.env.NEXT_PUBLIC_API_URL}${member.image}`} alt={member.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                                                    {member.roleInTeam === 'LEADER' && <BadgeCheck className="w-4 h-4 text-[#d4b904]" fill="#FBFF00" />}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1">
                                                    <span
                                                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                                                            member.roleInTeam === 'LEADER' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {member.roleInTeam}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{member.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Action: View ID Card */}
                                        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] text-slate-400">Identity Card</span>
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_API_URL}${member.identityCardImage}`}
                                                target="_blank"
                                                className="text-xs font-bold text-blue-600 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Image
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-gray-200 flex justify-end gap-3">
                    {registration.status === 'PENDING' ? (
                        <>
                            <button
                                onClick={() => onUpdateStatus(registration.uid, 'REJECTED')}
                                className="px-4 py-2 text-sm font-bold text-rose-700 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 shadow-sm transition-all"
                            >
                                Reject Registration
                            </button>
                            <button
                                onClick={() => onUpdateStatus(registration.uid, 'APPROVED')}
                                className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
                            >
                                Verify & Approve
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-slate-500 px-4">
                            <span>Status:</span>
                            <span className="font-bold text-slate-900">{registration.status}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
