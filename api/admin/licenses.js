// api/admin/licenses.js
const db = require('../../lib/db');
const { generateLicenseKey } = require('../../lib/licenseUtils');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { action, key, productId, email, phone } = req.body;

      if (action === 'generate') {
        if (!productId || !email) {
          return res.status(400).json({ success: false, error: 'Product and Email are required' });
        }
        const product = db.getProductBySlug(productId) || { name: productId, slug: productId };
        const newKey = generateLicenseKey(product.slug || 'TOOL');
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

        const newLicense = {
          key: newKey,
          productId: product.id || productId,
          productName: product.name,
          email: String(email).trim().toLowerCase(),
          phone: phone ? String(phone).trim() : '',
          hwid: 'UNLOCKED (พร้อมเปิดใช้งานบนเครื่องแรก)',
          hwidHash: null,
          activatedAt: null,
          lastPing: null,
          status: 'Active',
          orderId: `MANUAL-${Date.now()}`,
          createdAt: now,
          migrationsCount: 0
        };

        db.createLicense(newLicense);
        return res.status(200).json({ success: true, message: 'สร้าง License Key สำเร็จ', license: newLicense });
      }

      if (action === 'revoke') {
        if (!key) return res.status(400).json({ success: false, error: 'Key is required' });
        const lic = db.findLicenseByKey(key);
        if (!lic) return res.status(404).json({ success: false, error: 'License not found' });

        const newStatus = lic.status === 'Active' ? 'Revoked' : 'Active';
        const updated = db.updateLicense(key, { status: newStatus });
        return res.status(200).json({ success: true, message: `เปลี่ยนสถานะคีย์เป็น ${newStatus} สำเร็จ`, license: updated });
      }

      if (action === 'reset_hwid') {
        if (!key) return res.status(400).json({ success: false, error: 'Key is required' });
        const lic = db.findLicenseByKey(key);
        if (!lic) return res.status(404).json({ success: false, error: 'License not found' });

        const updated = db.updateLicense(key, {
          hwid: 'UNLOCKED (พร้อมเปิดใช้งานบนเครื่องใหม่)',
          hwidHash: null,
          migrationsCount: (lic.migrationsCount || 0) + 1,
          lastMigrationAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        });
        return res.status(200).json({ success: true, message: `ปลดล็อก HWID ของ ${key} เรียบร้อย`, license: updated });
      }

      return res.status(400).json({ success: false, error: 'Invalid action' });
    } catch (err) {
      console.error('License admin error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET all licenses
  const licenses = db.getLicenses();
  return res.status(200).json({ success: true, licenses });
};
