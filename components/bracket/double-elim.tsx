'use client'

import React, { useMemo, useState } from 'react'
import { BracketLayout } from '../layout/bracket-layout'
import { BracketLegend, BracketPath, getDynamicColumn } from '@/lib/function'

const NODE_W = 260
const NODE_H = 100
const GAP_X = 80
const GAP_Y = 40

export const BracketDouble = ({ matches }: { matches: IMatchBracket[] }) => {
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null)

  const { nodePositions, containerSize } = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    const cols: Record<number, { ub: IMatchBracket[]; lb: IMatchBracket[]; gf: IMatchBracket[] }> = {}

    let maxFoundCol = 0

    matches.forEach((m) => {
      const c = getDynamicColumn(m.id)

      if (c === 99) return

      maxFoundCol = Math.max(maxFoundCol, c)
      if (!cols[c]) cols[c] = { ub: [], lb: [], gf: [] }

      if (m.id.includes('LB')) cols[c].lb.push(m)
      else if (m.id.includes('GRAND')) cols[c].gf.push(m)
      else cols[c].ub.push(m)
    })

    const gfMatches = matches.filter((m) => m.id.includes('GRAND'))
    if (gfMatches.length > 0) {
      const gfCol = maxFoundCol + 1
      if (!cols[gfCol]) cols[gfCol] = { ub: [], lb: [], gf: [] }
      cols[gfCol].gf = gfMatches
      maxFoundCol = gfCol
    }

    for (let c = 0; c <= maxFoundCol; c++) {
      if (!cols[c]) continue

      const { ub, lb, gf } = cols[c]
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
      })

      let maxY_UB = -100
      if (ub.length > 0) {
        ub.forEach((m) => {
          if (pos[m.id]) maxY_UB = Math.max(maxY_UB, pos[m.id].y)
        })
      } else {
        maxY_UB = 0
      }

      const SECTION_GAP = 120

      const startY_LB = Math.max(0, maxY_UB + NODE_H + SECTION_GAP)

      lb.sort((a, b) => a.id.localeCompare(b.id))

      lb.forEach((match, idx) => {
        const y = startY_LB + idx * (NODE_H + GAP_Y)
        pos[match.id] = { x, y }
      })

      gf.forEach((match) => {
        const sources = matches.filter((prev) => prev.nextMatchWinId === match.id)
        const validSources = sources.filter((s) => pos[s.id])

        let y = 0
        if (validSources.length > 0) {
          y = validSources.reduce((acc, s) => acc + pos[s.id].y, 0) / validSources.length
        } else {
          y = 200
        }
        pos[match.id] = { x, y }
      })
    }

    let w = 0,
      h = 0
    Object.values(pos).forEach((p) => {
      w = Math.max(w, p.x + NODE_W)
      h = Math.max(h, p.y + NODE_H)
    })

    return { nodePositions: pos, containerSize: { w: w + 100, h: h + 100 } }
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

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F9FA] p-8 rounded-xl border border-gray-200">
      <BracketLegend />

      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <div style={{ width: Math.max(containerSize.w, 800), height: Math.max(containerSize.h, 600), position: 'relative' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">{paths}</svg>

          {matches.map((match) => {
            const pos = nodePositions[match.id]
            if (!pos) return null

            return (
              <div
                key={match.id}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: NODE_W,
                  transition: 'all 0.5s ease',
                }}>
                <BracketLayout match={match} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
