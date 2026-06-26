# Omada Console — UI Kit

Pixel-leaning recreation of the **Omada Cloud-Based System** chrome. Built as a click-through prototype, not production code.

## What's here

- `index.html` — entry. Renders an interactive flow: **Login → Dashboard → Devices**, with a working sidebar and product tab switcher.
- `components.jsx` — shared atoms: `Button`, `IconBtn`, `Card`, `StatusPill`, `Switch`, `Field`, `Icon`. All Manrope, all token-driven.
- `LoginScreen.jsx` — teal split-screen sign-in. Any input + click "Sign In" advances.
- `TopBar.jsx` — green chrome bar. Site selector pill on the left, product tabs (Wireless / Wired / VIGI), refresh/theme/avatar/kebab on the right. Click a product tab to scope the dashboard.
- `Sidebar.jsx` — white left rail. Site picker, sectioned nav (Manage / Monitoring / Configuration / Maintain), collapsible.
- `Dashboard.jsx` — the Overview screen: Site Health Score gauge, health-trend chart, topology row, clients donut, traffic chart, pending alarms, gateway info, AP density, channel distribution.
- `DevicesTable.jsx` — the Devices list: filter row, dense table with status pills, MAC/IP, model, uptime, client count, row actions.

## Cosmetic only

Real authentication, real data fetches, real charts and real virtualization are out of scope. Chart paths are inline SVGs. Sorting, filtering and pagination are mocked.

## How to extend

Add a new screen by writing `MyScreen.jsx`, exporting it to `window`, then adding a case in `index.html`'s `<App>` switch. All atoms in `components.jsx` are global on `window` after load — use `Button`, `Card`, `Pill`, etc. directly without imports.
