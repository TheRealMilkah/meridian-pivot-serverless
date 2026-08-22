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
  try {
    // Use scan instead of keys for better reliability
    const keys = await redis.scan(0, { match: 'stock:*', count: 100 });
    const allKeys = keys[1];
    
    if (!allKeys || allKeys.length === 0) {
      return {};
    }
    
    const values = await redis.mget(allKeys);
    const stockData = {};
    
    allKeys.forEach((key, index) => {
      const sku = key.replace('stock:', '');
      stockData[sku] = Number(values[index]);
    });
    
    return stockData;
  } catch (error) {
    console.error('Error getting all stock:', error);
    return {};
  }
}

export async function updateStock(sku, stock) {
  await redis.set(`stock:${sku}`, String(stock));
  console.log(`Cache updated: ${sku} = ${stock}`);
}

export async function getCacheSize() {
  try {
    const keys = await redis.scan(0, { match: 'stock:*', count: 1000 });
    const allKeys = keys[1];
    return allKeys ? allKeys.length : 0;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}
