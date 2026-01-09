'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGetMatchRound } from '../useGetMatchRound'
import { useUpdateScoreMatch } from '../useUpdateScoreMatch'
import { useEndMatchRound } from '../useEndMatchRound'
import { useCreateMatchRound } from '../useCreateMatchRound'
import { ITimelineAction } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'

export function useMatchLogic(matchId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // --- QUERIES & MUTATIONS ---
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

  // Store last known good state for error recovery
  const lastGoodStateRef = useRef<{
    homeScore: number
    awayScore: number
    timeline: ITimelineAction[]
  } | null>(null)

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

    // Store as last known good state
    lastGoodStateRef.current = {
      homeScore: currentActiveRound.scoreA,
      awayScore: currentActiveRound.scoreB,
      timeline: [],
    }

    // D. Reconstruct Timeline (Fix filter by Round ID)
    if (matchData.events && Array.isArray(matchData.events)) {
      const roundEvents = matchData.events.filter((e) => e.roundId === currentActiveRound.uid)

      const mappedTimeline: ITimelineAction[] = roundEvents.map((ev: IMatchEvent) => {
        let type: ITimelineAction['type'] = 'point'
        if (ev.type === 'YELLOW_CARD') type = 'yellow'
        else if (ev.type === 'RED_CARD') type = 'red'
        else if (ev.type === 'PENALTY') type = 'penalty'
        else if (ev.type === 'GOAL' || ev.type === 'KNOCKOUT') type = 'point'

        const isHome = ev.teamId === matchData.teamA?.uid

        return {
          name: isHome ? matchData.teamA?.name : matchData.teamB?.name,
          team: isHome ? 'home' : 'away',
          time: `${ev.minute}'`,
          type: type,
        }
      })

      const sortedTimeline = mappedTimeline.sort((a, b) => parseInt(a.time as string) - parseInt(b.time as string))
      setTimeline(sortedTimeline)

      // Update last good state with timeline
      lastGoodStateRef.current = {
        homeScore: currentActiveRound.scoreA,
        awayScore: currentActiveRound.scoreB,
        timeline: sortedTimeline,
      }
    }
  }, [matchData, currentActiveRound, isSumo])

  // --- RESTORE DATA FROM SERVER ON ERROR ---
  const restoreFromServer = useCallback(async () => {
    toast.info('Memulihkan data dari server...')
    try {
      const result = await refetch()
      const freshData = result.data?.data as IMatchRound | undefined
      const freshRound = freshData?.rounds?.find((r) => r.status === 'ACTIVE')

      if (freshRound) {
        setHomeScore(freshRound.scoreA)
        setAwayScore(freshRound.scoreB)

        // Restore timeline from events
        if (freshData?.events && Array.isArray(freshData.events)) {
          const roundEvents = freshData.events.filter((e) => e.roundId === freshRound.uid)
          const mappedTimeline: ITimelineAction[] = roundEvents.map((ev: IMatchEvent) => {
            let type: ITimelineAction['type'] = 'point'
            if (ev.type === 'YELLOW_CARD') type = 'yellow'
            else if (ev.type === 'RED_CARD') type = 'red'
            else if (ev.type === 'PENALTY') type = 'penalty'
            else if (ev.type === 'GOAL' || ev.type === 'KNOCKOUT') type = 'point'

            const isHome = ev.teamId === freshData.teamA?.uid

            return {
              name: isHome ? freshData.teamA?.name : freshData.teamB?.name,
              team: isHome ? 'home' : 'away',
              time: `${ev.minute}'`,
              type: type,
            }
          })
          setTimeline(mappedTimeline.sort((a, b) => parseInt(a.time as string) - parseInt(b.time as string)))
        }

        toast.success('Data berhasil dipulihkan')
      }
    } catch (restoreError) {
      console.error('Error restoring data:', restoreError)
      toast.error('Gagal memulihkan data')
    }
  }, [refetch])

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

    const teamId = team === 'home' ? matchData.teamA?.uid : matchData.teamB?.uid
    const teamName = team === 'home' ? matchData.teamA?.name : matchData.teamB?.name

    // Store current state before optimistic update (for rollback)
    const previousState = {
      homeScore,
      awayScore,
      timeline: [...timeline],
    }

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
          teamId: teamId!,
          type: backendEventType,
          value: 1,
          minute: currentMinute,
        },
      })

      // SUMO: Langsung proceed ke round berikutnya setelah GOAL (tanpa endRound)
      if (isSumo && type === 'GOAL') {
        // Calculate the new scores after optimistic update
        const newHomeScore = team === 'home' ? homeScore + 1 : homeScore
        const newAwayScore = team === 'away' ? awayScore + 1 : awayScore

        let roundWinner: 'home' | 'away' | 'draw' = 'draw'
        if (newHomeScore > newAwayScore) roundWinner = 'home'
        else if (newAwayScore > newHomeScore) roundWinner = 'away'

        // SUMO: Skip endRound, go directly to checkMatchStatus
        await checkMatchStatusForSumo(roundWinner)
      }
    } catch (error) {
      toast.error('Gagal update skor ke server')
      console.error('Error updating score:', error)

      // RESTORE: Rollback to previous state first (simple rollback)
      setHomeScore(previousState.homeScore)
      setAwayScore(previousState.awayScore)
      setTimeline(previousState.timeline)

      // Then fetch fresh data from server for complete restore
      await restoreFromServer()
    }
  }

  // SUMO specific: Only updateScore + createRound (NO endRound)
  const checkMatchStatusForSumo = async (currentRoundWinner: 'home' | 'away' | 'draw') => {
    if (!matchData) return

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    toast.loading('Memproses hasil ronde SUMO...')

    try {
      // Calculate wins including current round
      let currentWinsA = homeRoundsWon
      let currentWinsB = awayRoundsWon
      if (currentRoundWinner === 'home') currentWinsA++
      else if (currentRoundWinner === 'away') currentWinsB++

      const bestOf = matchData.bestOf || 3
      const winThreshold = Math.ceil(bestOf / 2)

      const matchFinished = currentWinsA >= winThreshold || currentWinsB >= winThreshold

      if (matchFinished) {
        // Match is over
        const winnerName = currentWinsA >= winThreshold ? matchData.teamA?.name : matchData.teamB?.name
        toast.dismiss()
        toast.success(`PERTANDINGAN SELESAI! Pemenang: ${winnerName}`)

        await queryClient.invalidateQueries({ queryKey: ['match-group'] })
        await queryClient.invalidateQueries({ queryKey: ['get-ongoing-match'] })

        setTimeout(() => {
          router.push('/admin/refree/match')
        }, 1500)
      } else {
        // Match continues - create new round (SUMO: NO endRound call)
        toast.dismiss()
        toast.loading('Menyiapkan Ronde Berikutnya...')

        await createRound({
          tourId: matchData.tournamentId,
          matchId: matchData.uid,
        })

        toast.dismiss()
        const nextRoundNum = (currentActiveRound?.roundNumber || 0) + 1
        toast.success(`Lanjut ke Ronde ${nextRoundNum}`)

        // Reset Local State for new round
        const defaultDuration = currentActiveRound?.duration || 3
        setSecondsLeft(defaultDuration * 60)
        setHomeScore(0)
        setAwayScore(0)
        setTimeline([])
        setHomeRoundsWon(currentWinsA)
        setAwayRoundsWon(currentWinsB)

        refetch()
      }
    } catch (error: unknown) {
      toast.dismiss()
      console.error('Error in checkMatchStatusForSumo:', error)
      toast.error('Gagal memproses hasil ronde SUMO')

      // Restore from server on error
      await restoreFromServer()
    }
  }

  // SOCCER: Uses endRound hook - 2 halves (babak), winner by total goals
  const checkMatchStatusAndProceed = async (_currentRoundWinner: 'home' | 'away' | 'draw') => {
    if (!matchData) return

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)

    try {
      // 1. End the current half on backend
      const result = (await endRound({ matchId: matchData.uid })) as { data?: IEndRoundResponse }

      // 2. Check if match is finished based on backend response
      // SOCCER: Match selesai setelah 2 halves (babak)
      let matchFinished = result?.data?.matchFinished || result?.data?.updatedMatch?.status === 'FINISHED'

      // Calculate current half number
      const finishedHalves = matchData.rounds?.filter((r) => r.status === 'FINISHED').length || 0
      const currentHalf = finishedHalves + 1 // Including the one we just finished

      // SOCCER: 2 halves total
      const TOTAL_HALVES = 2

      // If we've played 2 halves, match should be finished
      if (!matchFinished && currentHalf >= TOTAL_HALVES) {
        matchFinished = true
      }

      if (matchFinished) {
        // SOCCER: Match is over - determine winner by total goals
        // Calculate total goals from all events in the match
        const allGoalEvents = matchData.events?.filter((e) => e.type === 'GOAL') || []
        let totalGoalsA = 0
        let totalGoalsB = 0

        allGoalEvents.forEach((e) => {
          if (e.teamId === matchData.teamA?.uid) totalGoalsA += e.value || 1
          else if (e.teamId === matchData.teamB?.uid) totalGoalsB += e.value || 1
        })

        // Add current round scores
        totalGoalsA += homeScore
        totalGoalsB += awayScore

        let winnerName: string | undefined
        let isDraw = false

        if (totalGoalsA > totalGoalsB) {
          winnerName = matchData.teamA?.name
        } else if (totalGoalsB > totalGoalsA) {
          winnerName = matchData.teamB?.name
        } else {
          isDraw = true
        }

        toast.dismiss()
        if (isDraw) {
          toast.success(`PERTANDINGAN SELESAI! Hasil: SERI ${totalGoalsA} - ${totalGoalsB}`)
        } else {
          toast.success(`PERTANDINGAN SELESAI! Pemenang: ${winnerName} (${totalGoalsA} - ${totalGoalsB})`)
        }

        await queryClient.invalidateQueries({ queryKey: ['match-group'] })
        await queryClient.invalidateQueries({ queryKey: ['get-ongoing-match'] })

        setTimeout(() => {
          router.push('/admin/refree/match')
        }, 1500)
      } else {
        // Match continues - create next half (half 2)
        toast.dismiss()
        toast.loading('Menyiapkan Babak 2...')

        await createRound({
          tourId: matchData.tournamentId,
          matchId: matchData.uid,
        })

        toast.dismiss()
        toast.success('Lanjut ke Babak 2')

        // Reset Local State for next half (keep accumulated scores for display)
        const defaultDuration = currentActiveRound?.duration || 3
        setSecondsLeft(defaultDuration * 60)
        setHomeScore(0)
        setAwayScore(0)
        setTimeline([])

        refetch()
      }
    } catch (error: unknown) {
      toast.dismiss()

      // Check if error indicates match is already finished
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('already finished') || errorMessage.includes('finished') || errorMessage.includes('round not found') || errorMessage.includes('not found')) {
        toast.success('Pertandingan sudah selesai!')
        await queryClient.invalidateQueries({ queryKey: ['match-group'] })
        setTimeout(() => {
          router.push('/admin/refree/match')
        }, 1500)
        return
      }

      toast.error('Gagal memproses hasil babak')
      console.error('Error in checkMatchStatusAndProceed:', error)

      // Restore from server on error
      await restoreFromServer()
    }
  }

  // Handle Manual Finish (Tombol Selesai)
  const handleManualFinish = async () => {
    if (!matchData) return

    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    toast.loading('Menyelesaikan Ronde...')

    try {
      let roundWinner: 'home' | 'away' | 'draw' = 'draw'
      if (homeScore > awayScore) roundWinner = 'home'
      else if (awayScore > homeScore) roundWinner = 'away'

      // SUMO: Skip endRound, SOCCER: Use endRound
      if (isSumo) {
        await checkMatchStatusForSumo(roundWinner)
      } else {
        // FIXED: Don't call endRound here because checkMatchStatusAndProceed calls it internally.
        // This prevents the double-hit bug.
        await checkMatchStatusAndProceed(roundWinner)
      }
    } catch (e) {
      toast.dismiss()
      toast.error('Gagal menyelesaikan ronde secara manual')
      console.error('Error ending round manually:', e)

      // Restore from server on error
      await restoreFromServer()
    }
  }

  return {
    matchData,
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
