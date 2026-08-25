// api/license/activate.js
// Endpoint for Adobe CEP extension to activate a license on a specific machine
const db = require('../../lib/db');
const { hashMachineId, createActivationToken } = require('../../lib/licenseUtils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { licenseKey, machineId, productCode } = req.body;

    if (!licenseKey || !machineId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: licenseKey and machineId'
      });
    }

    const cleanKey = String(licenseKey).trim().toUpperCase();
    const license = db.findLicenseByKey(cleanKey);

    if (!license) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบ License Key นี้ในระบบ กรุณาตรวจสอบความถูกต้อง'
      });
    }

    if (license.status !== 'Active') {
      return res.status(403).json({
        success: false,
        error: 'License Key นี้ถูกระงับการใช้งาน กรุณาติดต่อฝ่ายบริการลูกค้า'
      });
    }

    const hashedMid = hashMachineId(machineId);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Case 1: First activation or Reset machine (UNLOCKED)
    if (!license.hwidHash || license.hwid === 'UNLOCKED' || String(license.hwid).includes('UNLOCKED')) {
      db.updateLicense(cleanKey, {
        hwid: String(machineId).slice(0, 30),
        hwidHash: hashedMid,
        activatedAt: now,
        lastPing: now
      });
    } else {
      // Case 2: Already bound - check if this machine matches
      if (license.hwidHash !== hashedMid) {
        return res.status(403).json({
          success: false,
          error: 'License Key นี้ถูกใช้งานบนคอมพิวเตอร์เครื่องอื่นอยู่แล้ว หากต้องการย้ายเครื่อง กรุณาเข้าไปกดย้ายเครื่องในหน้าสมาชิก (Member Portal) หรือติดต่อแอดมิน'
        });
      }
      // Update last ping
      db.updateLicense(cleanKey, { lastPing: now });
    }

    // Create signed HMAC-SHA256 lease token (valid offline for 14 days)
    const token = createActivationToken(cleanKey, hashedMid, productCode || license.productName, 14);

    return res.status(200).json({
      success: true,
      message: 'เปิดใช้งาน License Key สำเร็จ',
      token: token,
      product: license.productName,
      customerEmail: license.email,
      expiresInDays: 14
    });
  } catch (err) {
    console.error('License activation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
