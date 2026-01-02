import { colSpanClasses } from '@/lib'
import { IGenericRankTableProps } from '@/lib/types'

export function GenericRankTable<T>({ data, columns, title, subtitle }: IGenericRankTableProps<T>) {
  return (
    <div className="w-full flex flex-col">
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-3 px-1">
          {title && <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{title}</h2>}
          {subtitle && <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">{subtitle}</span>}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <div className="w-full min-w-150 lg:min-w-full">
            <div className="grid grid-cols-12 px-4 py-3 text-[11px] font-bold bg-[#FBFF00] text-slate-900 tracking-wider uppercase border-b border-yellow-300/50">
              {columns.map((col, idx) => {
                const spanClass = colSpanClasses[col.colSpan || 1] || 'col-span-1'

                return (
                  <div key={idx} className={`${col.className || ''} ${spanClass}`} title={col.title}>
                    {col.header}
                  </div>
                )
              })}
            </div>

            {/* --- TABLE BODY --- */}
            <div className="divide-y divide-slate-100">
              {data.map((item, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-50/80 transition-colors duration-200 group">
                  {columns.map((col, colIdx) => {
                    // Ambil class dari mapping yang sama
                    const spanClass = colSpanClasses[col.colSpan || 1] || 'col-span-1'

                    return (
                      <div key={colIdx} className={`${col.className || ''} ${spanClass}`}>
                        {col.accessor(item, rowIdx)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
