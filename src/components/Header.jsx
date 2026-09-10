import { LineChart, RefreshCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import SyncModal from './SyncModal'

export default function Header({
  onClearAll,
  syncCode,
  syncStatus,
  syncError,
  onStartSync,
  onLinkSync,
  onStopSync,
}) {
  const [syncOpen, setSyncOpen] = useState(false)

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

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => setSyncOpen(true)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 ${
            syncCode
              ? 'border-blue-500/40 bg-blue-500/10 text-blue-300 hover:border-blue-400/60'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <RefreshCcw size={14} />
          {syncCode ? 'Synced' : 'Sync devices'}
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
        >
          <Trash2 size={14} />
          Clear data
        </button>
      </div>

      {syncOpen && (
        <SyncModal
          syncCode={syncCode}
          syncStatus={syncStatus}
          syncError={syncError}
          onStartSync={onStartSync}
          onLinkSync={onLinkSync}
          onStopSync={onStopSync}
          onClose={() => setSyncOpen(false)}
        />
      )}
    </header>
  )
}
