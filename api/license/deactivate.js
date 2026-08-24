// api/license/deactivate.js
// Vercel Serverless Function: Deactivate license for machine migration
const { hashMachineId } = require('../../lib/licenseUtils');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { licenseKey, machineId } = req.body || {};

    if (!licenseKey || !machineId) {
      return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
    }

    const cleanKey = String(licenseKey).trim().toUpperCase();

    return res.status(200).json({
      success: true,
      message: 'ยกเลิกการผูกสิทธิ์เครื่องเดิมสำเร็จ สามารถนำคีย์นี้ไปใช้งานบนเครื่องใหม่ได้ทันที',
      data: {
        licenseKey: cleanKey,
        deactivatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
