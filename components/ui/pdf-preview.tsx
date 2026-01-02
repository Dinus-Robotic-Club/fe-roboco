import { FileText } from 'lucide-react'
import Loader from './loader'
import { useState } from 'react'

const PDFPreview = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative w-full bg-slate-200/50 rounded-xl border border-slate-200 p-4 lg:p-8 flex justify-center overflow-hidden">
      {/* A4 Aspect Ratio Container */}
      <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden ring-1 ring-slate-900/5 aspect-[1.414/1] md:aspect-[1.414/1] transition-transform duration-500 ease-out hover:scale-[1.01]">
        {loading && <Loader show />}

        <iframe src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title="Certificate Preview" className="w-full h-full" onLoad={() => setLoading(false)} />

        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 text-center bg-white">
          <FileText className="w-16 h-16 text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">Preview PDF</p>
        </div>
      </div>
    </div>
  )
}

export { PDFPreview }
