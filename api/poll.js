// api/poll.js
import { updateStock, getCacheSize } from './_cache.js';

function generateMockStock() {
  const skus = ['SHIRT-001', 'SHIRT-002', 'PANTS-001', 'HAT-001', 'SHOES-001'];
  const stockData = {};
  skus.forEach(sku => {
    stockData[sku] = Math.floor(Math.random() * 101);
  });
  return stockData;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('🔄 Polling warehouse API for stock updates...');

    const stockData = generateMockStock();
    
    let updatedCount = 0;
    for (const [sku, stock] of Object.entries(stockData)) {
      await updateStock(sku, stock);
      updatedCount++;
    }

    const cacheSize = await getCacheSize();
    console.log(`✅ Poll complete: Updated ${updatedCount} SKUs. Cache size: ${cacheSize}`);

    return res.status(200).json({
      success: true,
      updated: updatedCount,
      cacheSize: cacheSize,
      timestamp: new Date().toISOString(),
      data: stockData
    });

  } catch (error) {
    console.error('❌ Polling error:', error);
    return res.status(500).json({ 
      error: 'Failed to poll warehouse API',
      details: error.message 
    });
  }
}
