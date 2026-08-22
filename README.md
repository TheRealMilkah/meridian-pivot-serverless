# Meridian Pivot – Serverless Inventory Sync Service

**Sprint 2 | Northstar Retail Co. | Inventory Sync Service**

## Overview

This is a serverless inventory sync service built for "The Meridian Pivot" simulation. It supports both **polling** (Day 3) and **webhook** (Day 4) patterns, making it ready for the mid-sprint pivot.

The service:
- **Receives** stock updates via webhook (`POST /api/webhook`)
- **Polls** a warehouse API every 5 minutes (`/api/poll` via cron job)
- **Caches** stock data in **Upstash Redis** (persistent across all function invocations)
- **Exposes** a query endpoint to check stock (`GET /api/stock`)

This architecture directly supports the **Day 4 pivot** – when the client kills polling and forces a switch to webhooks, the webhook receiver is already built and tested.

---

## Tech Stack

- **Platform:** [Vercel](https://vercel.com) (Serverless Functions)
- **Runtime:** Node.js (ES Modules)
- **Deployment:** GitHub-connected (auto-deploys on `main` push)
- **Scheduling:** Vercel Cron Jobs (every 5 minutes)
- **Cache:** [Upstash Redis](https://upstash.com) (persistent key-value store)

---
## Project Structure
meridian-pivot-serverless/
├── api/
│ ├── _cache.js # Upstash Redis cache layer
│ ├── poll.js # Polling function (cron job)
│ ├── stock.js # Query endpoint
│ └── webhook.js # Webhook receiver
├── package.json # Project metadata (ES Modules)
├── vercel.json # Cron job configuration
└── README.md # This file

---

## How It Works

### 1. Webhook Receiver (`api/webhook.js`)
- Accepts `POST` requests with `{ "sku": "...", "stock": ... }`
- Validates the payload
- Stores the data in Upstash Redis
- Returns a `200 OK` response with a timestamp

### 2. Polling Function (`api/poll.js`)
- Runs every 5 minutes via Vercel Cron (`vercel.json`)
- Fetches mock stock data (replace with real warehouse API)
- Updates Upstash Redis with the latest values
- Logs the number of SKUs updated

### 3. Query Endpoint (`api/stock.js`)
- `GET /api/stock` – returns all cached stock data
- `GET /api/stock?sku=SHIRT-001` – returns stock for a specific SKU
- Returns `404` if SKU is not found

### 4. Cache Layer (`api/_cache.js`)
- Uses **Upstash Redis** for persistent storage
- Provides `getStock`, `setStock`, `updateStock`, `getAllStock`, `getCacheSize`
- Data is shared across all serverless function invocations (solves the container isolation problem)

---

## Deployment

1. Clone this repository.
2. Connect your GitHub repo to [Vercel](https://vercel.com).
3. Add Upstash Redis environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Vercel will auto-deploy on every push to `main`.
5. The cron job will start running automatically every 5 minutes.
6. Your endpoints will be live at:
   - `https://[your-project].vercel.app/api/webhook`
   - `https://[your-project].vercel.app/api/poll`
   - `https://[your-project].vercel.app/api/stock`

**Live URL:** `https://meridian-pivot-serverless-milkah.vercel.app`
---

## Testing the Endpoints

### 1. Manual Poll (Populates the Cache)

**Windows (CMD):**
```cmd
curl -L -X POST https://meridian-pivot-serverless-milkah.vercel.app/api/poll
{
  "success": true,
  "updated": 5,
  "cacheSize": 5,
  "timestamp": "2026-08-20T...",
  "data": {
    "SHIRT-001": 42,
    "SHIRT-002": 17,
    "PANTS-001": 83,
    "HAT-001": 5,
    "SHOES-001": 61
  }
}
curl -L https://meridian-pivot-serverless-milkah.vercel.app/api/stock
{
  "total": 5,
  "stock": {
    "SHIRT-001": 42,
    "SHIRT-002": 17,
    "PANTS-001": 83,
    "HAT-001": 5,
    "SHOES-001": 61
  },
  "timestamp": "2026-08-20T..."
}
curl -L https://meridian-pivot-serverless-milkah.vercel.app/api/stock?sku=SHIRT-001
{
  "sku": "SHIRT-001",
  "stock": 42,
  "timestamp": "2026-08-20T..."
}
curl -L -X POST https://meridian-pivot-serverless-milkah.vercel.app/api/webhook -H "Content-Type: application/json" -d "{\"sku\":\"SHIRT-001\",\"stock\":99}"
{
  "received": true,
  "sku": "SHIRT-001",
  "stock": 99,
  "timestamp": "2026-08-20T..."
}
curl -L https://meridian-pivot-serverless-milkah.vercel.app/api/stock?sku=SHIRT-001
{
  "sku": "SHIRT-001",
  "stock": 99,
  "timestamp": "2026-08-20T..."
}
## Validation Rules

| Scenario | Response |
| :--- | :--- |
| Missing `sku` or `stock` | `400 Bad Request: Missing sku or stock` |
|GET request to webhook endpoint|405 Method Not Allowed|
|SKU not found in cache	|404 Not Found: SKU not found|

Status: ✅ Deployed and tested successfully on 2026-08-22.

## Project Structure
## Blocker Journal Summary

| Blocker | Resolution |
| :--- | :--- |
| Vercel returned `404: NOT_FOUND` | The function file was named `webhook` (no `.js` extension). Vercel requires `.js` to detect serverless functions. Renamed to `webhook.js`. |
| Windows `curl` returned `-H' is not recognized` | Windows Command Prompt doesn't support backslash `\` line breaks. Rewrote as a single-line command. |
| `{"error":"Missing sku or stock"}` | Windows CMD requires double quotes `"` and escaped inner quotes `\"` for JSON payloads. Fixed command syntax. |
| ES Module imports not working (`export default`) | Added `"type": "module"` to `package.json` to enable ES Module syntax. |
| Vercel not detecting functions | Realized functions must be in the `/api` folder with `.js` extension. Corrected file structure. |
| In-memory cache not shared across containers | Switched to **Upstash Redis** for persistent storage across all function invocations. |
| Deployment Protection blocking `curl` requests | Disabled Vercel Authentication in project settings to allow public access. |
| Upstash Redis not connecting | Added `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables in Vercel. |

Live Prototype
🔗 https://vercel.com/milkah/meridian-pivot-serverless
