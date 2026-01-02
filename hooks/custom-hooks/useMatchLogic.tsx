'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGetMatchRound } from '../useGetMatchRound'
import { useUpdateScoreMatch } from '../useUpdateScoreMatch'
import { useEndMatchRound } from '../useEndMatchRound'
import { useCreateMatchRound } from '../useCreateMatchRound'
import { ITimelineAction } from '@/lib/types'

export function useMatchLogic(roundId: string) {
  const router = useRouter()

  // --- QUERIES & MUTATIONS ---
  // Pastikan generic type useGetMatchRound mengembalikan { data: IMatchRound }
  const { data: response } = useGetMatchRound(roundId)
  const { mutateAsync: updateScore } = useUpdateScoreMatch()
  const { mutateAsync: endRound } = useEndMatchRound()
  const { mutateAsync: createRound } = useCreateMatchRound()

  // Casting data ke IMatchRound agar strict
  const matchData = response?.data as IMatchRound | undefined

  // Helper: Ambil Data Ronde Aktif berdasarkan roundId (dari params URL)
  const currentActiveRound = matchData?.rounds?.find((r) => r.uid === roundId)

  const matchType = matchData?.category || 'SOCCER'
  const isSumo = matchType === 'SUMO'

  // --- LOCAL STATE ---
  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>(0)

  // Score State
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)

  // Rounds Won State (Best of X Logic)
  const [homeRoundsWon, setHomeRoundsWon] = useState(0)
  const [awayRoundsWon, setAwayRoundsWon] = useState(0)

  const [timeline, setTimeline] = useState<ITimelineAction[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // --- 1. INITIALIZATION & SYNC LOGIC ---
  useEffect(() => {
    if (!matchData || !matchData.rounds || !currentActiveRound) return

    // A. Set Timer Duration
    // Gunakan duration dari ronde aktif
    const defaultDuration = currentActiveRound.duration || (isSumo ? 3 : 10)
    setSecondsLeft((prev) => (prev === 0 ? defaultDuration * 60 : prev))

    // B. Hitung Total Kemenangan Ronde (History)
    // Hitung ronde yang statusnya FINISHED dan BUKAN ronde yang sedang aktif
    let winsA = 0
    let winsB = 0

    matchData.rounds.forEach((r) => {
      if (r.status === 'FINISHED' && r.uid !== roundId) {
        if (r.scoreA > r.scoreB) winsA++
        else if (r.scoreB > r.scoreA) winsB++
      }
    })
    setHomeRoundsWon(winsA)
    setAwayRoundsWon(winsB)

    // C. Sync Score & Timeline Ronde Aktif
    setHomeScore(currentActiveRound.scoreA)
    setAwayScore(currentActiveRound.scoreB)

    // D. Reconstruct Timeline
    // Filter events milik Match ini, ambil yang roundId-nya sesuai dengan ronde aktif
    if (matchData.events && Array.isArray(matchData.events)) {
      const roundEvents = matchData.events.filter((e) => e.roundId === currentActiveRound.uid)

      const mappedTimeline: ITimelineAction[] = roundEvents.map((ev: IMatchEvent) => {
        // Mapping Backend Type (typeEvent) ke Frontend Type
        let type: ITimelineAction['type'] = 'point'

        if (ev.type === 'YELLOW_CARD') type = 'yellow'
        else if (ev.type === 'RED_CARD') type = 'red'
        else if (ev.type === 'PENALTY') type = 'penalty'
        else if (ev.type === 'GOAL' || ev.type === 'KNOCKOUT') type = 'point'

        const isHome = ev.teamId === matchData.teamA.uid

        return {
          name: isHome ? matchData.teamA.name : matchData.teamB.name,
          team: isHome ? 'home' : 'away',
          time: `${ev.minute}'`,
          type: type,
        }
      })

      // Sort timeline agar urut berdasarkan menit
      setTimeline(mappedTimeline.sort((a, b) => parseInt(a.time) - parseInt(b.time)))
    }
  }, [matchData, currentActiveRound, isSumo, roundId])

  // --- 2. TIMER LOGIC ---
  const toggleTimer = useCallback(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsPlaying(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [isPlaying])

  // Helper Formatter
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // --- 3. HELPER: PROCEED TO NEXT STEP ---
  const checkMatchStatusAndProceed = async (currentRoundWinner: 'home' | 'away' | 'draw') => {
    if (!matchData) return

    let currentWinsA = homeRoundsWon
    let currentWinsB = awayRoundsWon

    if (currentRoundWinner === 'home') currentWinsA++
    else if (currentRoundWinner === 'away') currentWinsB++

    const bestOf = matchData.bestOf || 3
    const winThreshold = Math.ceil(bestOf / 2)

    if (currentWinsA >= winThreshold || currentWinsB >= winThreshold) {
      // MATCH SELESAI
      const winnerName = currentWinsA >= winThreshold ? matchData.teamA.name : matchData.teamB.name
      toast.dismiss()
      toast.success(`PERTANDINGAN SELESAI! Pemenang: ${winnerName}`)

      setTimeout(() => {
        router.push('/admin/match')
      }, 1500)
    } else {
      // LANJUT RONDE BERIKUTNYA
      toast.loading('Menyiapkan Ronde Berikutnya...')

      try {
        await createRound({
          tourId: matchData.tournamentId,
          matchId: matchData.uid,
        })

        toast.dismiss()
        // currentActiveRound mungkin undefined setelah await, jadi kita pakai optional chaining atau logic aman
        const nextRoundNum = (currentActiveRound?.roundNumber || 0) + 1
        toast.success(`Lanjut ke Ronde ${nextRoundNum}`)

        // Reset State
        const defaultDuration = isSumo ? 3 : 10
        setSecondsLeft(defaultDuration * 60)
        setHomeScore(0)
        setAwayScore(0)
        setTimeline([])
        setHomeRoundsWon(currentWinsA)
        setAwayRoundsWon(currentWinsB)

        setIsPlaying(false)
        if (timerRef.current) clearInterval(timerRef.current)
      } catch (error) {
        toast.error('Gagal membuat ronde baru')
      }
    }
  }

  // --- 4. ACTION HANDLERS ---
  const handleAction = async (type: 'GOAL' | 'YELLOW' | 'RED' | 'PENALTY', team: 'home' | 'away') => {
    if (!matchData || !currentActiveRound) return

    const teamId = team === 'home' ? matchData.teamA.uid : matchData.teamB.uid
    const teamName = team === 'home' ? matchData.teamA.name : matchData.teamB.name

    // Optimistic Update UI
    const timeString = formatTime(secondsLeft)
    setTimeline((prev) => [
      ...prev,
      {
        name: teamName,
        team,
        time: timeString,
        type: type === 'GOAL' ? 'point' : type === 'YELLOW' ? 'yellow' : type === 'RED' ? 'red' : 'penalty',
      },
    ])

    if (type === 'GOAL' || type === 'PENALTY') {
      if (team === 'home') setHomeScore((h) => h + 1)
      else setAwayScore((a) => a + 1)
    }

    try {
      // Tentukan tipe event backend
      let backendEventType: typeEvent = 'FOUL' // Default fallback
      if (type === 'GOAL') backendEventType = 'GOAL'
      if (type === 'YELLOW') backendEventType = 'YELLOW_CARD'
      if (type === 'RED') backendEventType = 'RED_CARD'
      if (type === 'PENALTY') backendEventType = 'PENALTY'

      const duration = currentActiveRound.duration || (isSumo ? 3 : 10)
      const currentMinute = Math.ceil((duration * 60 - secondsLeft) / 60) || 1

      await updateScore({
        matchId: matchData.uid,
        body: {
          teamId,
          type: backendEventType,
          value: 1,
          minute: currentMinute,
        },
      })

      if (isSumo && type === 'GOAL') {
        handleSumoAutoRound(team)
      }
    } catch (error) {
      toast.error('Gagal update skor ke server')
    }
  }

  const handleSumoAutoRound = async (winner: 'home' | 'away') => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)

    toast.loading('Point Masuk! Menyelesaikan Ronde...')

    try {
      if (!matchData) return
      await endRound({ matchId: matchData.uid })
      await checkMatchStatusAndProceed(winner)
    } catch (err) {
      toast.dismiss()
      toast.error('Gagal menyelesaikan ronde otomatis')
    }
  }

  const handleManualFinish = async () => {
    if (!matchData) return

    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    toast.loading('Menyelesaikan Ronde...')

    try {
      await endRound({ matchId: matchData.uid })

      let roundWinner: 'home' | 'away' | 'draw' = 'draw'
      if (homeScore > awayScore) roundWinner = 'home'
      else if (awayScore > homeScore) roundWinner = 'away'

      await checkMatchStatusAndProceed(roundWinner)
    } catch (e) {
      toast.dismiss()
      toast.error('Gagal menyelesaikan ronde secara manual')
    }
  }

  return {
    matchData,
    currentRoundNumber: currentActiveRound?.roundNumber || 1,
    state: {
      isPlaying,
      secondsLeft,
      timeString: formatTime(secondsLeft),
      homeScore,
      awayScore,
      homeRoundsWon,
      awayRoundsWon,
      timeline,
      matchType,
    },
    actions: {
      toggleTimer,
      handleAction,
      handleManualFinish,
    },
  }
}
