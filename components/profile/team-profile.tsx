'use client'

import { getImageUrl } from '@/lib/function'
import { ITeamProfileProps } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { updateParticipant, updateTeamProfile } from '@/lib/api/team'
import { useQueryClient } from '@tanstack/react-query'

function TeamProfile({ data }: ITeamProfileProps) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  // Team fields
  const [teamName, setTeamName] = useState(data.name || '')
  const [teamLogo, setTeamLogo] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Participants fields
  const [participantsData, setParticipantsData] = useState(
    data.participants.map((p) => ({
      uid: p.uid,
      name: p.name || '',
      phone: p.phone || '',
      twibbon: p.twibbon || '',
      image: null as File | null,
      originalName: p.name,
    })),
  )

  const handleSubmit = async () => {
    // Validate password match if provided
    if (password && password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok')
      return
    }

    setIsLoading(true)

    try {
      // Update team data if any field changed
      const teamFormData = new FormData()
      let hasTeamChanges = false

      if (teamName !== data.name) {
        teamFormData.append('name', teamName)
        hasTeamChanges = true
      } else {
        teamFormData.append('name', data.name)
      }

      if (teamLogo) {
        teamFormData.append('logo', teamLogo)
        hasTeamChanges = true
      }

      if (password) {
        teamFormData.append('password', password)
        hasTeamChanges = true
      }

      if (hasTeamChanges) {
        await updateTeamProfile(teamFormData)
      }

      // Update each participant if changed
      for (let i = 0; i < data.participants.length; i++) {
        const original = data.participants[i]
        const current = participantsData[i]

        const hasChanges = current.name !== original.name || current.phone !== original.phone || current.twibbon !== original.twibbon || current.image !== null

        if (hasChanges) {
          const formData = new FormData()
          formData.append('name', current.name)
          formData.append('phone', current.phone)
          formData.append('twibbon', current.twibbon)
          if (current.image) formData.append('image', current.image)
          await updateParticipant(current.uid, formData)
        }
      }

      toast.success('Profile berhasil diupdate!')
      setPassword('')
      setConfirmPassword('')
      setTeamLogo(null)

      queryClient.invalidateQueries({ queryKey: ['team-profile'] })
      queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Gagal mengupdate profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold tracking-tight">Update Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Ubah data yang diperlukan lalu simpan</p>
      </div>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Informasi Tim</h2>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            <Image src={teamLogo ? URL.createObjectURL(teamLogo) : getImageUrl(data.logo)} alt="Team Logo" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-2">Logo Tim</label>
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              onChange={(e) => setTeamLogo(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Nama Tim</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="Masukkan nama tim"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="Kosongkan jika tidak diubah"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="Ulangi password baru"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section className="mb-12">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Anggota Tim</h2>

        <div className="space-y-6">
          {data.participants.map((participant, index) => (
            <div key={participant.uid} className="p-5 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={participantsData[index]?.image ? URL.createObjectURL(participantsData[index].image!) : getImageUrl(participant.image)}
                    alt={participant.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{participant.roleInTeam === 'LEADER' ? 'Leader' : 'Member'}</p>
                  <p className="text-xs text-slate-400">{participant.uid.slice(0, 12)}...</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Nama</label>
                  <input
                    type="text"
                    value={participantsData[index]?.name || ''}
                    onChange={(e) => {
                      const updated = [...participantsData]
                      updated[index] = { ...updated[index], name: e.target.value }
                      setParticipantsData(updated)
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Telepon</label>
                  <input
                    type="text"
                    value={participantsData[index]?.phone || ''}
                    onChange={(e) => {
                      const updated = [...participantsData]
                      updated[index] = { ...updated[index], phone: e.target.value }
                      setParticipantsData(updated)
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Link Twibbon</label>
                  <input
                    type="text"
                    value={participantsData[index]?.twibbon || ''}
                    onChange={(e) => {
                      const updated = [...participantsData]
                      updated[index] = { ...updated[index], twibbon: e.target.value }
                      setParticipantsData(updated)
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Foto</label>
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const updated = [...participantsData]
                        updated[index] = { ...updated[index], image: file }
                        setParticipantsData(updated)
                      }
                    }}
                    className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer cursor-pointer file:rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition">
        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  )
}

export { TeamProfile }
