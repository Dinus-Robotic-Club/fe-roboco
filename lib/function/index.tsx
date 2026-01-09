import { Swords, Target } from 'lucide-react'
import Image from 'next/image'
import * as z from 'zod'
import slugify from 'slugify'
import { VARIANTS } from '..'
import { IParticipantRow } from '../types'

// fungsi untuk memformat tanggal ke format yang lebih ramah pengguna
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// fungsi untuk memetakan error dari ZodIssue ke objek error yang sesuai
export const mapZodErrors = (issues: z.ZodIssue[]): RegisterError => {
  const errorObj: RegisterError = {
    team: {},
    participants: [],
  }

  issues.forEach((issue) => {
    const path = issue.path

    if (path[0] === 'team') {
      const field = path[1] as keyof ITeamBody
      errorObj.team![field] = issue.message
    }

    if (path[0] === 'participants') {
      const index = path[1] as number
      const field = path[2] as keyof IParticipantsBody

      if (!errorObj.participants![index]) {
        errorObj.participants![index] = {}
      }
      errorObj.participants![index][field] = issue.message
    }
  })

  return errorObj
}

// fungsi untuk menggulir ke elemen pertama yang memiliki error berdasarkan hasil validasi Zod
export const scrollToFirstError = (issues: z.ZodIssue[]) => {
  if (issues.length === 0) return

  const firstError = issues[0]
  const path = firstError.path

  let elementId = ''

  if (path[0] === 'team') {
    elementId = `team_${String(path[1])}`

    if (path[1] === 'confirmPassword') elementId = 'confirm_password'
    if (path[1] === 'category') elementId = 'kategori'
    if (path[1] === 'tournamentId') elementId = 'turnamen'
    if (path[1] === 'communityName') elementId = 'community_input'
  } else if (path[0] === 'participants') {
    elementId = `participants-${String(path[1])}-${String(path[2])}`
  }

  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus({ preventScroll: true })
  }
}

// fungsi untuk mendapatkan URL lengkap gambar dari path yang diberikan
// Jika path null/undefined, kembalikan default logo lokal tanpa API URL
export const getImageUrl = (path?: string | null) => (path ? `${process.env.NEXT_PUBLIC_API_URL}${path}` : '/logo-only.svg')

// fungsi untuk mendapatkan tema berdasarkan kategori pertandingan
export const getCategoryTheme = (category: string) => {
  const normCategory = category?.toUpperCase()

  switch (normCategory) {
    case 'SUMO':
      return {
        label: 'Victory',
        subLabel: 'Technique',
        unit: 'Round',
        icon: Swords,
        colorA: 'bg-amber-600',
        colorB: 'bg-red-600',
        bgIconA: 'bg-amber-100 text-amber-700',
        bgIconB: 'bg-red-100 text-red-700',
      }
    case 'SOCCER':
    default:
      return {
        label: 'Goal',
        subLabel: 'Scored',
        unit: "'",
        icon: Target,
        colorA: 'bg-blue-600',
        colorB: 'bg-emerald-500',
        bgIconA: 'bg-blue-100 text-blue-700',
        bgIconB: 'bg-emerald-100 text-emerald-700',
      }
  }
}

// fungsi untuk merender informasi tim dalam format tertentu
export const renderTeamInfo = (teamName: string, communityName: string | undefined, logoUrl?: string | null, index: number = 0) => (
  <div className="flex items-center gap-4">
    <span className="text-sm font-medium text-slate-400 w-3">{index + 1}</span>
    <div className="flex bg-logo-team w-12 h-12 shrink-0 items-center justify-center drop-shadow-sm transition-transform group-hover:scale-105">
      <Image src={getImageUrl(logoUrl)} alt={teamName} width={100} height={100} className="w-full h-full p-2.5 object-contain" unoptimized />
    </div>
    <div className="flex flex-col">
      <p className="font-bold text-sm text-slate-900 line-clamp-1">{teamName}</p>
      <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wide line-clamp-1">{communityName}</p>
    </div>
  </div>
)

