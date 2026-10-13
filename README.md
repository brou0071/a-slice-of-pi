# A Slice of Pi 🍕

A small sales dashboard for a fictional pizza chain, "A Slice of Pi". It visualizes
2023 order, pricing, and review data across the chain's five Ottawa locations
(Kanata, Orleans, Downtown, Sandy Hill, and The Glebe).

Built with React, TypeScript, Vite, and [MUI X Charts](https://mui.com/x/react-charts/).

## Features

- **Revenue summary** – total money made over the selected period, formatted in CAD.
- **Money made per month** – a line chart of monthly revenue. The month buckets are
  derived from the data in range, so the chart follows whatever dates are selected.
- **Orders placed per store** – a bar chart of order counts per location, with
  additional filters for **pizza type** and **pizza size**.
- **Reviews per sentiment** – a pie chart breaking down customer reviews by sentiment
  (angry, sad, happy, delighted).
- **Recent reviews** – a scrollable list of individual customer reviews.
- **Global date-range filter** – start/end date inputs at the top of the page filter
  the revenue, orders, and reviews charts together. Inputs are clamped to the range of
  the underlying data, and a Reset button restores the full range.
- **Responsive layout** – the sidebar collapses into a top bar and the panel grids
  stack into a single column on tablet and mobile widths.

## Tech stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and build
- [MUI X Charts](https://mui.com/x/react-charts/) for the line, bar, and pie charts
- [ESLint](https://eslint.org/) for linting

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (bundled with Node)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Available scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with hot reloading.    |
| `npm run build`   | Type-check (`tsc -b`) and build for production.  |
| `npm run preview` | Preview the production build locally.            |
| `npm run lint`    | Run ESLint over the project.                     |

## Project structure

```
src/
├── App.tsx                      # Layout, sidebar nav, and the global date-range filter
├── App.css                      # Dashboard styling, including responsive breakpoints
├── components/
│   ├── moneyMade.tsx            # Money-made-per-month line chart
│   ├── ordersPlaced.tsx         # Orders-per-store bar chart + type/size filters
│   ├── reviewsCounts.tsx        # Reviews-per-sentiment pie chart
│   ├── reviews.tsx              # Scrollable list of individual reviews
│   └── helpers.tsx              # Shared helpers (revenue totals, date-range filtering)
└── data_sets/
    ├── order_data.json          # Orders: store, items (type + size), date
    ├── pricing_data.json        # Price per pizza type and size
    └── review_data.json         # Reviews: store, sentiment, message, date
```

## Data

The dashboard reads from static JSON files in `src/data_sets/`. The data covers the
2023 calendar year. Prices are looked up per pizza type and size from
`pricing_data.json`; any order item without a matching price is skipped and logged as a
warning.
