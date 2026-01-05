import React, { ReactNode } from 'react'
import { LucideIcon, Search, PackageOpen, Swords, AlertCircle, Trophy, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  variant?: 'default' | 'search' | 'public'
  className?: string
  action?: ReactNode
  onCreate?: () => void
  createLabel?: string
}

const EmptyState = ({
  title = 'Data tidak ditemukan',
  description = 'Belum ada data yang tersedia saat ini.',
  icon: Icon = PackageOpen,
  action,
  onCreate,
  createLabel = 'Tambah Data Baru',
  className,
  variant = 'default',
}: EmptyStateProps) => {
  if (variant === 'search') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500', className)}>
        <div className="bg-yellow-50 p-4 rounded-full mb-4 ring-8 ring-yellow-50/50">
          <Search className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title || 'Pencarian tidak ditemukan'}</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">{description || 'Kami tidak dapat menemukan apa yang Anda cari. Coba gunakan kata kunci lain.'}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center min-h-[500px] justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300',
        className,
      )}>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 transform transition-transform group-hover:scale-110 duration-300">
        {variant !== 'public' ? <Icon className="w-12 h-12 text-slate-400" strokeWidth={1.5} /> : <span className="text-4xl">🫵</span>}
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-base max-w-md mx-auto mb-8 leading-relaxed text-balance">{description}</p>

      <div className="flex gap-3">
        {action ? (
          action
        ) : onCreate ? (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FBFF00] hover:bg-yellow-300 text-slate-900 font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95">
            <Plus className="w-5 h-5" />
            {createLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

const EmptyMatchHistory = () => (
  <div className="w-full flex flex-col items-center justify-center py-12 px-4 md:py-20 text-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 md:mb-6">
      <Swords className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
    </div>
    <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2">Belum Ada Pertandingan</h3>
    <p className="text-sm md:text-base text-slate-500 max-w-62.5 md:max-w-md leading-relaxed">Tim ini belum memiliki riwayat pertandingan yang tercatat dalam sistem.</p>
  </div>
)

const EmptyStateCertificate = () => (
  <div className="w-full h-64 lg:h-125 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
      <AlertCircle className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-700">Sertifikat Belum Tersedia</h3>
    <p className="text-slate-500 text-sm mt-2 max-w-xs">Panitia belum menerbitkan sertifikat untuk tim ini. Silakan cek kembali secara berkala.</p>
  </div>
)

const EmptyStateTournament = ({ isSearching }: { isSearching: boolean }) => (
  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 text-center animate-in fade-in zoom-in-95 duration-500">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
      <Trophy className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{isSearching ? 'Turnamen Tidak Ditemukan' : 'Belum Ada Turnamen'}</h3>
    <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
      {isSearching ? 'Coba ubah kata kunci pencarian Anda atau cek ejaan kembali.' : 'Mulai kompetisi baru dengan membuat turnamen pertama Anda sekarang.'}
    </p>
  </div>
)

export { EmptyState, EmptyMatchHistory, EmptyStateCertificate, EmptyStateTournament }
