import { Check, Copy, Loader2, RefreshCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const fieldClasses =
  'rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 hover:border-slate-700 focus-visible:border-blue-500/60 focus-visible:ring-2 focus-visible:ring-blue-500/40'

const STATUS_LABEL = {
  idle: 'Not syncing',
  syncing: 'Syncing…',
  synced: 'Synced',
  error: 'Sync error',
}

export default function SyncModal({ syncCode, syncStatus, syncError, onStartSync, onLinkSync, onStopSync, onClose }) {
  const [linkCode, setLinkCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(syncCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable — the code is still shown on screen to copy manually.
    }
  }

  const handleLink = (e) => {
    e.preventDefault()
    const code = linkCode.trim().toUpperCase()
    if (!code) return
    if (!window.confirm('This replaces the trades on this device with the synced data. Continue?')) return
    onLinkSync(code)
    setLinkCode('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="glow-card w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 animate-[modal-in_180ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-50">Sync across devices</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <X size={16} />
          </button>
        </div>

        {syncCode ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs">
              {syncStatus === 'syncing' && <Loader2 size={13} className="animate-spin text-blue-400" />}
              <span
                className={
                  syncStatus === 'error'
                    ? 'font-semibold text-red-400'
                    : syncStatus === 'synced'
                      ? 'font-semibold text-emerald-400'
                      : 'font-semibold text-slate-400'
                }
              >
                {STATUS_LABEL[syncStatus]}
              </span>
              {syncStatus === 'error' && syncError && <span className="text-slate-500">— {syncError}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Your sync code</span>
              <div className="flex items-center gap-2">
                <span className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-center text-lg font-bold tracking-[0.3em] text-slate-100">
                  {syncCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy sync code"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Enter this same code on your other devices to pull in these trades.
              </p>
            </div>

            <button
              type="button"
              onClick={onStopSync}
              className="self-start text-xs font-medium text-slate-500 underline-offset-2 transition-colors hover:text-red-400 hover:underline"
            >
              Stop syncing this device
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-400">
              Generate a code on this device, then enter it on another device to keep the same trades everywhere.
            </p>

            <button
              type="button"
              onClick={onStartSync}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-6px_rgba(59,130,246,0.6)] transition-transform duration-150 hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500/40 active:translate-y-0"
            >
              <RefreshCcw size={14} />
              Generate a sync code
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-px flex-1 bg-slate-800" />
              or
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleLink} className="flex flex-col gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Have a code from another device?</span>
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value)}
                  placeholder="e.g. K7P2X9QM"
                  maxLength={64}
                  className={`text-center uppercase tracking-[0.3em] ${fieldClasses}`}
                />
              </label>
              <button
                type="submit"
                disabled={!linkCode.trim()}
                className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Link this device
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
