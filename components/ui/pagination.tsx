import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-4 py-4 px-2">
      <div className="text-sm text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{startItem}</span> to <span className="font-bold text-slate-800">{endItem}</span> of{' '}
        <span className="font-bold text-slate-800">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page">
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                currentPage === page ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}>
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export { Pagination }
