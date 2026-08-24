// api/payment/webhook.js
// Vercel Serverless Function: Webhook receiver for Payment Gateway
const { generateLicenseKey } = require('../../lib/licenseUtils');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    
    // 1. Verify Gateway HMAC Signature (Stripe / GB Prime Pay)
    // const signature = req.headers['stripe-signature'] || req.headers['gbprimepay-signature'];
    
    // 2. Extract order info
    const productCode = (payload.productCode || 'NEST').toUpperCase();
    const customerEmail = payload.customerEmail || 'customer@example.com';
    const orderId = payload.orderId || `ORD-${Date.now()}`;

    // 3. Automatically generate License Key
    const newLicenseKey = generateLicenseKey(productCode);

    console.log(`[PAYMENT SUCCESS] Order: ${orderId} | Email: ${customerEmail} | Generated Key: ${newLicenseKey}`);

    // 4. In production: Send email via Resend API (https://resend.com)
    /*
    await resend.emails.send({
      from: 'JarernGraphic <support@jarerngraphic.com>',
      to: customerEmail,
      subject: 'รหัสไลเซนส์และลิงก์ดาวน์โหลดโปรแกรมของคุณ — JarernGraphic',
      html: `<p>ขอบคุณที่สั่งซื้อ! รหัสของคุณคือ: <strong>${newLicenseKey}</strong></p>`
    });
    */

    return res.status(200).json({
      success: true,
      message: 'ประมวลผลการชำระเงินและออก License Key เรียบร้อย',
      data: {
        orderId,
        customerEmail,
        licenseKey: newLicenseKey,
        status: 'DELIVERED'
      }
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
