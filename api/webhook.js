import { updateStock } from './_cache.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sku, stock } = req.body || {};

  if (!sku || stock === undefined) {
    return res.status(400).json({ error: 'Missing sku or stock' });
  }

  // Store in the shared cache
  updateStock(sku, stock);
  console.log(`📦 Webhook received: ${sku} = ${stock}`);

  return res.status(200).json({
    received: true,
    sku,
    stock,
    timestamp: new Date().toISOString()
  });
}
