import { ExcelRow, IRankColumn } from './types'
import { renderTeamInfo } from './function'
import Image from 'next/image'
import { StatusBadge } from '@/components/ui/badge'
import { GiGoalKeeper, GiSoccerBall } from 'react-icons/gi'
import { TbRectangleVerticalFilled } from 'react-icons/tb'

const cellRowClass = 'h-8 flex items-center justify-center'
const cellRowClassLeft = 'h-8 flex items-center justify-start'

export const ACTIONS_CONFIG = [
  {
    id: 'GOAL',
    label: 'Goal',
    type: 'point',
    icon: <GiSoccerBall className="w-5 h-5" />,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    textColor: 'text-emerald-600',
  },
  {
    id: 'PENALTY',
    label: 'Penalty',
    type: 'penalty',
    icon: <GiGoalKeeper className="w-5 h-5" />,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    textColor: 'text-indigo-600',
  },
  {
    id: 'YELLOW',
    label: 'Yellow',
    type: 'yellow',
    icon: <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-300 stroke-black stroke-1" />,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    textColor: 'text-yellow-600',
  },
  {
    id: 'RED',
    label: 'Red',
    type: 'red',
    icon: <TbRectangleVerticalFilled className="w-5 h-5 text-red-100" />,
    color: 'bg-red-600 hover:bg-red-700',
    textColor: 'text-red-600',
  },
]

export const TABS = {
  ONGOING: 'on-going-match',
  FINISHED: 'finished-match',
}

export const CATEGORIES = {
  ALL: 'all',
  SUMO: 'SUMO',
  SOCCER: 'SOCCER',
}

export const colSpanClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
}

export const soccerColumns: IRankColumn<IGroupTeamStats>[] = [
  {
    header: 'Team',
    colSpan: 6,
    className: 'text-sm font-semibold',
    accessor: (d, i) => renderTeamInfo(d.team.name, d.team.community?.name, d.team.logo as string, i),
  },
  {
    header: 'MP',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Match Played',
    accessor: (d) => d.matchPlay,
  },
  {
    header: 'GS',
    colSpan: 1,
    className: 'text-center text-sm ',
    title: 'Goal Scored',
    accessor: (d) => d.golScore,
  },
  {
    header: 'GC',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Goal Conceded',
    accessor: (d) => d.golConceded,
  },
  {
    header: 'GD',
    colSpan: 1,
    className: 'text-center text-sm font-semibold ',
    title: 'Goal Difference',
    accessor: (d) => (Number(d.golDifferent) > 0 ? `+${d.golDifferent}` : d.golDifferent),
  },
  {
    header: 'PTS',
    colSpan: 2,
    className: 'text-sm font-semibold text-center',
    title: 'Points',
    accessor: (d) => <span className="inline-block font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-full min-w-8">{d.point}</span>,
  },
]

export const sumoColumns: IRankColumn<IGroupTeamStats>[] = [
  {
    header: 'Team',
    colSpan: 6,
    className: 'text-sm font-semibold',
    accessor: (d, i) => renderTeamInfo(d.team.name, d.team.community?.name, d.team.logo as string, i),
  },
  {
    header: 'MP',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Match Played',
    accessor: (d) => d.matchPlay,
  },
  {
    header: 'KS',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Knockout Score',
    accessor: (d) => d.knockoutScore,
  },
  {
    header: 'KC',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Knockout Conceded',
    accessor: (d) => d.knockoutConceded,
  },
  {
    header: 'KD',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Knockout Difference',
    accessor: (d) => (Number(d.knockoutDifferent) > 0 ? `+${d.knockoutDifferent}` : d.knockoutDifferent),
  },
  {
    header: 'PTS',
    colSpan: 2,
    className: 'text-sm font-semibold text-center',
    title: 'Points',
    accessor: (d) => <span className="inline-block font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-full min-w-8">{d.point}</span>,
  },
]

export const TeamColumns: IRankColumn<ITeam>[] = [
  {
    header: 'Nama tim',
    colSpan: 3,
    className: 'text-sm font-semibold',
    title: 'Nama tim',
    accessor: (d) => d.name,
  },
  {
    header: 'Komunitas',
    colSpan: 4,
    className: 'text-center text-sm font-semibold',
    title: 'Komunitas',
    accessor: (d) => d.community?.name || '-',
  },
  {
    header: 'Category',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Category',
    accessor: (d) => <StatusBadge>{d.category}</StatusBadge>,
  },
  {
    header: 'status',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Status',
    accessor: (d) => d.registrations?.map((reg) => <StatusBadge key={reg.uid}>{reg.status}</StatusBadge>),
  },
  {
    header: 'Attendance',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Attendance',
    accessor: (d) => d.registrations?.map((reg) => <StatusBadge key={reg.uid}>{reg.attendeance?.isPresent ? 'Present' : 'Absent'}</StatusBadge>),
  },
]

