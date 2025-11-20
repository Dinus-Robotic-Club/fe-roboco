'use-client'
import { ITeamBody, TeamError } from '@/lib/types/team'
import { IResponseGetTour } from '@/lib/types/type'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

function FormRegistationTeam({
    data,
    setData,
    error,
    listTour,
}: {
    data: ITeamBody
    setData: React.Dispatch<React.SetStateAction<ITeamBody>>
    error?: TeamError
    listTour?: IResponseGetTour
}) {
    const [showPass, setShowPass] = useState<boolean>(false)
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false)

    return (
        <div className=" z-10  w-full">
            <div className=" flex flex-col justify-center  items-center gap-10 sm:gap-10 lg:mt-4">
                <h1 className="text-center font-bold text-xl sm:text-2xl font-plus-jakarta-sans">TEAM PROFILE</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 sm:gap-y-7 gap-x-4 sm:gap-x-6 w-full h-full">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="team_name" className="text-sm lg:text-base font-fira-code">
                            TEAM NAME
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            type="text"
                            id="team_name"
                            name="team_name"
                            placeholder="Team name"
                            className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
                        />
                        {error?.name && <p className="text-red-500 text-xs">{error.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="team_email" className="text-sm lg:text-base font-fira-code">
                            TEAM EMAIL
                        </label>
                        <input
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            type="text"
                            id="team_email"
                            name="team_email"
                            placeholder="Team Email"
                            className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
                        />
                        {error?.email && <p className="text-red-500 text-xs">{error.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="team_logo" className="text-sm lg:text-base font-fira-code tracking-wide">
                            TEAM LOGO (OPTIONAL)
                        </label>

                        <label htmlFor="team_logo" className="relative bg-white w-full h-12 sm:h-14 flex items-center px-4 cursor-pointer shadow-md">
                            <span className={`text-gray-400 font-plus-jakarta-sans text-sm lg:text-base ${data.logo ? 'text-gray-800' : ''}`}>{data.logo?.name || 'FILE →'}</span>

                            <input
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                id="team_logo"
                                name="team_logo"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                        setData({ ...data, logo: file })
                                    }
                                }}
                            />
                        </label>
                        {error?.logo && <p className="text-red-500 text-xs">{error.logo}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="team_password" className="text-sm lg:text-base font-fira-code">
                            TEAM PASSWORD
                        </label>

                        <div className="relative">
                            <input
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                type={showPass ? 'text' : 'password'}
                                id="team_password"
                                placeholder="*****"
                                className="p-3 sm:p-4 bg-white rounded-xs w-full pr-12 outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
                            />

                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {error?.password && <p className="text-red-500 text-xs">{error.password}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm_password" className="text-sm lg:text-base font-fira-code">
                            CONFIRM PASSWORD
                        </label>

                        <div className="relative">
                            <input
                                value={data.confirmPassword}
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                type={showConfirmPass ? 'text' : 'password'}
                                id="confirm_password"
                                placeholder="*****"
                                className="p-3 sm:p-4 bg-white rounded-xs w-full pr-12 outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
                            />

                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {error?.confirmPassword && <p className="text-red-500 text-xs">{error.confirmPassword}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="invoice" className="text-sm lg:text-base font-fira-code tracking-wide">
                            INVOICE
                        </label>

                        <label htmlFor="invoice" className="relative bg-white w-full h-12 sm:h-14 flex items-center px-4 cursor-pointer shadow-md">
                            <span className={`text-gray-400 font-plus-jakarta-sans text-sm lg:text-base ${data.invoice ? 'text-gray-800' : ''}`}>
                                {data.invoice?.name || 'FILE →'}
                            </span>

                            <input
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                id="invoice"
                                name="invoice"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                        setData({ ...data, invoice: file })
                                    }
                                }}
                            />
                        </label>
                        {error?.invoice && <p className="text-red-500 text-xs">{error.invoice}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="kategori" className="text-sm lg:text-base font-fira-code">
                            KATEGORI LOMBA
                        </label>
                        <select
                            id="kategori"
                            name="kategori"
                            onChange={(e) => {
                                setData({ ...data, category: e.target.value })
                            }}
                            className={`h-12 sm:h-14 px-4 bg-white rounded-sm outline-none shadow-md font-plus-jakarta-sans text-sm lg:text-base ${
                                data.category === '' ? 'text-gray-400' : 'text-black'
                            }`}
                        >
                            <option value="">-- SELECT --</option>
                            <option value="SOCCER" className="text-black">
                                SOCCER
                            </option>
                            <option value="SUMO" className="text-black">
                                SUMMO
                            </option>
                        </select>
                        {error?.category && <p className="text-red-500 text-xs">{error.category}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="turnamen" className="text-sm lg:text-base font-fira-code">
                            TOURNAMENT
                        </label>
                        <select
                            id="turnamen"
                            name="turnamen"
                            onChange={(e) => {
                                setData({ ...data, tournamentId: e.target.value })
                            }}
                            className={`h-12 sm:h-14 px-4 bg-white rounded-sm outline-none shadow-md font-plus-jakarta-sans text-sm lg:text-base ${
                                data.tournamentId === '' ? 'text-gray-400' : 'text-black'
                            }`}
                        >
                            <option value="">-- SELECT --</option>
                            {listTour &&
                                listTour.data.map((tour) => (
                                    <option value={tour.uid} key={tour.uid} className="text-black">
                                        {tour.name}
                                    </option>
                                ))}
                        </select>
                        {error?.category && <p className="text-red-500 text-xs">{error.category}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="asal_instansi" className="text-sm lg:text-base font-fira-code">
                            ASAL INSTANSI
                        </label>
                        <input
                            value={data.school}
                            onChange={(e) => setData({ ...data, school: e.target.value })}
                            type="text"
                            id="asal_instansi"
                            name="asal_instansi"
                            placeholder="Asal instansi"
                            className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
                        />
                        {error?.school && <p className="text-red-500 text-xs">{error.school}</p>}
                    </div>
                </div>
                <p className="text-center text-[#7d7d7d] text-sm sm:text-base italic font-plus-jakarta-sans ">Dilarang menggunakan nama team yang mengandung unsur SARA*</p>
            </div>
        </div>
    )
}

export default FormRegistationTeam
