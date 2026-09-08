import AccountBalance from './components/AccountBalance'
import CalendarJournal from './components/calendar/CalendarJournal'
import PerformanceDashboard from './components/dashboard/PerformanceDashboard'
import Header from './components/Header'
import { useTradeStore } from './hooks/useTradeStore'

export default function App() {
  const store = useTradeStore()

  const handleSaveTrade = (trade) => {
    const exists = store.trades.some((t) => t.id === trade.id)
    if (exists) store.updateTrade(trade)
    else store.addTrade(trade)
  }

  const handleClearAll = () => {
    if (window.confirm('Delete all trades? This cannot be undone.')) {
      store.clearAll()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="ambient-glow pointer-events-none fixed inset-0" />
      <div className="relative mx-auto flex max-w-6xl flex-col">
        <Header onClearAll={handleClearAll} />
        <main className="flex flex-col gap-10 px-4 py-6 sm:px-8 sm:py-8">
          <AccountBalance
            trades={store.trades}
            startingBalance={store.startingBalance}
            onSetStartingBalance={store.setStartingBalance}
          />
          <PerformanceDashboard
            trades={store.trades}
            categories={store.categories}
            onAddCategory={store.addCategory}
            onDeleteCategory={store.deleteCategory}
          />
          <CalendarJournal
            trades={store.trades}
            categories={store.categories}
            onSaveTrade={handleSaveTrade}
            onDeleteTrade={store.deleteTrade}
          />
        </main>
      </div>
    </div>
  )
}
