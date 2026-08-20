// api/stock.js
import { getStock, getAllStock } from './_cache.js';

export default function handler(req, res) {
  const { sku } = req.query;

  // If no SKU provided, return all stock
  if (!sku) {
    const allStock = getAllStock();
    return res.status(200).json({
      total: Object.keys(allStock).length,
      stock: allStock,
      timestamp: new Date().toISOString()
    });
  }

  // Check if SKU exists in cache
  const stock = getStock(sku);

  if (stock === undefined) {
    console.log(`SKU not found: ${sku}`);
    return res.status(404).json({
      error: 'SKU not found',
      sku,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({
    sku,
    stock,
    timestamp: new Date().toISOString()
  });
}
