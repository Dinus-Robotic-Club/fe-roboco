'use client'

import { ArrowRight, Building2, Calendar, Check, Copy, CreditCard, FileImage, FileText, Image as Image_Preview, Phone, Shield, User, Users, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import Loader from './loader'
import { CAPTION_TEXT } from '@/lib/statis-data'
import { IModalProps, IValidationProps } from '@/lib/types'
import { StatusBadge } from './badge'
import { DataRow } from './row'
import { formatDate } from '@/lib/function'
import { ImageThumbnail } from './thumbnail'

export default function ImageUploadModal({
  onClose,
  data,
  setData,
  index,
}: {
  onClose: () => void
  data: IParticipantsBody[]
  setData: (index: number, patch: Partial<IParticipantsBody>) => void
  index: number
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [twibbonResult, setTwibbonResult] = useState<string | null>(null)

  const [loadingTwibbon, setLoadingTwibbon] = useState(false)
  const [loadingProcess, setLoadingProcess] = useState(false)

  const [tempFile, setTempFile] = useState<File | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isLoadingAny = loadingTwibbon || loadingProcess

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const generateTwibbon = async () => {
      if (!tempFile) return

      const formData = new FormData()
      formData.append('image', tempFile)

      try {
        setLoadingTwibbon(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/remove`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('Failed to generate twibbon')

        const blob = await res.blob()
        const twibbonUrl = URL.createObjectURL(blob)
        setTwibbonResult(twibbonUrl)
      } catch (err) {
        console.error(err)
        toast.error('Gagal membuat pratinjau Twibbon.')
      } finally {
        setLoadingTwibbon(false)
      }
    }

    generateTwibbon()
  }, [tempFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imgUrl = URL.createObjectURL(file)
    setPreview(imgUrl)
    setTempFile(file)
    setTwibbonResult(null)
  }

  const handleConfirmAndSave = async () => {
    if (!tempFile) {
      toast.error('Mohon pilih foto terlebih dahulu')
      return
    }

    const formData = new FormData()
    formData.append('file', tempFile)

    try {
      setLoadingProcess(true)

      const res = await fetch('https://api-bg-ok.dinusrobotic.org/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to remove background')

      const blob = await res.blob()
      const processedFile = new File([blob], `removed_bg_${tempFile.name}`, {
        type: 'image/png',
      })

      setData(index, { ...data, participantsImage: processedFile })

      toast.success('Foto berhasil diproses dan disimpan!')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Gagal memproses penghapusan latar belakang (background).')
    } finally {
      setLoadingProcess(false)
    }
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(CAPTION_TEXT)
    setIsCopied(true)
    toast.success('Caption Twibbon berhasil disalin!')
    setTimeout(() => setIsCopied(false), 2000)
  }

  const triggerUpload = () => fileInputRef.current?.click()

  const handleDownloadTwibbon = () => {
    if (!twibbonResult) return
    const link = document.createElement('a')
    link.href = twibbonResult
    link.download = `twibbon_result_${index + 1}.png`
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-plus-jakarta-sans backdrop-blur-sm" onClick={isLoadingAny ? undefined : onClose}>
      <div className="bg-white w-full max-w-4xl 2xl:max-w-5xl rounded-xl shadow-2xl p-6 relative max-h-[95vh] overflow-y-auto no-scrollbar flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
        {isLoadingAny && <Loader show />}

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Unggah Foto & Pratinjau Twibbon</h2>
          <button onClick={onClose} disabled={isLoadingAny} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-6">
          {/* Image Processing Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* KIRI: Upload */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <label className="text-sm font-semibold text-gray-700 ml-1">1. Pilih Foto Peserta</label>
              <label
                onClick={isLoadingAny ? undefined : triggerUpload}
                className={`cursor-pointer group flex flex-col items-center justify-center aspect-square w-full border-2 border-dashed rounded-xl transition-all duration-300 relative overflow-hidden bg-gray-50
                                ${preview ? 'border-yellow-400 bg-yellow-50/30' : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'}`}>
                {preview ? (
                  <Image src={preview} fill alt="Original Preview" className="object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-yellow-600 transition-colors">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Image_Preview className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium">Klik untuk upload foto</span>
                    <span className="text-xs text-gray-400 mt-1">Jpg, Png, Webp (Max 5MB)</span>
                  </div>
                )}
              </label>
            </div>

            <ArrowRight className="hidden lg:block w-8 h-8 text-gray-300" />

            {/* KANAN: Result */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <label className="text-sm font-semibold text-gray-700 ml-1">2. Hasil Preview Twibbon</label>
              <div className="flex flex-col items-center justify-center aspect-square w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 relative overflow-hidden">
                {twibbonResult ? (
                  <Image src={twibbonResult} fill alt="Twibbon Result" className="object-contain p-2" />
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <FileImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <span className="text-sm">
                      Preview akan muncul otomatis
                      <br />
                      setelah foto dipilih
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 relative group">
            {/* Decorative Background Blob (Subtle) */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-white/50 p-1 sm:p-2 transition-all hover:border-gray-400 hover:bg-white">
              {/* Header Bar */}
              <div className="flex justify-between items-center px-3 py-2 border-b border-dashed border-gray-200 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="font-fira-code text-xs sm:text-sm font-bold text-gray-800 tracking-tight">CAPTION_TWIBBON.TXT</span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCaption}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95
                                    ${isCopied ? 'bg-green-500 text-white shadow-green-200 shadow-lg ring-2 ring-green-100' : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200'}`}>
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> COPY TEXT
                    </>
                  )}
                </button>
              </div>

              {/* Text Area (Monospace Look) */}
              <div className="relative p-2">
                <textarea
                  readOnly
                  value={CAPTION_TEXT}
                  className="w-full h-32 sm:h-40 bg-transparent text-xs sm:text-sm text-gray-600 font-mono leading-relaxed resize-none focus:outline-none p-2 selection:bg-yellow-200 selection:text-black"
                  spellCheck={false}
                />

                {/* Overlay Gradient untuk indikasi scroll jika teks panjang */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Warning / Reminder Tag */}
            <div className="flex items-start gap-2 mt-3 ml-2">
              <div className="min-w-1 h-4 bg-yellow-400 rounded-full mt-0.5"></div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                <span className="text-red-500 font-bold">PENTING:</span> Jangan lupa ganti bagian
                <span className="bg-yellow-100 px-1 mx-1 rounded text-gray-800 border border-yellow-200 font-mono">[Nama]</span>
                dan
                <span className="bg-yellow-100 px-1 mx-1 rounded text-gray-800 border border-yellow-200 font-mono">[Instansi]</span>
                sebelum posting ya! 🚀
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-end border-t pt-6">
            <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            {/* Tombol Confirm Utama */}
            <button
              onClick={handleConfirmAndSave}
              disabled={isLoadingAny || !tempFile}
              className="order-1 sm:order-2 flex-1 sm:flex-none py-3 px-6 bg-[#FBFF00] hover:bg-yellow-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none min-w-50">
              {loadingProcess ? 'Menyimpan...' : 'Simpan Foto ke Form'}
              <Check className="w-5 h-5" />
            </button>

            {/* Tombol Download Sekunder */}
            <button
              disabled={!twibbonResult || isLoadingAny}
              onClick={handleDownloadTwibbon}
              className="order-2 sm:order-1 flex-1 sm:flex-none py-3 px-6 bg-white border-2 border-gray-200 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Unduh Twibbon
              <FaCloudDownloadAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ValidationModal({ setShowModalStart, action, title, desc, confirm_text }: IValidationProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-plus-jakarta-sans">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-base text-gray-600 mb-6">{desc}</p>
        <div className="flex justify-between gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowModalStart(false)}>
            Batal
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => {
              action()
              setShowModalStart(false)
            }}>
            {confirm_text}
          </button>
        </div>
      </div>
    </div>
  )
}

const TeamDetailModal: React.FC<IModalProps> = ({ isOpen, onClose, data, onApprove, onReject }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<IParticipant | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  if (!isOpen || !data.team) return null

  const { team } = data

  return (
    <>
      {/* --- Main Backdrop --- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
        {/* --- Main Modal Card --- */}
        <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
          {/* LEFT COLUMN: Team Info & Invoice */}
          <div className="w-full md:w-7/12 overflow-y-auto p-6 md:p-8 border-r border-slate-100 scrollbar-hide">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                {/* Team Logo Container - Added relative for fill */}
                <div className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  {team.logo ? (
                    <Image src={team.logo} alt={team.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Shield className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{team.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded text-xs">{team.category}</span>
                    <StatusBadge>{data.status}</StatusBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Registration Info</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <DataRow icon={FileText} label="Registration UID" value={<span className="font-mono text-xs">{data.uid}</span>} />
                  <DataRow icon={Calendar} label="Registered At" value={formatDate(data.registeredAt)} />
                  <DataRow icon={Building2} label="Community" value={team.community?.name || '-'} />
                  <DataRow icon={Shield} label="Team UID" value={<span className="font-mono text-xs">{team.uid}</span>} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Proof
                </h3>
                <div className="max-w-xs">
                  {/* ImageThumbnail already updated above */}
                  <ImageThumbnail src={data.invoice} alt="Payment Invoice" label="Invoice" onClick={() => setPreviewImage(data.invoice)} />
                </div>
              </section>

              <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => onReject(data.teamId)}
                  className="flex-1 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Reject Team
                </button>
                <button
                  onClick={() => onApprove(data.teamId)}
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                  <Check className="w-4 h-4" /> Approve Team
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Participants List */}
          <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col h-full border-l border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Roster ({team.participants.length})
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {team.participants.map((member) => (
                <div
                  key={member.uid}
                  onClick={() => setSelectedParticipant(member)}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group">
                  {/* Participant Avatar - Added relative */}
                  <div className="relative w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    <Image src={member.image} alt={member.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{member.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${member.roleInTeam === 'LEADER' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{member.roleInTeam}</span>
                      <span>•</span>
                      <span className="truncate">{member.phone}</span>
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-500">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Participant Detail Modal (Nested) --- */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedParticipant(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              {/* Detail Avatar - Added relative */}
              <div className="relative w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                <Image src={selectedParticipant.image} alt={selectedParticipant.name} fill className="object-cover" sizes="96px" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedParticipant.name}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {selectedParticipant.roleInTeam} — {team.name}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedParticipant.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-2 ml-1">Identity Card (KTP)</p>
                <ImageThumbnail src={selectedParticipant.identityCardImage} alt="Identity Card" label="ID Card" onClick={() => setPreviewImage(selectedParticipant.identityCardImage)} />
              </div>

              {selectedParticipant.twibbon && (
                <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100">
                  <Image_Preview className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase font-bold">Twibbon Link</p>
                    <a href={selectedParticipant.twibbon} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline truncate">
                      {selectedParticipant.twibbon}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewImage(null)}>
          {/* Wrapper relative diperlukan untuk next/image fill */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image src={previewImage} alt="Preview" fill className="object-contain animate-in zoom-in-90 duration-300 drop-shadow-2xl" sizes="100vw" priority unoptimized />
          </div>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all z-50">
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  )
}

export { ImageUploadModal, ValidationModal, TeamDetailModal }
