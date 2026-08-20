// api/_cache.js
// Shared in-memory cache for stock data
// This cache is shared across all functions in the same Vercel deployment
// For production, replace with Vercel KV or Redis for persistence

// Create a single cache instance that persists across requests
// In Vercel serverless, this object stays in memory between invocations
// of the same container, making it shared across functions
const stockCache = {};

/**
 * Get stock for a specific SKU
 * @param {string} sku - The SKU to look up
 * @returns {number|undefined} - The stock count or undefined if not found
 */
export function getStock(sku) {
  const value = stockCache[sku];
  return value !== undefined ? Number(value) : undefined;
}

/**
 * Set stock for a specific SKU
 * @param {string} sku - The SKU to set
 * @param {number} stock - The stock count
 */
export function setStock(sku, stock) {
  stockCache[sku] = Number(stock);
  console.log(`Cache set: ${sku} = ${stock}`);
}

/**
 * Get all stock data
 * @returns {Object} - All SKU-stock pairs
 */
export function getAllStock() {
  return { ...stockCache };
}

/**
 * Update stock for a specific SKU (alias for setStock)
 * @param {string} sku - The SKU to update
 * @param {number} stock - The stock count
 */
export function updateStock(sku, stock) {
  const oldValue = stockCache[sku];
  stockCache[sku] = Number(stock);
  console.log(`Cache updated: ${sku} = ${oldValue || 'null'} → ${stock}`);
}

/**
 * Get the number of SKUs in the cache
 * @returns {number} - Cache size
 */
export function getCacheSize() {
  return Object.keys(stockCache).length;
}

/**
 * Clear all cache data (useful for testing)
 */
export function clearCache() {
  const keys = Object.keys(stockCache);
  keys.forEach(key => delete stockCache[key]);
  console.log(`Cache cleared: ${keys.length} items removed`);
}

/**
 * Check if a SKU exists in cache
 * @param {string} sku - The SKU to check
 * @returns {boolean} - True if SKU exists
 */
export function hasStock(sku) {
  return stockCache[sku] !== undefined;
}

// For debugging - log cache contents
export function debugCache() {
  console.log('Current cache:', JSON.stringify(stockCache, null, 2));
}
