// api/stock.js
import { getStock, getAllStock } from './_cache.js';

export default async function handler(req, res) {
  const { sku } = req.query;

  if (!sku) {
    const allStock = await getAllStock();
    return res.status(200).json({
      total: Object.keys(allStock).length,
      stock: allStock,
      timestamp: new Date().toISOString()
    });
  }

  const stock = await getStock(sku);

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
