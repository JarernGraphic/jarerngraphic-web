// api/license/deactivate.js
// Endpoint to deactivate/release a license from a machine so it can be moved
const db = require('../../lib/db');
const { hashMachineId } = require('../../lib/licenseUtils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { licenseKey, machineId } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ success: false, error: 'Missing licenseKey parameter' });
    }

    const cleanKey = String(licenseKey).trim().toUpperCase();
    const license = db.findLicenseByKey(cleanKey);

    if (!license) {
      return res.status(404).json({ success: false, error: 'License key not found' });
    }

    // Verify machine if provided
    if (machineId && license.hwidHash) {
      const hashedMid = hashMachineId(machineId);
      if (license.hwidHash !== hashedMid) {
        return res.status(403).json({ success: false, error: 'Cannot deactivate: Machine ID mismatch' });
      }
    }

    // Reset HWID and increment migration count
    const updated = db.updateLicense(cleanKey, {
      hwid: 'UNLOCKED (พร้อมเปิดใช้งานบนเครื่องใหม่)',
      hwidHash: null,
      migrationsCount: (license.migrationsCount || 0) + 1,
      lastMigrationAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });

    return res.status(200).json({
      success: true,
      message: 'ปลดล็อก License Key เรียบร้อยแล้ว สามารถนำไปใช้งานบนเครื่องใหม่ได้ทันที',
      key: cleanKey
    });
  } catch (err) {
    console.error('License deactivation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
