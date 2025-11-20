'use client'

import Card from '@/component/dashboard-admin/card'
import Navbar from '@/component/ui/Global/Navbar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateTournament } from '@/hooks/mutations/tournament-mutations'
import { useTournaments } from '@/hooks/queries/useTournaments'
import { nav_admin } from '@/lib'
import { generateSlug } from '@/lib/func'
import { IBodyCreateTournament, PlayoffType, StageType } from '@/lib/types/type'
import { useState } from 'react'
const Page = () => {
    const { data, isLoading, isError } = useTournaments()
    const createTournament = useCreateTournament()

    // const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isStage, setIsStage] = useState<StageType | null>(null)
    const [isForm, setIsForm] = useState<IBodyCreateTournament>({
        data: {
            name: '',
            slug: '',
            stageType: null,
            startDate: '',
            description: '',
            endDate: '',
            image: null,
            location: '',
            playoffType: null,
        },
    })

    console.log(isForm)

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault()

        // setIsLoading(true)
        createTournament.mutate(isForm as IBodyCreateTournament)
    }

    const handleChangeSlug = (name: string) => {
        setIsForm((prev) => ({
            data: {
                ...prev.data,
                name,
                slug: generateSlug(name),
            },
        }))
    }

    if (isLoading) return <p>Loading tournaments...</p>
    if (isError) return <p>Error fetching tournaments</p>
    return (
        <div className="w-full min-h-screen bg-grid">
            <Navbar left={nav_admin.left} right={nav_admin.right} />
            <div className="h-[300px] md:h-[400px] mb-10 bg-white w-full flex flex-col justify-center items-center pt-[70px] 2xl:pt-20 font-plus-jakarta-sans shadow-2xl">
                <div className="absolute top-50">
                    <h1 className="text-5xl font-bold text-center">ADMIN ZONE</h1>
                    <p className="text-center text-2xl mt-1">carefull to make any decision here</p>
                </div>
            </div>
            <main className=" w-full p-4 md:p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {data?.data?.map((t) => (
                        <Card data={t} key={t.uid} />
                    ))}
                </div>

                <div className="flex justify-center items-center mt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Buat Turnamen</Button>
                        </DialogTrigger>
                        <DialogContent variant={'yellow'}>
                            <form onSubmit={submitForm}>
                                <DialogHeader className="items-center mt-5 mb-5">
                                    <DialogTitle className="text-2xl">Buat Turnamen</DialogTitle>
                                </DialogHeader>
                                <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-2 ">
                                    <div className="grid">
                                        <Label htmlFor="name-id" className="text-lg font-bold">
                                            Nama Turnamen
                                        </Label>
                                        <Input
                                            id="name-id"
                                            name="nama"
                                            value={isForm?.data.name as string}
                                            onChange={(e) => handleChangeSlug(e.target.value)}
                                            placeholder="contoh: DN ROBOCO 2025"
                                        />
                                    </div>
                                    <div className="grid ">
                                        <Label htmlFor="slug-id" className="text-lg font-bold">
                                            Slug
                                        </Label>
                                        <Input id="slug-id" name="slug" readOnly value={isForm?.data.slug as string} onChange={(e) => handleChangeSlug(e.target.value)} />
                                    </div>
                                    <div className="grid ">
                                        <Label htmlFor="deskripsi-1" className="text-lg font-bold">
                                            Deskripsi (opsional)
                                        </Label>
                                        <Input
                                            id="deskripsi-id"
                                            name="deskripsi"
                                            value={isForm?.data.description as string}
                                            onChange={(e) =>
                                                setIsForm((prev) => ({
                                                    data: { ...prev.data, description: e.target.value },
                                                }))
                                            }
                                            placeholder="contoh: Ini adalah deskripsi turnamen"
                                        />
                                    </div>
                                    <div className="grid">
                                        <Label htmlFor="start-date-id" className="text-lg font-bold">
                                            Tanggal Mulai
                                        </Label>
                                        <Input
                                            id="start-date-id"
                                            name="start-date"
                                            type="date"
                                            value={isForm?.data.startDate as string}
                                            onChange={(e) =>
                                                setIsForm((prev) => ({
                                                    data: { ...prev.data, startDate: e.target.value },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="grid">
                                        <Label htmlFor="start-date-id" className="text-lg font-bold">
                                            Tanggal Berakhir (opsional)
                                        </Label>
                                        <Input
                                            id="start-date-id"
                                            name="start-date"
                                            type="date"
                                            value={isForm?.data.endDate as string}
                                            onChange={(e) =>
                                                setIsForm((prev) => ({
                                                    data: { ...prev.data, endDate: e.target.value },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="grid">
                                        <Label htmlFor="start-date-id" className="text-lg font-bold">
                                            Tipe Stage
                                        </Label>
                                        <Select
                                            value={isForm?.data.stageType as StageType}
                                            onValueChange={(value) => {
                                                setIsForm((e) => ({
                                                    data: { ...e.data, stageType: value as StageType },
                                                }))
                                                setIsStage(value as StageType)
                                            }}
                                        >
                                            <SelectTrigger className="w-full py-6 shadow-lg">
                                                <SelectValue placeholder="Select a stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Stage</SelectLabel>
                                                    <SelectItem value="SINGLE_STAGE">Single Stage</SelectItem>
                                                    <SelectItem value="DOUBLE_STAGE">Double Stage</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {isStage === StageType.DOUBLE_STAGE ? (
                                        <div className="grid">
                                            <Label htmlFor="start-date-id" className="text-lg font-bold">
                                                Tipe Playoff
                                            </Label>
                                            <Select
                                                value={isForm?.data.playoffType as PlayoffType}
                                                onValueChange={(value) =>
                                                    setIsForm((e) => ({
                                                        data: { ...e.data, playoffType: value as PlayoffType },
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="w-full py-6 shadow-lg">
                                                    <SelectValue placeholder="Select a stage" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Playoff</SelectLabel>
                                                        <SelectItem value="SINGLE_ELIM">Single Elimination</SelectItem>
                                                        <SelectItem value="DOUBLE_ELIM">Double Elimination</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : null}
                                </div>

                                <DialogFooter className="px-10 mt-5">
                                    <DialogClose asChild>
                                        <Button variant="outline">Batalkan</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={createTournament.isPending}>
                                        {createTournament.isPending ? 'Creating...' : 'Create Tournament'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    )
}

export default Page
