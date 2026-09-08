export default function DayCell({ date, inMonth, isToday, pl, count, onClick }) {
  const hasEntry = count > 0
  const isProfit = pl > 0
  const isLoss = pl < 0

  const toneClasses = !hasEntry
    ? 'bg-slate-900/40 border-slate-800'
    : isProfit
      ? 'bg-emerald-400/10 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_18px_-4px_rgba(74,222,128,0.45)]'
      : isLoss
        ? 'bg-red-400/10 border-red-500/30 hover:border-red-400/60 hover:shadow-[0_0_18px_-4px_rgba(248,113,113,0.45)]'
        : 'bg-slate-800/40 border-slate-700'

  return (
    <button
      type="button"
      disabled={!inMonth}
      onClick={onClick}
      aria-label={`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}${
        hasEntry ? `, ${pl >= 0 ? 'profit' : 'loss'} of ${pl.toFixed(2)}` : ', no trades logged'
      }`}
      className={`group flex aspect-square w-full flex-col items-start justify-between rounded-xl border p-1.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 sm:p-2.5 ${
        inMonth
          ? `${toneClasses} cursor-pointer hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50`
          : 'cursor-default border-transparent bg-transparent opacity-30'
      } ${isToday && inMonth ? 'ring-1 ring-blue-500/50' : ''}`}
    >
      <span
        className={`text-[11px] font-medium sm:text-xs ${
          isToday
            ? 'flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-slate-950'
            : 'text-slate-400'
        }`}
      >
        {date.getDate()}
      </span>

      {inMonth && hasEntry && (
        <div className="flex w-full flex-col items-start gap-0.5">
          <span
            className={`text-[10px] font-bold leading-tight sm:text-sm ${
              isProfit ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-slate-300'
            }`}
          >
            {isProfit ? '+' : ''}
            {pl.toFixed(0)}
          </span>
          {count > 1 && (
            <span className="text-[8px] text-slate-500 sm:text-[10px]">{count} trades</span>
          )}
        </div>
      )}
    </button>
  )
}
