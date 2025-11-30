'use client'
import React, { useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import Image from 'next/image'
import { toast } from 'sonner'
import { FaCamera } from 'react-icons/fa'

function CheckTicket() {
    const [isCameraActive, setIsCameraActive] = useState(false)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)
    const qrBoxId = 'qr-reader'
    const onScanSuccess = (decodedText: string) => {
        toast.success(`QR Code detected: ${decodedText}`, {
            duration: 2000,
        })
    }

    const onScanFailure = (error: string) => {
        console.warn(`QR Code scan error: ${error}`)
    }
    const toggleCamera = () => {
        if (isCameraActive && scannerRef.current) {
            scannerRef.current.clear().catch((error) => {
                console.error('Failed to clear html5QrcodeScanner. ', error)
            })
            scannerRef.current = null
            setIsCameraActive(false)
        } else if (!isCameraActive) {
            setIsCameraActive(true)

            setTimeout(() => {
                const element = document.getElementById(qrBoxId)
                if (!element) {
                    console.error('qr-reader element not found!')
                    return
                }

                scannerRef.current = new Html5QrcodeScanner(
                    qrBoxId,
                    {
                        fps: 60,
                        qrbox: { width: 350, height: 350 },
                        supportedScanTypes: [],
                        rememberLastUsedCamera: true,
                    },
                    false,
                )

                scannerRef.current.render(onScanSuccess, onScanFailure)
            }, 100)
        }
    }
    return (
        <main className="w-full min-h-screen h-auto  p-14 flex flex-col justify-center items-center gap-5 bg-grid">
            <Image src="/logo-title.svg" alt="logo-title" width={488} height={234} className="w-full max-w-[450px] h-auto px-2" />
            <h1 className="text-xl font-plus-jakarta-sans font-semibold text-center text-gray-800">Silakan scan QR Code untuk konfirmasi kehadiran</h1>

            <div className="flex w-auto gap-4 justify-center items-center">
                <Image src="/element-left-qr.svg" alt="element-left" width={100} height={300} className="w-auto h-[370px]" />
                <div className="bg-[#FBFF00] min-w-[600px] max-w-[600px] rounded-lg min-h-[500px] overflow-y-hidden h-auto flex justify-center p-5 shadow-md">
                    {isCameraActive ? (
                        <div className="bg-white w-full rounded-lg" id={qrBoxId}></div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full min-h-full bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all">
                            <div className="p-6 rounded-full bg-gray-100 shadow-sm animate-pulse">
                                <FaCamera className="w-20 h-20 text-gray-400" />
                            </div>

                            <h2 className="mt-4 text-lg font-medium text-gray-700">Kamera Tidak Aktif</h2>
                            <p className="text-sm text-gray-500">Hidupkan kamera untuk mulai scan QR Code.</p>
                        </div>
                    )}
                </div>
                <Image src="/element-right-qr.svg" alt="element-right" width={100} height={300} className="w-auto h-[370px]" />
            </div>

            <button
                onClick={toggleCamera}
                className="min-w-[600px] max-w-lg bg-[#FBFF00] py-4 cursor-pointer rounded-lg font-plus-jakarta-sans text-lg font-medium flex justify-center items-center transition-all hover:bg-amber-300 active:scale-105"
            >
                {isCameraActive ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Matikan Kamera
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Hidupkan Kamera
                    </span>
                )}
            </button>
        </main>
    )
}

export default CheckTicket
