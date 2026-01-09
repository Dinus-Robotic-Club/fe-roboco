'use client'

import React, { useMemo, useState } from 'react'
import { BracketLayout } from '../layout/bracket-layout'
import { BracketLegend, BracketPath, getDynamicColumn, getImageUrl } from '@/lib/function'
import Image from 'next/image'
import { Trophy } from 'lucide-react'

const NODE_W = 260
const NODE_H = 100
const GAP_X = 80
const GAP_Y = 40
const SECTION_GAP = 60
const DIVIDER_HEIGHT = 50
const PODIUM_WIDTH = 180

// Section header component
const SectionHeader = ({ title, y }: { title: string; y: number }) => (
  <div className="absolute left-0 flex items-center gap-3 z-10" style={{ top: y, width: '100%' }}>
    <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
    <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-500 shadow-sm whitespace-nowrap">{title}</span>
    <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
  </div>
)

// Podium card for top 3 placements
const PodiumCard = ({ team, placement, className }: { team: ITeamBracket | null; placement: 1 | 2 | 3; className?: string }) => {
  const placementConfig = {
    1: {
      label: 'JUARA 1',
      bg: 'bg-linear-to-br from-amber-100 via-yellow-50 to-amber-100',
      border: 'border-amber-300',
      iconBg: 'bg-amber-400',
      iconColor: 'text-amber-900',
      textColor: 'text-amber-900',
      shadow: 'shadow-amber-200/50',
      trophyColor: 'text-amber-500',
    },
    2: {
      label: 'JUARA 2',
      bg: 'bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100',
      border: 'border-slate-300',
      iconBg: 'bg-slate-400',
      iconColor: 'text-slate-900',
      textColor: 'text-slate-700',
      shadow: 'shadow-slate-200/50',
      trophyColor: 'text-slate-400',
    },
    3: {
      label: 'JUARA 3',
      bg: 'bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100',
      border: 'border-orange-300',
      iconBg: 'bg-orange-400',
      iconColor: 'text-orange-900',
      textColor: 'text-orange-800',
      shadow: 'shadow-orange-200/50',
      trophyColor: 'text-orange-500',
    },
  }

  const config = placementConfig[placement]

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-xl border-2 ${config.bg} ${config.border} shadow-lg ${config.shadow} transition-transform hover:scale-105 ${className}`}
      style={{ width: PODIUM_WIDTH }}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.iconBg} mb-3`}>
        <Trophy className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      <span className={`text-[10px] font-bold uppercase tracking-widest ${config.textColor} mb-2`}>{config.label}</span>

      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white mb-2">
        <Image src={getImageUrl(team?.logoUrl)} alt={team?.name ?? 'TBD'} width={56} height={56} className="w-full h-full object-contain p-1" unoptimized />
      </div>

      <span className={`text-sm font-bold text-center line-clamp-2 ${config.textColor}`}>{team?.name ?? 'TBD'}</span>
    </div>
  )
}

