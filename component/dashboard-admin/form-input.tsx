'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { generateSlug } from '@/lib/func'
import { ICreateTournament, StageType, PlayoffType } from '@/lib/types/type'
import { DialogClose, DialogContent } from '@/components/ui/dialog'
import React from 'react'

interface Props {
    isForm: ICreateTournament
    setIsForm: React.Dispatch<React.SetStateAction<ICreateTournament>>
    isStage: StageType | null
    setIsStage: React.Dispatch<React.SetStateAction<StageType | null>>
    submitForm: (e: React.FormEvent<HTMLFormElement>) => void
    isPending: boolean
}

const FormInputTurney = ({ isForm, setIsForm, isStage, setIsStage, submitForm, isPending }: Props) => {
    const handleChangeSlug = (name: string) => {
        setIsForm({ ...isForm, name, slug: generateSlug(name) })
    }

    return (
        <DialogContent className="bg-white p-6 rounded-lg" variant={'yellow'}>
            <form onSubmit={submitForm}>
                <DialogHeader className="items-center mt-5 mb-5">
                    <DialogTitle className="text-2xl">Buat Turnamen</DialogTitle>
                </DialogHeader>

                <div className="w-full grid sm:grid-cols-3 grid-cols-1 gap-4">
                    {/* NAME */}
                    <div className="grid">
                        <label className="text-lg font-bold">Nama Turnamen</label>
                        <input
                            value={isForm.name as string}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                            onChange={(e) => handleChangeSlug(e.target.value)}
                            placeholder=" DN ROBOCO 2025"
                        />
                    </div>

                    {/* SLUG */}
                    <div className="grid">
                        <label className="text-lg font-bold">Slug</label>
                        <input readOnly value={isForm.slug as string} className="p-3 bg-gray-100 rounded-xs shadow-md outline-none" />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="grid">
                        <label className="text-lg font-bold">Deskripsi (opsional)</label>
                        <input
                            value={isForm.description ?? ''}
                            onChange={(e) => setIsForm({ ...isForm, description: e.target.value })}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                            placeholder="bla bla bla"
                        />
                    </div>

                    <div className="grid">
                        <label className="text-lg font-bold">Lokasi (opsional)</label>
                        <input
                            value={isForm.location ?? ''}
                            onChange={(e) => setIsForm({ ...isForm, location: e.target.value })}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                            placeholder="Udinus Gedung I"
                        />
                    </div>

                    {/* IMAGE */}
                    <div className="grid">
                        <label className="text-lg font-bold">Gambar Turnamen</label>
                        <input
                            type="file"
                            accept=".jpg, .png, .jpeg"
                            onChange={(e) => {
                                const f = (e.target as HTMLInputElement).files?.[0]
                                if (f) setIsForm({ ...isForm, image: f })
                            }}
                            className="p-3 bg-white rounded-xs shadow-md outline-none w-full"
                        />
                    </div>

                    {/* START DATE */}
                    <div className="grid">
                        <label className="text-lg font-bold">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={isForm.startDate}
                            onChange={(e) => setIsForm({ ...isForm, startDate: e.target.value })}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                        />
                    </div>

                    {/* END DATE */}
                    <div className="grid">
                        <label className="text-lg font-bold">Tanggal Berakhir</label>
                        <input
                            type="date"
                            value={isForm.endDate ?? ''}
                            onChange={(e) => setIsForm({ ...isForm, endDate: e.target.value })}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                        />
                    </div>

                    {/* STAGE TYPE */}
                    <div className="grid">
                        <label className="text-lg font-bold">Tipe Stage</label>

                        <select
                            value={isForm.stageType ?? ''}
                            onChange={(e) => {
                                const value = e.target.value as StageType
                                setIsForm({ ...isForm, stageType: value })
                                setIsStage(value)
                            }}
                            className="p-3 bg-white rounded-xs shadow-md outline-none"
                        >
                            <option value="">-- SELECT --</option>
                            <option value="SINGLE_STAGE">SINGLE STAGE</option>
                            <option value="DOUBLE_STAGE">DOUBLE STAGE</option>
                        </select>
                    </div>

                    {/* PLAYOFF TYPE */}
                    {isStage === StageType.DOUBLE_STAGE && (
                        <div className="grid">
                            <label className="text-lg font-bold">Tipe Playoff</label>

                            <select
                                value={isForm.playoffType ?? ''}
                                onChange={(e) =>
                                    setIsForm({
                                        ...isForm,
                                        playoffType: e.target.value as PlayoffType,
                                    })
                                }
                                className="p-3 bg-white rounded-xs shadow-md outline-none"
                            >
                                <option value="">-- SELECT --</option>
                                <option value="SINGLE_ELIM">SINGLE ELIMINATION</option>
                                <option value="DOUBLE_ELIM">DOUBLE ELIMINATION</option>
                            </select>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-8 pr-7">
                    <DialogClose asChild>
                        <Button variant="outline">Batalkan</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Tournament'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default FormInputTurney
