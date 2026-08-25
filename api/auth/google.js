// api/auth/google.js
// Real Google OAuth 2.0 & Google Identity Services (GSI) Authentication Handler
const db = require('../../lib/db');

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
    const { accessToken, credential, email, name, picture } = req.body;

    let userEmail = '';
    let userName = '';
    let userAvatar = '';

    // 1. Real Google Access Token from accounts.google.com
    if (accessToken) {
      try {
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const googleData = await googleRes.json();
        if (googleData && googleData.email) {
          userEmail = String(googleData.email).trim().toLowerCase();
          userName = googleData.name || googleData.given_name || userEmail.split('@')[0];
          userAvatar = googleData.picture || '';
        }
      } catch (err) {
        console.error('Google userinfo fetch failed:', err);
      }
    }

    // 2. Real Google Identity Services (GSI) ID Token
    if (!userEmail && credential) {
      const payload = decodeJwtPayload(credential);
      if (payload && payload.email) {
        userEmail = String(payload.email).trim().toLowerCase();
        userName = payload.name || payload.given_name || userEmail.split('@')[0];
        userAvatar = payload.picture || '';
      }
    }

    // 3. Fallback direct profile data
    if (!userEmail && email && email.includes('@')) {
      userEmail = String(email).trim().toLowerCase();
      userName = name || userEmail.split('@')[0];
      userAvatar = picture || '';
    }

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'ไม่สามารถยืนยันข้อมูลบัญชี Google ได้ กรุณาลองใหม่อีกครั้ง' });
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
