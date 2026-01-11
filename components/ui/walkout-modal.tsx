'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trophy, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/function'

interface WalkoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (winnerId: string) => void
  teamA: { uid: string; name: string; logo: string | null } | null | undefined
  teamB: { uid: string; name: string; logo: string | null } | null | undefined
}

export function WalkoutModal({ isOpen, onClose, onConfirm, teamA, teamB }: WalkoutModalProps) {
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null)

  const handleConfirm = () => {
    if (selectedWinnerId) {
      onConfirm(selectedWinnerId)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={20} />
            Konfirmasi Walkout (WO)
          </DialogTitle>
          <DialogDescription>
            Pilih tim yang akan menjadi pemenang. Status match akan menjadi <strong>WALKOUT</strong> dan poin akan dihitung otomatis.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Team A Selection */}
          <div
            onClick={() => setSelectedWinnerId(teamA?.uid || null)}
            className={`
              cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all
              ${selectedWinnerId === teamA?.uid ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
            `}>
            {teamA?.logo && <Image src={getImageUrl(teamA.logo)} alt={teamA.name} width={60} height={60} className="object-contain h-16 w-16" />}
            <div className="text-center">
              <p className="font-bold text-sm line-clamp-2">{teamA?.name || 'Team A'}</p>
            </div>
            {selectedWinnerId === teamA?.uid && (
              <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <Trophy size={12} /> Winner
              </div>
            )}
          </div>

          {/* Team B Selection */}
          <div
            onClick={() => setSelectedWinnerId(teamB?.uid || null)}
            className={`
              cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all
              ${selectedWinnerId === teamB?.uid ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
            `}>
            {teamB?.logo && <Image src={getImageUrl(teamB.logo)} alt={teamB.name} width={60} height={60} className="object-contain h-16 w-16" />}
            <div className="text-center">
              <p className="font-bold text-sm line-clamp-2">{teamB?.name || 'Team B'}</p>
            </div>
            {selectedWinnerId === teamB?.uid && (
              <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <Trophy size={12} /> Winner
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedWinnerId} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
            Konfirmasi WO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
