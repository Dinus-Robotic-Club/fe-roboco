'use client'

import { CounterRow, SliderRow } from '@/components/ui/row'
import { SectionHeader } from '@/components/ui/header'
import { Timer, Trophy, Save, Loader2 } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import { useUpdateSettings, IUpdateSettingInput } from '@/hooks/useUpdateSettings'

interface TournamentRulesProps {
  tournamentId: string
  tournamentSlug: string
  settings?: ITournamentSettings | null
}

const TournamentRules: React.FC<TournamentRulesProps> = ({ tournamentId, tournamentSlug, settings }) => {
  const { mutate: updateSettings, isPending } = useUpdateSettings(tournamentId, tournamentSlug)

  // Derive initial values from settings
  const initialConfig = useMemo(
    () => ({
      groupBestOf: settings?.groupBestOf ?? 3,
      upperBestOf: settings?.upperBestOf ?? 3,
      lowerBestOf: settings?.lowerBestOf ?? 3,
      grandFinalBestOf: settings?.grandFinalBestOf ?? 3,
      roundDurationSoccer: settings?.roundDurationSoccer ?? 3,
      roundDurationSumo: settings?.roundDurationSumo ?? 5,
    }),
    [settings],
  )

  const [config, setConfig] = useState(initialConfig)

  // Track if there are unsaved changes by comparing with initial values
  const hasChanges = useMemo(() => {
    return (
      config.groupBestOf !== initialConfig.groupBestOf ||
      config.upperBestOf !== initialConfig.upperBestOf ||
      config.lowerBestOf !== initialConfig.lowerBestOf ||
      config.grandFinalBestOf !== initialConfig.grandFinalBestOf ||
      config.roundDurationSoccer !== initialConfig.roundDurationSoccer ||
      config.roundDurationSumo !== initialConfig.roundDurationSumo
    )
  }, [config, initialConfig])

  const updateFormat = useCallback((key: keyof typeof config, val: number) => {
    setConfig((prev) => ({ ...prev, [key]: val }))
  }, [])

  const handleSave = useCallback(() => {
    const updateData: IUpdateSettingInput = {
      groupBestOf: config.groupBestOf,
      upperBestOf: config.upperBestOf,
      lowerBestOf: config.lowerBestOf,
      grandFinalBestOf: config.grandFinalBestOf,
      roundDurationSoccer: config.roundDurationSoccer,
      roundDurationSumo: config.roundDurationSumo,
    }
    updateSettings(updateData)
  }, [config, updateSettings])

  // Reset config when settings change from API
  const handleReset = useCallback(() => {
    setConfig(initialConfig)
  }, [initialConfig])

  return (
    <div className="h-full p-6 font-sans flex justify-center items-start">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tournament Rules</h1>
            <p className="text-gray-500 text-sm mt-1">Configure match mechanics and scoring systems.</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={handleReset}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-300">
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                hasChanges && !isPending ? 'bg-[#FBFF00] hover:bg-yellow-400 text-black shadow-md hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Match Format Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
            <SectionHeader icon={<Trophy className="w-5 h-5" />} title="Match Format (Best Of)" />

            <div className="space-y-1 mt-6">
              <CounterRow label="Group Stage" value={config.groupBestOf} onChange={(v) => updateFormat('groupBestOf', v)} />
              <CounterRow label="Upper Bracket" value={config.upperBestOf} onChange={(v) => updateFormat('upperBestOf', v)} />
              <CounterRow label="Lower Bracket" value={config.lowerBestOf} onChange={(v) => updateFormat('lowerBestOf', v)} />
              <CounterRow label="Grand Finals" value={config.grandFinalBestOf} onChange={(v) => updateFormat('grandFinalBestOf', v)} />
            </div>
          </div>

          {/* Round Durations Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
            <SectionHeader icon={<Timer className="w-5 h-5" />} title="Round Durations" />

            <div className="mt-8 space-y-10">
              <SliderRow label="Soccer Category" value={config.roundDurationSoccer} onChange={(v) => updateFormat('roundDurationSoccer', v)} />
              <SliderRow label="Sumo Category" value={config.roundDurationSumo} onChange={(v) => updateFormat('roundDurationSumo', v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentRules
