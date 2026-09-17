# DND Site Selector

## Overview

A frontend prototype built for the **Times OOH take-home assignment**: a self-serve,
e-commerce-style way to browse out-of-home (OOH) advertising inventory and select sites
by **dragging their map pin into a cart**, instead of picking off a static list.

It plots all **122 real sites** from the DND (Delhi–Noida Direct) corridor spreadsheet on
an interactive map. Dragging a pin onto the cart panel selects it — the pin disappears from
the map and the site appears in the cart with its code, coordinates, and specs. Removing it
from the cart returns it to the map, unchanged.

There is no backend, no auth, and no database — all state is in-memory React state, exactly
as the brief specifies.

## Features

- **Interactive DND map** — all 122 sites plotted with custom OOH-pin markers (Leaflet +
  OpenStreetMap), colour-coded by zone, with a "fit to sites" control and a small legend.
- **Drag-to-cart** — native HTML5 drag-and-drop from map pin to cart panel is the primary
  interaction. The cart becomes an active drop zone the moment a drag starts, and highlights
  further on hover-over before the drop.
- **Remove and restore** — removing a site from the cart returns its exact original marker to
  the map; nothing is ever mutated or lost.
- **Search** — matches site code, location, display type, or zone as you type.
- **Zone and display-type filters** — display types are derived from the dataset, not
  hard-coded, and combine with search and each other.
- **Duplicate-coordinate handling** — see below.
- **Responsive UI** — side-by-side map/cart on desktop and tablet, a stacked layout with a
  slide-up cart drawer on mobile.
- **Accessibility** — markers are keyboard-focusable and Enter/Space opens their popup; every
  popup includes a secondary, non-drag "Add to cart" button as a keyboard/touch-friendly
  alternative to dragging; remove buttons are real `<button>` elements with `aria-label`s;
  focus states and contrast follow standard SaaS-dashboard conventions.

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · React-Leaflet /
Leaflet · Lucide React icons.

## Dataset

The prototype uses the 122 sites from `DND- Site List Latitude Longitude.xlsx` (sheet
`DND`) as the source of truth — no invented data.

`src/data/sites.ts` is **generated, not hand-typed**, from that spreadsheet, to rule out
transcription mistakes across 122 rows × 13 columns. The conversion:

1. Reads every data row (skipping the title/header rows at the top of the sheet).
2. Validates there are exactly 122 rows, each with numeric, finite latitude/longitude.
3. Preserves every original value verbatim — site code, zone, display type, location,
   dimensions, area, media status, lit status, coordinates.
4. Adds one field the source doesn't have: `id`. The sheet's `Site Code` column is **not**
   unique — 5 rows share the literal code `"LANDSCAPE ADVERTISING"` and one code
   (`DND/N/MP/PKG-25`) appears twice for two distinct kiosks. `id` (derived from the sheet's
   `Sr.No` column, e.g. `SITE-033`) is the real, always-unique key used for selection and cart
   state; `siteCode` remains exactly as given, for display only.

The generated file is committed, so the app never reads the `.xlsx` at runtime.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
npm run build
npm run start
```

## Architecture

```
src/
  app/                  Next.js App Router entry (layout, page, global styles)
  components/
    AppShell.tsx        Top-level client component: owns filters, selection, drag & toast state
    layout/Header.tsx
    filters/            SearchBar, FilterBar
    map/                SiteMap (Leaflet container), SiteMarker (drag source + popup),
                         MapControls (fit-to-sites, legend), mapIcons (custom pin factory)
    cart/               CartPanel (desktop drop zone), CartItem, CartEmptyState,
                         MobileCartSheet (mobile drawer)
    ui/                 Toast, EmptyState
  hooks/
    useSiteSelection.ts Cart state: add/remove/isSelected, derived available vs. cart lists
    useToast.ts         Lightweight toast queue
  lib/
    siteUtils.ts         Filtering, search, formatting, bounds, overlap-offset math
    zoneColors.ts         Zone → colour lookup (kept Leaflet-free — see Assumptions)
  data/sites.ts           Generated, immutable dataset (see Dataset above)
  types/site.ts           Site / Zone / SiteFilters types
