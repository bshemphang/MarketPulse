# MarketPulse

Live market news and signals dashboard. It tracks crypto prices over a Binance WebSocket feed, pulls market news, computes confluence trading signals, and shows charts, a watchlist, and a portfolio tracker in one place.

## Features

- Live prices and charts (Binance WebSocket, lightweight-charts, Recharts)
- News feed with a digest mode
- Confluence trading signals from technical indicators
- Watchlist and portfolio tracking
- Wallet support for Solana and EVM chains
- Sentiment and DEX data services

## Tech stack

- React, TypeScript, Vite
- Tailwind CSS
- @solana/web3.js, ethers
- lightweight-charts, Recharts, lucide-react

## Getting started

```bash
npm install
npm run dev
```

Market and news providers are configured in `src/config/sources.json`, and chains in `src/config/chains.json`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - type-check and build for production
- `npm run preview` - preview the production build
