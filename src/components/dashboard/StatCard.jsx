const ICON_TONE_CLASSES = {
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-emerald-400/10 text-emerald-400',
  red: 'bg-red-400/10 text-red-400',
}

const VALUE_TONE_CLASSES = {
  default: 'text-slate-50',
  green: 'text-emerald-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
}

const HOVER_GLOW_CLASSES = {
  blue: 'hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.55)]',
  green: 'hover:shadow-[0_0_24px_-8px_rgba(74,222,128,0.55)]',
  red: 'hover:shadow-[0_0_24px_-8px_rgba(248,113,113,0.55)]',
}

export default function StatCard({ icon: Icon, iconTone = 'blue', label, value, valueTone, subtext }) {
  return (
    <div
      className={`glow-card relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-slate-700 ${HOVER_GLOW_CLASSES[iconTone]}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${ICON_TONE_CLASSES[iconTone]}`}
          >
            <Icon size={16} strokeWidth={2.25} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${VALUE_TONE_CLASSES[valueTone || 'default']}`}
        >
          {value}
        </div>
        {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
      </div>
    </div>
  )
}