```

`SiteMap` is loaded via `next/dynamic({ ssr: false })` because Leaflet touches `window` at
module-load time and cannot be evaluated on the server.

## Assumptions

- Frontend-only prototype: no backend, no persistence across reloads, no auth — matches the
  brief exactly ("dummy/in-memory data is fine").
- `id` (derived from `Sr.No`), not `siteCode`, is the unique selection key, because the source
  data itself has duplicate site codes (see Dataset).
- The provided latitude/longitude are used as-is and are never altered, including for sites
  rendered with a small visual offset (see Edge Cases below).
- `zoneColor` was pulled out into its own Leaflet-free module (`lib/zoneColors.ts`) purely so
  the cart list (which is always server-rendered) never transitively imports the real
  `leaflet` package — an early build hit a `window is not defined` SSR crash from exactly this
  import path, fixed by this split rather than by disabling static rendering.
- "Media Status" / "Lit Status" are shown as free text exactly as the sheet has them
  (`Frontlit Flex` / `Front Lit`, etc.) rather than re-labelled, since the brief asks for the
  data to be surfaced, not re-interpreted.

## Edge Cases

- **Near-identical coordinates** (several DND kiosks sit metres apart — 84 of the 122 sites
  round to a shared 4-decimal-degree bucket with at least one neighbour): sites sharing a
  bucket are auto-arranged on a small circle around their true centroid **for on-screen
  placement only** — the stored coordinates shown in the popup/cart are never touched. Each
  pin also carries a small count badge when it's part of such a cluster.
- **Dropping outside the cart**: nothing happens — the site stays on the map, no state changes.
- **Empty cart / empty search results / all-filtered-out map**: each has its own explicit
  empty state with guidance text, not a blank panel.
- **Re-adding a removed site**: works identically to a first-time add — nothing is soft-deleted.
- **Selecting the same site twice** (rapid drops, or the popup's "Add to cart" clicked twice):
  guarded at both the drop handler and the state hook, so a site can never appear twice in the
  cart.
- **Mobile / touch**: drag-and-drop stays desktop-primary; on touch devices, tapping a pin opens
  its popup with an "Add to cart" button as the reliable fallback, and the cart becomes a
  slide-up drawer behind a floating "Cart" button.

## What I Would Build Next

- A real inventory API (availability, pricing, hold/booking windows) behind the current UI.
- Authentication and saved/named campaigns per user.
- A booking/checkout flow once sites are in the cart (dates, quote, confirmation).
- A real database instead of in-memory state, with optimistic UI kept as-is.
- Live inventory status (e.g. another user has this site on hold).
- Basic analytics (which corridors/display types get selected most) and role-based access for
  internal sales vs. client-facing views.

## AI Usage

AI (Claude) was used throughout this build — for scaffolding the Next.js/Tailwind project,
generating the typed dataset conversion script from the spreadsheet, drafting the initial
components (map, markers, cart, filters), and debugging a real SSR crash caused by an
unguarded `leaflet` import in a server-rendered code path.

What was changed/rejected from AI output along the way:
- The first working build relied on `export const dynamic = "force-dynamic"` to dodge a
  `window is not defined` SSR crash. That was rejected as a band-aid; the actual fix was
  tracing the import chain (`CartItem` → `mapIcons` → `leaflet`) and splitting the
  Leaflet-free `zoneColor` helper into its own module so the page could go back to being
  fully static.
- The initial marker-overlap "spiderfy" radius was tuned after browser-testing showed pins in
  the densest clusters were visually unclickable at the default fit-to-bounds zoom.
- **A real drag-and-drop bug that early testing missed and was only caught after the user
  reported it**: my first automated pass drove the app with synthetic `dispatchEvent(new
  Event("dragstart"))` calls, which fire listeners directly but bypass the browser's actual
  native drag-gesture detection — so it "passed" while real dragging was silently broken for
  every user. The real cause: Leaflet's own stylesheet sets `-webkit-user-drag: none` on every
  `.leaflet-marker-icon` (to stop browsers natively dragging marker *images* off the map), and
  that rule also blocked my intentional custom drag regardless of the `draggable="true"`
  attribute. Root-caused it by reproducing with genuine `page.mouse.down()/move()/up()` mouse
  synthesis instead of dispatched events, diffing against a plain non-Leaflet drag-and-drop
  page (which worked) to isolate that Leaflet's CSS was the difference, then confirmed via the
  Leaflet source. Fixed with a scoped override
  (`.leaflet-marker-icon.dnd-marker-icon { -webkit-user-drag: element !important; }`) in
  [globals.css](src/app/globals.css), then re-verified with real mouse-gesture simulation, not
  dispatched events, before trusting it again.
- Every interaction (drag-to-cart, remove/restore, search, zone/display-type filters combined,
  keyboard add-to-cart, rapid duplicate-drop protection, mobile drawer) was re-verified in a
  headless-browser pass driving the actual running app with genuine mouse gestures, not
  dispatched events and not assumed from the code — see Testing.

## Testing Performed

- `npx tsc --noEmit` — no type errors.
- `npm run build` — clean production build, route prerenders as fully static.
- `npm run lint` — no ESLint errors.
- Headless-browser pass (Playwright, driving the actual running dev server with **genuine
  `mouse.down()`/`mouse.move()`/`mouse.up()` gestures**, not dispatched synthetic events —
  see the drag-and-drop bug above for why that distinction matters) confirming: all 122
  markers render; hover/keyboard-focus opens a marker popup with full site details;
  a real mouse-driven drag from a map pin onto the cart panel removes the pin from the map,
  adds the card to the cart, and shows a success toast; the remove button returns the site to
  the map; search, zone filter, display-type filter, and all three combined narrow the map and
  update the "Showing X of 122" count correctly; the no-results empty state appears for an
  unmatched search; rapid duplicate drops of the same site only ever add one cart entry; the
  mobile viewport renders the stacked layout with a floating cart button and slide-up drawer —
  with zero browser console errors throughout.

## Known Limitations

- Touch-based drag-and-drop on real mobile hardware is not exercised by the automated pass
  (headless Chromium has no true touch-drag emulation); the tap-to-open-popup →
  "Add to cart" fallback is the intended and tested path on touch devices.
- At the fully-zoomed-out "fit to all sites" view, the densest kiosk clusters still overlap
  visually — panning/zooming in (as a user naturally would to inspect a cluster) fully
  separates them; a production version would likely add zoom-dependent decluttering.
