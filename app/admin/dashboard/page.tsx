'use client'

import Card from '@/component/dashboard-admin/card'
import FormInputTurney from '@/component/dashboard-admin/form-input'
import Loader from '@/component/ui/Global/loader'
import EmptyState from '@/component/ui/Global/not-found-data'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { useCreateTournament } from '@/hooks/mutations/tournament-mutations'
import { useTournaments } from '@/hooks/queries/useTournaments'
import { ICreateTournament, StageType } from '@/lib/types/type'
import { Search, Trophy } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const Page = () => {
    const { data, isLoading, isError } = useTournaments()
    const { mutate, isPending } = useCreateTournament()
    const params = useSearchParams()
    const error = params.get('error')
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [isStage, setIsStage] = useState<StageType | null>(null)
    const [isForm, setIsForm] = useState<ICreateTournament>({
        name: '',
        slug: '',
        stageType: null,
        startDate: '',
        description: '',
        endDate: '',
        image: null,
        location: '',
        playoffType: null,
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData()

        Object.entries(isForm).forEach(([key, value]) => {
            if (value === null || value === undefined) return

            if (value instanceof File) {
                formData.append(key, value)
                return
            }

            formData.append(key, String(value))
        })

        mutate(formData, {
            onSuccess: () => setIsDialogOpen(false),
        })
    }

    const filteredData = data?.data?.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (isLoading) return <Loader show />

    if (isError) return <EmptyState />

    if (error === 'unauthorized') {
        toast.error('UNAUTHORIZED: Kamu tidak dapat mengakses halaman tersebut')

        const newParams = new URLSearchParams(params.toString())
        newParams.delete('error')

        router.replace(`?${newParams.toString()}`)
    }

    return (
        <div className="w-full min-h-screen bg-grid flex flex-col">
            <HeaderDashboard title="DASHBOARD" name="Admin" />

            <main className="w-full flex-1 p-4 md:p-6 mb-20">
                {/* Section Toolbar */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <p className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Tournament List</p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari turnamen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>

                        {/* Button Create */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#FBFF00] text-black hover:bg-[#e6eb00] font-semibold">+ Buat Turnamen</Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden">
                                {/* Dialog Title for Accessibility */}
                                <DialogTitle className="sr-only">Form Buat Turnamen</DialogTitle>

                                <FormInputTurney isForm={isForm} setIsForm={setIsForm} isStage={isStage} setIsStage={setIsStage} submitForm={submitForm} isPending={isPending} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Grid Card */}
                <div className="max-w-7xl mx-auto">
                    {filteredData && filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 w-full animate-in fade-in zoom-in-95 duration-500">
                            {filteredData.map((t) => (
                                <Card data={t} key={t.uid} />
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <Trophy className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{searchQuery ? 'Tidak ditemukan' : 'Belum ada Turnamen'}</h3>
                            <p className="text-gray-500 text-sm max-w-sm text-center">
                                {searchQuery
                                    ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain.`
                                    : 'Mulai buat kompetisi pertamamu dengan menekan tombol Buat Turnamen di atas.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Page
