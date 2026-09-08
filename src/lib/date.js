export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function pad2(n) {
  return String(n).padStart(2, '0')
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function todayKey() {
  return toDateKey(new Date())
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Returns a flat array of 42 cells: { date, key, inMonth } for a Sun-Sat month grid.
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay())
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i)
    cells.push({
      date,
      key: toDateKey(date),
      inMonth: date.getMonth() === month,
    })
  }
  return cells
}

export function formatMoney(value, { signed = true } = {}) {
  const sign = value > 0 && signed ? '+' : ''
  return `${sign}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatPips(value, { signed = true } = {}) {
  const sign = value > 0 && signed ? '+' : ''
  return `${sign}${Math.round(value * 10) / 10}`
}

export function formatShortDate(dateOrKey) {
  const date = typeof dateOrKey === 'string' ? fromDateKey(dateOrKey) : dateOrKey
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}`
}
