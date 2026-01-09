'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Upload, X, Loader2, Check, IdCard, Camera, Building2, FileText, LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export interface MissingField {
  type: 'identity_card' | 'participant_image' | 'logo' | 'invoice'
  participantId?: string
  participantName?: string
}

interface MissingDataModalProps {
  missingFields: MissingField[]
  onUpload: (type: MissingField['type'], file: File, participantId?: string) => Promise<void>
  onComplete?: () => void
  isUploading?: boolean
}

interface FieldConfigItem {
  label: string
  description: string
  icon: LucideIcon
  accept: string
  needsRemoveBg: boolean
  optional: boolean
}

const fieldConfig: Record<MissingField['type'], FieldConfigItem> = {
  identity_card: {
    label: 'Kartu Identitas',
    description: 'Upload KTP, KTM, atau KTS untuk verifikasi identitas.',
    icon: IdCard,
    accept: '.jpg,.jpeg,.png',
    needsRemoveBg: false,
    optional: false,
  },
  participant_image: {
    label: 'Foto Peserta',
    description: 'Upload foto untuk keperluan dokumentasi. Background akan dihapus secara otomatis.',
    icon: Camera,
    accept: '.jpg,.jpeg,.png,.webp',
    needsRemoveBg: true,
    optional: false,
  },
  logo: {
    label: 'Logo Tim',
    description: 'Upload logo tim untuk ditampilkan pada leaderboard. (Opsional)',
    icon: Building2,
    accept: '.jpg,.jpeg,.png',
    needsRemoveBg: false,
    optional: true,
  },
  invoice: {
    label: 'Bukti Pembayaran',
    description: 'Upload bukti pembayaran (Invoice) untuk verifikasi pendaftaran.',
    icon: FileText,
    accept: '.jpg,.jpeg,.png,.pdf',
    needsRemoveBg: false,
    optional: false,
  },
}

// Remove background using the same API as registration
const removeBackground = async (file: File): Promise<File> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('https://api-bg-ok.dinusrobotic.org/remove-bg', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Failed to remove background')

  const blob = await res.blob()
  return new File([blob], `removed_bg_${file.name}`, {
    type: 'image/png',
  })
}

export const MissingDataModal = ({ missingFields, onUpload, onComplete, isUploading = false }: MissingDataModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentField = missingFields[currentIndex]
  const config = currentField ? fieldConfig[currentField.type] : null

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [selectedFile])

  // Simulate upload progress
  useEffect(() => {
    if (isUploading || isProcessing) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)
      return () => clearInterval(interval)
    } else {
      setUploadProgress(0)
    }
  }, [isUploading, isProcessing])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !currentField) return

    try {
      setIsProcessing(true)

      let fileToUpload = selectedFile

      // If this field needs background removal (participant_image), process it first
      if (config?.needsRemoveBg) {
        toast.info('Menghapus background foto...')
        fileToUpload = await removeBackground(selectedFile)
        toast.success('Background berhasil dihapus!')
      }

      // Now call the onUpload callback with the processed file
      await onUpload(currentField.type, fileToUpload, currentField.participantId)

      // Move to next field or close
      setSelectedFile(null)
      if (currentIndex < missingFields.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        // All done
        toast.success('Semua data berhasil dilengkapi!')
        onComplete?.()
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal memproses file. Silakan coba lagi.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Don't render if no missing fields
  if (missingFields.length === 0) return null

  const Icon = config?.icon || AlertTriangle
  const isLoading = isUploading || isProcessing

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/80 backdrop-blur-sm font-plus-jakarta-sans p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-white/10">
        {/* Warning Header */}
        <div className="bg-[#FBFF00] p-5 flex items-center gap-4 border-b border-black/5">
          <div className="w-10 h-10 rounded-full bg-black text-[#FBFF00] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black uppercase tracking-tight">Data Tidak Lengkap</h2>
            <p className="text-sm text-black/80 font-medium">{missingFields.length} data wajib belum dilengkapi</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2">
            {missingFields.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx < currentIndex ? 'bg-black' : idx === currentIndex ? 'bg-[#FBFF00] ring-2 ring-black/5' : 'bg-gray-100'}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Langkah {currentIndex + 1} dari {missingFields.length}
            </p>
            <p className="text-xs font-bold text-black">{Math.round((currentIndex / missingFields.length) * 100)}% Selesai</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                {config?.label}
                {currentField?.participantName && <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-full">{currentField.participantName}</span>}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{config?.description}</p>
            </div>
          </div>

          {/* Upload Area */}
          <label
            className={`
              relative flex flex-col items-center justify-center w-full h-56 
              border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group
              ${selectedFile ? 'border-[#FBFF00] bg-yellow-50/30' : 'border-gray-300 hover:border-[#FBFF00] hover:bg-yellow-50/10'}
            `}>
            <input type="file" accept={config?.accept} className="hidden" onChange={handleFileSelect} disabled={isLoading} />

            {previewUrl ? (
              <div className="relative w-full h-full p-2">
                <Image src={previewUrl} alt="Preview" fill className="object-contain rounded-lg" unoptimized />
                {!isLoading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedFile(null)
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">File terpilih</div>
              </div>
            ) : (
              <div className="text-center p-6 transition-transform duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FBFF00] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <p className="text-sm font-bold text-gray-700">Klik atau drag file di sini</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 10MB)</p>
              </div>
            )}
          </label>

          {/* Upload Progress */}
          {isLoading && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-black mb-2">
                <span>{isProcessing && config?.needsRemoveBg ? 'MENGHAPUS BACKGROUND...' : 'MENGUPLOAD...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                <div className="h-full bg-[#FBFF00] transition-all duration-300 relative" style={{ width: `${uploadProgress}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className={`
              w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3
              ${selectedFile && !isLoading ? 'bg-black text-[#FBFF00] hover:bg-gray-900 hover:shadow-xl hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isProcessing && config?.needsRemoveBg ? 'Memproses...' : 'Menyimpan...'}
              </>
            ) : (
              <>
                Upload {config?.label}
                <Check className="w-5 h-5" />
              </>
            )}
          </button>

          {config?.optional && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null)
                if (currentIndex < missingFields.length - 1) {
                  setCurrentIndex((prev) => prev + 1)
                } else {
                  toast.success('Data tersimpan!')
                  onComplete?.()
                }
              }}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              Lewati (Nanti Saja)
            </button>
          )}

          <p className="text-[10px] text-center text-gray-400 mt-2 uppercase tracking-wider font-medium">Data Anda aman dan terenkripsi</p>
        </div>
      </div>
    </div>
  )
}

export default MissingDataModal
