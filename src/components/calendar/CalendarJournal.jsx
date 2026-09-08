import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MONTH_NAMES } from '../../lib/date'
import { computeMonthSummary } from '../../lib/stats'
import CalendarGrid from './CalendarGrid'
import DayModal from './DayModal'
import SummaryPanel from './SummaryPanel'

export default function CalendarJournal({ trades, categories, onSaveTrade, onDeleteTrade }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const dailyTotals = useMemo(() => {
    const map = new Map()
    for (const t of trades) {
      const entry = map.get(t.date) || { pl: 0, count: 0 }
      entry.pl += t.profitLoss || 0
      entry.count += 1
      map.set(t.date, entry)
    }
    return map
  }, [trades])

  const summary = useMemo(() => computeMonthSummary(trades, year, month), [trades, year, month])

  const goToMonth = (delta) => {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    } else if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    }
    setMonth(newMonth)
    setYear(newYear)
  }

  const tradesForSelectedDate = selectedDate
    ? trades
        .filter((t) => t.date === selectedDate)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    : []

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_0_rgba(74,222,128,0.8)]" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-50 sm:text-xl">
            Monthly Journal
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="w-36 text-center text-sm font-semibold text-slate-200 sm:w-40">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CalendarGrid
          year={year}
          month={month}
          dailyTotals={dailyTotals}
          onSelectDate={setSelectedDate}
        />
        <SummaryPanel summary={summary} />
      </div>

      {selectedDate && (
        <DayModal
          dateKey={selectedDate}
          trades={tradesForSelectedDate}
          categories={categories}
          onSave={onSaveTrade}
          onDelete={onDeleteTrade}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </section>
  )
}
