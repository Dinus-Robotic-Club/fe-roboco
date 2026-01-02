import { LucideIcon } from 'lucide-react'

const MetadataItem = ({ icon: Icon, label, value, subValue }: { icon: LucideIcon; label: string; value: string; subValue?: React.ReactNode }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className="p-2 bg-white rounded-md text-slate-400 border border-slate-100 shadow-sm shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-800 leading-tight">{value}</span>
        {subValue && <div className="mt-1">{subValue}</div>}
      </div>
    </div>
  </div>
)

export { MetadataItem }
