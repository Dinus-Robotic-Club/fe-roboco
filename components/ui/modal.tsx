'use client'

import { ArrowRight, Check, Copy, FileImage, Image as Image_Preview, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import Loader from './loader'
import { CAPTION_TEXT } from '@/lib/statis-data'
import { IValidationProps } from '@/lib/types'

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
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={action}>
            {confirm_text}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ImageUploadModal, ValidationModal }
