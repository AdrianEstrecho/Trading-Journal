import { Check, Pencil, TrendingDown, TrendingUp, Wallet, X } from 'lucide-react'
import { useState } from 'react'

function formatCurrency(value) {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function AccountBalance({ trades, startingBalance, onSetStartingBalance }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(startingBalance))

  const netPL = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
  const balance = startingBalance + netPL
  const changePct = startingBalance ? (netPL / startingBalance) * 100 : 0
  const isUp = netPL >= 0
  const TrendIcon = isUp ? TrendingUp : TrendingDown

  const startEditing = () => {
    setDraft(String(startingBalance))
    setEditing(true)
  }

  const submit = (e) => {
    e.preventDefault()
    const amount = parseFloat(draft)
    if (!Number.isNaN(amount)) onSetStartingBalance(amount)
    setEditing(false)
  }

  return (
    <div className="glow-card glow-blue flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-slate-950">
          <Wallet size={22} strokeWidth={2.25} />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account Balance
          </span>
          <div className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {formatCurrency(balance)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm">
            <TrendIcon size={14} className={isUp ? 'text-emerald-400' : 'text-red-400'} />
            <span className={`font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUp ? '+' : ''}
              {formatCurrency(netPL)} ({isUp ? '+' : ''}
              {changePct.toFixed(1)}%)
            </span>
            <span className="text-slate-500">since start</span>
          </div>
        </div>
      </div>

      {editing ? (
        <form onSubmit={submit} className="flex items-center gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Starting balance</span>
            <input
              type="number"
              step="0.01"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-32 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:border-slate-700 focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            />
          </label>
          <button
            type="submit"
            aria-label="Save starting balance"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400 transition-colors hover:bg-emerald-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="Cancel"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <X size={16} />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-blue-500/40 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <Pencil size={13} />
          Edit starting balance
        </button>
      )}
    </div>
  )
}
