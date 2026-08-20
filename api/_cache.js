// Shared in-memory cache for stock data
const stockCache = new Map();

export function getStock(sku) {
  return stockCache.get(sku);
}

export function setStock(sku, stock) {
  stockCache.set(sku, stock);
}

export function getAllStock() {
  return Object.fromEntries(stockCache);
}

export function updateStock(sku, stock) {
  stockCache.set(sku, stock);
  console.log(`Cache updated: ${sku} = ${stock}`);
}

export function getCacheSize() {
  return stockCache.size;
}
