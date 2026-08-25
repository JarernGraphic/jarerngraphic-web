// api/admin/stats.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  try {
    const stats = db.getStats();
    const products = db.getProducts();
    const licenses = db.getLicenses();
    const orders = db.getOrders();
    const settings = db.getSettings();

    return res.status(200).json({
      success: true,
      stats: stats,
      products: products,
      licenses: licenses,
      orders: orders,
      settings: {
        storeName: settings.storeName,
        promptpayId: settings.promptpayId,
        promptpayName: settings.promptpayName,
        adminEmail: settings.adminEmail,
        supportLine: settings.supportLine,
        version: settings.version
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
