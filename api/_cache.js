// api/_cache.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getStock(sku) {
  try {
    const value = await redis.get(`stock:${sku}`);
    return value !== null ? Number(value) : undefined;
  } catch (error) {
    console.error(`Error getting stock for ${sku}:`, error);
    return undefined;
  }
}

export async function setStock(sku, stock) {
  try {
    await redis.set(`stock:${sku}`, stock);
  } catch (error) {
    console.error(`Error setting stock for ${sku}:`, error);
  }
}

export async function updateStock(sku, stock) {
  return setStock(sku, stock);
}

// ... keep your existing getAllStock and getCacheSize below ...
