import { LineChart, Trash2 } from 'lucide-react'

export default function Header({ onClearAll }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800/80 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-slate-950 glow-blue">
          <LineChart size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide text-slate-50 sm:text-xl">
            TRADING JOURNAL
          </h1>
          <p className="text-xs text-slate-400 sm:text-sm">
            Track your edge — win rate, pips &amp; P/L record.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 sm:self-auto"
      >
        <Trash2 size={14} />
        Clear data
      </button>
    </header>
  )
}
