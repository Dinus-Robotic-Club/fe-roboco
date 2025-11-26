'use client'
import FormRegistationTeam from '@/component/ui/FormRegistationTeam'
import FormRegistrationPlayer from '@/component/ui/FormRegistrationPlayer'
import Navbar from '@/component/ui/Global/Navbar'
import { useTournaments } from '@/hooks/queries/useTournaments'
import { nav_register } from '@/lib'
import { IBodyRegisterTeam, IParticipantsBody, ITeamBody, RegisterError } from '@/lib/types/team'
import { useMounted } from '@/lib/useMounted'
import { RegisterTeamSchema } from '@/lib/validator/register-form'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import { useCreateTeam } from '@/hooks/mutations/teams-mutation'
import Loader from '@/component/ui/Global/loader'
import { mapZodErrors } from '@/lib/func'
import { IGetAllTournaments } from '@/lib/types/type'
import ImageUploadModal from '@/component/ui/Modal'
import { useTournamentAndCommunity } from '@/hooks/function/useTournamentAndCommunity'

function Register() {
    const mounted = useMounted()
    const { communities, isError, isLoading, tournaments } = useTournamentAndCommunity()
    const { mutate, isPending, isSuccess } = useCreateTeam()
    const [showModal, setShowModal] = useState(false)

    const [team, setTeam] = useState<ITeamBody>({
        name: '',
        email: '',
        password: '',
        communityName: '',
        category: '',
        logo: null,
        tournamentId: '',
        invoice: null,
    })

    const [participants, setParticipants] = useState<IParticipantsBody[]>([
        {
            participantsName: '',
            participantsPhone: '',
            participantsTwibbon: '',
            participantsRoleInTeam: '',
            participantsImage: null,
            participantsIdentityCardImage: null,
        },
        {
            participantsName: '',
            participantsPhone: '',
            participantsTwibbon: '',
            participantsRoleInTeam: '',
            participantsImage: null,
            participantsIdentityCardImage: null,
        },
    ])

    const [error, setError] = useState<RegisterError>({})

    useEffect(() => {
        localStorage.setItem('team-form', JSON.stringify(team))
    }, [team])

    useEffect(() => {
        localStorage.setItem('participants-form', JSON.stringify(participants))
    }, [participants])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const payload: IBodyRegisterTeam = {
            team,
            participants,
        }

        const parsed = RegisterTeamSchema.safeParse(payload)

        if (!parsed.success) {
            setError(mapZodErrors(parsed.error.issues))
            console.log(parsed.error.issues)
            return
        }

        setError({})

        const fd = new FormData()

        Object.entries(team).forEach(([k, v]) => {
            fd.append(`${k}`, v instanceof File ? v : String(v))
        })

        participants.forEach((p) => {
            Object.entries(p).forEach(([k, v]) => {
                fd.append(`${k}`, v instanceof File ? v : String(v))
            })
        })

        mutate(fd)
    }

    if (isSuccess) localStorage.clear()
    if (isLoading) return <Loader show={isLoading} />
    if (!mounted) return null

    return (
        <main className="w-full relative flex flex-col items-center bg-grid">
            <Loader show={isPending} />
            <Navbar left={nav_register.left} right={nav_register.right} />
            <div className="z-10 min-h-[700px] w-full shadow-lg absolute top-0 left-0 right-0 bg-white"></div>
            <div className="flex flex-col max-w-5xl justify-center items-center font-plus-jakarta-sans w-full px-10 gap-4 text-center mt-52 mb-32 z-20">
                <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">REGISTRATION FORM</h1>
                <p className="text-base lg:text-xl 2xl:text-2xl">
                    tolong lengkapi form di bawah ini, silahkan download{' '}
                    <a href="" className="underline cursor-pointer">
                        panduan pendaftaran
                    </a>{' '}
                    atau hubungi{' '}
                    <a href="" className="underline cursor-pointer">
                        narahubung kami
                    </a>
                </p>
            </div>
            <div className="max-h-full md:max-h-[510px]  w-full max-w-[1176px] relative flex justify-center items-center flex-col px-3 sm:px-6 lg:px-20 z-20 mb-28 py-10 mx-auto shadow-md lg:shadow-none bg-[#fcff00] lg:bg-transparent">
                <Image src="/bg-registration-team.svg" alt="Registration Team" fill className="rounded-md object-cover hidden lg:block" />
                <FormRegistationTeam data={team} setData={setTeam} listTour={tournaments?.data} error={error.team} listCommunity={communities?.data} />
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
                    onOpenTwibbonModal={() => setShowModal(true)}
                    errors={error.participants ?? {}}
                />

                <div className="w-full max-w-[1176px] flex justify-center mt-8 px-3 md:px-6">
                    <button onClick={handleSubmit} className="bg-[#FBFF00] hover:shadow-xl transition font-fira-code font-medium py-3 px-10 w-full shadow-md">
                        SUBMIT NOW
                    </button>
                </div>
            </div>
            {showModal && <ImageUploadModal onClose={() => setShowModal(false)} />}
        </main>
    )
}

export default Register
