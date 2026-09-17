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

## Live Demo

**Production Demo:**  
https://times-ooh-iota.vercel.app/

## Project Architecture

The application follows a clean, modular component-based architecture using Next.js App Router and TypeScript.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── AppShell.tsx
│   │   └── Top-level client component responsible for filters,
│   │       site selection, drag-and-drop state, and toast feedback.
│   │
│   ├── layout/
│   │   └── Header.tsx
│   │
│   ├── filters/
│   │   ├── SearchBar.tsx
│   │   └── FilterBar.tsx
│   │
│   ├── map/
│   │   ├── SiteMap.tsx
│   │   │   └── Leaflet map container and site rendering
│   │   ├── SiteMarker.tsx
│   │   │   └── Draggable site marker and site information popup
│   │   ├── MapControls.tsx
│   │   │   └── Fit-to-sites control and map legend
│   │   └── mapIcons.ts
│   │       └── Custom Leaflet marker/icon factory
│   │
│   ├── cart/
│   │   ├── CartPanel.tsx
│   │   │   └── Desktop cart and drag-and-drop target
│   │   ├── CartItem.tsx
│   │   │   └── Selected site information and remove action
│   │   ├── CartEmptyState.tsx
│   │   │   └── Empty cart guidance
│   │   └── MobileCartSheet.tsx
│   │       └── Mobile-friendly cart drawer
│   │
│   └── ui/
│       ├── Toast.tsx
│       └── EmptyState.tsx
│
├── hooks/
│   ├── useSiteSelection.ts
│   │   └── Manages cart state, site selection/removal,
│   │       duplicate prevention, and derived site lists
│   │
│   └── useToast.ts
│       └── Lightweight toast notification management
│
├── lib/
│   ├── siteUtils.ts
│   │   └── Search, filtering, formatting, map bounds,
│   │       and coordinate-overlap utilities
│   │
│   └── zoneColors.ts
│       └── Zone-to-color mapping kept independent of Leaflet
│
├── data/
│   └── sites.ts
│       └── Immutable dataset containing the provided DND sites
│
└── types/
    └── site.ts
        └── TypeScript definitions for Site, Zone, and SiteFilters
```

`SiteMap` is loaded via `next/dynamic({ ssr: false })` because Leaflet touches `window` at
module-load time and cannot be evaluated on the server.

## What I Would Build Next

- A real inventory API (availability, pricing, hold/booking windows) behind the current UI.
- Authentication and saved/named campaigns per user.
- A booking/checkout flow once sites are in the cart (dates, quote, confirmation).
- A real database instead of in-memory state, with optimistic UI kept as-is.
- Live inventory status (e.g. another user has this site on hold).
- Basic analytics (which corridors/display types get selected most) and role-based access for
  internal sales vs. client-facing views.

## AI Usage

Claude was used as a development assistant throughout the project for:

- Scaffolding the Next.js and Tailwind CSS project
- Converting the provided DND site dataset into structured TypeScript data
- Assisting with the initial implementation of map, marker, cart, search, and filter components
- Debugging and resolving runtime and SSR-related issues
- Reviewing edge cases and improving the overall user experience

All AI-generated suggestions and code were reviewed, modified, and tested during development. The final implementation was validated against the assignment requirements and actual user interactions.

### Engineering Decisions & Changes

#### Leaflet SSR Handling

During development, an SSR issue occurred because Leaflet depends on browser-specific APIs such as `window`.

An initial workaround used:

```ts
export const dynamic = "force-dynamic";
```

