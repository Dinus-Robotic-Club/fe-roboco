interface CounterRowProps {
  label: string
  value: number
  onChange: (newValue: number) => void
  min?: number
}

interface SliderRowProps {
  label: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
}

export const CounterRow: React.FC<CounterRowProps> = ({ label, value, onChange, min = 1 }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50  rounded-xl mb-3 last:mb-0 hover:bg-gray-100 transition-colors group">
      <span className="text-gray-600 font-medium text-sm group-hover:text-gray-900 transition-colors">{label}</span>
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all font-bold text-lg rounded-l-lg">
          -
        </button>
        <span className="w-10 text-center font-bold text-gray-800 text-sm">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all font-bold text-lg rounded-r-lg">
          +
        </button>
      </div>
    </div>
  )
}

export const SliderRow: React.FC<SliderRowProps> = ({ label, value, onChange, min = 1, max = 60 }) => {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-600 font-medium text-sm">{label}</span>
        <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-md text-xs font-bold shadow-sm min-w-15 text-center">{value} m</span>
      </div>
      <div className="relative w-full h-2 rounded-full bg-gray-200 group">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-20" />
        <div className="absolute h-full bg-gray-400 rounded-full pointer-events-none transition-all duration-100 ease-out z-10 group-hover:bg-yellow-400" style={{ width: `${progress}%` }} />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-gray-300 rounded-full top-1/2 -translate-y-1/2 shadow-md pointer-events-none transition-all duration-100 ease-out z-10 group-hover:scale-110 group-hover:border-yellow-400"
          style={{ left: `${progress}%`, transform: `translate(-${progress}%, -50%)` }}
        />
      </div>
    </div>
  )
}


export const DataRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </div>
    <div className="text-slate-800 font-medium text-sm truncate">{value}</div>
  </div>
)