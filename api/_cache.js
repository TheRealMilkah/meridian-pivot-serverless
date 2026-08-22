// api/_cache.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getStock(sku) {
  const value = await redis.get(`stock:${sku}`);
  return value !== null ? Number(value) : undefined;
}

export async function setStock(sku, stock) {
  await redis.set(`stock:${sku}`, String(stock));
}

export async function getAllStock() {
  const keys = await redis.keys('stock:*');
  if (keys.length === 0) return {};
  
  const values = await redis.mget(...keys);
  const stockData = {};
  keys.forEach((key, index) => {
    const sku = key.replace('stock:', '');
    stockData[sku] = Number(values[index]);
  });
  return stockData;
}

export async function updateStock(sku, stock) {
  await redis.set(`stock:${sku}`, String(stock));
  console.log(`Cache updated: ${sku} = ${stock}`);
}

export async function getCacheSize() {
  const keys = await redis.keys('stock:*');
  return keys.length;
}
