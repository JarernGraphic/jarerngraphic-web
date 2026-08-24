// api/payment/create-checkout.js
// Vercel Serverless Function: Create payment session (PromptPay QR / Gateway)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { productId, productName, price, customerEmail, customerName } = req.body || {};

    if (!productId || !price || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุข้อมูลสินค้าและอีเมลผู้ซื้อให้ครบถ้วน'
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Structure ready for Stripe TH / GB Prime Pay / Omise PromptPay QR integration
    return res.status(200).json({
      success: true,
      message: 'สร้างรายการสั่งซื้อสำเร็จ',
      data: {
        orderId,
        productId,
        productName: productName || 'ECUT Plugin',
        amount: Number(price),
        currency: 'THB',
        customerEmail,
        paymentMethod: 'PROMPTPAY',
        // In production, this URL will be the Gateway checkout or dynamic QR image URL
        status: 'PENDING_PAYMENT'
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
