'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatDate, getImageUrl, InfoRow, StatusBadge } from '@/lib/function'
import Image from 'next/image'
import { ArrowRight, Calendar, LucideIcon, MapPin, Trophy, Users } from 'lucide-react'
import { ITournamentCardProps } from '@/lib/types'
import { useRouter } from 'next/navigation'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card" className={cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
}

const InsightCard = ({ icon: Icon, value, label }: { icon: LucideIcon; value: string | number; label: string }) => (
  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center hover:border-slate-200 transition-colors">
    <span className="text-slate-400 mb-2 p-1.5 bg-white rounded-full shadow-sm">
      <Icon className="w-3.5 h-3.5" />
    </span>
    <span className="text-lg font-bold text-slate-800 tabular-nums leading-none mb-1">{value}</span>
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
  </div>
)

const ParticipantCard = ({ participant }: { participant: IParticipant }) => (
  <div className="flex flex-col items-center">
    <div className="bg-player h-53.75 w-53.75">
      <Image className="w-full h-full pb-2" alt={participant.name} src={getImageUrl(participant.image)} height={1000} width={1000} />
    </div>
    <h1 className="text-2xl font-bold">{participant.name}</h1>
    <p>{participant.roleInTeam === 'LEADER' ? 'Team Leader' : 'Team Member'}</p>
  </div>
)

const TournamentCard = ({ data, href }: ITournamentCardProps) => {
  const router = useRouter()
  const imageUrl = getImageUrl(data.image)

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.push(`dashboard/tournament/${data.slug}`)
    }
  }

  const teamCount = data.totalTeam || 0

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col h-full active:scale-[0.99]">
      {/* --- Image Section --- */}
      <div className="relative h-48 w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Trophy className="w-6 h-6 text-slate-300" />
            </div>
            <span className="text-xs text-slate-400 font-medium">No Image Available</span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-10">
          <StatusBadge startDate={data.startDate} />
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex-1 space-y-3">
          {/* Title & Desc */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-blue-900 transition-colors">{data.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed h-10">{data.description || 'Tidak ada deskripsi turnamen.'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid gap-2 pt-2">
            <InfoRow icon={Calendar} text={formatDate(data.startDate)} />
            <InfoRow icon={MapPin} text={data.location || 'Online / TBD'} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          {/* Team Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">{teamCount} Teams</span>
          </div>

          {/* Action Text */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-black transition-colors">
            Manage
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

const TeamScoreCard = ({
  name,
  school,
  logo,
  score,
  roundsWon,
  isSumo,
  align = 'left',
}: {
  name: string
  school: string
  logo: string
  score: number
  roundsWon: number
  isSumo: boolean
  align?: 'left' | 'right'
}) => (
  <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
    <div className={`flex items-center gap-4 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Logo */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 w-16 h-16 shadow-sm flex items-center justify-center">
        <Image src={`${process.env.NEXT_PUBLIC_API_URL}${logo ?? '/logo-only.svg'}`} alt={name} width={40} height={40} className="w-auto h-auto" unoptimized />
      </div>

      {/* Name & School */}
      <div className={`flex flex-col ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <h2 className="text-lg lg:text-xl font-bold text-slate-800 leading-tight line-clamp-1">{name}</h2>
        <p className="text-sm text-slate-500 line-clamp-1">{school}</p>
      </div>
    </div>

    {/* Score & Rounds Indicator */}
    <div className={`mt-4 flex items-end gap-3 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="text-5xl font-bold font-fira-code text-slate-900 tracking-tighter">{score}</div>

      {isSumo && (
        <div className="flex gap-1 mb-2">
          {[...Array(2)].map(
            (
              _,
              i, // Asumsi BO3 (max 2 win)
            ) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < roundsWon ? 'bg-[#FBFF00] shadow-[0_0_8px_#FBFF00]' : 'bg-slate-200'}`} />
            ),
          )}
        </div>
      )}
    </div>
  </div>
)

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, ParticipantCard, InsightCard, TournamentCard, TeamScoreCard }
