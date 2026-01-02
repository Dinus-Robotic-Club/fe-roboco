'use client'

import { ActionButton } from '@/components/ui/button'
import { TimelineItem } from '@/components/ui/timeline'
import { ACTIONS_CONFIG } from '@/lib'
import { IMatchActionProps, ManualActionType } from '@/lib/types'
import { useEffect, useRef } from 'react'
import { TbRectangleVerticalFilled } from 'react-icons/tb'

function MatchAction({ startMatch, handleScoreAction, timeline }: IMatchActionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll ke bawah saat ada event baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [timeline])

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col gap-6">
      {/* SECTION A: TIMELINE FEED */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-72">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Match Events</h3>
          <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono">{timeline.length} Events</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth bg-slate-50/30">
          {timeline.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <TbRectangleVerticalFilled className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-sm font-medium">Belum ada kejadian</p>
            </div>
          ) : (
            timeline.map((item, i) => <TimelineItem key={i} event={item} />)
          )}
        </div>
      </div>

      {/* SECTION B: CONTROL PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
        {/* Divider Visual di Desktop */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

        {/* Home Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Home Actions</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS_CONFIG.map((action) => (
              <ActionButton
                key={action.id}
                config={action}
                disabled={!startMatch}
                align="left"
                // Mengirim action.id ('GOAL', 'YELLOW', dst) ke hook
                onClick={() => handleScoreAction(action.id as ManualActionType, 'home')}
              />
            ))}
          </div>
        </div>

        {/* Away Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2 mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Away Actions</p>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS_CONFIG.map((action) => (
              <ActionButton
                key={action.id}
                config={action}
                disabled={!startMatch}
                align="right"
                // Mengirim action.id ('GOAL', 'YELLOW', dst) ke hook
                onClick={() => handleScoreAction(action.id as ManualActionType, 'away')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchAction
