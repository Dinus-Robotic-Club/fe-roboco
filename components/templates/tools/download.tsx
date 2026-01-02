import { Button } from '@/components/ui/button'
import { exportToExcel } from '@/lib/download'
import { IDownloadButtonProps } from '@/lib/types'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function DownloadButton<T>({ data, fileName = 'Export_Data', sheetName, label = 'Download Data', mapper, className }: IDownloadButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)

    setTimeout(() => {
      try {
        exportToExcel({
          data,
          fileName,
          sheetName,
          mapper,
        })
      } catch (error) {
        console.error('Gagal download:', error)
        toast.error('Failed to download data. Please try again.')
      } finally {
        setIsExporting(false)
      }
    }, 100)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isExporting || data.length === 0}
      className={`
        bg-[#FBFF00] hover:bg-[#eef300] text-black font-semibold 
        shadow-sm hover:shadow active:scale-95 transition-all 
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}>
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span className="hidden sm:inline">{isExporting ? 'Exporting...' : label}</span>
    </Button>
  )
}
