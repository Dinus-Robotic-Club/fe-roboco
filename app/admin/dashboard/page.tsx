'use client'

import Card from '@/component/dashboard-admin/card'
import Navbar from '@/component/ui/Navbar'
import { useTournaments } from '@/hooks/queries/useTournaments'
import { nav_admin } from '@/lib'
const Page = () => {
    const { data, isLoading, isError } = useTournaments()

    if (isLoading) return <p>Loading tournaments...</p>
    if (isError) return <p>Error fetching tournaments</p>
    return (
        <div className="w-full min-h-screen flex flex-col bg-grid">
            <Navbar left={nav_admin.left} right={nav_admin.right} />
            <div className="h-[300px] md:h-[400px] bg-white w-full flex flex-col justify-center items-center pt-[70px] 2xl:pt-20 font-plus-jakarta-sans shadow-2xl">
                <div className="absolute top-50">
                    <h1 className="text-5xl font-bold text-center">ADMIN ZONE</h1>
                    <p className="text-center text-2xl mt-1">carefull to make any decision here</p>
                </div>
            </div>
            <main className="flex-1 p-4 md:p-6 ">
                <div className="max-w-5xl mx-auto">
                    {data?.data?.map((t) => (
                        <Card data={t} key={t.uid} />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Page
