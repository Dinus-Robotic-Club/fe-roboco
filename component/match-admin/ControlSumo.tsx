import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { Play, FlagTriangleRightIcon, Pause, ArrowLeftIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import ValidationModal from '@/component/match-admin/validationModal'
import { TimelineAction } from '@/lib/types/type'
import MatchAction from './MatchAction'
import { useRouter } from 'next/navigation'

function ControlSumo({ matchId }: { matchId: string }) {
  const [startMatch, setStartMatch] = useState(false)
  const [showModalFinish, setShowModalFinish] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [timeline, setTimeline] = useState<TimelineAction[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [roundNumber, setRoundNumber] = useState(1) // ronde ke berapa
  const [homeRounds, setHomeRounds] = useState(0) // menang berapa ronde
  const [awayRounds, setAwayRounds] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(180)
  const router = useRouter()

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const confirmPlay = () => {
    setStartMatch(true)
    setSecondsLeft(180)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setStartMatch(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleScoreAction = (actionName: string, actionType: string, team: 'home' | 'away') => {
    const actionTime = formatTime(secondsLeft)
    const newAction: TimelineAction = {
      name: actionName + ' R' + roundNumber,
      team: team,
      time: actionTime,
      type: actionType as TimelineAction['type'],
    }

    setTimeline((prev) => [...prev, newAction])

    if (actionType === 'point') {
      if (team === 'home') {
        setHomeScore((prev) => prev + 1)
        setHomeRounds((prev) => prev + 1)
      } else {
        setAwayScore((prev) => prev + 1)
        setAwayRounds((prev) => prev + 1)
      }

      // Stop timer ronde ini
      if (timerRef.current) clearInterval(timerRef.current)

      setRoundNumber((prev) => prev + 1)
      setSecondsLeft(180)
      setStartMatch(false)

      return
    }
  }

  const handleFinish = () => {
    setShowModalFinish(true)
  }

  const confirmFinish = () => {
    setShowModalFinish(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setStartMatch(false)
    setSecondsLeft(180)
    console.log(timeline)
    setHomeScore(0)
    setAwayScore(0)
    setRoundNumber(1)
    setHomeRounds(0)
    setAwayRounds(0)
    setTimeline([])
  }

  const handlePause = () => {
    if (!startMatch) return

    if (!isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPaused(true)
    } else {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setStartMatch(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setIsPaused(false)
    }
  }

  return (
    <>
      <HeaderDashboard title="Match Control" name="Admin" />
      <main className="w-full p-4 md:p-6 mb-20 flex flex-col items-center">
        <div className="w-full py-6 px-3 flex-col items-center justify-between rounded-md bg-white shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] lg:bg-transparent lg:shadow-none font-plus-jakarta-sans">
          <p className="mb-6 text-gray-700 font-medium tracking-wide text-center block">GROUP B - MATCH 2 - SUMMO BOT</p>

          <div className="w-full flex lg:flex-col items-center justify-between">
            <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row items-start justify-center w-full lg:max-w-6x md:px-3">
              {/* Home Team */}
              <div className="w-full lg:w-auto flex items-center justify-between">
                <div className="flex flex-col items-start lg:items-end">
                  <div className="flex flex-row-reverse lg:flex-row items-center gap-4 justify-end col-span-2">
                    <div className="flex flex-col lg:text-right">
                      <h1 className="text-xl font-bold line-clamp-1">Nee GUZZ</h1>
                      <p className="text-sm text-gray-600 line-clamp-1">Universitas Digidaw</p>
                    </div>
                    <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                      <Image src="/logo-only.svg" alt="logo" height={30} width={30} className="w-auto h-auto p-2" />
                    </div>
                    <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">{homeScore}</p>
                  </div>

                  <div className="mt-2 flex gap-2 sm:gap-3 lg:flex-row-reverse">
                    <span className={`w-7 h-2 ${homeRounds >= 1 ? 'bg-[#f9fd0b]' : 'bg-gray-300'}`}></span>
                    <span className={`w-7 h-2 ${homeRounds >= 2 ? 'bg-[#f9fd0b]' : 'bg-gray-300'}`}></span>
                  </div>
                </div>
                <div className="font-plus-jakarta-sans text-2xl sm:text-3xl block lg:hidden">
                  <p className=" font-bold bg-black text-white w-16 h-16 sm:w-[70px] flex items-center justify-center">{homeScore}</p>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center col-span-1 gap-2 mx-3">
                <Image src="/logo-only.svg" alt="Center Logo" width={50} height={50} className="w-28" />
                <div className="h-22 bg-time bg-contain w-[310px] flex items-center justify-center font-bold pb-2 font-fira-code text-4xl">{formatTime(secondsLeft)}</div>
              </div>
              <div className="w-full lg:w-auto flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-4 justify-start col-span-2 ">
                    <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">{awayScore}</p>

                    <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px]  flex items-center justify-center">
                      <Image src="/logo-only.svg" alt="logo" height={30} width={30} className="w-auto h-auto p-2" />
                    </div>

                    <div className="flex flex-col text-left">
                      <h1 className="text-xl font-bold line-clamp-1">Mahasigma</h1>
                      <p className="text-sm text-gray-600 line-clamp-1">Universitas Digidaw</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 sm:gap-3 items-start">
                    <span className={`w-7 h-2 ${awayRounds >= 1 ? 'bg-[#f9fd0b]' : 'bg-gray-300'}`}></span>
                    <span className={`w-7 h-2 ${awayRounds >= 2 ? 'bg-[#f9fd0b]' : 'bg-gray-300'}`}></span>
                  </div>
                </div>
                <div className="font-plus-jakarta-sans text-2xl sm:text-3xl block lg:hidden">
                  <p className=" font-bold bg-black text-white w-16 h-16 sm:w-[70px] flex items-center justify-center">{awayScore}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full lg:hidden">
          <div className="h-22 bg-time bg-contain w-[320px] flex items-center justify-center font-bold pb-2.5 font-fira-code text-4xl">{formatTime(secondsLeft)}</div>
        </div>
        <MatchAction startMatch={startMatch} handleScoreAction={handleScoreAction} timeline={timeline} />
        <div className="w-full mt-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:flex md:justify-between md:items-center">
            {/* BACK */}
            <button
              disabled={startMatch && homeRounds < 2 && awayRounds < 2}
              onClick={() => router.push('/admin/match')}
              className="order-1 md:order-0 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 bg-yellow-300 hover:bg-yellow-400 text-black disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
              <ArrowLeftIcon size={18} />
              Back
            </button>

            {/* START */}
            <button
              onClick={confirmPlay}
              disabled={startMatch || homeRounds >= 2 || awayRounds >= 2}
              className="order-2 md:order-0 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
              <Play size={18} />
              Start
            </button>

            {/* PAUSE / CONTINUE */}
            <button
              disabled={!startMatch}
              onClick={handlePause}
              className="order-3 md:order-0 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hadow-md active:scale-95 bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
              <Pause size={18} />
              {isPaused ? 'Continue' : 'Pause'}
            </button>

            {/* FINISH */}
            <button
              onClick={handleFinish}
              disabled={roundNumber <= 3}
              className="order-4 md:order-0 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
              <FlagTriangleRightIcon size={18} />
              Finish
            </button>
          </div>
        </div>

        {showModalFinish ? (
          <ValidationModal setShowModalStart={setShowModalFinish} action={confirmFinish} title="Akhiri Pertandingan?" desc="Pertandingan akan selesai jika anda memilih Finish" confirm_text="Finish" />
        ) : null}
      </main>
    </>
  )
}

export default ControlSumo
