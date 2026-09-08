# Trading Journal

A responsive trading journal: a performance dashboard (win rate, pips, net P/L,
asset breakdown) driven by the trades you log in a monthly calendar journal.
Dark navy theme with blue/green glow accents. All data is stored in the
browser via `localStorage` — no backend.

## Stack

- React 19 (functional components + hooks)
- Tailwind CSS v4
- Recharts (daily P/L sparkline)
- lucide-react (icons)

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build` (output in `dist/`).

## How it works

- Every trade you log from the calendar (`src/components/calendar/DayModal.jsx`)
  is stored in a single `trades` array (`src/hooks/useTradeStore.js`), persisted
  to `localStorage`.
- The Performance Dashboard derives all stats and the asset performance list
  from that same array, filtered by the category/time-range controls
  (`src/lib/stats.js`).
- The calendar always shows every trade regardless of the dashboard filters;
  clicking a day opens a modal to add, edit, or delete trades for that date.
- First run seeds a few weeks of demo trades so the dashboard isn't empty —
  use "Clear data" in the header to start fresh.
