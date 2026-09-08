import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { formatShortDate } from '../../lib/date'

// Recharts needs literal colors (no Tailwind classes) — these mirror the
// slate-900/slate-800/slate-400/emerald-400/red-400/slate-50 tokens used elsewhere.
const CHART_COLORS = {
  tooltipBg: '#0f172a',
  tooltipBorder: '#1e293b',
  tooltipLabel: '#f8fafc',
  tooltipText: '#f8fafc',
  cursor: 'rgba(148,163,184,0.08)',
  profit: '#4ade80',
  loss: '#f87171',
}

export default function Sparkline({ dayEntries }) {
  if (dayEntries.length === 0) {
    return (
      <div className="flex h-20 items-center justify-center text-xs text-slate-600">
        No trades logged this month yet.
      </div>
    )
  }

  const data = dayEntries.map((d) => ({ ...d, label: formatShortDate(d.date) }))

  return (
    <div className="h-20 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="label" hide />
          <Tooltip
            cursor={{ fill: CHART_COLORS.cursor }}
            contentStyle={{
              background: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: CHART_COLORS.tooltipLabel, fontWeight: 600, marginBottom: 2 }}
            itemStyle={{ color: CHART_COLORS.tooltipText }}
            formatter={(value) => [value.toFixed(2), 'P/L']}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="pl" radius={[3, 3, 0, 0]} maxBarSize={14}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={entry.pl >= 0 ? CHART_COLORS.profit : CHART_COLORS.loss}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
