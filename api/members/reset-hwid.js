// api/members/reset-hwid.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, key } = req.body;
    if (!email || !key) {
      return res.status(400).json({ success: false, error: 'Email and License Key are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const license = db.findLicenseByKey(key);

    if (!license) {
      return res.status(404).json({ success: false, error: 'ไม่พบ License Key ในระบบ' });
    }

    if (String(license.email).trim().toLowerCase() !== cleanEmail) {
      return res.status(403).json({ success: false, error: 'คุณไม่มีสิทธิ์จัดการ License Key นี้' });
    }

    // Reset HWID to UNLOCKED and increment migrations count
    const updated = db.updateLicense(key, {
      hwid: 'UNLOCKED (พร้อมเปิดใช้งานบนเครื่องใหม่)',
      hwidHash: null,
      migrationsCount: (license.migrationsCount || 0) + 1,
      lastMigrationAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });

    return res.status(200).json({
      success: true,
      message: `ปลดล็อกเครื่องสำหรับคีย์ ${key} สำเร็จแล้ว คุณสามารถนำคีย์ไปกรอกบนเครื่องใหม่ได้ทันทีครับ`,
      license: updated
    });
  } catch (err) {
    console.error('Reset HWID error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
