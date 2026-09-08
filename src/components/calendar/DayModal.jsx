import { ChevronDown, ImagePlus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { fromDateKey, MONTH_NAMES } from '../../lib/date'

const RESULT_OPTIONS = [
  { value: 'win', label: 'Win', tone: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400' },
  { value: 'loss', label: 'Loss', tone: 'border-red-500/50 bg-red-500/15 text-red-400' },
  { value: 'scratch', label: 'Scratch', tone: 'border-slate-500/50 bg-slate-500/15 text-slate-300' },
]

const fieldClasses =
  'rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 hover:border-slate-700 focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40'

const emptyForm = {
  profitLoss: '',
  pips: '',
  category: '',
  result: 'win',
  notes: '',
  screenshot: null,
}

export default function DayModal({ dateKey, trades, categories, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ ...emptyForm, category: categories[0] || '' })
  const [editingId, setEditingId] = useState(null)
  const [resultTouched, setResultTouched] = useState(false)
  const fileInputRef = useRef(null)

  const date = fromDateKey(dateKey)
  const dayTotal = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const resetForm = () => {
    setForm({ ...emptyForm, category: categories[0] || '' })
    setEditingId(null)
    setResultTouched(false)
  }

  const loadForEdit = (trade) => {
    setForm({
      profitLoss: String(trade.profitLoss),
      pips: trade.pips ? String(trade.pips) : '',
      category: trade.category || categories[0] || '',
      result: trade.result,
      notes: trade.notes || '',
      screenshot: trade.screenshot || null,
    })
    setEditingId(trade.id)
    setResultTouched(true)
  }

  const handlePlChange = (value) => {
    setForm((f) => ({ ...f, profitLoss: value }))
    if (!resultTouched) {
      const n = parseFloat(value)
      if (!Number.isNaN(n)) {
        setForm((f) => ({ ...f, profitLoss: value, result: n > 0 ? 'win' : n < 0 ? 'loss' : 'scratch' }))
      }
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, screenshot: reader.result }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const profitLoss = parseFloat(form.profitLoss)
    if (Number.isNaN(profitLoss)) return

    const trade = {
      id: editingId || `${dateKey}-${Date.now()}`,
      date: dateKey,
      profitLoss,
      pips: form.pips ? parseFloat(form.pips) : 0,
      category: form.category || undefined,
      result: form.result,
      notes: form.notes,
      screenshot: form.screenshot,
      createdAt: editingId
        ? trades.find((t) => t.id === editingId)?.createdAt || Date.now()
        : Date.now(),
    }
    onSave(trade)
    resetForm()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="glow-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 animate-[modal-in_180ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-50">
              {MONTH_NAMES[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
            </h3>
            {trades.length > 0 && (
              <p className={`text-xs font-semibold ${dayTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                Day total: {dayTotal >= 0 ? '+' : ''}
                {dayTotal.toFixed(2)} · {trades.length} trade{trades.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <X size={16} />
          </button>
        </div>

        {trades.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {trades.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                  editingId === t.id ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => loadForEdit(t)}
                  className="flex flex-1 items-center gap-2 rounded text-left focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <span
                    className={`font-semibold ${
                      t.result === 'win' ? 'text-emerald-400' : t.result === 'loss' ? 'text-red-400' : 'text-slate-400'
                    }`}
                  >
                    {t.profitLoss >= 0 ? '+' : ''}
                    {t.profitLoss.toFixed(2)}
                  </span>
                  {t.category && <span className="text-xs text-slate-500">{t.category}</span>}
                  {!!t.pips && <span className="text-xs text-slate-600">{t.pips} pips</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(t.id)
                    if (editingId === t.id) resetForm()
                  }}
                  aria-label="Delete trade"
                  className="rounded text-slate-600 transition-colors hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-400/40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Profit / Loss *</span>
              <input
                type="number"
                step="0.01"
                required
                value={form.profitLoss}
                onChange={(e) => handlePlChange(e.target.value)}
                placeholder="e.g. 125 or -40"
                className={fieldClasses}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Pips (optional)</span>
              <input
                type="number"
                step="0.1"
                value={form.pips}
                onChange={(e) => setForm((f) => ({ ...f, pips: e.target.value }))}
                placeholder="e.g. 24"
                className={fieldClasses}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Category / instrument</span>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`w-full appearance-none pr-9 ${fieldClasses}`}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Result</span>
            <div className="flex gap-2">
              {RESULT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setResultTouched(true)
                    setForm((f) => ({ ...f, result: opt.value }))
                  }}
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    form.result === opt.value ? opt.tone : 'border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Notes (optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Setup, reasoning, lessons..."
              className={`resize-none ${fieldClasses}`}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <ImagePlus size={14} />
              {form.screenshot ? 'Replace screenshot' : 'Add screenshot'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {form.screenshot && (
              <div className="relative">
                <img src={form.screenshot} alt="Trade screenshot" className="h-10 w-14 rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, screenshot: null }))}
                  aria-label="Remove screenshot"
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-1 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-6px_rgba(59,130,246,0.6)] transition-transform duration-150 hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500/40 active:translate-y-0"
            >
              {editingId ? 'Update trade' : 'Save trade'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
