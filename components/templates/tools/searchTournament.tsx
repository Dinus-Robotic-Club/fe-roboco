import { Button } from '@/components/ui/button'
import { LayoutGrid, Plus, Search } from 'lucide-react'

const Toolbar = ({ searchQuery, setSearchQuery, onOpenDialog }: { searchQuery: string; setSearchQuery: (v: string) => void; onOpenDialog: (v: boolean) => void }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-slate-100 rounded-lg">
        <LayoutGrid className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">Daftar Turnamen</h2>
        <p className="text-xs text-slate-500 font-medium">Kelola semua kompetisi yang aktif</p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      {/* Search Input with Focus Ring */}
      <div className="relative w-full sm:w-80 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
        <input
          type="text"
          placeholder="Cari nama turnamen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all shadow-sm hover:border-slate-300"
        />
      </div>

      {/* Create Button */}
      <Button
        onClick={() => onOpenDialog(true)}
        className="bg-[#FBFF00] hover:bg-[#eef300] text-black font-bold px-6 py-2.5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Buat Turnamen
      </Button>
    </div>
  </div>
)

export { Toolbar }
