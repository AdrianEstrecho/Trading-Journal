import { Flame } from 'lucide-react'
import { formatShortDate } from '../../lib/date'
import Sparkline from './Sparkline'

function StatRow({ label, value, valueClass = 'text-slate-200' }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/60 py-2.5 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}

export default function SummaryPanel({ summary }) {
  const { totalPL, greenDays, redDays, best, worst, avgDaily, dayEntries, streak } = summary
  const plTone = totalPL > 0 ? 'text-emerald-400' : totalPL < 0 ? 'text-red-400' : 'text-slate-200'

  return (
    <div className="glow-card flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Total P/L this month
        </span>
        <div className={`mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${plTone}`}>
          {totalPL > 0 ? '+' : ''}
          {totalPL.toFixed(2)}
        </div>
      </div>

      {streak >= 2 && (
        <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300">
          <Flame size={14} />
          {streak}-day green streak
        </div>
      )}

      <div className="flex flex-col">
        <StatRow
          label="Win / loss days"
          value={
            <>
              <span className="text-emerald-400">{greenDays} green</span>
              <span className="text-slate-600"> / </span>
              <span className="text-red-400">{redDays} red</span>
            </>
          }
        />
        <StatRow
          label="Best day"
          value={best ? `+${best.pl.toFixed(2)} · ${formatShortDate(best.date)}` : '—'}
          valueClass="text-emerald-400"
        />
        <StatRow
          label="Worst day"
          value={worst ? `${worst.pl.toFixed(2)} · ${formatShortDate(worst.date)}` : '—'}
          valueClass="text-red-400"
        />
        <StatRow label="Average daily P/L" value={avgDaily.toFixed(2)} />
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Daily trend
        </span>
        <Sparkline dayEntries={dayEntries} />
      </div>
    </div>
  )
}
