import { useEffect, useState } from 'react'
import { ocrNutrition, analyzeCorrected, type NutritionAnalysis, type OcrNutrition } from '../api'
import ScoreRing from '../components/ScoreRing'

interface OcrPageProps {
  file: File
  onBack: () => void
}

export default function OcrPage({ file, onBack }: OcrPageProps) {
  const [nutrition, setNutrition] = useState<OcrNutrition | null>(null)
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ocrNutrition(file)
      .then(async res => {
        setNutrition(res.nutrition)
        const n = res.nutrition
        const toNum = (v: string) => parseFloat(v) || 0
        const result = await analyzeCorrected({
          sugar: toNum(n.sugar),
          protein: toNum(n.protein),
          carbs: toNum(n.carbs),
          salt: toNum(n.sodium) / 1000,
          fat: toNum(n.fat),
        })
        setAnalysis(result.analysis)
      })
      .catch(() => setError('OCR failed. Check backend connection.'))
      .finally(() => setLoading(false))
  }, [file])

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Running OCR on label…</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-red-400 text-center">{error}</p>
      <button onClick={onBack} className="text-emerald-400 text-sm font-bold hover:underline">← Back</button>
    </div>
  )

  const rows = [
    { label: 'Protein', value: nutrition?.protein, unit: 'g' },
    { label: 'Carbohydrates', value: nutrition?.carbs, unit: 'g' },
    { label: 'Sugar', value: nutrition?.sugar, unit: 'g' },
    { label: 'Total Fat', value: nutrition?.fat, unit: 'g' },
    { label: 'Saturated Fat', value: nutrition?.saturated_fat, unit: 'g' },
    { label: 'Sodium', value: nutrition?.sodium, unit: 'mg' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-lg">←</button>
        <span className="font-bold text-sm text-slate-200">OCR Label Analysis</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Score */}
        {analysis && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col items-center gap-5">
            <ScoreRing score={analysis.score} status={analysis.status} color={analysis.color} />
            <div className="w-full space-y-2">
              {analysis.advice.map((tip, i) => (
                <div key={i} className="text-sm text-slate-300 bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-700">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted values */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Extracted Nutrition Values</h3>
          <div className="divide-y divide-slate-800">
            {rows.map(r => (
              <div key={r.label} className="flex justify-between items-center py-3">
                <span className="text-slate-400 text-sm">{r.label}</span>
                <span className={`font-mono font-bold text-sm ${r.value === 'Not Found' ? 'text-slate-600' : 'text-emerald-400'}`}>
                  {r.value === 'Not Found' ? '—' : `${r.value} ${r.unit}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onBack}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-colors text-sm">
          ← Scan Another
        </button>
      </div>
    </div>
  )
}
