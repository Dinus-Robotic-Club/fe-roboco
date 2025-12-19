'use client'
import HistoryMatch from '@/component/match/HistoryMatch'
import OngoingMatch from '@/component/match/OngoingMatch'
import Navbar from '@/component/ui/Global/Navbar'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { useAuth } from '@/context/auth-context'
import { nav_admin } from '@/lib'
import dummyData from '@/lib/dumy.json'
import React, { useState } from 'react'

function MatchsPage() {
    const { user } = useAuth()
    const [activeNav, setActiveNav] = useState('on-going-match')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')

    const filteredData = (dummyData as ICardMatch[])
        .filter((item) => {
            if (activeNav === 'on-going-match') return item.status === 'ONGOING'
            if (activeNav === 'finished-match') return item.status === 'FINISHED'
            return true
        })
        .filter((item) => {
            if (category === 'all') return true
            return item.category.toLowerCase() === category.toLowerCase()
        })
        .filter((item) => {
            const q = search.toLowerCase()
            return item.teamA.name.toLowerCase().includes(q) || item.teamB.name.toLowerCase().includes(q)
        })

    const ComponentToRender = activeNav === 'on-going-match' ? <OngoingMatch data={filteredData} user={user} /> : <HistoryMatch data={filteredData} />

    return (
        <div className="w-full min-h-screen flex flex-col bg-grid">
            <Navbar left={nav_admin.left} right={nav_admin.right} />
            <HeaderDashboard title="Match Lists 🎮" name="Admin" />

            <main className="w-full p-4 md:p-6 mb-20 items-center flex flex-col">
                <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
                    <p
                        className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
                            activeNav === 'on-going-match' ? 'bg-[#FBFF00]' : 'bg-transparent'
                        }`}
                        onClick={() => setActiveNav('on-going-match')}
                    >
                        ON-GOING MATCH
                    </p>
                    <p
                        className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
                            activeNav === 'finished-match' ? 'bg-[#FBFF00]' : 'bg-transparent'
                        }`}
                        onClick={() => setActiveNav('finished-match')}
                    >
                        FINISHED MATCH
                    </p>
                </nav>
                <div className="flex flex-wrap justify-between max-w-6xl 2xl:max-w-7xl w-full mt-12">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="py-2 outline-none border-b-3 2xl:border-b-4 border-[#FBFF00] lg:w-xs lg:text-base text-sm"
                        placeholder="Search teams..."
                    />

                    <select
                        name="type-match"
                        id="type-match"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="py-2 px-5 bg-white rounded-xs shadow-md border-2 font-plus-jakarta-sans text-sm lg:text-base border-gray-200 outline-none cursor-pointer"
                    >
                        <option value="all">ALL CATEGORY</option>
                        <option value="SUMMO BOT">SUMMO BOT</option>
                        <option value="SOCCER BOT">SOCCER BOT</option>
                    </select>
                </div>

                <div className="w-full h-auto flex flex-col items-center gap-10 mt-16 mb-20 font-plus-jakarta-sans">{ComponentToRender}</div>
            </main>
        </div>
    )
}

export default MatchsPage
