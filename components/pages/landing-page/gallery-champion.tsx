'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Trophy, Crown, Medal } from 'lucide-react'
import { useMounted } from '@/hooks/useMounted'

// Target date: January 12, 2026 at 3:00 PM WIB (UTC+7)
const TARGET_DATE = new Date('2026-01-12T15:00:00+07:00').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black text-white flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold rounded-lg border-2 border-[#FBFF00]">
        {String(value).padStart(2, '0')}
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FBFF00] rounded-full" />
    </div>
    <span className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-600">{label}</span>
  </div>
)

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = TARGET_DATE - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  return (
    <section className="relative w-full flex justify-center py-16 lg:py-24 overflow-hidden" id="countdown">
      <div className="flex flex-col font-plus-jakarta-sans w-full mx-4 sm:mx-10 lg:mx-20 gap-8 max-w-7xl items-center">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center space-y-3">
          <span className="inline-block px-4 py-1.5 bg-[#FBFF00] text-black text-xs font-bold uppercase tracking-wider rounded-full">Pertandingan Dimulai</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-black">Bersiaplah untuk Bertanding!</h2>
          <p className="text-slate-600 text-base lg:text-lg max-w-xl mx-auto">Waktu terus berjalan. Pastikan robot kamu siap menghadapi pertandingan!</p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <CountdownUnit value={timeLeft.days} label="Hari" />
          <span className="text-3xl lg:text-4xl font-bold text-black mt-[-24px]">:</span>
          <CountdownUnit value={timeLeft.hours} label="Jam" />
          <span className="text-3xl lg:text-4xl font-bold text-black mt-[-24px]">:</span>
          <CountdownUnit value={timeLeft.minutes} label="Menit" />
          <span className="text-3xl lg:text-4xl font-bold text-black mt-[-24px]">:</span>
          <CountdownUnit value={timeLeft.seconds} label="Detik" />
        </motion.div>

        {/* Date Info */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="text-sm text-slate-500 font-medium">
          12 Januari 2026 • 15:00 WIB
        </motion.p>
      </div>
    </section>
  )
}

const ChampionSection = () => {
  const champions = [
    { place: 2, label: 'Juara 2', icon: Medal, height: 'h-32 lg:h-40' },
    { place: 1, label: 'Juara 1', icon: Crown, height: 'h-40 lg:h-52' },
    { place: 3, label: 'Juara 3', icon: Trophy, height: 'h-28 lg:h-32' },
  ]

  const categories = [
    { id: 'soccer', name: 'Soccer Bot', icon: '/logo-soccer.svg' },
    { id: 'sumo', name: 'Sumo Bot', icon: '/logo-summo.svg' },
  ]

  return (
    <section className="relative w-full flex justify-center py-16 lg:py-24 bg-white overflow-hidden" id="champions">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat" />
      </div>

      <div className="relative flex flex-col font-plus-jakarta-sans w-full mx-4 sm:mx-10 lg:mx-20 gap-12 max-w-7xl items-center">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-black">Hall of Champions</h2>
          <p className="text-black text-xl lg:text-2xl font-semibold italic">&quot;Siapa yang akan mengukir sejarah?&quot;</p>
          <p className="text-slate-600 text-base lg:text-lg max-w-2xl mx-auto">Podium kehormatan menanti pemenang. Tunjukkan kemampuan terbaikmu dan jadilah legenda di DN Roboco Championship 2026!</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + catIdx * 0.2 }}
              className="flex flex-col items-center">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <Image src={category.icon} alt={category.name} width={40} height={40} className="w-10 h-10" unoptimized />
                <h3 className="text-xl lg:text-2xl font-bold text-black uppercase tracking-wide">{category.name}</h3>
              </div>

              {/* Champion Podium */}
              <div className="flex items-end justify-center gap-2 lg:gap-4 w-full">
                {champions.map((champion, idx) => (
                  <div key={champion.place} className="flex flex-col items-center flex-1 max-w-[140px]">
                    {/* Silhouette */}
                    <div className="relative w-full aspect-3/4 mb-2">
                      <Image src="/champion-silhouette.png" alt={`${champion.label} Silhouette`} fill className="object-contain grayscale opacity-50" unoptimized />
                      {/* Question Mark Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl lg:text-4xl font-bold text-black/20">?</span>
                      </div>
                    </div>

                    {/* Podium */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + catIdx * 0.2 + idx * 0.1 }}
                      style={{ transformOrigin: 'bottom' }}
                      className={`w-full ${champion.height} bg-linear-to-t from-gray-200 to-gray-100 rounded-t-lg border-2 border-black border-b-0 flex flex-col items-center justify-start pt-3 lg:pt-4`}>
                      <champion.icon className="w-6 h-6 lg:w-8 lg:h-8 text-black mb-1" />
                      <span className="text-black font-bold text-xs lg:text-sm">{champion.label}</span>
                      <span className="text-slate-500 text-[10px] lg:text-xs mt-0.5">Coming Soon</span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="text-center space-y-4 mt-4">
          <p className="text-black text-lg lg:text-xl font-medium">Apakah kamu yang selanjutnya berdiri di podium ini?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/register" className="px-8 py-3 bg-black text-[#FBFF00] font-bold uppercase tracking-wide rounded-lg hover:bg-gray-800 transition-all active:scale-95">
              Daftar Sekarang
            </a>
            <a href="#about" className="px-8 py-3 bg-transparent text-black font-bold uppercase tracking-wide rounded-lg border-2 border-black/30 hover:border-black/60 transition-all">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 p-6 lg:p-8 bg-gray-100 rounded-xl border border-gray-200 max-w-3xl w-full">
          <blockquote className="text-center">
            <p className="text-black text-lg lg:text-xl italic leading-relaxed">
              &quot;Kesuksesan tidak diukur dari seberapa tinggi kamu naik, tapi seberapa keras kamu berusaha untuk sampai ke sana.&quot;
            </p>
            <footer className="mt-4 text-black font-semibold">— Tunjukkan Skill Terbaikmu di DN Roboco 2026</footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}

export { Countdown, ChampionSection }
