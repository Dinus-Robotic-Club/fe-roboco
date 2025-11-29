'use client'
import BasisRank from '@/component/leagueboard/BasisRank'
import GroupRankSoccer from '@/component/leagueboard/GroupRankSoccer'
import GroupRankSumo from '@/component/leagueboard/GroupRankSumo'
import Navbar from '@/component/ui/Global/Navbar'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { nav_home, nav_legaueboard } from '@/lib'
import { useState } from 'react'

function Leagueboard() {
    const [activeNav, setActiveNav] = useState('basis-rank')
    let ComponentToRender

    if (activeNav === 'basis-rank') {
        ComponentToRender = <BasisRank />
    } else if (activeNav === 'group-rank-soccer') {
        ComponentToRender = <GroupRankSoccer />
    } else if (activeNav === 'group-rank-sumo') {
        ComponentToRender = <GroupRankSumo />
    } else {
        ComponentToRender = null
    }

    const handleClickNav = (key: string) => {
        setActiveNav(key)
    }
    return (
        <>
            <Navbar left={nav_home.left} right={nav_home.right} />
            <HeaderDashboard title="LEAGUEBOARD" name=" " />
            <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20">
                <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
                    {nav_legaueboard.map((data) => (
                        <p
                            key={data.key}
                            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
                                activeNav === data.key ? 'bg-[#FBFF00]' : 'bg-transparent'
                            }`}
                            onClick={() => handleClickNav(data.key)}
                        >
                            {data.label}
                        </p>
                    ))}
                </nav>
                <div className="w-full h-auto flex flex-col items-center gap-20 mt-20 lg:px-10 ">{ComponentToRender}</div>
            </div>
        </>
    )
}

export default Leagueboard
