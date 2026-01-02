interface HeaderProps {
  title: string
  name?: string
  className?: string
}

const HeaderDashboard = ({ title, name, className }: HeaderProps) => {
  return (
    <div className={`h-75 md:h-100 bg-white w-full flex flex-col justify-center items-center pt-17.5 2xl:pt-20 font-plus-jakarta-sans shadow-xl gap-3 ${className}`}>
      <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">{title}</h1>
      <p className="text-base lg:text-xl 2xl:text-2xl">Selamat datang, Team {name}</p>
    </div>
  )
}

const MatchStatusHeader = ({ isLive, isFinished, category, roundLabel }: { isLive: boolean; isFinished: boolean; category: string; roundLabel: string }) => (
  <div
    className={`
      relative z-10 flex items-center justify-between px-4 py-2 border-b text-xs font-semibold tracking-wider uppercase transition-colors
      ${isLive ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-500'}
    `}>
    <div className="flex items-center gap-2">
      {isLive ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span>SEDANG BERLANGSUNG</span>
        </>
      ) : isFinished ? (
        <span>🏁 SELESAI</span>
      ) : (
        <span>YANG AKAN DATANG</span>
      )}
    </div>
    <div className="flex items-center gap-2 opacity-75">
      <span>
        {category} • {roundLabel}
      </span>
    </div>
  </div>
)

export { HeaderDashboard, MatchStatusHeader }
