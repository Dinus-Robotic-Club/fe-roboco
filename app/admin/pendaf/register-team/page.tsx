'use client'

import { Suspense } from 'react'
import FormRegistrationPlayer from '@/components/pages/register/form-player'
import FormRegistationTeam from '@/components/pages/register/form-team'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { useCreateTeamByAdmin } from '@/hooks/useCreateTeamByAdmin'
import { useGetCommunity } from '@/hooks/useGetCommunity'
import { useGetTournaments } from '@/hooks/useGetTournaments'
import { useMounted } from '@/hooks/useMounted'
import { getNavByRole } from '@/lib/statis-data'
import { useAuth } from '@/context/auth-context'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

function RegisterContent() {
  const { user } = useAuth()
  const nav = getNavByRole(user?.role)
  const mounted = useMounted()
  const { data: communities } = useGetCommunity()
  const { data: tournaments } = useGetTournaments()
  const { mutate, isPending } = useCreateTeamByAdmin()

  const [team, setTeam] = useState<ITeamBody>({
    name: '',
    email: '',
    communityName: '',
    category: '',
    tournamentId: '',
    password: '',
    confirmPassword: '',
  })

  // State participant tetap array object
  const [participants, setParticipants] = useState<IParticipantsBody[]>([
    {
      participantsName: '',
      participantsPhone: '',
      participantsTwibbon: '',
      participantsRoleInTeam: '',
    },
    {
      participantsName: '',
      participantsPhone: '',
      participantsTwibbon: '',
      participantsRoleInTeam: '',
    },
  ])

  const [error, setError] = useState<RegisterError>({
    team: {},
    participants: [],
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!team.name || !team.tournamentId) {
      alert('Nama Tim dan Turnamen wajib diisi!')
      return
    }

    const formData = new FormData()

    // 1. Data Team
    formData.append('name', team.name)
    formData.append('email', team.email)
    formData.append('communityName', team.communityName || '')
    formData.append('category', team.category)
    formData.append('tournamentId', team.tournamentId)
    formData.append('password', team.password || '')
    if (team.logo) formData.append('logo', team.logo)
    if (team.invoice) formData.append('invoice', team.invoice)

    // 2. Data Participants
    participants.forEach((p, index) => {
      formData.append('participantsName', p.participantsName)
      formData.append('participantsRoleInTeam', p.participantsRoleInTeam)
      formData.append('participantsPhone', p.participantsPhone)
      formData.append('participantsTwibbon', p.participantsTwibbon || '')
      if (p.participantsIdentityCardImage) {
        formData.append(`participantsIdentityCardImage_${index}`, p.participantsIdentityCardImage)
      }
    })

    mutate(formData)
  }

  if (!mounted) return null

  return (
    <main className="w-full relative flex flex-col items-center bg-grid">
      <Loader show={isPending} />
      <Navbar left={nav.left} right={nav.right} />
      <div className="z-10 min-h-175 w-full shadow-lg absolute top-0 left-0 right-0 bg-white"></div>

      <div className="flex flex-col max-w-5xl justify-center items-center font-plus-jakarta-sans w-full px-10 gap-4 text-center mt-52 mb-32 z-20">
        <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">REGISTRATION FORM ADMIN</h1>
      </div>

      <div className="max-h-full md:max-h-127.5 w-full max-w-294 relative flex justify-center items-center flex-col px-3 sm:px-6 lg:px-20 z-20 mb-28 py-10 mx-auto shadow-md lg:shadow-none bg-[#fcff00] lg:bg-transparent">
        <Image src="/bg-registration-team.svg" alt="Registration Team" fill className="rounded-md object-cover hidden lg:block" />
        <FormRegistationTeam data={team} setData={setTeam} listTour={tournaments?.data || []} error={error.team} listCommunity={communities?.data || []} type="admin" />
      </div>

      <div className="w-full flex flex-col justify-center items-center mb-28">
        <h1 className="text-center font-bold text-2xl font-plus-jakarta-sans mb-10">PLAYER PROFILE</h1>
        <FormRegistrationPlayer
          data={participants}
          setData={(index, data) =>
            setParticipants((prev) => {
              const copy = [...prev]
              copy[index] = { ...copy[index], ...data }
              return copy
            })
          }
          errors={error.participants}
          type="admin"
        />

        <div className="w-full max-w-294 flex justify-center mt-8 px-3 md:px-6">
          <button onClick={handleSubmit} className="bg-[#FBFF00] hover:shadow-xl transition font-fira-code font-medium py-3 px-10 w-full shadow-md">
            SUBMIT NOW
          </button>
        </div>
      </div>
    </main>
  )
}

const RegisterPage = () => {
  return (
    <Suspense fallback={<Loader show />}>
      <RegisterContent />
    </Suspense>
  )
}

export default RegisterPage
