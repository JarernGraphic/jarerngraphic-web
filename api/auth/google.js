// api/auth/google.js
// Google OAuth & Google Identity Services (GSI) Authentication Handler
const db = require('../../lib/db');

/**
 * Decode JWT token payload without external heavy dependencies
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payloadStr);
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { credential, email, name, picture } = req.body;

    let userEmail = '';
    let userName = '';
    let userAvatar = '';

    // Case 1: Real Google Identity Services (GSI) credential token
    if (credential) {
      const payload = decodeJwtPayload(credential);
      if (!payload || !payload.email) {
        return res.status(400).json({ success: false, error: 'Google Credential token is invalid' });
      }

      userEmail = String(payload.email).trim().toLowerCase();
      userName = payload.name || payload.given_name || userEmail.split('@')[0];
      userAvatar = payload.picture || '';
    } 
    // Case 2: Direct Google OAuth profile data
    else if (email && email.includes('@')) {
      userEmail = String(email).trim().toLowerCase();
      userName = name || userEmail.split('@')[0];
      userAvatar = picture || '';
    } else {
      return res.status(400).json({ success: false, error: 'กรุณาระบุข้อมูลบัญชี Google ให้ถูกต้อง' });
    }

    // Retrieve all customer's software licenses and orders from database
    const licenses = db.getLicensesByEmail(userEmail);
    const orders = db.getOrdersByEmail(userEmail);

    return res.status(200).json({
      success: true,
      message: `เข้าสู่ระบบด้วย Google สำเร็จ: ${userEmail}`,
      authProvider: 'google',
      user: {
        email: userEmail,
        name: userName,
        avatar: userAvatar,
        totalLicenses: licenses.length,
        totalOrders: orders.length
      },
      licenses: licenses,
      orders: orders
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
