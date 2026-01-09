import { FileUp, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

// Allowed file types for certificate upload
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const ALLOWED_EXTENSIONS = '.pdf, .jpg, .jpeg, .png, .webp'

const isValidFileType = (file: File): boolean => {
  return ALLOWED_TYPES.includes(file.type) || file.type.startsWith('image/')
}

const UploadZone = ({ onFileSelect, isUploading, hasExistingFile }: { onFileSelect: (file: File) => void; isUploading?: boolean; hasExistingFile: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (isValidFileType(file)) {
        setError(null)
        onFileSelect(file)
      } else {
        setError('Format file tidak didukung. Gunakan PDF atau gambar (JPG, PNG)')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (isValidFileType(file)) {
        setError(null)
        onFileSelect(file)
      } else {
        setError('Format file tidak didukung. Gunakan PDF atau gambar (JPG, PNG)')
      }
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300
        ${isDragOver ? 'border-[#FBFF00] bg-yellow-50/50' : error ? 'border-red-300 hover:border-red-400' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
        ${hasExistingFile ? 'h-32 mt-6' : 'h-125'}
      `}>
      <input ref={inputRef} type="file" accept={ALLOWED_EXTENSIONS} className="hidden" onChange={handleChange} disabled={isUploading} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Mengupload sertifikat...</p>
        </div>
      ) : (
        <div className="text-center p-6 space-y-3">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragOver ? 'bg-[#FBFF00]' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            <FileUp className={`w-6 h-6 ${isDragOver ? 'text-black' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{hasExistingFile ? 'Ganti File Sertifikat' : 'Upload Sertifikat Baru'}</p>
            <p className="text-xs text-slate-500 mt-1">Klik atau drag & drop file PDF/gambar di sini (Max 10MB)</p>
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
      )}
    </div>
  )
}

export { UploadZone }
