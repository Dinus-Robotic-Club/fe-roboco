import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50 relative flex flex-col justify-center items-center p-3">
      <div className="w-full h-full relative flex flex-col justify-center items-center">
        <h1 className="text-9xl 2xl:text-[170px] font-extrabold text-center text-gray-900 font-fira-code">404</h1>
        <p className="text-center text-gray-700 font-fira-code">Kamu mungkin menjelajah terlalu jauh</p>
        <Image src="/notfound-robot.svg" alt="Not Found" width={200} height={200} className="lg:fixed bottom-5 left-5  w-60 lg:w-64 2xl:w-76 h-auto my-5" />
        <Link
          href="/"
          className="bg-gray-900 hover:bg-gray-800 rounded transition font-fira-code text-center font-medium py-3 w-full max-w-xs shadow-md text-white mt-6 flex justify-center items-center gap-3">
          <FaHome />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
