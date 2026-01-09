'use client'

import { X, FileText, File, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface FilePreviewProps {
  file: File | null
  existingUrl?: string | null
  onRemove?: () => void
  className?: string
  showRemoveButton?: boolean
  label?: string
}

const isImageFile = (file: File | null, url?: string | null): boolean => {
  if (file) {
    return file.type.startsWith('image/')
  }
  if (url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const lowerUrl = url.toLowerCase()
    return imageExtensions.some((ext) => lowerUrl.includes(ext))
  }
  return false
}

const isPdfFile = (file: File | null, url?: string | null): boolean => {
  if (file) {
    return file.type === 'application/pdf'
  }
  if (url) {
    return url.toLowerCase().includes('.pdf')
  }
  return false
}

export const FilePreview = ({ file, existingUrl, onRemove, className = '', showRemoveButton = true, label }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file && isImageFile(file, null)) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (existingUrl && isImageFile(null, existingUrl)) {
      setPreviewUrl(existingUrl.startsWith('http') ? existingUrl : `${process.env.NEXT_PUBLIC_API_URL}${existingUrl}`)
    } else {
      setPreviewUrl(null)
    }
  }, [file, existingUrl])

  // No file and no existing URL
  if (!file && !existingUrl) {
    return null
  }

  const fileName = file?.name || existingUrl?.split('/').pop() || 'File'
  const isImage = isImageFile(file, existingUrl)
  const isPdf = isPdfFile(file, existingUrl)

  return (
    <div className={`relative mt-2 ${className}`}>
      {label && <p className="text-xs text-slate-500 mb-1">{label}</p>}

      <div className="relative inline-flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition-colors">
        {/* Preview Thumbnail */}
        {isImage && previewUrl && (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0">
            <Image src={previewUrl} alt={fileName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
          </div>
        )}

        {isPdf && (
          <div className="w-16 h-16 rounded-md bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
        )}

        {!isImage && !isPdf && (
          <div className="w-16 h-16 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <File className="w-8 h-8 text-slate-400" />
          </div>
        )}

        {/* File Info */}
        <div className="flex flex-col min-w-0 max-w-48">
          <p className="text-sm font-medium text-slate-700 truncate">{fileName}</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
            {isImage && <ImageIcon className="w-3 h-3" />}
            {isPdf && <FileText className="w-3 h-3" />}
            {!isImage && !isPdf && <File className="w-3 h-3" />}
            <span className="uppercase">{file?.type?.split('/')[1] || existingUrl?.split('.').pop() || 'file'}</span>
            {file && <span className="ml-1">• {(file.size / 1024).toFixed(1)} KB</span>}
          </div>
        </div>

        {/* Remove Button */}
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove()
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// Compact version for forms
export const FilePreviewCompact = ({ file, existingUrl, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file && isImageFile(file, null)) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (existingUrl && isImageFile(null, existingUrl)) {
      setPreviewUrl(existingUrl.startsWith('http') ? existingUrl : `${process.env.NEXT_PUBLIC_API_URL}${existingUrl}`)
    } else {
      setPreviewUrl(null)
    }
  }, [file, existingUrl])

  if (!file && !existingUrl) return null

  const isImage = isImageFile(file, existingUrl)
  const isPdf = isPdfFile(file, existingUrl)
  const fileName = file?.name || existingUrl?.split('/').pop() || 'File'

  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
      {isImage && previewUrl && <Image src={previewUrl} alt={fileName} width={32} height={32} className="w-8 h-8 rounded object-cover" unoptimized />}
      {isPdf && <FileText className="w-5 h-5 text-red-500" />}
      {!isImage && !isPdf && <File className="w-5 h-5 text-slate-400" />}
      <span className="text-xs text-green-700 font-medium truncate max-w-32">{fileName}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
          className="ml-auto text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default FilePreview
