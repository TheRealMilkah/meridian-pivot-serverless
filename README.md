# Meridian Pivot – Serverless Webhook Receiver

**Sprint 2 | Northstar Retail Co. | Inventory Sync Service**

## Overview

This is a serverless webhook receiver built as the **Day 1–2 solo mini-prototype** for "The Meridian Pivot" simulation.

It accepts `POST` requests containing inventory stock updates (SKU + stock quantity) and validates the payload. This prototype directly supports the **Day 4 pivot**—when the client kills polling and forces a switch to webhooks, this receiver is ready to go.

## Tech Stack

- **Platform:** [Vercel](https://vercel.com) (Serverless Functions)
- **Runtime:** Node.js
- **Deployment:** GitHub-connected (auto-deploys on `main` push)

## Project Structure

## How It Works

The function `api/webhook.js`:

1. Accepts only `POST` requests.
2. Parses the JSON body for `sku` and `stock`.
3. Validates that both fields exist.
4. Logs the update to the Vercel console.
5. Returns a `200 OK` response with a timestamp.

## Deployment

1. Clone this repository.
2. Connect your GitHub repo to [Vercel](https://vercel.com).
3. Vercel will auto-deploy on every push to `main`.
4. Your endpoint will be live at:  
   `https://[your-project].vercel.app/api/webhook`

## Testing the Endpoint

### Using `curl` (Windows Command Prompt)

```cmd
curl -X POST https://meridian-pivot-serverless.vercel.app/api/webhook -H "Content-Type: application/json" -d "{\"sku\":\"SHIRT-001\",\"stock\":42}"
curl -X POST https://meridian-pivot-serverless.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"sku":"SHIRT-001","stock":42}'
curl -X POST https://meridian-pivot-serverless.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"sku":"SHIRT-001","stock":42}'
  {"received":true,"sku":"SHIRT-001","stock":42,"timestamp":"2026-08-17T09:29:47.551Z"}
