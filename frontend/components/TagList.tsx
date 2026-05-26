interface TagListProps {
  title: string
  icon: string
  items: string[]
}

export default function TagList({ title, icon, items }: TagListProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 flex items-center gap-2">
        <span>{icon}</span>{title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => {
          const isWarn = item.startsWith('⚠') || item.startsWith('🍬') || item.startsWith('🍭')
          const isOk = item.startsWith('✅') || item.startsWith('💪')
          return (
            <span key={i} className={`text-xs px-3 py-1.5 rounded-full font-medium border
              ${isOk ? 'bg-green-950 border-green-800 text-green-400' :
                isWarn ? 'bg-red-950 border-red-800 text-red-400' :
                'bg-slate-800 border-slate-700 text-slate-300'}`}>
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}
