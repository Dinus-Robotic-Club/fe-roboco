'use client'

import { useState } from 'react'
import { X, Upload, User, Phone, Award, Building2, Users } from 'lucide-react'
import Image from 'next/image'

interface IParticipantDetail {
  uid: string
  name: string
  phone: string
  roleInTeam: string
  image?: string | null
  twibbon?: string
  certificate?: string | null
  team: {
    name: string
    category: string
    logo?: string | null
    community?: { name: string } | null
  }
}

interface ParticipantDetailModalProps {
  participant: IParticipantDetail | null
  isOpen: boolean
  onClose: () => void
  onUploadCertificate?: (participantId: string, file: File) => Promise<void>
  isUploading?: boolean
}

export function ParticipantDetailModal({ participant, isOpen, onClose, onUploadCertificate, isUploading = false }: ParticipantDetailModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  if (!isOpen || !participant) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (selectedFile && onUploadCertificate) {
      await onUploadCertificate(participant.uid, selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'LEADER':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'MEMBER':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Detail Peserta</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
              {participant.image ? (
                <Image src={participant.image.startsWith('http') ? participant.image : `${process.env.NEXT_PUBLIC_API_URL}${participant.image}`} alt={participant.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-900 truncate">{participant.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getRoleBadgeColor(participant.roleInTeam)}`}>{participant.roleInTeam}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Phone className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Telepon</p>
                <p className="text-sm font-medium text-slate-900">{participant.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Users className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Tim</p>
                <p className="text-sm font-medium text-slate-900 truncate">{participant.team.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Award className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Kategori</p>
                <p className="text-sm font-medium text-slate-900">{participant.team.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Building2 className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Komunitas</p>
                <p className="text-sm font-medium text-slate-900 truncate">{participant.team.community?.name || '-'}</p>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Sertifikat</h4>

            {participant.certificate ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={participant.certificate.startsWith('http') ? participant.certificate : `${process.env.NEXT_PUBLIC_API_URL}${participant.certificate}`}
                  alt="Certificate"
                  width={400}
                  height={280}
                  className="w-full h-auto object-contain"
                />
                <a
                  href={participant.certificate.startsWith('http') ? participant.certificate : `${process.env.NEXT_PUBLIC_API_URL}${participant.certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors shadow-sm">
                  Lihat Full
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {previewUrl ? (
                  <div className="relative h-[280px] rounded-xl overflow-hidden border border-slate-200">
                    <Image src={previewUrl} alt="Preview" width={400} height={280} className="w-full h-auto object-contain" />
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Upload Sertifikat</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, PDF (Max 5MB)</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                )}

                {selectedFile && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full py-2.5 bg-[#FBFF00] text-slate-900 font-semibold rounded-xl hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isUploading ? 'Mengupload...' : 'Simpan Sertifikat'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
