'use client'

import { FilePreviewCompact } from '@/components/ui/file-preview'
import Loader from '@/components/ui/loader'
import { updateParticipant, updateTeamProfile } from '@/lib/api/team'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  data: ITeamDetail
}

export default function MissingDataModal({ data }: Props) {
  const queryClient = useQueryClient()
  const [logo, setLogo] = useState<File | null>(null)
  const [invoice, setInvoice] = useState<File | null>(null)
  // Map participant index to their missing files
  const [participantFiles, setParticipantFiles] = useState<{
    [key: number]: {
      image?: File | null
      identityCard?: File | null
    }
  }>({})

  // Identify what's missing
  const isLogoMissing = !data.logo
  const isInvoiceMissing = data.registrations.length > 0 && !data.registrations[0].invoice // Assuming index 0 is current
  const missingParticipants = data.participants
    .map((p: IParticipant, index: number) => {
      const isImageMissing = !p.image
      const isIdCardMissing = !p.identityCardImage
      return { index, uid: p.uid, name: p.name, isImageMissing, isIdCardMissing }
    })
    .filter((p) => p.isImageMissing || p.isIdCardMissing)

  const updateTeamMutation = useMutation({
    mutationFn: (formData: FormData) => updateTeamProfile(formData),
  })

  const updateParticipantMutation = useMutation({
    mutationFn: ({ uid, formData }: { uid: string; formData: FormData }) => updateParticipant(uid, formData),
  })

  const isPending = updateTeamMutation.isPending || updateParticipantMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    /*
    // Optional logo based on user request (logo tipe opsional)
    if (isLogoMissing && !logo) {
         // Should we force it? Request says: "untuk form yang di tampilkan hanya form dengan data yang null atau tidak ada, dan untuk logo itu tipenya opsional."
         // So if logo is missing, we show input, but user is NOT required to fill it?
         // Request also says: "diberi modal yang tidak bisa diclose, dan diwajibkan untuk memasukkan itu semua disitu."
         // This implies mandatory. But "logo itu tipenya opsional" might mean it appears but is not blocking?
         // Let's assume Invoice and IdentityCard are BLOCKING. Logo is shown but optional.
    }
    */

    if (isInvoiceMissing && !invoice) {
      toast.error('Bukti Pembayaran (Invoice) wajib diunggah')
      return
    }

    for (const p of missingParticipants) {
      const files = participantFiles[p.index]
      if (p.isImageMissing && !files?.image) {
        toast.error(`Foto untuk ${p.name} wajib diunggah`)
        return
      }
      if (p.isIdCardMissing && !files?.identityCard) {
        toast.error(`Kartu Identitas untuk ${p.name} wajib diunggah`)
        return
      }
    }

    try {
      const promises = []

      // Update Team (Logo & Invoice)
      if ((isLogoMissing && logo) || (isInvoiceMissing && invoice)) {
        const formData = new FormData()
        formData.append('name', data.name) // Required by backend? usually yes for update
        // Backend updateTeamController uses 'logo' field, 'invoice' field.
        if (logo) formData.append('logo', logo)
        if (invoice) formData.append('invoice', invoice)

        // We need to send other required fields if backend validation is strict?
        // `updateTeamService` updates whatever is in data. `updateTeamController` creates `data` from `req.body`.
        // If we only send name, logo, invoice, it should be fine as it's partial update?
        // `IUpdateTeam` is Partial. So we good.

        promises.push(updateTeamMutation.mutateAsync(formData))
      }

      // Update Participants
      for (const p of missingParticipants) {
        const files = participantFiles[p.index]
        if (files?.image || files?.identityCard) {
          const formData = new FormData()
          formData.append('name', p.name) // Pass name just in case
          if (files.image) formData.append('image', files.image) // Controller looks for 'image' or 'participantsImage'?
          // Refactored controller: const imageFile = getFilesByField('image')[0] || getFilesByField('participantsImage')[0]
          // So 'image' works.

          if (files.identityCard) formData.append('identityCardImage', files.identityCard)
          // Refactored controller: const idCardFile = getFilesByField('identityCardImage')[0] || getFilesByField('participantsIdentityCardImage')[0]
          // So 'identityCardImage' works.

          promises.push(updateParticipantMutation.mutateAsync({ uid: p.uid, formData }))
        }
      }

      await Promise.all(promises)
      toast.success('Data berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['team-profile'] })
      queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
      window.location.reload() // Reload to ensure clean state and modal removal check
    } catch (error) {
      console.error(error)
      toast.error('Gagal memperbarui data')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-6">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-xl font-bold font-plus-jakarta-sans">Lengkapi Data Pendaftaran</h2>
          </div>

          <p className="text-slate-600 mb-6 font-plus-jakarta-sans">Mohon lengkapi data berikut untuk melanjutkan. Anda tidak dapat menutup jendela ini sampai semua data wajib terisi.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Section */}
            {(isLogoMissing || isInvoiceMissing) && (
              <div className="space-y-4 border-b pb-6">
                <h3 className="font-bold text-lg">Data Tim</h3>

                {isLogoMissing && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo Tim (Opsional)</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-plus-jakarta-sans">Klik untuk upload logo</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                    </label>
                    <FilePreviewCompact file={logo} onRemove={() => setLogo(null)} />
                  </div>
                )}

                {isInvoiceMissing && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bukti Pembayaran / Invoice <span className="text-red-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-plus-jakarta-sans">Klik untuk upload Invoice</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setInvoice(e.target.files?.[0] || null)} />
                    </label>
                    <FilePreviewCompact file={invoice} onRemove={() => setInvoice(null)} />
                  </div>
                )}
              </div>
            )}

            {/* Participants Section */}
            {missingParticipants.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Data Peserta</h3>
                {missingParticipants.map((p) => (
                  <div key={p.index} className="p-4 border rounded-lg bg-slate-50 space-y-4">
                    <p className="font-medium text-slate-800">{p.name}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {p.isImageMissing && (
                        <div>
                          <label className="block text-xs font-semibold mb-1 uppercase">
                            Foto Profil <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              setParticipantFiles((prev) => ({
                                ...prev,
                                [p.index]: { ...prev[p.index], image: file },
                              }))
                            }}
                          />
                          <FilePreviewCompact
                            file={participantFiles[p.index]?.image || null}
                            onRemove={() => setParticipantFiles((prev) => ({ ...prev, [p.index]: { ...prev[p.index], image: null } }))}
                          />
                        </div>
                      )}

                      {p.isIdCardMissing && (
                        <div>
                          <label className="block text-xs font-semibold mb-1 uppercase">
                            Kartu Identitas <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              setParticipantFiles((prev) => ({
                                ...prev,
                                [p.index]: { ...prev[p.index], identityCard: file },
                              }))
                            }}
                          />
                          <FilePreviewCompact
                            file={participantFiles[p.index]?.identityCard || null}
                            onRemove={() => setParticipantFiles((prev) => ({ ...prev, [p.index]: { ...prev[p.index], identityCard: null } }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <button
                disabled={isPending}
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isPending && <Loader show />}
    </div>
  )
}
