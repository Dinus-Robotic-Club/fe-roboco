import { useState } from 'react'
import { Save, Loader2, Trophy, Clock } from 'lucide-react'
import { TournamentSettings } from '@/lib/types/type'

interface SettingsTabProps {
    settings: TournamentSettings
    onUpdateSettings: (newSettings: TournamentSettings) => void
    onShowToast: (message: string) => void
}

export default function SettingsTab({ settings, onUpdateSettings, onShowToast }: SettingsTabProps) {
    const [isEditingSettings, setIsEditingSettings] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    // Local handler untuk update nilai spesifik
    const handleSettingChange = (field: keyof TournamentSettings, value: string) => {
        onUpdateSettings({ ...settings, [field]: parseInt(value) || 1 })
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            setIsEditingSettings(false)
            onShowToast('Settings saved successfully!')
        }, 1000)
    }

    return (
        <div className="max-w-4xl mx-auto no-print">
            <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Tournament Rules</h2>
                    <p className="text-slate-500 text-sm mt-1">Configure match mechanics and scoring systems.</p>
                </div>
                {isEditingSettings ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditingSettings(false)}
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-lg text-sm font-bold border border-gray-200 bg-white hover:bg-gray-50 text-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditingSettings(true)}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#FBFF00] text-black hover:bg-[#e6eb00] hover:shadow-lg hover:shadow-[#FBFF00]/20 transition-all shadow-sm"
                    >
                        Edit Configuration
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Match Structure Card */}
                <div
                    className={`bg-white p-6 rounded-xl border transition-all duration-300 ${
                        isEditingSettings ? 'border-[#FBFF00] ring-2 ring-[#FBFF00]/10' : 'border-gray-100 shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-slate-100 rounded-lg">
                            <Trophy className="w-5 h-5 text-slate-900" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Match Format (Best Of)</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 'groupBestOf', label: 'Group Stage' },
                            { id: 'upperBestOf', label: 'Upper Bracket' },
                            { id: 'lowerBestOf', label: 'Lower Bracket' },
                            { id: 'grandFinalBestOf', label: 'Grand Finals' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        disabled={!isEditingSettings || settings[item.id as keyof TournamentSettings] <= 1}
                                        onClick={() => handleSettingChange(item.id as keyof TournamentSettings, (settings[item.id as keyof TournamentSettings] - 2).toString())}
                                        className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-slate-900 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FBFF00] hover:bg-[#FBFF00]"
                                    >
                                        -
                                    </button>
                                    <span className={`w-8 text-center font-bold text-lg ${isEditingSettings ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {settings[item.id as keyof TournamentSettings]}
                                    </span>
                                    <button
                                        disabled={!isEditingSettings}
                                        onClick={() => handleSettingChange(item.id as keyof TournamentSettings, (settings[item.id as keyof TournamentSettings] + 2).toString())}
                                        className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-slate-900 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FBFF00] hover:bg-[#FBFF00]"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration Card */}
                <div
                    className={`bg-white p-6 rounded-xl border transition-all duration-300 ${
                        isEditingSettings ? 'border-[#FBFF00] ring-2 ring-[#FBFF00]/10' : 'border-gray-100 shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-slate-100 rounded-lg">
                            <Clock className="w-5 h-5 text-slate-900" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Round Durations</h3>
                    </div>
                    <div className="space-y-6">
                        {['Soccer', 'Sumo'].map((type) => {
                            const key = `roundDuration${type}` as keyof TournamentSettings
                            return (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-700">{type} Category</label>
                                        <span className="text-sm font-bold text-black bg-[#FBFF00] px-2 py-0.5 rounded">{settings[key]} Mins</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={settings[key]}
                                        disabled={!isEditingSettings}
                                        onChange={(e) => handleSettingChange(key, e.target.value)}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black disabled:cursor-not-allowed"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
