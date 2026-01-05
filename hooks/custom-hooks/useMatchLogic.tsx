'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGetMatchRound } from '../useGetMatchRound'
import { useUpdateScoreMatch } from '../useUpdateScoreMatch'
import { useEndMatchRound } from '../useEndMatchRound'
import { useCreateMatchRound } from '../useCreateMatchRound'
import { ITimelineAction } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query' // Opsional: untuk invalidasi manual

export function useMatchLogic(matchId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // --- QUERIES & MUTATIONS ---
  // Pastikan useGetMatchRound mengembalikan object query lengkap (termasuk refetch)
  const { data: response, refetch } = useGetMatchRound(matchId)

  const { mutateAsync: updateScore } = useUpdateScoreMatch()
  const { mutateAsync: endRound } = useEndMatchRound()
  const { mutateAsync: createRound } = useCreateMatchRound()

  const matchData = response?.data as IMatchRound | undefined

  const currentActiveRound = matchData?.rounds?.find((r) => r.status === 'ACTIVE')

  const matchType = matchData?.category || 'SOCCER'
  const isSumo = matchType === 'SUMO'

  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>(0)

  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [homeRoundsWon, setHomeRoundsWon] = useState(0)
  const [awayRoundsWon, setAwayRoundsWon] = useState(0)

  const [timeline, setTimeline] = useState<ITimelineAction[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!matchData || !matchData.rounds) return

    let winsA = 0
    let winsB = 0
    matchData.rounds.forEach((r) => {
      if (r.status === 'FINISHED') {
        if (r.scoreA > r.scoreB) winsA++
        else if (r.scoreB > r.scoreA) winsB++
      }
    })
    setHomeRoundsWon(winsA)
    setAwayRoundsWon(winsB)

    if (!currentActiveRound) return

    const defaultDuration = parseInt(currentActiveRound.duration.toString())

    setSecondsLeft((prev) => {
      return prev === 0 ? defaultDuration * 60 : prev
    })

    setHomeScore(currentActiveRound.scoreA)
    setAwayScore(currentActiveRound.scoreB)

    // D. Reconstruct Timeline (Fix filter by Round ID)
    if (matchData.events && Array.isArray(matchData.events)) {
      // Filter event HANYA untuk ronde yang sedang aktif
      const roundEvents = matchData.events.filter((e) => e.roundId === currentActiveRound.uid)

      const mappedTimeline: ITimelineAction[] = roundEvents.map((ev: IMatchEvent) => {
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

      setTimeline(mappedTimeline.sort((a, b) => parseInt(a.time) - parseInt(b.time)))
    }
  }, [matchData, currentActiveRound, isSumo]) // Hapus matchId dari dependency agar tidak re-run berlebih

  // --- 3. TIMER LOGIC ---
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

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleAction = async (type: 'GOAL' | 'YELLOW' | 'RED' | 'PENALTY', team: 'home' | 'away') => {
    if (!matchData || !currentActiveRound) {
      toast.error('Tidak ada ronde aktif!')
      return
    }

    const teamId = team === 'home' ? matchData.teamA.uid : matchData.teamB.uid
    const teamName = team === 'home' ? matchData.teamA.name : matchData.teamB.name

    // 1. Optimistic Update (UI duluan)
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

    // 2. Server Update
    try {
      let backendEventType: string = 'FOUL'
      if (type === 'GOAL') backendEventType = 'GOAL'
      if (type === 'YELLOW') backendEventType = 'YELLOW_CARD'
      if (type === 'RED') backendEventType = 'RED_CARD'
      if (type === 'PENALTY') backendEventType = 'PENALTY'

      const duration = parseInt(currentActiveRound.duration.toString())
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
        let roundWinner: 'home' | 'away' | 'draw' = 'draw'
        if (homeScore > awayScore) roundWinner = 'home'
        else if (awayScore > homeScore) roundWinner = 'away'
        checkMatchStatusAndProceed(roundWinner)
      }
    } catch (error) {
      toast.error('Gagal update skor ke server')
      console.log('Error updating score:', error)

      setTimeline((prev) => prev.slice(0, -1))
      if (type === 'GOAL') {
        if (team === 'home') setHomeScore((h) => Math.max(0, h - 1))
        else setAwayScore((a) => Math.max(0, a - 1))
      }
    }
  }

  const checkMatchStatusAndProceed = async (currentRoundWinner: 'home' | 'away' | 'draw') => {
    if (!matchData) return

    let currentWinsA = homeRoundsWon
    let currentWinsB = awayRoundsWon

    if (currentRoundWinner === 'home') currentWinsA++
    else if (currentRoundWinner === 'away') currentWinsB++

    const bestOf = matchData.bestOf || 3
    const winThreshold = Math.ceil(bestOf / 2)

    if (currentWinsA >= winThreshold || currentWinsB >= winThreshold) {
      const winnerName = currentWinsA >= winThreshold ? matchData.teamA.name : matchData.teamB.name
      toast.dismiss()
      toast.success(`PERTANDINGAN SELESAI! Pemenang: ${winnerName}`)

      await queryClient.invalidateQueries({ queryKey: ['match-group'] })

      setTimeout(() => {
        router.push('/admin/refree/match')
      }, 1500)
    } else {
      toast.loading('Menyiapkan Ronde Berikutnya...')

      try {
        await createRound({
          tourId: matchData.tournamentId,
          matchId: matchData.uid,
        })

        toast.dismiss()
        const nextRoundNum = (currentActiveRound?.roundNumber || 0) + 1
        toast.success(`Lanjut ke Ronde ${nextRoundNum}`)

        // Reset Local State
        const defaultDuration = isSumo ? currentActiveRound?.duration : 3
        setSecondsLeft(defaultDuration! * 60)
        setHomeScore(0)
        setAwayScore(0)
        setTimeline([])

        setHomeRoundsWon(currentWinsA)
        setAwayRoundsWon(currentWinsB)

        setIsPlaying(false)
        if (timerRef.current) clearInterval(timerRef.current)

        refetch()
      } catch (error) {
        toast.dismiss()
        toast.error('Gagal membuat ronde baru')
        console.log('Error creating new round:', error)
      }
    }
  }

  // Handle Manual Finish (Tombol Selesai)
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
      console.log('Error ending round manually:', e)
    }
  }

  return {
    matchData,
    // Jika tidak ada active round, mungkin match baru selesai atau belum mulai
    currentRoundNumber: currentActiveRound?.roundNumber || matchData?.rounds?.length || 0,
    isMatchActive: !!currentActiveRound,
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
