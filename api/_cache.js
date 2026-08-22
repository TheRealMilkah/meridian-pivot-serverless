// api/_cache.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// ... (keep your existing getStock, setStock, updateStock functions as they are) ...

export async function getAllStock() {
  try {
    const stockData = {};
    let cursor = 0;

    do {
      // Scan for keys with the "stock:" prefix
      const [nextCursor, keys] = await redis.scan(cursor, { match: 'stock:*', count: 100 });
      cursor = nextCursor;

      if (keys.length > 0) {
        // Use mget to fetch all values in one go
        const values = await redis.mget(keys);
        keys.forEach((key, index) => {
          const sku = key.replace('stock:', '');
          stockData[sku] = Number(values[index]);
        });
      }
    } while (cursor !== 0); // Continue until the scan is complete

    return stockData;
  } catch (error) {
    console.error('Error getting all stock:', error);
    return {};
  }
}

export async function getCacheSize() {
  try {
    let count = 0;
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, { match: 'stock:*', count: 1000 });
      cursor = nextCursor;
      count += keys.length;
    } while (cursor !== 0);
    return count;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}
