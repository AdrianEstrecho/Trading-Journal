function csvEscape(value) {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export function exportTradesToCsv(trades, stats, filename = 'trading-journal-summary.csv') {
  const summaryRows = [
    ['Summary'],
    ['Win rate', `${stats.winRate.toFixed(1)}%`],
    ['Wins', stats.wins],
    ['Losses', stats.losses],
    ['Scratch', stats.scratch],
    ['Total signals', stats.totalSignals],
    ['Pips won', stats.pipsWon],
    ['Net pips', stats.netPips],
    ['Total P/L', stats.totalPL.toFixed(2)],
    [],
    ['Date', 'Category', 'Result', 'P/L', 'Pips', 'Notes'],
  ]

  const tradeRows = trades
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => [t.date, t.category || '', t.result, t.profitLoss, t.pips ?? '', t.notes || ''])

  const csv = [...summaryRows, ...tradeRows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
