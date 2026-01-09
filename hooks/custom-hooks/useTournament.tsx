'use client'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import { useCreateTournament } from '../useCreateTournament'
import { useGetTournaments } from '../useGetTournaments'

export const useTournamentLogic = () => {
  const router = useRouter()
  const params = useSearchParams()
  const { isLoading: isAuthLoading } = useAuth()
  const { data: tournaments } = useGetTournaments()
  const { mutate, isPending, isSuccess } = useCreateTournament()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form State
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

  useEffect(() => {
    const error = params.get('error')
    if (error === 'unauthorized') {
      toast.error('Akses Ditolak: Anda tidak memiliki izin.')
      const newParams = new URLSearchParams(params.toString())
      newParams.delete('error')
      router.replace(`?${newParams.toString()}`)
    }
  }, [params, router])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()

    Object.entries(isForm).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    })

    mutate(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false)
    }
  }, [isSuccess])

  // Filtering Logic
  const filteredData = tournaments?.data?.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return {
    isAuthLoading,
    filteredData,
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    formState: { isForm, setIsForm, isStage, setIsStage },
    mutation: { handleSubmit, isPending },
  }
}
