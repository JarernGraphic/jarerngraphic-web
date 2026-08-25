// api/payment/confirm.js
const db = require('../../lib/db');
const { generateLicenseKey } = require('../../lib/licenseUtils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const orders = db.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.paymentStatus === 'PAID' && order.licenseKey) {
      return res.status(200).json({
        success: true,
        message: 'Order already paid',
        order: order,
        licenseKey: order.licenseKey
      });
    }

    // Generate real license key
    const productSlug = order.productId.replace('prod-', '');
    const newLicenseKey = generateLicenseKey(productSlug);

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Save License into DB
    const newLicense = {
      key: newLicenseKey,
      productId: order.productId,
      productName: order.productName,
      email: order.customerEmail,
      phone: order.customerPhone,
      hwid: 'UNLOCKED (พร้อมเปิดใช้งานบนเครื่องแรก)',
      hwidHash: null,
      activatedAt: null,
      lastPing: null,
      status: 'Active',
      orderId: order.id,
      createdAt: now,
      migrationsCount: 0
    };

    db.createLicense(newLicense);

    // Update Order Status
    const updatedOrder = db.updateOrder(order.id, {
      paymentStatus: 'PAID',
      paidAt: now,
      licenseKey: newLicenseKey
    });

    // Update Product Sales Count
    const product = db.getProductBySlug(order.productId);
    if (product) {
      db.saveProduct({
        ...product,
        salesCount: (product.salesCount || 0) + 1
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment confirmed & License key generated successfully',
      order: updatedOrder,
      licenseKey: newLicenseKey,
      downloadUrl: product ? product.downloadUrl : '/downloads/latest.zip'
    });
  } catch (err) {
    console.error('Payment confirm error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
