import { CounterRow, SliderRow } from '@/components/ui/row'
import { SectionHeader } from '@/components/ui/header'
import { IMatchFormatConfig, IRoundDurationConfig, ITournamentConfig } from '@/lib/types'
import { Settings, Timer, Trophy } from 'lucide-react'
import { useState } from 'react'

const TournamentRules: React.FC = () => {
  const [config, setConfig] = useState<ITournamentConfig>({
    formats: {
      groupStage: 3,
      upperBracket: 3,
      lowerBracket: 3,
      grandFinals: 3,
    },
    durations: {
      soccer: 3,
      sumo: 5,
    },
  })

  const updateFormat = (key: keyof IMatchFormatConfig, val: number) => {
    setConfig((prev) => ({
      ...prev,
      formats: { ...prev.formats, [key]: val },
    }))
  }

  const updateDuration = (key: keyof IRoundDurationConfig, val: number) => {
    setConfig((prev) => ({
      ...prev,
      durations: { ...prev.durations, [key]: val },
    }))
  }

  return (
    <div className="h-full p-6 font-sans flex justify-center items-start">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tournament Rules</h1>
            <p className="text-gray-500 text-sm mt-1">Configure match mechanics and scoring systems.</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Match Format Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
            <SectionHeader icon={<Trophy className="w-5 h-5" />} title="Match Format (Best Of)" />

            <div className="space-y-1 mt-6">
              <CounterRow label="Group Stage" value={config.formats.groupStage} onChange={(v) => updateFormat('groupStage', v)} />
              <CounterRow label="Upper Bracket" value={config.formats.upperBracket} onChange={(v) => updateFormat('upperBracket', v)} />
              <CounterRow label="Lower Bracket" value={config.formats.lowerBracket} onChange={(v) => updateFormat('lowerBracket', v)} />
              <CounterRow label="Grand Finals" value={config.formats.grandFinals} onChange={(v) => updateFormat('grandFinals', v)} />
            </div>
          </div>

          {/* Round Durations Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
            <SectionHeader icon={<Timer className="w-5 h-5" />} title="Round Durations" />

            <div className="mt-8 space-y-10">
              <SliderRow label="Soccer Category" value={config.durations.soccer} onChange={(v) => updateDuration('soccer', v)} />
              <SliderRow label="Sumo Category" value={config.durations.sumo} onChange={(v) => updateDuration('sumo', v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentRules
