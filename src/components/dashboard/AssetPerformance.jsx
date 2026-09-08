import { Bitcoin, Coins, LineChart, Wallet } from 'lucide-react'

const CATEGORY_META = {
  Gold: { icon: Coins, symbol: 'Au', tone: 'text-amber-400 bg-amber-400/10' },
  Forex: { icon: Wallet, symbol: 'Fx', tone: 'text-blue-400 bg-blue-400/10' },
  Indices: { icon: LineChart, symbol: 'Ix', tone: 'text-violet-400 bg-violet-400/10' },
  Crypto: { icon: Bitcoin, symbol: '₿', tone: 'text-orange-400 bg-orange-400/10' },
}

function metaFor(category) {
  return (
    CATEGORY_META[category] || {
      icon: LineChart,
      symbol: category.slice(0, 2).toUpperCase(),
      tone: 'text-emerald-400 bg-emerald-400/10',
    }
  )
}

export default function AssetPerformance({ data }) {
  return (
    <div className="glow-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_0_rgba(59,130,246,0.8)]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
          Asset performance
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          No decided trades yet for this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((row) => {
            const meta = metaFor(row.category)
            const Icon = meta.icon
            return (
              <div key={row.category} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${meta.tone}`}
                >
                  <Icon size={16} />
                </div>
                <div className="w-24 shrink-0 truncate">
                  <div className="text-sm font-medium text-slate-200">
                    {meta.symbol} {row.category.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {row.wins}W / {row.losses}L
                  </div>
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 shadow-[0_0_10px_-2px_rgba(74,222,128,0.7)] transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, row.winRate))}%` }}
                  />
                </div>
                <div className="w-12 shrink-0 text-right text-sm font-semibold text-slate-100">
                  {row.winRate.toFixed(0)}%
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
