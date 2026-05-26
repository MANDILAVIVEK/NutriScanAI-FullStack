interface ScoreRingProps {
  score: number
  status: string
  color: 'green' | 'orange' | 'red'
}

const colorMap = {
  green: { stroke: '#22c55e', glow: '#22c55e40', text: '#16a34a' },
  orange: { stroke: '#f97316', glow: '#f9731640', text: '#ea580c' },
  red: { stroke: '#ef4444', glow: '#ef444440', text: '#dc2626' },
}

export default function ScoreRing({ score, status, color }: ScoreRingProps) {
  const c = colorMap[color]
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36" style={{ filter: `drop-shadow(0 0 12px ${c.glow})` }}>
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums" style={{ color: c.stroke }}>{score}</span>
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">score</span>
        </div>
      </div>
      <span className="text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full"
        style={{ color: c.text, background: `${c.glow}` }}>
        {status}
      </span>
    </div>
  )
}
