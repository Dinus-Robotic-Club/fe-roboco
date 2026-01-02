import Loader from '@/components/ui/loader'
import { FileUp } from 'lucide-react'
import { useRef, useState } from 'react'

const UploadZone = ({ onFileSelect, isUploading, hasExistingFile }: { onFileSelect: (file: File) => void; isUploading?: boolean; hasExistingFile: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') onFileSelect(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
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
        ${isDragOver ? 'border-[#FBFF00] bg-yellow-50/50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
        ${hasExistingFile ? 'h-32 mt-6' : 'h-125'}
      `}>
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleChange} disabled={isUploading} />

      {isUploading ? (
        <Loader show />
      ) : (
        <div className="text-center p-6 space-y-3">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragOver ? 'bg-[#FBFF00]' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            <FileUp className={`w-6 h-6 ${isDragOver ? 'text-black' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{hasExistingFile ? 'Ganti File Sertifikat' : 'Upload Sertifikat Baru'}</p>
            <p className="text-xs text-slate-500 mt-1">Klik atau drag & drop file PDF di sini (Max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { UploadZone }
