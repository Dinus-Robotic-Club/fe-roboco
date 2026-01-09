import { colSpanClasses } from '@/lib'
import { IGenericRankTableProps } from '@/lib/types'

// Helper untuk menentukan style baris berdasarkan posisi ranking
const getRowPositionStyle = (position: number): string => {
  if (position === 0) {
    // Rank 1: Juara Grup - Gold/Amber
    return 'bg-amber-50 border-l-4 border-l-amber-400'
  } else if (position < 4) {
    // Rank 2-4: Lolos Playoff - Green
    return 'bg-emerald-50/50 border-l-4 border-l-emerald-400'
  } else {
    // Rank 5+: Tidak Lolos - Red
    return 'bg-red-50/50 border-l-4 border-l-red-400'
  }
}

// Update Interface ini di file types kamu (atau biarkan disini jika ingin collocated)

export function GenericRankTable<T>({ data, columns, title, subtitle, onRowClick, rowClassName = '' }: IGenericRankTableProps<T>) {
  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-4 px-1">
          {title && <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{title}</h2>}
          {subtitle && <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">{subtitle}</span>}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          {' '}
          {/* Pastikan punya utility scrollbar atau biarkan default */}
          <div className="w-full min-w-200 lg:min-w-full">
            {/* --- TABLE HEAD --- */}
            <div className="grid grid-cols-12 px-4 py-3.5 text-[11px] font-bold bg-[#FBFF00] text-slate-900 tracking-wider uppercase border-b border-yellow-300/50 sticky top-0 z-10">
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
            <div className="divide-y divide-slate-100 bg-white">
              {data.length > 0 ? (
                data.map((item, rowIdx) => (
                  <div
                    key={rowIdx}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`
                      grid grid-cols-12 px-4 py-3.5 items-center 
                      transition-all duration-200 group relative
                      ${getRowPositionStyle(rowIdx)}
                      ${onRowClick ? 'cursor-pointer hover:brightness-95 active:brightness-90' : 'hover:brightness-[0.98]'}
                      ${rowClassName} 
                    `}>
                    {columns.map((col, colIdx) => {
                      const spanClass = colSpanClasses[col.colSpan || 1] || 'col-span-1'
                      return (
                        <div key={colIdx} className={`${col.className || ''} ${spanClass} text-sm text-slate-700`}>
                          {col.accessor(item, rowIdx)}
                        </div>
                      )
                    })}
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No data found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
