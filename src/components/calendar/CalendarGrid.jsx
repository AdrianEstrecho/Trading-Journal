import { getMonthGrid, toDateKey, todayKey, WEEKDAY_NAMES } from '../../lib/date'
import DayCell from './DayCell'

export default function CalendarGrid({ year, month, dailyTotals, onSelectDate }) {
  const cells = getMonthGrid(year, month)
  const today = todayKey()

  return (
    <div className="glow-card rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-5">
      <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell) => {
          const totals = dailyTotals.get(cell.key)
          return (
            <DayCell
              key={cell.key}
              date={cell.date}
              inMonth={cell.inMonth}
              isToday={cell.key === today}
              pl={totals?.pl || 0}
              count={totals?.count || 0}
              onClick={() => onSelectDate(toDateKey(cell.date))}
            />
          )
        })}
      </div>
    </div>
  )
}
