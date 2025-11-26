'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, FileImage, Image as Image_Preview, X } from 'lucide-react'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import { toast } from 'sonner'

export default function ImageUploadModal({ onClose }: { onClose: () => void }) {
    const [preview, setPreview] = useState<string | null>(null)
    const [twibbonResult, setTwibbonResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const imgUrl = URL.createObjectURL(file)
        setPreview(imgUrl)

        setTwibbonResult(null)

        const formData = new FormData()
        formData.append('image', file)

        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/remove`, {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Failed to generate twibbon')

            const blob = await res.blob()
            const twibbonUrl = URL.createObjectURL(blob)
            setTwibbonResult(twibbonUrl)
        } catch (err) {
            const errMessage = (err as Error).message
            toast.error(errMessage)
        } finally {
            setLoading(false)
        }
    }

    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    const handleDownload = () => {
        if (!twibbonResult) return
        const link = document.createElement('a')
        link.href = twibbonResult
        link.download = 'twibbon.png'
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
                        <label
                            onClick={triggerUpload}
                            className="cursor-pointer flex flex-col items-center justify-center aspect-square w-full max-w-[330px] md:max-w-[350px] 2xl:max-w-[400px] border-2 border-dashed border-gray-400 rounded-lg mx-auto"
                        >
                            {preview ? (
                                <Image src={preview} width={400} height={400} alt="Preview" className="object-contain w-full h-full rounded-lg" />
                            ) : (
                                <>
                                    <Image_Preview color="#dedede" className="w-20 h-20" />
                                    <span className="text-sm text-gray-600">Upload your image</span>
                                </>
                            )}
                        </label>

                        <ArrowRight color="gray" className="hidden lg:block" />

                        <div className="flex flex-col items-center justify-center aspect-square w-full max-w-[330px] md:max-w-[350px] 2xl:max-w-[400px] border-2 border-dashed border-gray-400 rounded-lg mx-auto relative">
                            {loading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                    <span className="text-gray-700 animate-pulse">Processing...</span>
                                </div>
                            )}
                            {twibbonResult ? (
                                <Image src={twibbonResult} width={400} height={400} alt="Twibbon Preview" className="object-contain w-full h-full rounded-lg" />
                            ) : (
                                <>
                                    <Image_Preview color="#dedede" className="w-20 h-20" />
                                    <span className="text-sm text-gray-600">Preview Your Twibbon</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full flex-wrap justify-between items-center gap-3 mt-4">
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                        <button
                            onClick={triggerUpload}
                            className="py-3 px-7 text-xs sm:text-sm bg-yellow-300 font-semibold rounded flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-300/80 w-full sm:w-fit"
                        >
                            Upload Image <FileImage className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <button
                            disabled={!twibbonResult || loading}
                            onClick={handleDownload}
                            className="py-3 px-7 text-xs sm:text-sm bg-yellow-300 font-semibold rounded flex items-center justify-center gap-2 disabled:bg-yellow-300/50 disabled:cursor-not-allowed disabled:text-gray-500 hover:bg-amber-300/80 w-full sm:w-fit"
                        >
                            Download Twibbon <FaCloudDownloadAlt className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
