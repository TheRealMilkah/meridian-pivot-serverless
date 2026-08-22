export async function getAllStock() {
  try {
    console.log('🔍 Scanning for keys: stock:*');
    const keys = await redis.scan(0, { match: 'stock:*', count: 100 });
    console.log('📋 Scan result:', keys);
    
    const allKeys = keys[1];
    
    if (!allKeys || allKeys.length === 0) {
      console.log('⚠️ No keys found');
      return {};
    }
    
    console.log(`✅ Found ${allKeys.length} keys`);
    const values = await redis.mget(allKeys);
    const stockData = {};
    
    allKeys.forEach((key, index) => {
      const sku = key.replace('stock:', '');
      stockData[sku] = Number(values[index]);
    });
    
    console.log('📊 Stock data:', stockData);
    return stockData;
  } catch (error) {
    console.error('❌ Error getting all stock:', error);
    return {};
  }
}
