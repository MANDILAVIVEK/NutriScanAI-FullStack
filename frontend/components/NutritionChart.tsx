import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

interface NutritionChartProps {
  nutriments: Record<string, number>
}

export default function NutritionChart({ nutriments }: NutritionChartProps) {
  const data = [
    { nutrient: 'Protein', value: Math.min((nutriments.proteins_100g ?? 0), 30), max: 30 },
    { nutrient: 'Carbs', value: Math.min((nutriments.carbohydrates_100g ?? 0), 100), max: 100 },
    { nutrient: 'Fat', value: Math.min((nutriments.fat_100g ?? 0), 40), max: 40 },
    { nutrient: 'Sugar', value: Math.min((nutriments.sugars_100g ?? 0), 30), max: 30 },
    { nutrient: 'Salt', value: Math.min((nutriments.salt_100g ?? 0) * 10, 20), max: 20 },
    { nutrient: 'Fiber', value: Math.min((nutriments.fiber_100g ?? 0), 10), max: 10 },
  ].map(d => ({ ...d, pct: Math.round((d.value / d.max) * 100) }))

  const macros = [
    { label: 'Protein', val: nutriments.proteins_100g ?? 0, unit: 'g', color: '#22c55e' },
    { label: 'Carbs', val: nutriments.carbohydrates_100g ?? 0, unit: 'g', color: '#3b82f6' },
    { label: 'Fat', val: nutriments.fat_100g ?? 0, unit: 'g', color: '#f97316' },
    { label: 'Sugar', val: nutriments.sugars_100g ?? 0, unit: 'g', color: '#ec4899' },
    { label: 'Salt', val: nutriments.salt_100g ?? 0, unit: 'g', color: '#a855f7' },
    { label: 'Energy', val: nutriments['energy-kcal_100g'] ?? 0, unit: 'kcal', color: '#eab308' },
  ]

  return (
    <div className="space-y-6">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
            <Radar name="Nutrition" dataKey="pct" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(v: number) => [`${v}%`, 'Level']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {macros.map(m => (
          <div key={m.label} className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800">
            <div className="text-lg font-black tabular-nums" style={{ color: m.color }}>
              {m.val.toFixed(1)}<span className="text-xs font-medium text-slate-500 ml-0.5">{m.unit}</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold tracking-wide uppercase mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
