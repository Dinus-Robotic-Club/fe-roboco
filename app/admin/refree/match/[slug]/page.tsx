'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/ui/loader'
import MatchControlInterface from '@/components/templates/match/match-control'
import { useMounted } from '@/hooks/useMounted'

function MatchControlWrapper() {
  const params = useParams()
  const mounted = useMounted()
  const matchId = params.slug as string

  if (!matchId) return null

  if (!mounted) return null
  return <MatchControlInterface matchId={matchId} />
}

const MatchControl = () => {
  const { isLoading } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<></>}>
      <MatchControlWrapper />
    </Suspense>
  )
}

export default MatchControl
