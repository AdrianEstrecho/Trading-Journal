import { addDays, fromDateKey, startOfDay, todayKey } from './date'

export const TIME_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' },
  { value: 'custom', label: 'Custom' },
  { value: 'all', label: 'All time' },
]

export function getRangeBounds(timeRange, custom) {
  const today = startOfDay(new Date())
  switch (timeRange) {
    case 'today':
      return { from: today, to: today }
    case 'week':
      return { from: addDays(today, -6), to: today }
    case 'month':
      return { from: addDays(today, -29), to: today }
    case '3months':
      return { from: addDays(today, -89), to: today }
    case 'custom':
      return {
        from: custom?.from ? startOfDay(fromDateKey(custom.from)) : null,
        to: custom?.to ? startOfDay(fromDateKey(custom.to)) : null,
      }
    case 'all':
    default:
      return { from: null, to: null }
  }
}

function withinBounds(dateKey, bounds) {
  const d = startOfDay(fromDateKey(dateKey))
  if (bounds.from && d < bounds.from) return false
  if (bounds.to && d > bounds.to) return false
  return true
}

export function filterTrades(trades, { category, timeRange, custom }) {
  const bounds = getRangeBounds(timeRange, custom)
  return trades.filter((t) => {
    if (category && category !== 'all' && t.category !== category) return false
    return withinBounds(t.date, bounds)
  })
}

export function computeStats(filteredTrades) {
  const wins = filteredTrades.filter((t) => t.result === 'win')
  const losses = filteredTrades.filter((t) => t.result === 'loss')
  const scratch = filteredTrades.filter((t) => t.result === 'scratch')
  const decided = wins.length + losses.length
  const winRate = decided ? (wins.length / decided) * 100 : 0
  const pipsWon = wins.reduce((sum, t) => sum + (t.pips || 0), 0)
  const pipsLost = losses.reduce((sum, t) => sum + (t.pips || 0), 0)
  const netPips = pipsWon - pipsLost
  const totalPL = filteredTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)

  return {
    wins: wins.length,
    losses: losses.length,
    scratch: scratch.length,
    decided,
    winRate,
    totalSignals: filteredTrades.length,
    pipsWon,
    pipsLost,
    netPips,
    totalPL,
  }
}

export function computeAssetPerformance(filteredTrades) {
  const byCategory = new Map()
  for (const t of filteredTrades) {
    const key = t.category || 'Uncategorized'
    if (!byCategory.has(key)) {
      byCategory.set(key, { category: key, wins: 0, losses: 0, scratch: 0, count: 0 })
    }
    const entry = byCategory.get(key)
    entry.count += 1
    if (t.result === 'win') entry.wins += 1
    else if (t.result === 'loss') entry.losses += 1
    else entry.scratch += 1
  }

  return Array.from(byCategory.values())
    .map((entry) => {
      const decided = entry.wins + entry.losses
      return {
        ...entry,
        decided,
        winRate: decided ? (entry.wins / decided) * 100 : 0,
      }
    })
    .filter((entry) => entry.decided > 0)
    .sort((a, b) => b.winRate - a.winRate)
}

export function computeMonthSummary(trades, year, month) {
  const monthTrades = trades.filter((t) => {
    const d = fromDateKey(t.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const byDate = new Map()
  for (const t of monthTrades) {
    byDate.set(t.date, (byDate.get(t.date) || 0) + (t.profitLoss || 0))
  }

  const dayEntries = Array.from(byDate.entries())
    .map(([date, pl]) => ({ date, pl }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const totalPL = dayEntries.reduce((sum, d) => sum + d.pl, 0)
  const greenDays = dayEntries.filter((d) => d.pl > 0).length
  const redDays = dayEntries.filter((d) => d.pl < 0).length

  let best = null
  let worst = null
  for (const d of dayEntries) {
    if (!best || d.pl > best.pl) best = d
    if (!worst || d.pl < worst.pl) worst = d
  }

  const avgDaily = dayEntries.length ? totalPL / dayEntries.length : 0

  // Current streak of consecutive green days, walking back from most recent trading day.
  let streak = 0
  for (let i = dayEntries.length - 1; i >= 0; i--) {
    if (dayEntries[i].pl > 0) streak += 1
    else break
  }

  return {
    totalPL,
    greenDays,
    redDays,
    best,
    worst,
    avgDaily,
    dayEntries,
    tradingDays: dayEntries.length,
    streak,
  }
}

export function isToday(dateKey) {
  return dateKey === todayKey()
}
