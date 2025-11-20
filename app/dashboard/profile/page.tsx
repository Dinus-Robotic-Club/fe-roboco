'use client'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { useMounted } from '@/lib/useMounted'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function TeamProfile() {
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const showNewPass = () => {
        setShowNewPassword(!showNewPassword)
    }

    const showConfirmPass = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const mounted = useMounted()
    if (!mounted) return null
    return (
        <>
            <HeaderDashboard title="TEAM PROFILE" />
            <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
                <div className="flex gap-8">
                    <p>TEAM PROFILE</p>
                    <p>BASE TEAM PROFILE</p>
                </div>
                <div className="flex flex-col justify-center items-center mt-14">
                    <div className="flex flex-wrap  justify-center items-center gap-30">
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-player min-h-[215px] min-w-[215px]">
                                <Image className="h-80 w-auto pb-2 pl-3" alt="member1" src="/member1.png" height={300} width={200} />
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold">Player I</h1>
                                <p>Team Leader</p>
                            </div>

                            <a href="/dashboard/profile/edit?player=player1" className="mt-10 underline">
                                CHANGE PROFILE
                            </a>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-player min-h-[215px] min-w-[215px]">
                                <Image className="h-80 w-auto pb-2 pl-3" alt="member1" src="/member1.png" height={300} width={200} />
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold">Player I</h1>
                                <p>Team Leader</p>
                            </div>

                            <a href="/dashboard/profile/edit?player=player1" className="mt-10 underline">
                                CHANGE PROFILE
                            </a>
                        </div>
                    </div>
                </div>
                <div className="my-20 max-w-4xl w-full px-4 flex flex-col items-center gap-10">
                    <div className="bg-logo-team w-[123px] h-[123px]">
                        <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-full h-full p-2 " />
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
                                <p className="text-red-500 text-xs">please fill your name</p>
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
                                <p className="text-red-500 text-xs">please fill your name</p>
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
                                    <p className="text-red-500 text-xs">please fill your name</p>
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
                                    <p className="text-red-500 text-xs">please fill your name</p>
                                </div>
                            </div>
                        </div>
                        <button className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 mt-2 shadow-md">UPDATE PROFILE</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeamProfile
