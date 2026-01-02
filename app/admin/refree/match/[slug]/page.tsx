'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/ui/loader'
import MatchControlInterface from '@/components/templates/match/match-control'

function MatchControlWrapper() {
  const params = useParams()
  const roundId = params.slug as string

  if (!roundId) return null

  return <MatchControlInterface roundId={roundId} />
}

const MatchControl = () => {
  const { isLoading } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<Loader show />}>
      <MatchControlWrapper />
    </Suspense>
  )
}

export default MatchControl
