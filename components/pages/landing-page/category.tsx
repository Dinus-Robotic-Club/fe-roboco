'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { categories } from '@/lib/statis-data'

function Category() {
  const [active, setActive] = useState('soccerbot')
  const selected = categories.find((item) => item.id === active) || categories[0]
  return (
    <section className="relative w-full flex justify-center my-10 scroll-mt-24" id="category">
      <div className="flex flex-col font-plus-jakarta-sans w-full mx-3 sm:mx-10 lg:mx-20 gap-4 max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-bold text-4xl text-center md:text-start  lg:text-5xl 2xl:text-[53px]">
          Kategori Lomba
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-semibold text-base lg:text-xl text-center md:text-start">
          DN ROBOCO 2026
        </motion.p>

        <div className="flex w-full font-plus-jakarta-sans mt-10 flex-wrap">
          <div className="flex bg-transparent max-w-5xl w-full">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`w-36 sm:w-46 pb-1.5 sm:pb-2.5 pt-5 sm:pt-7 text-sm sm:text-base font-semibold bg-cover
              ${active === cat.id ? 'bg-category-button text-black z-20' : 'bg-category-button-trans text-[#FDFF87]'} ${index !== 1 ? '-mr-4' : ''}`}>
                {cat.title.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white w-full max-w-7xl rounded-b-3xl rounded-tr-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-10 border-4 border-black">
            <div className="w-full md:w-1/2">
              <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-3xl font-bold mb-4 flex gap-3 items-center">
                <Image src={selected.icon} alt="logo" height={35} width={35} />
                {selected.title}
              </motion.h2>

              <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="space-y-4 text-lg leading-relaxed">
                {selected.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </motion.div>

              <div className="mt-8 text-center flex flex-col md:flex-row gap-4">
                <motion.a
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
                  href="/register"
                  className="px-10 py-3 border-3 border-black bg-black text-[#FBFF00] font-semibold rounded-md shadow-md hover:bg-[#A8A8A8] transition flex items-center justify-center">
                  DAFTAR
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
                  href={selected.guidebook}
                  download
                  className="px-10 py-3 border-3 border-black text-black rounded-lg font-semibold hover:bg-[#FAFAFA] transition flex justify-center items-center gap-4">
                  <Image src={selected.icon} alt="logo" width={20} height={20} className="" /> GUIDE BOOK
                </motion.a>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.8, type: 'spring', stiffness: 50, delay: 0.5 }}>
                <Image src={selected.icon} alt={selected.title} width={450} height={300} className="w-[260px] md:w-[300px] h-auto drop-shadow-xl scale-x-[-1]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Category
