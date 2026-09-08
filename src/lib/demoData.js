import { addDays, toDateKey } from './date'

const CATEGORIES = ['Forex', 'Gold', 'Indices', 'Crypto']
const INSTRUMENTS = {
  Forex: ['EURUSD', 'GBPUSD', 'USDJPY'],
  Gold: ['XAUUSD'],
  Indices: ['US30', 'NAS100'],
  Crypto: ['BTCUSD', 'ETHUSD'],
}

function pick(arr, seed) {
  return arr[Math.floor(seed) % arr.length]
}

// Deterministic pseudo-random generator so demo data is stable across reloads
// until the user starts editing (at which point real state takes over).
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateDemoTrades() {
  const rand = mulberry32(20260908)
  const trades = []
  const today = new Date()
  let id = 1

  for (let dayOffset = 50; dayOffset >= 0; dayOffset--) {
    const date = addDays(today, -dayOffset)
    const dow = date.getDay()
    if (dow === 0 || dow === 6) continue // skip weekends
    if (rand() < 0.35) continue // skip some days entirely

    const tradesToday = 1 + Math.floor(rand() * 3)
    for (let i = 0; i < tradesToday; i++) {
      const category = pick(CATEGORIES, rand() * CATEGORIES.length)
      const instrument = pick(INSTRUMENTS[category], rand() * INSTRUMENTS[category].length)
      const roll = rand()
      const result = roll < 0.62 ? 'win' : roll < 0.9 ? 'loss' : 'scratch'
      const pips = result === 'scratch' ? 0 : Math.round((5 + rand() * 45) * 10) / 10
      const pipValue = category === 'Gold' ? 1.2 : category === 'Indices' ? 2.4 : 8.5
      const profitLoss =
        result === 'scratch'
          ? 0
          : Math.round(
              (result === 'win' ? pips * pipValue : -pips * pipValue) * (0.85 + rand() * 0.3) *
                100,
            ) / 100

      trades.push({
        id: `demo-${id++}`,
        date: toDateKey(date),
        profitLoss,
        pips,
        category,
        instrument,
        result,
        notes: '',
        screenshot: null,
        createdAt: date.getTime() + i,
      })
    }
  }

  return trades
}

export const DEFAULT_CATEGORIES = CATEGORIES
