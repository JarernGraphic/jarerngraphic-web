// api/auth/verify-otp.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'กรุณาระบุอีเมลและรหัส OTP' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const verification = db.verifyOtp(cleanEmail, otp);

    if (!verification.valid) {
      let msg = 'รหัส OTP ไม่ถูกต้อง';
      if (verification.reason === 'OTP_EXPIRED') msg = 'รหัส OTP หมดอายุแล้ว กรุณากดขอรหัสใหม่';
      if (verification.reason === 'OTP_NOT_FOUND') msg = 'ไม่พบคำขอรหัส OTP หรือหมดอายุแล้ว';
      return res.status(400).json({ success: false, error: msg });
    }

    // Get all user licenses and orders
    const licenses = db.getLicensesByEmail(cleanEmail);
    const orders = db.getOrdersByEmail(cleanEmail);

    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        email: cleanEmail,
        totalLicenses: licenses.length,
        totalOrders: orders.length
      },
      licenses: licenses,
      orders: orders
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
