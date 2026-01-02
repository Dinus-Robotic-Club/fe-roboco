'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import Image from 'next/image'
import { FaCamera } from 'react-icons/fa'
import { useAttendance } from '@/hooks/useAttendance'
import Loader from '@/components/ui/loader'

// --- Configuration ---
const QR_BOX_ID = 'qr-reader'
const SCAN_DELAY_MS = 2000
const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 350, height: 350 },
  aspectRatio: 1.0,
  supportedScanTypes: [],
  rememberLastUsedCamera: true,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true,
  },
}

// --- Sub-Components for Icons (To keep main JSX clean) ---
const IconCameraOn = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconCameraOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

function CheckTicket() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const { mutate: submitAttendance, isPending } = useAttendance()

  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const isProcessingRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
        scannerRef.current = null
      }
    }
  }, [])

  // Helper: Resume scanning logic
  const handleResumeScanning = useCallback(() => {
    setTimeout(() => {
      isProcessingRef.current = false
      try {
        scannerRef.current?.resume()
      } catch (e) {
        console.error('Failed to resume scanner', e)
      }
    }, SCAN_DELAY_MS)
  }, [])

  const onScanSuccess = useCallback(
    (decodedText: string) => {
      if (isProcessingRef.current) return

      isProcessingRef.current = true

      try {
        scannerRef.current?.pause(true)
      } catch (e) {
        console.error('Failed to pause scanner', e)
      }

      submitAttendance(
        { token: decodedText },
        {
          onSuccess: handleResumeScanning,
          onError: handleResumeScanning,
        },
      )
    },
    [submitAttendance, handleResumeScanning],
  )

  const onScanFailure = () => {
    // Suppress console spam
  }

  const startScanner = () => {
    setIsCameraActive(true)
    isProcessingRef.current = false

    // Wait for DOM element to exist
    setTimeout(() => {
      const element = document.getElementById(QR_BOX_ID)
      if (!element) return

      const scanner = new Html5QrcodeScanner(QR_BOX_ID, SCANNER_CONFIG, false)
      scannerRef.current = scanner
      scanner.render(onScanSuccess, onScanFailure)
    }, 100)
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner.', error)
      })
      scannerRef.current = null
    }
    setIsCameraActive(false)
    isProcessingRef.current = false
  }

  const toggleCamera = () => {
    if (isCameraActive) {
      stopScanner()
    } else {
      startScanner()
    }
  }

  return (
    <main className="w-full min-h-screen h-auto p-14 flex flex-col justify-center items-center gap-5 bg-grid">
      {isPending && <Loader show />}

      <Image src="/logo-title.svg" alt="logo-title" width={488} height={234} className="w-full max-w-112.5 h-auto px-2" />

      <h1 className="text-xl font-plus-jakarta-sans font-semibold text-center text-gray-800">Silakan scan QR Code untuk konfirmasi kehadiran</h1>

      <div className="flex w-auto gap-4 justify-center items-center">
        <Image src="/element-left-qr.svg" alt="element-left" width={100} height={300} className="w-auto h-92.5" />

        <div className="bg-[#FBFF00] min-w-150 max-w-150 rounded-lg min-h-125 overflow-y-hidden h-auto flex justify-center p-5 shadow-md">
          {isCameraActive ? (
            <div className="bg-white w-full rounded-lg" id={QR_BOX_ID}></div>
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

        <Image src="/element-right-qr.svg" alt="element-right" width={100} height={300} className="w-auto h-92.5" />
      </div>

      <button
        onClick={toggleCamera}
        className="min-w-150 max-w-lg bg-[#FBFF00] py-4 cursor-pointer rounded-lg font-plus-jakarta-sans text-lg font-medium flex justify-center items-center transition-all hover:bg-amber-300 active:scale-105">
        {isCameraActive ? (
          <span className="flex items-center justify-center gap-2">
            <IconCameraOff />
            Matikan Kamera
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <IconCameraOn />
            Hidupkan Kamera
          </span>
        )}
      </button>
    </main>
  )
}

export default CheckTicket
