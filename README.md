# Trading Journal

A responsive trading journal: a performance dashboard (win rate, pips, net P/L,
asset breakdown) driven by the trades you log in a monthly calendar journal.
Dark navy theme with blue/green glow accents. Data is always cached in the
browser via `localStorage`, and can optionally be synced across devices
through a small Postgres-backed API.

## Stack

- React 19 (functional components + hooks)
- Tailwind CSS v4
- Recharts (daily P/L sparkline)
- lucide-react (icons)
- Vercel serverless function + Neon Postgres for cross-device sync (`api/state.js`)

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build` (output in `dist/`).

`npm run dev` only serves the frontend — `/api/state` (used by "Sync devices")
needs `vercel dev` instead, with `DATABASE_URL` set in `.env` (see
`.env.example`). Without it, the app still works fully offline via
`localStorage`; the sync button just shows an error until it's deployed.

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

## Syncing across devices

Click "Sync devices" in the header to generate a sync code, then enter that
same code on another device to pull in the same trades. Behind the scenes:

- `api/state.js` is a Vercel serverless function backed by Postgres
  (`journal_state` table: `sync_code`, `data` jsonb, `updated_at`), storing the
  whole app state (trades, categories, P/L mode, starting balance) as one blob
  per code.
- `src/lib/sync.js` has the client-side `pullState`/`pushState` calls;
  `src/hooks/useTradeStore.js` wires them up — pulling on mount/link, and
  pushing (debounced) on every local change.
- The sync code itself is just a shared secret stored in `localStorage`
  (`trading-journal:sync-code`) — there's no login, so treat the code like a
  password and only share it between your own devices.
- Deployed on Vercel, add `DATABASE_URL` (a Postgres connection string, e.g.
  from [Neon](https://neon.tech)) as a project environment variable — the API
  route creates its table on first use.
