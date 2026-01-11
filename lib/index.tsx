import { ExcelRow, IParticipantRow, IRankColumn } from './types'
import { formatDate, getImageUrl, renderTeamInfo } from './function'
import Image from 'next/image'
import { StatusBadge } from '@/components/ui/badge'
import { GiGoalKeeper, GiSoccerBall } from 'react-icons/gi'
import { TbRectangleVerticalFilled } from 'react-icons/tb'

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

export const TeamColumns: IRankColumn<IRegistrationData | ITeam>[] = [
  {
    header: 'Nama tim',
    colSpan: 3,
    className: 'text-sm font-semibold',
    title: 'Nama tim',
    accessor: (d, i) => {
      if ('team' in d) {
        return renderTeamInfo(d.team?.name as string, d.team?.community?.name, d.team?.logo as string, i)
      } else if ('registrations' in d) {
        return renderTeamInfo(d.name, d.community?.name, d.logo as string, i)
      }
    },
  },
  {
    header: 'Tanggal Daftar',
    colSpan: 2,
    className: 'text-sm font-semibold',
    title: 'Tanggal Daftar',
    accessor: (d) => formatDate(d.createdAt) || '-',
  },
  {
    header: 'Category',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Category',
    accessor: (d) => {
      const category = 'team' in d ? d.team?.category : (d as ITeam).category
      return <StatusBadge>{category}</StatusBadge>
    },
  },
  {
    header: 'Status',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Status',
    accessor: (d) => {
      const status = 'status' in d ? d.status : (d as ITeam).registrations?.[0]?.status

      return <StatusBadge>{status || '-'}</StatusBadge>
    },
  },
  {
    header: 'Attendance',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Attendance',
    accessor: (d) => {
      const isPresent = 'attendance' in d ? d.attendance?.isPresent : (d as ITeam).registrations?.[0]?.attendance?.isPresent

      return <StatusBadge>{isPresent ? 'Present' : 'Absent'}</StatusBadge>
    },
  },
  {
    header: 'Action',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Action',
    accessor: () => <span className="text-xs font-medium text-blue-600 hover:text-blue-800 underline">Lihat Detail</span>,
  },
]

export const ParticipantsColumns: IRankColumn<IParticipantRow>[] = [
  {
    header: 'Nama Member',
    colSpan: 3, // Sesuaikan span
    className: 'text-sm font-semibold text-left',
    title: 'Nama Member',
    accessor: (d, i) => renderTeamInfo(d.participantName, d.teamName, d.participantAvatar as string, i),
  },
  {
    header: 'Tim',
    colSpan: 3,
    className: 'text-left text-sm font-semibold', // Sesuaikan alignment dgn gambar
    title: 'Tim',
    accessor: (row) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-700">{row.teamName}</span>
        <span className="text-xs text-slate-500">{row.teamCategory}</span>
      </div>
    ),
  },
  {
    header: 'Role',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Role',
    accessor: (row) => <StatusBadge>{row.participantRole}</StatusBadge>,
  },
  {
    header: 'Status regis',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Status',
    accessor: (row) => <StatusBadge>{row.registrationStatus}</StatusBadge>,
  },
  {
    header: 'Attendance',
    colSpan: 1,
    className: 'text-center text-sm font-semibold',
    title: 'Attendance',
    accessor: (row) => <StatusBadge>{row.attendanceStatus ? 'Present' : 'Absent'}</StatusBadge>,
  },
  {
    header: 'Action',
    colSpan: 2,
    className: 'text-center text-sm font-semibold',
    title: 'Action',
    accessor: () => <span className="text-xs font-medium text-blue-600 hover:text-blue-800 underline">Lihat Detail</span>,
  },
]

export const basisColumns: IRankColumn<ICommunity>[] = [
  {
    header: 'Komunitas',
    colSpan: 7,
    accessor: (item, index) => (
      <div className="flex items-center gap-4 w-full">
        <span className="text-lg font-semibold w-6 text-slate-400 shrink-0">{index + 1}.</span>

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

export const teamExcelMapper = (row: IRegistrationData | ITeam): ExcelRow => {
  const isRegistration = 'team' in row

  const name = isRegistration ? row.team?.name : (row as ITeam).name

  const category = isRegistration ? row.team?.category : (row as ITeam).category

  const community = isRegistration ? row.team?.community?.name : (row as ITeam).community?.name

  const status = isRegistration ? (row as IRegistrationData).status : (row as ITeam).registrations?.[0]?.status

  const isPresent = isRegistration ? (row as IRegistrationData).attendance?.isPresent : (row as ITeam).registrations?.[0]?.attendance?.isPresent

  const participantsCount = isRegistration ? row.team?.participants?.length : (row as ITeam).participants?.length

  return {
    No: row.uid.substring(0, 5).toUpperCase(),
    'Nama Tim': name || '-',
    Kategori: category?.toUpperCase() || '-',
    'Asal Instansi': community || '-',
    'Status Pembayaran': status || 'N/A',
    Kehadiran: isPresent ? 'Hadir' : 'Tidak Hadir',
    'Tanggal Daftar': new Date(row.createdAt).toLocaleDateString('id-ID'),
    'Total Anggota': participantsCount || 0,
  }
}

export const participantExcelMapper = (team: IParticipantRow): ExcelRow => {
  return {
    'Nama Tim': team.teamName || '-',
    Kategori: team.teamCategory.toUpperCase() || '-',
    Anggota: team.participantName && team.participantRole ? `${team.participantName} (${team.participantRole})` : '-',
    'Status Pembayaran': team.registrationStatus || '-',
    Kehadiran: team.attendanceStatus ? 'Hadir' : 'Tidak Hadir',
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
