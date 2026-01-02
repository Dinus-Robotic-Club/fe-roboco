import { ITabItemProps } from '@/lib/types'

export const TabItem = ({ label, isActive, onClick }: ITabItemProps) => {
  return (
    <p
      onClick={onClick}
      className={`
        cursor-pointer px-4 py-1 rounded-sm transition-all duration-400
        hover:bg-[#FBFF00] font-medium
        ${isActive ? 'bg-[#FBFF00] text-black' : 'bg-transparent text-gray-600 hover:text-black'}
      `}>
      {label}
    </p>
  )
}
