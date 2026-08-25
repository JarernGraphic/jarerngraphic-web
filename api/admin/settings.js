// api/admin/settings.js
const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { promptpayId, promptpayName, supportLine, adminPass, googleClientId } = req.body;
      const updates = {};
      if (promptpayId) updates.promptpayId = String(promptpayId).trim();
      if (promptpayName) updates.promptpayName = String(promptpayName).trim();
      if (supportLine) updates.supportLine = String(supportLine).trim();
      if (googleClientId !== undefined) updates.googleClientId = String(googleClientId).trim();
      if (adminPass && adminPass.length >= 6) updates.adminPass = String(adminPass).trim();

      const newSettings = db.updateSettings(updates);
      return res.status(200).json({
        success: true,
        message: 'บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว',
        settings: newSettings
      });
    } catch (err) {
      console.error('Settings update error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET
  const settings = db.getSettings();
  return res.status(200).json({
    success: true,
    settings: {
      storeName: settings.storeName,
      promptpayId: settings.promptpayId,
      promptpayName: settings.promptpayName,
      adminEmail: settings.adminEmail,
      supportLine: settings.supportLine,
      googleClientId: settings.googleClientId || '',
      version: settings.version
    }
  });
};
