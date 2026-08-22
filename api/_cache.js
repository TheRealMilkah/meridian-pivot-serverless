// api/_cache.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// ... (keep getStock, setStock, updateStock, getCacheSize as they are) ...

export async function getAllStock() {
  const stockData = {};
  let cursor = 0;

  do {
    // Scan for keys with the "stock:" prefix
    const response = await redis.scan(cursor, {
      match: 'stock:*',
      count: 100 // Adjust count as needed
    });
    cursor = response[0];
    const keys = response[1];

    if (keys.length > 0) {
      // Use mget to fetch all values in one go
      const values = await redis.mget(keys);
      keys.forEach((key, index) => {
        const sku = key.replace('stock:', '');
        stockData[sku] = Number(values[index]);
      });
    }
  } while (cursor !== 0);

  return stockData;
}
