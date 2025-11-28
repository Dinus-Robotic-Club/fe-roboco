import { ITeamDetail, TeamError, updateParticipant, updateTeam } from '@/lib/types/team'
import Image from 'next/image'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function TeamProfile({
    data,
    bodyTeam,
    setBodyTeam,
    bodyParticipant,
    setBodyParticipant,
    error,
}: {
    data: ITeamDetail
    bodyTeam?: updateTeam
    setBodyTeam?: React.Dispatch<React.SetStateAction<updateTeam>>
    error?: TeamError
    bodyParticipant: updateParticipant
    setBodyParticipant: React.Dispatch<React.SetStateAction<updateParticipant>>
}) {
    const [showNewPassword, setShowNewPassword] = useState(true)
    const [showConfirmPassword, setShowConfirmPassword] = useState(true)

    const showNewPass = () => {
        setShowNewPassword(!showNewPassword)
    }

    const showConfirmPass = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    return (
        <>
            <div className="">
                <h1 className="text-2xl lg:text-3xl font-bold">TEAM PROFILE</h1>
            </div>
            <div className="flex flex-col justify-center items-center ">
                <div className="flex flex-wrap  justify-center items-center gap-30">
                    {data.participants.map((pt, i) => (
                        <div key={i} className="flex flex-col items-center justify-center">
                            <div className="bg-player min-h-[215px] min-w-[215px]">
                                <Image className="h-80 w-auto pb-2 pl-3" alt="member1" src={`${process.env.NEXT_PUBLIC_API_URL}${pt.image}`} height={300} width={200} unoptimized />
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold">{pt.name}</h1>
                                <p>{pt.roleInTeam}</p>
                            </div>

                            {/* <a href="/dashboard/profile/edit?player=player1" className="mt-10 underline">
                                CHANGE PROFILE
                            </a> */}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-20 max-w-4xl w-full md:px-4 flex flex-col items-center gap-10">
                <div className="bg-logo-team w-[123px] h-[123px]">
                    <Image src="" alt="logo-team" height={30} width={30} className="w-full h-full p-2 " />
                </div>
                <div className="flex flex-col gap-5 sm:gap-8 w-full">
                    <div className="flex gap-5 w-full flex-col sm:flex-row">
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="player1_name" className="text-sm lg:text-base font-fira-code">
                                TEAM NAME
                            </label>
                            <input
                                id="team_name"
                                type="text"
                                placeholder="Team Name"
                                className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
                            />
                            {error && <p className="text-red-500 text-xs">{error.name}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="player1_picture" className="text-sm lg:text-base font-fira-code">
                                TEAM LOGO
                            </label>
                            <input
                                id="logo"
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                placeholder="logo"
                                className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
                            />
                            {error && <p className="text-red-500 text-xs">{error.logo}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex gap-5 w-full ">
                            <div className="relative flex flex-col gap-1 w-full">
                                <label htmlFor="change_password" className="text-sm lg:text-base font-fira-code">
                                    CHANGE PASSWORD
                                </label>
                                <input
                                    id="change_password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
                                />

                                <button
                                    type="button"
                                    onClick={showNewPass}
                                    className="absolute right-5 bottom-7 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {error && <p className="text-red-500 text-xs">{error.password}</p>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-full">
                            <div className="relative flex flex-col gap-1 w-full">
                                <label htmlFor="confirm_password" className="text-sm lg:text-base font-fira-code">
                                    CONFIRM PASSWORD
                                </label>
                                <input
                                    id="confirm_password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
                                />

                                <button
                                    type="button"
                                    onClick={showConfirmPass}
                                    className="absolute right-5 bottom-7 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {error && <p className="text-red-500 text-xs">{error.confirmPassword}</p>}
                            </div>
                        </div>
                    </div>
                    <button className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 mt-2 shadow-md">UPDATE PROFILE</button>
                </div>
            </div>
        </>
    )
}

export default TeamProfile
