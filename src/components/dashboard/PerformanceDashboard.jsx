import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { exportTradesToCsv } from '../../lib/csv'
import { computeAssetPerformance, computeStats, filterTrades } from '../../lib/stats'
import AssetPerformance from './AssetPerformance'
import Controls from './Controls'
import StatCard from './StatCard'

export default function PerformanceDashboard({ trades, categories, onAddCategory, onDeleteCategory }) {
  const [category, setCategory] = useState('all')
  const [timeRange, setTimeRange] = useState('all')
  const [customRange, setCustomRange] = useState({ from: '', to: '' })

  const filtered = useMemo(
    () => filterTrades(trades, { category, timeRange, custom: customRange }),
    [trades, category, timeRange, customRange],
  )

  const stats = useMemo(() => computeStats(filtered), [filtered])
  const assetData = useMemo(() => computeAssetPerformance(filtered), [filtered])

  const handleExport = () => exportTradesToCsv(filtered, stats)

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_0_rgba(59,130,246,0.8)]" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-50 sm:text-xl">
            Performance
          </h2>
        </div>
        <p className="pl-4 text-sm text-slate-500">
          Signal intelligence — win rate, pips &amp; asset record.
        </p>
      </div>

      <Controls
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={Target}
          iconTone="blue"
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtext={`${stats.wins}W / ${stats.losses}L`}
        />
        <StatCard
          icon={BarChart3}
          iconTone="blue"
          label="Total Signals"
          value={stats.totalSignals}
          subtext={`${stats.decided} decided · ${stats.scratch} open/scratch`}
        />
        <StatCard
          icon={TrendingUp}
          iconTone="green"
          label="Pips Won"
          valueTone="green"
          value={`+${stats.pipsWon.toFixed(1)}`}
          subtext="From highest TP hits"
        />
        <StatCard
          icon={Zap}
          iconTone={stats.netPips >= 0 ? 'green' : 'red'}
          label="Net Pips"
          valueTone={stats.netPips >= 0 ? 'green' : 'red'}
          value={`${stats.netPips >= 0 ? '+' : ''}${stats.netPips.toFixed(1)}`}
          subtext={`SL losses -${stats.pipsLost.toFixed(1)}`}
        />
      </div>

      <AssetPerformance data={assetData} />
    </section>
  )
}
