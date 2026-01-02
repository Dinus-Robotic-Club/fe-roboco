import { CATEGORIES } from '@/lib'
import { IFilterControlsProps } from '@/lib/types'
import { Search } from 'lucide-react'

export const FilterControls = ({ search, filters = [], action, className }: IFilterControlsProps) => {
  return (
    <div className={`w-full flex flex-col md:flex-row justify-between px-4 py-3 mb-3 rounded-md gap-4 items-center bg-white shadow-sm border border-slate-100 ${className}`}>
      {/* 1. Dynamic Search Bar */}
      {search && (
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="py-2 pl-2 pr-8 outline-none border-b-4 border-[#FBFF00] w-full md:min-w-62.5 lg:text-base text-sm bg-transparent placeholder:text-slate-400"
            placeholder={search.placeholder || 'Search...'}
          />
          {/* Opsional: Ikon search kecil biar manis */}
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      )}

      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto items-center">
        {/* 2. Dynamic Filters Loop */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-sm outline-none cursor-pointer transition-colors text-slate-700 font-medium">
            {/* Opsi Default (All) */}
            <option value="all">{filter.placeholder || 'All'}</option>

            {/* Mapping Options */}
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* 3. Action Slot */}
        {action && <div className="pl-2">{action}</div>}
      </div>
    </div>
  )
}

export const FilterBar = ({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: {
  search: string
  category: string
  onSearchChange: (val: string) => void
  onCategoryChange: (val: string) => void
}) => {
  return (
    <div className="flex flex-wrap justify-between max-w-6xl 2xl:max-w-7xl w-full mt-12">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="py-2 outline-none border-b-3 2xl:border-b-4 border-[#FBFF00] lg:w-xs lg:text-base text-sm"
        placeholder="Search teams..."
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="py-2 px-5 bg-white rounded-xs shadow-md border-2 font-plus-jakarta-sans text-sm lg:text-base border-gray-200 outline-none cursor-pointer">
        <option value={CATEGORIES.ALL}>ALL CATEGORY</option>
        <option value={CATEGORIES.SUMO}>SUMMO BOT</option>
        <option value={CATEGORIES.SOCCER}>SOCCER BOT</option>
      </select>
    </div>
  )
}