export const BracketDouble = ({ matches }: { matches: IMatchBracket[] }) => {
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null)

  // Determine top 3 teams from Grand Finals and 3rd place match
  const podiumTeams = useMemo(() => {
    const grandFinal = matches.find((m) => m.id.includes('GRAND'))
    const lbFinal = matches.find((m) => m.id === 'LB-FINAL')

    let first: ITeamBracket | null = null
    let second: ITeamBracket | null = null
    let third: ITeamBracket | null = null

    if (grandFinal && grandFinal.status === 'Completed') {
      const winnerIdx = grandFinal.score[0] > grandFinal.score[1] ? 0 : 1
      first = grandFinal.teams[winnerIdx]
      second = grandFinal.teams[winnerIdx === 0 ? 1 : 0]
    }

    // 3rd place is the loser of LB Final (who lost to 2nd place)
    if (lbFinal && lbFinal.status === 'Completed') {
      const loserIdx = lbFinal.score[0] > lbFinal.score[1] ? 1 : 0
      third = lbFinal.teams[loserIdx]
    }

    return { first, second, third }
  }, [matches])

  const showPodium = podiumTeams.first || podiumTeams.second || podiumTeams.third

  const { nodePositions, containerSize, sectionInfo } = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    const cols: Record<number, { ub: IMatchBracket[]; lb: IMatchBracket[]; gf: IMatchBracket[] }> = {}

    let maxFoundCol = 0

    // Categorize matches into columns and brackets
    matches.forEach((m) => {
      const c = getDynamicColumn(m.id)

      if (c === 99) return

      maxFoundCol = Math.max(maxFoundCol, c)
      if (!cols[c]) cols[c] = { ub: [], lb: [], gf: [] }

      if (m.id.includes('LB')) cols[c].lb.push(m)
      else if (m.id.includes('GRAND')) cols[c].gf.push(m)
      else cols[c].ub.push(m)
    })

    // Place Grand Finals in the last column
    const gfMatches = matches.filter((m) => m.id.includes('GRAND'))
    if (gfMatches.length > 0) {
      const gfCol = maxFoundCol + 1
      if (!cols[gfCol]) cols[gfCol] = { ub: [], lb: [], gf: [] }
      cols[gfCol].gf = gfMatches
      maxFoundCol = gfCol
    }

    // === PHASE 1: Position Upper Bracket matches ===
    let maxY_UB = 0

    for (let c = 0; c <= maxFoundCol; c++) {
      if (!cols[c]) continue

      const { ub } = cols[c]
      const x = c * (NODE_W + GAP_X)

      ub.sort((a, b) => a.id.localeCompare(b.id))

      ub.forEach((match, idx) => {
        let y = 0

        const sources = matches.filter((prev) => prev.nextMatchWinId === match.id)
        const validSources = sources.filter((s) => pos[s.id])

        if (validSources.length > 0) {
          const sumY = validSources.reduce((acc, s) => acc + pos[s.id].y, 0)
          y = sumY / validSources.length
        } else {
          const multiplier = c === 0 ? 1 : Math.pow(1.3, c)
          y = idx * (NODE_H + GAP_Y) * multiplier
        }
        pos[match.id] = { x, y }
        maxY_UB = Math.max(maxY_UB, y + NODE_H)
      })
    }

    // Record UB section end
    const ubSectionEnd = maxY_UB
    const dividerY = ubSectionEnd + SECTION_GAP / 2

    // === PHASE 2: Position Lower Bracket matches ===
    const lbStartY = dividerY + DIVIDER_HEIGHT + SECTION_GAP / 2

    for (let c = 0; c <= maxFoundCol; c++) {
      if (!cols[c]) continue

      const { lb } = cols[c]
      const x = c * (NODE_W + GAP_X)

      lb.sort((a, b) => a.id.localeCompare(b.id))

      lb.forEach((match, idx) => {
        // Try to align with source matches first
        const sources = matches.filter((prev) => prev.nextMatchWinId === match.id || prev.nextMatchLoseId === match.id)
        const validLBSources = sources.filter((s) => pos[s.id] && s.id.includes('LB'))

        let y = lbStartY + idx * (NODE_H + GAP_Y)

        if (validLBSources.length > 0) {
          const sumY = validLBSources.reduce((acc, s) => acc + pos[s.id].y, 0)
          y = Math.max(lbStartY, sumY / validLBSources.length)
        }

        pos[match.id] = { x, y }
      })
    }

    // Find max Y in LB for container sizing
    let maxY_LB = lbStartY
    Object.keys(pos).forEach((id) => {
      if (id.includes('LB')) {
        maxY_LB = Math.max(maxY_LB, pos[id].y + NODE_H)
      }
    })

    // === PHASE 3: Position Grand Finals centered in container ===
    const gfCol = maxFoundCol
    const gfX = gfCol * (NODE_W + GAP_X)

    // Calculate total height and center GF
    const totalHeight = maxY_LB
    const gfY = (totalHeight - NODE_H) / 2

    gfMatches.forEach((match) => {
      pos[match.id] = { x: gfX, y: gfY }
    })

    // Calculate container size
    let w = 0,
      h = 0
    Object.values(pos).forEach((p) => {
      w = Math.max(w, p.x + NODE_W)
      h = Math.max(h, p.y + NODE_H)
    })

    return {
      nodePositions: pos,
      containerSize: { w: w + 100, h: h + 100 },
      sectionInfo: {
        ubHeaderY: -30,
        dividerY: dividerY,
        lbHeaderY: lbStartY - 35,
      },
    }
  }, [matches])

  const paths = useMemo(() => {
    const lines: React.ReactNode[] = []

    matches.forEach((match) => {
      const startPos = nodePositions[match.id]
      if (!startPos) return

      const startPoint = { x: startPos.x + NODE_W, y: startPos.y + 50 }

      if (match.nextMatchWinId && nodePositions[match.nextMatchWinId]) {
        const nextPos = nodePositions[match.nextMatchWinId]
        const isSlotB = match.nextMatchWinSlotIsB

        const endPoint = {
          x: nextPos.x,
          y: nextPos.y + (isSlotB ? 75 : 25),
        }
        lines.push(<BracketPath key={`${match.id}-win`} start={startPoint} end={endPoint} isWinPath={true} />)
      }

      if (match.nextMatchLoseId && nodePositions[match.nextMatchLoseId]) {
        const nextPos = nodePositions[match.nextMatchLoseId]
        const isSlotB = match.nextMatchLoseSlotIsB

        const startLose = { x: startPos.x + NODE_W / 2, y: startPos.y + NODE_H }
        const endPoint = {
          x: nextPos.x,
          y: nextPos.y + (isSlotB ? 75 : 25),
        }

        lines.push(
          <path
            key={`${match.id}-lose`}
            d={`M ${startLose.x} ${startLose.y} L ${startLose.x} ${endPoint.y} L ${endPoint.x} ${endPoint.y}`}
            fill="none"
            className="stroke-red-300 stroke-[1.5px] border-dashed"
            strokeDasharray="4"
          />,
        )
      }
    })
    return lines
  }, [matches, nodePositions])

  // Check if we have LB matches
  const hasLowerBracket = matches.some((m) => m.id.includes('LB'))

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F9FA] py-8 rounded-xl border border-gray-200">
      {/* Podium Section */}
      {showPodium && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-300 to-transparent" />
            <span className="px-4 py-1.5 bg-linear-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full text-[11px] font-bold uppercase tracking-wider text-amber-700 shadow-sm">
              🏆 PODIUM
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-300 to-transparent" />
          </div>

          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place (Silver) - Left */}
            <div className="flex flex-col items-center">
              <PodiumCard team={podiumTeams.second} placement={2} />
              <div className="w-full h-16 bg-linear-to-t from-slate-300 to-slate-200 rounded-b-lg mt-2" />
            </div>

            {/* 1st Place (Gold) - Center, Higher */}
            <div className="flex flex-col items-center -mt-8">
              <PodiumCard team={podiumTeams.first} placement={1} />
              <div className="w-full h-24 bg-linear-to-t from-amber-400 to-amber-300 rounded-b-lg mt-2" />
            </div>

            {/* 3rd Place (Bronze) - Right */}
            <div className="flex flex-col items-center">
              <PodiumCard team={podiumTeams.third} placement={3} />
              <div className="w-full h-12 bg-linear-to-t from-orange-400 to-orange-300 rounded-b-lg mt-2" />
            </div>
          </div>
        </div>
      )}

      <BracketLegend />

      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <div style={{ width: Math.max(containerSize.w, 800), height: Math.max(containerSize.h, 600), position: 'relative', paddingTop: 40, paddingLeft: 0 }}>
          {/* Section Headers */}
          <SectionHeader title="UPPER BRACKET" y={sectionInfo.ubHeaderY + 40} />
          {hasLowerBracket && <SectionHeader title="LOWER BRACKET" y={sectionInfo.lbHeaderY + 40} />}

          {/* Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: 40 }}>
            {paths}
          </svg>

          {/* Match Nodes */}
          {matches.map((match) => {
            const pos = nodePositions[match.id]
            if (!pos) return null

            const isGrandFinal = match.id.includes('GRAND')

            return (
              <div
                key={match.id}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y + 40,
                  width: NODE_W,
                  transition: 'all 0.5s ease',
                }}
                className={isGrandFinal ? 'ring-2 ring-amber-300 ring-offset-2 rounded-lg' : ''}>
                <BracketLayout match={match} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
