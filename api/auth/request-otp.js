// api/auth/request-otp.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'กรุณาระบุอีเมลที่ถูกต้อง' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    
    // Check if customer has any licenses or orders
    const userLicenses = db.getLicensesByEmail(cleanEmail);
    const userOrders = db.getOrdersByEmail(cleanEmail);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    db.saveOtp(cleanEmail, otpCode);

    return res.status(200).json({
      success: true,
      message: `ส่งรหัส OTP 6 หลักไปยัง ${cleanEmail} เรียบร้อยแล้ว`,
      email: cleanEmail,
      demoOtp: otpCode,
      hasPurchases: userLicenses.length > 0 || userOrders.length > 0
    });
  } catch (err) {
    console.error('Request OTP error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