export const ParticipantsColumns: IRankColumn<ITeam>[] = [
  {
    header: 'Nama Member',
    colSpan: 2,
    className: 'text-sm font-semibold',
    title: 'Nama Member',

    accessor: (d) => (
      <div className="flex flex-col gap-1">
        {d.participants.flatMap((p) => (
          <div key={p.uid} className={`${cellRowClassLeft} border-b border-dashed text-center border-slate-100 last:border-0`}>
            {p.name}
          </div>
        ))}
      </div>
    ),
  },
  {
    header: 'Tim',
    colSpan: 3,
    className: 'text-center text-sm font-semibold',
    title: 'Tim',

    accessor: (d) => <span className="font-bold text-slate-700">{d.name}</span>,
  },
  {
    header: 'Category',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Category',
    accessor: (d) => <StatusBadge>{d.category}</StatusBadge>,
  },
  {
    header: 'Role',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Role',

    accessor: (d) => (
      <div className="flex flex-col gap-1">
        {d.participants.flatMap((p, idx) => (
          <div key={idx} className={`${cellRowClass} border-b border-dashed border-slate-100 last:border-0`}>
            <StatusBadge>{p.roleInTeam}</StatusBadge>
          </div>
        ))}
      </div>
    ),
  },
  {
    header: 'Status',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Status',
    accessor: (d) => <div className="flex items-center justify-center h-full">{d.registrations?.flatMap((reg, idx) => <StatusBadge key={idx}>{reg.status}</StatusBadge>) || '-'}</div>,
  },
  {
    header: 'Attendance',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Attendance',
    accessor: (d) => (
      <div className="flex items-center justify-center h-full">
        {d.registrations?.flatMap((reg, idx) => <StatusBadge key={idx}>{reg.attendeance?.isPresent ? 'Present' : 'Absent'}</StatusBadge>) || '-'}
      </div>
    ),
  },
]

export const basisColumns: IRankColumn<ICommunity>[] = [
  {
    header: 'Komunitas',
    colSpan: 7,
    accessor: (item, index) => (
      <div className="flex items-center gap-4 w-full">
        <span className="text-lg font-semibold w-6 text-slate-400 shrink-0">{index + 1}.</span>

        <div className="flex bg-logo-team w-12 h-12 shrink-0 items-center justify-center drop-shadow-sm">
          <Image src={`${process.env.NEXT_PUBLIC_API_URL}${item.team[0]?.logo || ''}`} alt="logo" width={100} height={100} className="w-full h-full p-1 object-contain" unoptimized />
        </div>

        <div className="flex flex-col min-w-0">
          <p className="font-bold text-base text-slate-900 truncate">{item.name}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Total Team',
    colSpan: 2,
    className: 'text-sm font-semibold text-center',
    accessor: (item) => item.team.length,
  },
  {
    header: 'Points',
    colSpan: 3,
    className: 'text-sm font-semibold text-center',
    accessor: (item) => <span className="inline-block font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-full min-w-8">{item.comPoint}</span>,
  },
]

export const teamExcelMapper = (team: ITeam): ExcelRow => ({
  No: team.uid.substring(0, 5),
  'Nama Tim': team.name,
  Kategori: team.category.toUpperCase(),
  'Asal Instansi': team.community?.name || '-',
  'Status Pembayaran': team.registrations?.[0]?.status || 'N/A',
  Kehadiran: team.registrations?.[0]?.attendeance?.isPresent ? 'Hadir' : 'Tidak Hadir',
  'Tanggal Daftar': new Date(team.createdAt).toLocaleDateString('id-ID'),
  'Total Anggota': team.participants.length,
})

export const participantExcelMapper = (team: ITeam): ExcelRow => {
  const members = team.participants.map((p) => `${p.name} (${p.roleInTeam})`).join(', ')
  const reg = team.registrations?.[0]

  return {
    'Nama Tim': team.name,
    Kategori: team.category.toUpperCase(),
    Anggota: members,
    'Status Pembayaran': reg?.status || '-',
    Kehadiran: reg?.attendeance?.isPresent ? 'Hadir' : 'Tidak Hadir',
  }
}

export const VARIANTS = {
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
}
