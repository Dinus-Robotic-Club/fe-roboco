'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, FileImage, Image as Image_Preview, X } from 'lucide-react'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import { IParticipantsBody } from '@/lib/types/team'

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
    // STATE LOKAL
    const [preview, setPreview] = useState<string | null>(null) // Kiri: Preview Gambar Asli
    const [twibbonResult, setTwibbonResult] = useState<string | null>(null) // Kanan: Preview Twibbon (Download Only)

    const [loadingTwibbon, setLoadingTwibbon] = useState(false) // Loading untuk generate Twibbon
    const [loadingProcess, setLoadingProcess] = useState(false) // Loading untuk Remove BG (Confirm)

    const [tempFile, setTempFile] = useState<File | null>(null) // File mentah dari user

    const fileInputRef = useRef<HTMLInputElement>(null)

    console.log(tempFile, twibbonResult)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    // 1. AUTO GENERATE TWIBBON (SIDE EFFECT KETIKA FILE DIPILIH)
    useEffect(() => {
        const generateTwibbon = async () => {
            if (!tempFile) return

            const formData = new FormData()
            formData.append('image', tempFile) // Sesuaikan key dengan API Twibbon kamu

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
                toast.error('Gagal membuat preview Twibbon.')
            } finally {
                setLoadingTwibbon(false)
            }
        }

        generateTwibbon()
    }, [tempFile])

    // Handler saat user memilih file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const imgUrl = URL.createObjectURL(file)
        setPreview(imgUrl)
        setTempFile(file) // Ini akan memicu useEffect di atas
        setTwibbonResult(null) // Reset hasil lama
    }

    // 2. HANDLER CONFIRM: REMOVE BG & SAVE TO STATE
    const handleConfirmAndSave = async () => {
        if (!tempFile) {
            toast.error('Pilih gambar terlebih dahulu')
            return
        }

        const formData = new FormData()
        formData.append('file', tempFile) // Kirim file ASLI (bukan twibbon)

        try {
            setLoadingProcess(true)

            console.log(formData)

            // Hit API Remove BG (Khusus untuk Data Peserta)
            const res = await fetch('https://api-bg-ok.dinusrobotic.org/remove-bg', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Failed to remove background')

            const blob = await res.blob()

            // Convert hasil Remove BG jadi File
            const processedFile = new File([blob], `removed_bg_${tempFile.name}`, { type: 'image/png' })

            // Simpan ke State Form Utama
            setData(index, { ...data, participantsImage: processedFile })

            toast.success('Foto berhasil diproses & disimpan!')
            onClose() // Tutup modal karena flow selesai
        } catch (err) {
            console.error(err)
            toast.error('Gagal memproses background removal.')
        } finally {
            setLoadingProcess(false)
        }
    }

    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    const handleDownloadTwibbon = () => {
        if (!twibbonResult) return
        const link = document.createElement('a')
        link.href = twibbonResult
        link.download = `twibbon_result_${index + 1}.png`
        link.click()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-plus-jakarta-sans" onClick={onClose}>
            <div
                className="bg-white w-full max-w-4xl 2xl:max-w-5xl rounded-xl shadow-xl p-6 relative max-h-[95vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X />
                </button>

                <h2 className="text-2xl font-bold mb-6">Upload & Preview Twibbon</h2>

                <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-wrap justify-between items-center gap-3 w-full">
                        {/* KIRI: Upload & Preview Gambar Asli */}
                        <label
                            onClick={triggerUpload}
                            className="cursor-pointer flex flex-col items-center justify-center aspect-square w-full max-w-[330px] md:max-w-[350px] 2xl:max-w-[400px] border-2 border-dashed border-gray-400 rounded-lg mx-auto hover:bg-gray-50 transition-colors"
                        >
                            {preview ? (
                                <Image src={preview} width={400} height={400} alt="Original Preview" className="object-contain w-full h-full rounded-lg" />
                            ) : (
                                <>
                                    <Image_Preview color="#dedede" className="w-20 h-20" />
                                    <span className="text-sm text-gray-600 mt-2">Click to select image</span>
                                </>
                            )}
                        </label>

                        <ArrowRight color="gray" className="hidden lg:block w-8 h-8" />

                        {/* KANAN: Preview Twibbon (Auto Generated) */}
                        <div className="flex flex-col items-center justify-center aspect-square w-full max-w-[330px] md:max-w-[350px] 2xl:max-w-[400px] border-2 border-dashed border-gray-400 rounded-lg mx-auto relative bg-gray-50">
                            {loadingTwibbon && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <span className="text-gray-700 font-semibold">Generating Twibbon...</span>
                                    </div>
                                </div>
                            )}

                            {twibbonResult ? (
                                <Image src={twibbonResult} width={400} height={400} alt="Twibbon Result" className="object-contain w-full h-full rounded-lg" />
                            ) : (
                                <div className="text-center p-4">
                                    <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                                    <span className="text-sm text-gray-400">Twibbon preview will appear here</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full flex-wrap justify-between items-center gap-3 mt-6 border-t pt-4">
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                        {/* Tombol Confirm: Trigger Remove BG & Save */}
                        <button
                            onClick={handleConfirmAndSave}
                            disabled={loadingProcess || !tempFile}
                            className="py-3 px-7 text-xs sm:text-sm bg-yellow-300 font-semibold rounded flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-300 transition-colors w-full sm:w-fit disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loadingProcess ? 'Processing Remove BG...' : 'Confirm Upload Picture'}
                            <FileImage className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Tombol Download: Hanya Download Twibbon */}
                        <button
                            disabled={!twibbonResult || loadingTwibbon}
                            onClick={handleDownloadTwibbon}
                            className="py-3 px-7 text-xs sm:text-sm bg-white border border-yellow-300 text-yellow-600 font-semibold rounded flex items-center justify-center gap-2 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-yellow-50 transition-colors w-full sm:w-fit shadow-sm"
                        >
                            Download Twibbon <FaCloudDownloadAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
