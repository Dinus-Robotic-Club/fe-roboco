'use client'

import { ICertificateProps } from '@/lib/types'
import { Download, ExternalLink, ShieldCheck, Award } from 'lucide-react'
import { UploadZone } from './upload-certif'
import { EmptyStateCertificate } from '@/components/ui/empty'
import { PDFPreview } from '@/components/ui/pdf-preview'
import Image from 'next/image'
import { useState } from 'react'

// Helper to check if URL is an image
const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some((ext) => lowerUrl.includes(ext))
}

// Image Preview Component
const ImagePreview = ({ url, alt }: { url: string; alt: string }) => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative w-full bg-slate-100/50 rounded-xl border border-slate-200 p-4 lg:p-8 flex justify-center overflow-hidden">
      <div className="relative w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden ring-1 ring-slate-900/5 transition-transform duration-500 ease-out hover:scale-[1.01]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
          </div>
        )}
        <Image src={url} alt={alt} width={1200} height={850} className="w-full h-auto object-contain" onLoad={() => setLoading(false)} unoptimized />
      </div>
    </div>
  )
}

const Certificate = ({ pdfUrl, fileName = 'certificate.pdf', role = 'PARTICIPANTS', onUpload, isUploading = false }: ICertificateProps) => {
  const isAdmin = role === 'ADMIN'
  const hasFile = Boolean(pdfUrl)
  const isImage = pdfUrl ? isImageUrl(pdfUrl) : false

  const handleDownload = async () => {
    if (!pdfUrl) return

    try {
      // Fetch the file as a blob to ensure proper download
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      // Fallback: open in new tab if download fails
      window.open(pdfUrl, '_blank')
    }
  }

  const handleOpenNewTab = () => {
    if (pdfUrl) window.open(pdfUrl, '_blank')
  }

  const handleFileSelect = async (file: File) => {
    if (onUpload) {
      await onUpload(file)
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex flex-col items-center justify-center w-full text-center">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#FBFF00] fill-black" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Document</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">E-CERTIFICATE</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-md">Dokumen resmi pencapaian tim dalam turnamen. Dapat diverifikasi keasliannya.</p>
        </div>

        {hasFile && (
          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black bg-[#FBFF00] rounded-lg shadow-sm hover:bg-yellow-300 active:scale-95 transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {!hasFile ? (
          isAdmin ? (
            <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} hasExistingFile={false} />
          ) : (
            <EmptyStateCertificate />
          )
        ) : (
          <>
            {/* Preview - Image or PDF */}
            {isImage ? <ImagePreview url={pdfUrl!} alt="Certificate" /> : <PDFPreview url={pdfUrl!} />}

            {/* Certificate Info Card */}
            <div className="bg-linear-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FBFF00]/20 rounded-lg">
                  <Award className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Sertifikat Partisipasi</h3>
                  <p className="text-sm text-slate-500">Sertifikat ini diberikan sebagai bukti keikutsertaan dalam turnamen. Klik tombol download untuk mengunduh sertifikat.</p>
                </div>
              </div>
            </div>

            {/* Admin Upload Controls */}
            {isAdmin && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Controls</p>
                <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} hasExistingFile={true} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { Certificate }
