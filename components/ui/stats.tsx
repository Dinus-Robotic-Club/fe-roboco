import { IThemeConfig } from '@/lib/types'

const StatItem = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center lg:items-start">
    <h1 className="font-bold text-4xl">{value}</h1>
    <p className="text-base">{label}</p>
  </div>
)

const StatBar = ({ label, valueA, valueB, total, theme }: { label: string; valueA: number; valueB: number; total: number; theme: IThemeConfig }) => {
  const percentA = total === 0 ? 0 : Math.round((valueA / total) * 100)
  const percentB = total === 0 ? 0 : Math.round((valueB / total) * 100)

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-end text-xs font-medium text-slate-600">
        <span className="group-hover:text-slate-900 transition-colors">{valueA}</span>
        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="group-hover:text-slate-900 transition-colors">{valueB}</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div style={{ width: `${percentA}%` }} className={`transition-all duration-500 ${theme.bgIconA}`} />
        <div style={{ width: `${percentB}%` }} className={`transition-all duration-500 ${theme.bgIconB}`} />
      </div>
    </div>
  )
}

export { StatItem, StatBar }