// Komponen legenda untuk bracket
export const BracketLegend = () => (
  <div className="flex items-center gap-6 mb-8 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm w-fit mx-auto sticky left-0 z-10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-0.5 bg-gray-300"></div>
      <span className="text-[10px] uppercase font-bold text-gray-400">Jalur Menang</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-0 border-t border-dashed border-red-300"></div>
      <span className="text-[10px] uppercase font-bold text-gray-400">Jalur Kalah</span>
    </div>
  </div>
)

// Komponen jalur pada bracket
export const BracketPath = ({ start, end, isWinPath }: { start: { x: number; y: number }; end: { x: number; y: number }; isWinPath?: boolean }) => {
  const midX = (start.x + end.x) / 2
  const strokeColor = isWinPath ? 'stroke-gray-300' : 'stroke-red-300'

  return (
    <path
      d={`M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`}
      fill="none"
      className={`${strokeColor} stroke-[1.5px] transition-colors duration-300`}
      strokeDasharray={isWinPath ? '' : '4'}
    />
  )
}

// fungsi untuk mendapatkan kolom dinamis berdasarkan ID pertandingan
export const getDynamicColumn = (id: string): number => {
  if (id.includes('PI')) return 0
  if (id.includes('GRAND')) return 99

  const roundMatch = id.match(/-R(\d+)/)
  if (roundMatch) {
    return parseInt(roundMatch[1])
  }

  if (id.includes('QF') || id.includes('R1')) return 1
  if (id.includes('SEMI') || id.includes('R2')) return 2
  if (id.includes('UB-FINAL')) return 3
  if (id.includes('LB-FINAL')) return 3

  return 1
}

// Komponen badge status untuk turnamen
export const getStatusConfig = (startDate: string) => {
  const isUpcoming = new Date(startDate) > new Date()

  if (isUpcoming) {
    return { label: 'UPCOMING', className: 'bg-slate-900 text-white border-slate-900' }
  }
  return { label: 'ONGOING', className: 'bg-[#FBFF00] text-black border-[#FBFF00] animate-pulse' }
}

// Komponen baris informasi dengan ikon
export const InfoRow = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
    <span className="truncate font-medium">{text}</span>
  </div>
)

// Komponen badge status untuk turnamen
export const StatusBadge = ({ startDate }: { startDate: string }) => {
  const { label, className } = getStatusConfig(startDate)
  return <span className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase border shadow-sm ${className}`}>{label}</span>
}

// fungsi untuk menghasilkan slug dari string yang diberikan
export const generateSlug = (value: string): string => {
  return slugify(value, {
    lower: true,
    strict: true,
    replacement: '-',
    trim: true,
  })
}

export const getStatusStyle = (status: string): string => {
  const normalized = status.toUpperCase()

  switch (normalized) {
    // Green / Success
    case 'APPROVED':
    case 'VERIFIED':
    case 'PRESENT':
    case 'ACTIVE':
      return VARIANTS.success

    // Yellow / Warning
    case 'PENDING':
    case 'WAITING':
    case 'ON_PROCESS':
      return VARIANTS.warning

    // Red / Danger
    case 'REJECTED':
    case 'ABSENT':
    case 'FAILED':
    case 'BANNED':
      return VARIANTS.danger

    // Blue / Info
    case 'SOCCER':
      return VARIANTS.info

    // Purple
    case 'SUMO':
      return VARIANTS.purple

    // Default Gray
    default:
      return VARIANTS.neutral
  }
}

export const flattenParticipants = (teams: ITeam[]): IParticipantRow[] => {
  return teams.flatMap((team) => {
    const reg = team.registrations?.[0]

    return team.participants.map((participant) => ({
      // Participant fields
      uid: participant.uid,
      participantId: participant.uid,
      participantName: participant.name,
      name: participant.name,
      participantRole: participant.roleInTeam,
      roleInTeam: participant.roleInTeam,
      participantAvatar: participant.image,
      image: participant.image,
      phone: participant.phone || '',
      twibbon: participant.twibbon || '',
      certificate: participant.certificate || null,

      // Team fields
      teamId: team.uid,
      teamName: team.name,
      teamCategory: team.category,
      teamLogo: team.logo,
      communityName: team.community?.name || '',

      // Registration fields
      registrationStatus: reg?.status || 'PENDING',
      attendanceStatus: reg?.attendeance?.isPresent || false,
    }))
  })
}
