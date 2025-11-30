'use client'

import { IParticipantsBody } from '@/lib/types/team'
import { Square, SquareCheckBig } from 'lucide-react'

type Props = {
    data: IParticipantsBody[]
    setData: (index: number, patch: Partial<IParticipantsBody>) => void
    errors?: Record<number, Partial<Record<keyof IParticipantsBody, string>>>
    onOpenTwibbonModal: (index: number) => void
}

export default function FormRegistrationPlayer({ data, setData, errors = {}, onOpenTwibbonModal }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 w-full max-w-[1176px] px-3 md:px-6">
            {data.map((player, index) => (
                <div key={index} className="flex flex-col gap-6">
                    {/* NAME */}
                    <Field label={`PLAYER ${index + 1} NAME`} error={errors[index]?.participantsName}>
                        <input
                            value={player.participantsName}
                            type="text"
                            placeholder={`Player ${index + 1} name`}
                            className="p-4 bg-white rounded-xs shadow-md border-2"
                            onChange={(e) => setData(index, { participantsName: e.target.value })}
                        />
                    </Field>

                    <Field label={`PLAYER ${index + 1} ROLE`} error={errors[index]?.participantsRoleInTeam}>
                        <select
                            id="participant-role"
                            name="participant-role"
                            value={player.participantsRoleInTeam} // Pastikan value terikat state
                            onChange={(e) => setData(index, { participantsRoleInTeam: e.target.value })}
                            className={`p-4 bg-white rounded-xs shadow-md border-2 font-plus-jakarta-sans text-sm lg:text-base ${
                                player.participantsRoleInTeam === '' ? 'text-gray-400' : 'text-black'
                            }`}
                        >
                            <option value="">-- SELECT --</option>

                            {!data.some((p, i) => p.participantsRoleInTeam === 'LEADER' && i !== index) && (
                                <option value="LEADER" className="text-black">
                                    LEADER
                                </option>
                            )}

                            <option value="MEMBER" className="text-black">
                                MEMBER
                            </option>
                        </select>
                    </Field>

                    <Field label={`PLAYER ${index + 1} IDENTITY IMAGE`} error={errors[index]?.participantsIdentityCardImage}>
                        <input
                            type="file"
                            accept=".jpg, .png, .jpeg"
                            id="participantsImage"
                            name="participantsImage"
                            className="p-4 bg-white rounded-xs shadow-md border-2"
                            onChange={(e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                    setData(index, { participantsIdentityCardImage: file })
                                }
                            }}
                        />
                    </Field>

                    <Field label={`PLAYER ${index + 1} PICTURE AND TWIBBON`} error={errors[index]?.participantsImage}>
                        <button
                            type="button" // Penting: Biar gak submit form
                            key={index}
                            onClick={() => onOpenTwibbonModal(index)}
                            className={`p-4 bg-white rounded-xs shadow-md border-2 flex justify-between items-center cursor-pointer active:bg-gray-100 w-full transition-colors ${
                                data[index]?.participantsImage ? 'border-green-500/50 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500'
                            }`}
                        >
                            <p className="truncate max-w-[85%] font-medium">
                                {data[index]?.participantsImage instanceof File ? data[index].participantsImage.name : 'Setting Picture and Twibbon'}
                            </p>

                            {data[index]?.participantsImage ? (
                                <SquareCheckBig className="text-green-600 w-6 h-6" /> // Icon Sukses
                            ) : (
                                <Square className="text-gray-300 w-6 h-6" /> // Icon Biasa/Kosong
                            )}
                        </button>
                    </Field>

                    <Field label={`PLAYER ${index + 1} TWIBON`} error={errors[index]?.participantsTwibbon}>
                        <input
                            value={player.participantsTwibbon}
                            type="url"
                            placeholder="Link upload twibbon"
                            className="p-4 bg-white rounded-xs shadow-md border-2"
                            onChange={(e) => setData(index, { participantsTwibbon: e.target.value })}
                        />
                    </Field>

                    {/* PHONE */}
                    <Field label={`PLAYER ${index + 1} PHONE`} error={errors[index]?.participantsPhone}>
                        <input
                            value={player.participantsPhone}
                            type="tel"
                            placeholder="08123456789"
                            className="p-4 bg-white rounded-xs shadow-md border-2"
                            onChange={(e) => setData(index, { participantsPhone: e.target.value })}
                        />
                    </Field>
                </div>
            ))}
        </div>
    )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm lg:text-base font-fira-code">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    )
}
