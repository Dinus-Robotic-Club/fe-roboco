import { LucideIcon } from 'lucide-react'
import { IAuthUser } from './auth'
import { ReactNode } from 'react'

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
}

export type StatusType = 'PENDING' | 'APPROVED' | 'VERIFIED' | 'REJECTED' | 'Present' | 'Absent' | 'SUMO' | 'SOCCER' | string

export type ExcelValue = string | number | boolean | Date | null | undefined

export type ExcelRow = Record<string, ExcelValue>

export type NavItemType = {
  title: string
  href: string
}

export type NavData = {
  left: NavItemType[]
  right: NavItemType[]
}

export interface IApiResponse<T> {
  success: boolean
  status: StatusCode
  message: string
  data?: T
  error?: T
}

export interface ITeamDisplayProps {
  team: { name: string; logo: string; communityName: string }
  align: 'left' | 'right'
}

export interface IScoreboardProps {
  scoreA: number | string
  scoreB: number | string
  isLive: boolean
  isAdmin: boolean
  isFinished: boolean
  isDetailOpen: boolean
}

export interface IThemeConfig {
  icon: LucideIcon
  colorA: string
  colorB: string
  bgIconA: string
  bgIconB: string
  label: string
}

export interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  errorMessage?: string
}

export interface ITeamProfileProps {
  data: ITeamDetail
  bodyTeam?: updateTeam
  setBodyTeam?: React.Dispatch<React.SetStateAction<updateTeam>>
  bodyParticipant?: updateParticipant
  setBodyParticipant?: React.Dispatch<React.SetStateAction<updateParticipant>>
  error?: TeamError
}

export interface ICertificateProps {
  pdfUrl?: string | null
  fileName?: string
  role?: 'ADMIN' | 'PARTICIPANTS'
  onUpload?: (file: File) => Promise<void> | void
  isUploading?: boolean
}

export interface IMatchListProps {
  data: ICardMatch[]
  user: IAuthUser | null
  emptyTitle?: string
  emptyDescription?: string
}

export interface IRankColumn<T> {
  header: string
  accessor: (item: T, index: number) => React.ReactNode
  colSpan?: number
  className?: string
  title?: string // Tooltip
}

export interface IGenericRankTableProps<T> {
  data: T[]
  columns: IRankColumn<T>[]
  title?: string
  subtitle?: string
}

export interface IRankLayoutProps {
  title: string
  highlight?: string // Bagian judul yang berwarna kuning
  isEmpty: boolean
  children: React.ReactNode
}

export interface INavItemProps {
  item: NavItemType
  isActive: boolean
  onClick: (e: React.MouseEvent, href: string, title: string) => void
  className?: string
}

export interface ITeamRowProps {
  team: ITeamBracket
  isEliminated?: boolean
  isTop: boolean
  hoveredTeamId: string | null
  setHoveredTeamId: (id: string | null) => void
  score?: number
}

export interface IMatchNodeProps {
  match: IMatchBracket
  className?: string
  hoveredTeamId: string | null
  setHoveredTeamId: (id: string | null) => void
}

export interface IValidationProps {
  setShowModalStart: (show: boolean) => void
  action: () => void
  title: string
  desc: string
  confirm_text: string
}

export interface ITournamentCardProps {
  data: IGetAllTournaments
  href?: string
}

export interface IFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string
  icon?: React.ElementType
  required?: boolean
  helperText?: string
}

export interface IPropsInputTournament {
  isForm: ICreateTournament
  setIsForm: React.Dispatch<React.SetStateAction<ICreateTournament>>
  isStage: StageType | null
  setIsStage: React.Dispatch<React.SetStateAction<StageType | null>>
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
}

export interface IFilterOption {
  label: string
  value: string
}

export interface IFilterConfig {
  key: string
  value: string
  onChange: (value: string) => void
  options: IFilterOption[]
  placeholder?: string
}

export interface IFilterControlsProps {
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  filters?: IFilterConfig[]
  action?: ReactNode
  className?: string
}

export interface IDownloadExcelProps<T> {
  data: T[]
  fileName: string
  sheetName?: string
  mapper?: (item: T) => ExcelRow
}

export interface IDownloadButtonProps<T> {
  data: T[]
  fileName?: string
  sheetName?: string
  label?: string
  mapper?: (item: T) => ExcelRow
  className?: string
}

export interface IStatusBadgeProps {
  children: StatusType | null | undefined
  className?: string
  label?: string
}

export interface IOptionItem {
  label: string
  value: string
}

export interface ITabItemProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export interface ITimelineAction {
  name: string
  team: string
  time: string
  type: 'point' | 'penalty' | 'foul' | 'yellow' | 'red'
  player?: string
}

export type ManualActionType = 'GOAL' | 'YELLOW' | 'RED' | 'PENALTY'

export interface IMatchActionProps {
  startMatch: boolean
  handleScoreAction: (type: ManualActionType, team: 'home' | 'away') => void
  timeline: ITimelineAction[]
}
