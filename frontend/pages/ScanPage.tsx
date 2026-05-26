import { useState, useRef } from 'react'
import { scanBarcodeImage } from '../api'

interface ScanPageProps {
  onBarcode: (barcode: string) => void
  onOcrFile: (file: File) => void
}

export default function ScanPage({ onBarcode, onOcrFile }: ScanPageProps) {
  const [manual, setManual] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const ocrRef = useRef<HTMLInputElement>(null)

  async function handleImageScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScanning(true)
    setError('')
    try {
      const res = await scanBarcodeImage(file)
      if (res.status === 'success' && res.barcode) {
        onBarcode(res.barcode)
      } else {
        setError('Barcode not detected in image. Try a clearer photo.')
      }
    } catch {
      setError('Failed to connect to backend.')
    } finally {
      setScanning(false)
    }
  }

  function handleOcrUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onOcrFile(file)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-2xl shadow-emerald-900">
          <span className="text-4xl">🥗</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight leading-none">
          Nutri<span className="text-emerald-400">Scan</span>
          <span className="text-slate-500">AI</span>
        </h1>
        <p className="text-slate-400 mt-3 text-base font-medium">
          Scan any product. Know exactly what you're eating.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Manual barcode */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
          <label className="text-xs font-bold tracking-widest uppercase text-slate-500 block mb-3">
            🔢 Enter Barcode
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={manual}
              onChange={e => setManual(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && manual.trim() && onBarcode(manual.trim())}
              placeholder="e.g. 8901030865213"
              className="flex-1 bg-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm font-mono outline-none border border-slate-700 focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={() => manual.trim() && onBarcode(manual.trim())}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 rounded-xl transition-colors text-sm"
            >
              Go
            </button>
          </div>
        </div>

        {/* Upload barcode image */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-600 rounded-3xl p-6 text-left transition-all group disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 group-hover:bg-emerald-950 rounded-2xl flex items-center justify-center text-2xl transition-colors">
              {scanning ? '⏳' : '📷'}
            </div>
            <div>
              <div className="text-white font-bold text-sm">Upload Barcode Image</div>
              <div className="text-slate-500 text-xs mt-0.5">
                {scanning ? 'Scanning…' : 'JPG, PNG — we'll detect the barcode'}
              </div>
            </div>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageScan} />

        {/* OCR nutrition label */}
        <button
          onClick={() => ocrRef.current?.click()}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600 rounded-3xl p-6 text-left transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 group-hover:bg-blue-950 rounded-2xl flex items-center justify-center text-2xl transition-colors">
              🔬
            </div>
            <div>
              <div className="text-white font-bold text-sm">Scan Nutrition Label</div>
              <div className="text-slate-500 text-xs mt-0.5">Upload label image — OCR extracts values</div>
            </div>
          </div>
        </button>
        <input ref={ocrRef} type="file" accept="image/*" className="hidden" onChange={handleOcrUpload} />

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-950 border border-red-800 rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
