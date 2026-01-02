import { ICertificateProps } from '@/lib/types'
import { Download, ExternalLink, ShieldCheck } from 'lucide-react'
import { UploadZone } from './upload-certif'
import { EmptyStateCertificate } from '@/components/ui/empty'
import { PDFPreview } from '@/components/ui/pdf-preview'

const Certificate = ({ pdfUrl, fileName = 'certificate.pdf', role = 'PARTICIPANTS', onUpload, isUploading = false }: ICertificateProps) => {
  const isAdmin = role === 'ADMIN'
  const hasFile = Boolean(pdfUrl)

  const handleDownload = () => {
    if (!pdfUrl) return
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex flex-col items-center justify-center  w-full">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#FBFF00] fill-black" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Document</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">E-CERTIFICATE</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-md">Dokumen resmi pencapaian tim dalam turnamen. Dapat diverifikasi keasliannya.</p>
        </div>

        {hasFile && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewTab}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
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

      <div className="space-y-6">
        {!hasFile ? (
          isAdmin ? (
            <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} hasExistingFile={false} />
          ) : (
            <EmptyStateCertificate />
          )
        ) : (
          <>
            <PDFPreview url={pdfUrl!} />

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
