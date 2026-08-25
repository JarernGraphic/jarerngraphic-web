// api/products/index.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, sku, slug, price, originalPrice, apps, subtitle, description, chips } = req.body;
      if (!name || !price) {
        return res.status(400).json({ success: false, error: 'Name and Price are required' });
      }

      const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newProduct = {
        id: `prod-${generatedSlug}`,
        sku: sku || `JG-${generatedSlug.toUpperCase().slice(0, 6)}`,
        name: String(name).trim(),
        slug: generatedSlug,
        tag: 'โปรแกรมใหม่ล่าสุด',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.4),
        apps: apps || 'Photoshop & Illustrator CC 2021+',
        subtitle: subtitle || `${name} Extension Panel`,
        description: description || 'โปรแกรมเสริมสำหรับเพิ่มประสิทธิภาพการทำงานบน Adobe',
        chips: Array.isArray(chips) ? chips : (chips ? chips.split(',').map(s => s.trim()) : ['Adobe CEP', 'Lifetime License']),
        symbol: name.slice(0, 2).toUpperCase(),
        theme: 'display-jg-1',
        status: 'Active',
        salesCount: 0,
        downloadUrl: `/downloads/${generatedSlug}-latest.zip`
      };

      db.saveProduct(newProduct);
      return res.status(200).json({ success: true, message: `เพิ่มโปรแกรม ${name} เข้าสู่ระบบสำเร็จ`, product: newProduct });
    } catch (err) {
      console.error('Save product error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET
  const products = db.getProducts();
  return res.status(200).json({ success: true, products });
};
