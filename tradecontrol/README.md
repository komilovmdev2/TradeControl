# TradeControl — Trading Journal & Analytics Platform (MVP)

A premium, dark-theme trading journal built with **Next.js (App Router) + React + TypeScript + Tailwind CSS v4**, recreated pixel-close from the `design_handoff_tradecontrol` handoff.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. This fetches the Inter font from Google Fonts at runtime via a `<link>` tag (no build-time network dependency).

On first load the app seeds ~140 realistic mock trades (deterministic, seeded random) into `localStorage` so every screen has real data to compute from. All state (trades, goals, strategies, settings, auth) persists in `localStorage` — clear your browser storage to reset to the seed data.

## Routes (16 screens)

| Route | Screen |
|---|---|
| `/` | Landing / marketing page |
| `/splash` | Boot/loading screen |
| `/login`, `/register` | Auth (client-side validated, mock session) |
| `/dashboard` | KPIs, equity curve, calendar heatmap, recent trades, top strategies |
| `/journal` | Trade Journal — search/filter/sort over real trades |
| `/analytics` | Win-rate donut, per-pair & per-hour performance, AI-detected mistakes |
| `/calendar` | Year heatmap + current month P/L grid |
| `/risk-calculator` | Live position-sizing calculator |
| `/strategies` | Strategy cards with computed stats, + create new strategy |
| `/goals` | Editable daily/weekly/monthly/yearly targets with computed progress |
| `/reports` | Monthly summaries + mock PDF/Excel export |
| `/ai-coach` | Insights derived from trade data + ask-a-question box |
| `/settings` | Appearance, persisted notification toggles, subscription |
| `/profile` | Stats, achievements, trading history |
| `/add-trade` | Standalone route that opens the Add Trade modal |

The **Add Trade** modal (navbar button, Dashboard Quick Actions, or `/add-trade`) is available globally within the app shell and writes real trades into the store — Dashboard, Journal, and Analytics all recompute from it immediately.

## Architecture

- `src/lib/types.ts` — domain model
- `src/lib/mockData.ts` — seeded trade/strategy generator
- `src/lib/calculations.ts` — all derived analytics (win rate, profit factor, drawdown, equity curve, per-pair/hour/emotion aggregates)
- `src/lib/store.tsx` — global state via React Context + `localStorage`
- `src/components/ui/*` — Button, Badge, Toggle, Modal, KPICard, TradeCard
- `src/components/layout/*` — Sidebar (active-route highlighting), Navbar, AppShell
- `src/components/charts/*` — Recharts-based Equity Curve, Win-Rate Donut, Hourly Bar chart, Calendar Heatmap
- `src/app/(app)/*` — authenticated routes sharing the app shell
- `src/app/{page,login,register,splash}.tsx` — public routes

## Notes / next steps

- Currently fully client-side/mock — no backend. Wire `addTrade`/`login`/`register` in `src/lib/store.tsx` to a real API or Supabase when ready.
- CSV import and PDF/Excel export are stubbed (buttons exist, show a confirmation message) — swap in real implementations when a backend exists.
- Design tokens live in `src/app/globals.css` under `@theme`, matching the handoff's color/radius/shadow spec exactly.
