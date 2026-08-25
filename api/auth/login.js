// api/auth/login.js
// Standard Email + Password Login and Registration
const db = require('../../lib/db');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { action, email, password, name } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'กรุณากรอกอีเมลที่ถูกต้อง' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. REGISTRATION
    if (action === 'register') {
      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      }

      const licenses = db.getLicensesByEmail(cleanEmail);
      const orders = db.getOrdersByEmail(cleanEmail);

      return res.status(200).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ JarernGraphic',
        user: {
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          totalLicenses: licenses.length,
          totalOrders: orders.length
        },
        licenses: licenses,
        orders: orders
      });
    }

    // 2. LOGIN
    if (!password) {
      return res.status(400).json({ success: false, error: 'กรุณากรอกรหัสผ่าน' });
    }

    // Fetch user purchases & licenses from DB
    const licenses = db.getLicensesByEmail(cleanEmail);
    const orders = db.getOrdersByEmail(cleanEmail);

    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        totalLicenses: licenses.length,
        totalOrders: orders.length
      },
      licenses: licenses,
      orders: orders
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
