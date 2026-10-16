# Live Market Watch

A real-time cryptocurrency market dashboard built with React, TypeScript, WebSockets, and Lightweight Charts.

## Features

- Live cryptocurrency prices using Binance public WebSocket streams
- Interactive price chart with recent tick history
- Green and red price-change indicators
- Market watchlist with search and selection
- Automatic WebSocket reconnection with exponential backoff
- Loading, error, and empty states
- Memoized components and React Profiler instrumentation
- Component tests using Vitest and React Testing Library
- Express health-check API

## Tech Stack

**Frontend:** React, TypeScript, Vite, Lightweight Charts, Lucide React

**Backend:** Node.js, Express, TypeScript

**Real-time data:** Binance public market WebSocket streams

**Testing:** Vitest, React Testing Library

**Deployment:** Vercel (frontend), Render (optional API)

## Getting Started

### Prerequisites

- Node.js LTS
- npm
- Git

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Run the backend

Create `server/.env` with:

```dotenv
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

Then run:

```bash
cd server
npm run dev
```

### Run the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite.

### Run tests and build

```bash
cd client
npm run test:run
npm run build
```

## Architecture

The React client connects to Binance's combined WebSocket stream, processes ticker events, updates market state, and renders the watchlist and selected market chart.

The Express API exposes a health-check endpoint. The frontend currently consumes the public market stream directly.

## Performance

React Profiler is used to inspect component render duration. Performance changes should be measured under comparable workloads and documented with actual results.

## Demo

Add a screenshot or GIF of the deployed dashboard here.

## Future Improvements

- Historical candlestick data
- Server-side market-data aggregation
- Batched tick processing
- Virtualized watchlist for large datasets
- More comprehensive WebSocket and integration tests
- Persistent user watchlists
- Quote-volume analytics

## Disclaimer

This project is for educational purposes only. It does not execute trades or provide financial advice.
