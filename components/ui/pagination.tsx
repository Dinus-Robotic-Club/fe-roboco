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

  const generatePagination = () => {
    // If pages are 7 or less, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // If current page is among the first 4
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    // If current page is among the last 4
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    // Somewhere in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = generatePagination()

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-4 py-6 px-2">
      <div className="text-sm text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-800">{startItem}</span> - <span className="font-bold text-slate-800">{endItem}</span> of{' '}
        <span className="font-bold text-slate-800">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          aria-label="Previous Page">
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, idx) => (
            <div key={idx}>
              {page === '...' ? (
                <span className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs tracking-widest cursor-default">•••</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    currentPage === page ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          aria-label="Next Page">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export { Pagination }
