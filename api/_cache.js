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
    // Use keys() instead of scan (simpler for small datasets)
    const allKeys = await redis.keys('stock:*');
    
    if (!allKeys || allKeys.length === 0) {
      console.log('No keys found with pattern stock:*');
      return {};
    }
    
    console.log(`Found ${allKeys.length} keys:`, allKeys);
    
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
    const keys = await redis.keys('stock:*');
    return keys ? keys.length : 0;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}
