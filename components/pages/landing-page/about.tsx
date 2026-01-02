'use client'
import Image from 'next/image'
import { motion } from 'motion/react'

const About = () => {
  return (
    <section className="flex flex-col h-auto bg-transparent w-full " id="about">
      <Image src="/line-dnroboco.svg" alt="line-dn-roboco" width={1920} height={112} className="w-full h-auto" />
      <div className="min-h-[400px] lg:min-h-[450px] w-full flex flex-col justify-center items-center mt-10 md:mt-0 py-5 px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col gap-6 2xl:gap-8 justify-center items-center max-w-[1500px] w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
            <Image src="/text-dn-roboco.svg" alt="text-dnroboco" width={700} height={85} className="w-full max-w-[500px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] h-auto" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex-1 max-w-5xl 2xl:max-w-7xl">
            <p className="text-lg sm:text-xl lg:text-2xl font-plus-jakarta-sans text-center leading-relaxed w-full">
              DN Roboco 2026 hadir mewadahi inovator dan pecinta robotika Indonesia! Bersainglah dalam dua kategori seru Robot Soccer dan Robot Summo. Ini adalah ajang pertandingan intelektualitas dan
              ketangkasan teknik, di mana setiap sirkuit dan kode diuji di medan pertandingan sesungguhnya. Siapkan robot terbaikmu dan buktikan siapa yang paling tangguh!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
