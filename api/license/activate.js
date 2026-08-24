// api/license/activate.js
// Vercel Serverless Function: Activate license for CEP Extension
const { hashMachineId, createActivationToken } = require('../../lib/licenseUtils');

module.exports = async function handler(req, res) {
  // Set CORS headers so CEP panel can call it
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { licenseKey, machineId, productCode } = req.body || {};

    if (!licenseKey || !machineId) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ License Key และ Machine ID ให้ครบถ้วน'
      });
    }

    const cleanKey = String(licenseKey).trim().toUpperCase();
    const cleanMachineId = String(machineId).trim();
    const cleanProduct = (productCode || 'NEST').toUpperCase();

    // Basic format validation: e.g. JG-XXXX-XXXX-XXXX-XXXX
    if (!cleanKey.startsWith('JG-')) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบ License Key ไม่ถูกต้อง (ต้องขึ้นต้นด้วย JG-)'
      });
    }

    // Hash the Hardware ID
    const machineIdHash = hashMachineId(cleanMachineId);

    // Create 14-day signed offline lease token
    const token = createActivationToken(cleanKey, machineIdHash, cleanProduct, 14);

    return res.status(200).json({
      success: true,
      message: 'เปิดใช้งานไลเซนส์สำเร็จ',
      data: {
        licenseKey: cleanKey,
        productCode: cleanProduct,
        activatedAt: new Date().toISOString(),
        offlineGraceDays: 14,
        token: token
      }
    });

  } catch (error) {
    console.error('Activation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบไลเซนส์',
      error: error.message
    });
  }
};
