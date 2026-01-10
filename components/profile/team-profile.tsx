'use client'

import { FormInput, PasswordInput } from '@/components/ui/input'
import { getImageUrl } from '@/lib/function'
import { ITeamProfileProps } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { updateParticipant, updateTeamProfile } from '@/lib/api/team'
import { useQueryClient } from '@tanstack/react-query'
import { Save, Loader2 } from 'lucide-react'

// Small save button component
const SaveButton = ({ onClick, isLoading, disabled }: { onClick: () => void; isLoading: boolean; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className="px-3 py-2 bg-[#FBFF00] hover:bg-yellow-400 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-lg text-sm font-bold flex items-center gap-1 transition-all">
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
    {isLoading ? 'Saving...' : 'Simpan'}
  </button>
)

function TeamProfile({ data }: ITeamProfileProps) {
  const queryClient = useQueryClient()

  // Loading states for individual saves
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})

  // Team fields
  const [teamName, setTeamName] = useState(data.name || '')
  const [teamLogo, setTeamLogo] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Participants fields - array for each participant
  const [participantsData, setParticipantsData] = useState(
    data.participants.map((p) => ({
      uid: p.uid,
      name: p.name || '',
      phone: p.phone || '',
      twibbon: p.twibbon || '',
      image: null as File | null,
    })),
  )

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }))
  }

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['team-profile'] })
    queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
  }

  // Individual update functions
  const handleUpdateTeamName = async () => {
    if (!teamName.trim()) {
      toast.error('Nama tim tidak boleh kosong')
      return
    }
    setLoading('teamName', true)
    try {
      const formData = new FormData()
      formData.append('name', teamName)
      await updateTeamProfile(formData)
      toast.success('Nama tim berhasil diupdate!')
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate nama tim')
    } finally {
      setLoading('teamName', false)
    }
  }

  const handleUpdateTeamLogo = async () => {
    if (!teamLogo) {
      toast.error('Pilih logo terlebih dahulu')
      return
    }
    setLoading('teamLogo', true)
    try {
      const formData = new FormData()
      formData.append('name', data.name) // Keep original name
      formData.append('logo', teamLogo)
      await updateTeamProfile(formData)
      toast.success('Logo tim berhasil diupdate!')
      setTeamLogo(null)
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate logo tim')
    } finally {
      setLoading('teamLogo', false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!password) {
      toast.error('Password tidak boleh kosong')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi tidak cocok')
      return
    }
    setLoading('password', true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('password', password)
      await updateTeamProfile(formData)
      toast.success('Password berhasil diupdate!')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Gagal mengupdate password')
    } finally {
      setLoading('password', false)
    }
  }

  const handleUpdateParticipantName = async (index: number) => {
    const participant = participantsData[index]
    if (!participant.name.trim()) {
      toast.error('Nama peserta tidak boleh kosong')
      return
    }
    setLoading(`pName_${index}`, true)
    try {
      const formData = new FormData()
      formData.append('name', participant.name)
      await updateParticipant(participant.uid, formData)
      toast.success('Nama peserta berhasil diupdate!')
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate nama peserta')
    } finally {
      setLoading(`pName_${index}`, false)
    }
  }

  const handleUpdateParticipantPhone = async (index: number) => {
    const participant = participantsData[index]
    setLoading(`pPhone_${index}`, true)
    try {
      const formData = new FormData()
      formData.append('name', data.participants[index].name)
      formData.append('phone', participant.phone)
      await updateParticipant(participant.uid, formData)
      toast.success('Telepon peserta berhasil diupdate!')
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate telepon peserta')
    } finally {
      setLoading(`pPhone_${index}`, false)
    }
  }

  const handleUpdateParticipantTwibbon = async (index: number) => {
    const participant = participantsData[index]
    setLoading(`pTwibbon_${index}`, true)
    try {
      const formData = new FormData()
      formData.append('name', data.participants[index].name)
      formData.append('twibbon', participant.twibbon)
      await updateParticipant(participant.uid, formData)
      toast.success('Twibbon peserta berhasil diupdate!')
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate twibbon peserta')
    } finally {
      setLoading(`pTwibbon_${index}`, false)
    }
  }

  const handleUpdateParticipantImage = async (index: number) => {
    const participant = participantsData[index]
    if (!participant.image) {
      toast.error('Pilih foto terlebih dahulu')
      return
    }
    setLoading(`pImage_${index}`, true)
    try {
      const formData = new FormData()
      formData.append('name', data.participants[index].name)
      formData.append('image', participant.image)
      await updateParticipant(participant.uid, formData)
      toast.success('Foto peserta berhasil diupdate!')
      setParticipantsData((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], image: null }
        return updated
      })
      refreshData()
    } catch (error) {
      toast.error('Gagal mengupdate foto peserta')
    } finally {
      setLoading(`pImage_${index}`, false)
    }
  }

  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">UPDATE PROFILE</h1>
        <p className="text-sm text-slate-500 mt-2">Klik tombol Simpan di setiap field yang ingin diupdate</p>
      </div>

      {/* Team Section */}
      <div className="mt-10 max-w-4xl w-full px-4 flex flex-col items-center gap-8">
        <h2 className="text-xl font-bold text-slate-700">TEAM INFO</h2>

        {/* Current Logo Preview */}
        <div className="bg-logo-team w-30.75 h-30.75 relative">
          <Image src={teamLogo ? URL.createObjectURL(teamLogo) : getImageUrl(data.logo)} alt="logo-team" height={10000} width={10000} className="w-full h-full p-2 object-contain" />
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* Team Name */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <FormInput id="team_name" label="NAMA TIM" placeholder="Nama Tim" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </div>
            <SaveButton onClick={handleUpdateTeamName} isLoading={loadingStates.teamName} />
          </div>

          {/* Team Logo */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <FormInput
                id="logo"
                label="LOGO TIM"
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setTeamLogo(file)
                }}
              />
            </div>
            <SaveButton onClick={handleUpdateTeamLogo} isLoading={loadingStates.teamLogo} disabled={!teamLogo} />
          </div>

          {/* Password */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <p className="text-sm font-bold text-slate-600 mb-4">UBAH PASSWORD (Opsional)</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <PasswordInput id="change_password" label="PASSWORD BARU" placeholder="Password Baru" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex-1">
                <PasswordInput id="confirm_password" label="KONFIRMASI PASSWORD" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="flex items-end">
                <SaveButton onClick={handleUpdatePassword} isLoading={loadingStates.password} disabled={!password || !confirmPassword} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="mt-16 max-w-4xl w-full px-4">
        <h2 className="text-xl font-bold text-slate-700 text-center mb-8">ANGGOTA TIM</h2>

        <div className="space-y-12">
          {data.participants.map((participant, index) => (
            <div key={participant.uid} className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                {/* Participant Image Preview */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={participantsData[index]?.image ? URL.createObjectURL(participantsData[index].image!) : getImageUrl(participant.image)}
                    alt={participant.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg">{participant.roleInTeam === 'LEADER' ? '👑 Leader' : '👤 Member'}</p>
                  <p className="text-sm text-slate-500">ID: {participant.uid.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Participant Name */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FormInput
                      id={`participant_name_${index}`}
                      label="NAMA PESERTA"
                      placeholder="Nama Peserta"
                      value={participantsData[index]?.name || ''}
                      onChange={(e) => {
                        setParticipantsData((prev) => {
                          const updated = [...prev]
                          updated[index] = { ...updated[index], name: e.target.value }
                          return updated
                        })
                      }}
                    />
                  </div>
                  <SaveButton onClick={() => handleUpdateParticipantName(index)} isLoading={loadingStates[`pName_${index}`]} />
                </div>

                {/* Participant Phone */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FormInput
                      id={`participant_phone_${index}`}
                      label="NO. TELEPON"
                      placeholder="08xxxxxxxxxx"
                      value={participantsData[index]?.phone || ''}
                      onChange={(e) => {
                        setParticipantsData((prev) => {
                          const updated = [...prev]
                          updated[index] = { ...updated[index], phone: e.target.value }
                          return updated
                        })
                      }}
                    />
                  </div>
                  <SaveButton onClick={() => handleUpdateParticipantPhone(index)} isLoading={loadingStates[`pPhone_${index}`]} />
                </div>

                {/* Participant Twibbon */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FormInput
                      id={`participant_twibbon_${index}`}
                      label="LINK TWIBBON"
                      placeholder="https://..."
                      value={participantsData[index]?.twibbon || ''}
                      onChange={(e) => {
                        setParticipantsData((prev) => {
                          const updated = [...prev]
                          updated[index] = { ...updated[index], twibbon: e.target.value }
                          return updated
                        })
                      }}
                    />
                  </div>
                  <SaveButton onClick={() => handleUpdateParticipantTwibbon(index)} isLoading={loadingStates[`pTwibbon_${index}`]} />
                </div>

                {/* Participant Image Upload */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FormInput
                      id={`participant_image_${index}`}
                      label="FOTO PESERTA"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setParticipantsData((prev) => {
                            const updated = [...prev]
                            updated[index] = { ...updated[index], image: file }
                            return updated
                          })
                        }
                      }}
                    />
                  </div>
                  <SaveButton onClick={() => handleUpdateParticipantImage(index)} isLoading={loadingStates[`pImage_${index}`]} disabled={!participantsData[index]?.image} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export { TeamProfile }
