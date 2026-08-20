// api/_cache.js
// In-memory cache for stock data (Vercel serverless global state)

// This object persists across function invocations in the same container
// Data may reset on cold starts, but works for demos
const stockCache = {};

export function getStock(sku) {
  return stockCache[sku];
}

export function setStock(sku, stock) {
  stockCache[sku] = stock;
}

export function getAllStock() {
  return { ...stockCache };
}

export function updateStock(sku, stock) {
  stockCache[sku] = stock;
  console.log(`Cache updated: ${sku} = ${stock}`);
}

export function getCacheSize() {
  return Object.keys(stockCache).length;
}
