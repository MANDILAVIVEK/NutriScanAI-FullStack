import { useEffect, useState } from 'react'
import { fetchProduct, type ProductResponse } from '../api'
import ScoreRing from '../components/ScoreRing'
import NutritionChart from '../components/NutritionChart'
import TagList from '../components/TagList'

interface ResultPageProps {
  barcode: string
  onBack: () => void
}

export default function ResultPage({ barcode, onBack }: ResultPageProps) {
  const [data, setData] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchProduct(barcode)
      .then(setData)
      .catch(() => setError('Failed to fetch product. Check backend connection.'))
      .finally(() => setLoading(false))
  }, [barcode])

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Fetching product data…</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
      <span className="text-5xl">⚠️</span>
      <p className="text-red-400 text-center">{error}</p>
      <button onClick={onBack} className="text-emerald-400 text-sm font-bold hover:underline">← Try again</button>
    </div>
  )

  if (!data || data.status === 'error') return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
      <span className="text-5xl">🔍</span>
      <p className="text-slate-300 font-bold text-lg">Product Not Found</p>
      <p className="text-slate-500 text-sm text-center">Barcode <span className="font-mono text-emerald-400">{barcode}</span> isn't in the database yet.</p>
      <button onClick={onBack} className="text-emerald-400 text-sm font-bold hover:underline mt-2">← Scan another</button>
    </div>
  )

  const { product, analysis, ingredient_analysis, allergy_detection, product_category, diet_suitability, message } = data

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-lg">←</button>
        <span className="font-bold text-sm text-slate-200 truncate">{product?.name || 'Product'}</span>
        <span className="ml-auto font-mono text-xs text-slate-600">{barcode}</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Product hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700 flex gap-5 items-start">
          {product?.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-contain rounded-2xl bg-white p-1 flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-700 flex items-center justify-center text-3xl flex-shrink-0">🛒</div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white leading-tight">{product?.name || 'Unknown Product'}</h2>
            <p className="text-slate-400 text-sm mt-1">{product?.brand || 'Unknown Brand'}</p>
            <p className="font-mono text-xs text-slate-600 mt-2">{barcode}</p>
          </div>
        </div>

        {/* Partial data warning */}
        {message && (
          <div className="bg-amber-950 border border-amber-700 rounded-2xl px-4 py-3 text-amber-400 text-sm font-medium">
            ℹ️ {message}
          </div>
        )}

        {/* Score */}
        {analysis && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-5">Nutrition Score</h3>
            <div className="flex flex-col items-center gap-5">
              <ScoreRing score={analysis.score} status={analysis.status} color={analysis.color} />
              <div className="w-full space-y-2">
                {analysis.advice.map((tip, i) => (
                  <div key={i} className="text-sm text-slate-300 bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-700">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nutrition chart */}
        {product?.nutriments && Object.keys(product.nutriments).length > 0 && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-5">Nutrient Breakdown <span className="normal-case text-slate-600 font-normal">per 100g</span></h3>
            <NutritionChart nutriments={product.nutriments} />
          </div>
        )}

        {/* Tag lists */}
        {allergy_detection && allergy_detection.length > 0 && (
          <TagList title="Allergen Detection" icon="🚨" items={allergy_detection} />
        )}
        {ingredient_analysis && ingredient_analysis.length > 0 && (
          <TagList title="Ingredient Analysis" icon="🔬" items={ingredient_analysis} />
        )}
        {product_category && product_category.length > 0 && (
          <TagList title="Product Category" icon="📦" items={product_category} />
        )}
        {diet_suitability && diet_suitability.length > 0 && (
          <TagList title="Diet Suitability" icon="🥗" items={diet_suitability} />
        )}

        {/* Ingredients */}
        {product?.ingredients && product.ingredients !== 'Ingredients not available' && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Ingredients</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{product.ingredients}</p>
          </div>
        )}

        <button onClick={onBack}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-colors text-sm tracking-wide">
          ← Scan Another Product
        </button>
      </div>
    </div>
  )
}
