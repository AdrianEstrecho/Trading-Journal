import { ChevronDown, Download, Plus, Settings2, X } from 'lucide-react'
import { useState } from 'react'
import { TIME_RANGES } from '../../lib/stats'

const selectClasses =
  'h-10 w-full appearance-none rounded-lg border border-slate-800 bg-slate-900/60 pl-3 pr-9 text-sm text-slate-200 outline-none transition-colors hover:border-slate-700 focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40'

const inputClasses =
  'h-10 rounded-lg border border-slate-800 bg-slate-900/60 px-3 text-sm text-slate-200 outline-none transition-colors hover:border-slate-700 focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40'

function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={selectClasses}>
        {children}
      </select>
      <ChevronDown
        size={15}
        strokeWidth={2.5}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  )
}

export default function Controls({
  categories,
  category,
  onCategoryChange,
  timeRange,
  onTimeRangeChange,
  customRange,
  onCustomRangeChange,
  onAddCategory,
  onDeleteCategory,
  onExport,
}) {
  const [manageOpen, setManageOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const submitNewCategory = (e) => {
    e.preventDefault()
    const trimmed = newCategory.trim()
    if (!trimmed) return
    onAddCategory(trimmed)
    setNewCategory('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <button
          type="button"
          onClick={() => setManageOpen((v) => !v)}
          aria-expanded={manageOpen}
          aria-label="Manage categories"
          title="Manage categories"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
            manageOpen
              ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Settings2 size={15} />
        </button>

        <Select value={timeRange} onChange={(e) => onTimeRangeChange(e.target.value)}>
          {TIME_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>

        {timeRange === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange?.from || ''}
              onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
              className={inputClasses}
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="date"
              value={customRange?.to || ''}
              onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
              className={inputClasses}
            />
          </div>
        )}

        <button
          type="button"
          onClick={onExport}
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-4 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-6px_rgba(59,130,246,0.6)] transition-transform duration-150 hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500/40 active:translate-y-0"
        >
          <Download size={15} strokeWidth={2.5} />
          Export Summary
        </button>
      </div>

      {manageOpen && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <span className="text-xs font-medium text-slate-500">Categories:</span>
          {categories.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300"
            >
              {c}
              <button
                type="button"
                onClick={() => onDeleteCategory(c)}
                aria-label={`Remove ${c}`}
                title={`Remove ${c}`}
                className="rounded-full text-slate-500 transition-colors hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-400/40"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <form onSubmit={submitNewCategory} className="flex items-center gap-1">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              aria-label="New category name"
              className="h-7 w-28 rounded-lg border border-slate-800 bg-slate-950/60 px-2 text-xs text-slate-200 outline-none transition-colors focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            />
            <button
              type="submit"
              aria-label="Add category"
              className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20 text-blue-400 transition-colors hover:bg-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <Plus size={13} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
