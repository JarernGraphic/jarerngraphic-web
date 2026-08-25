// api/payment/create-checkout.js
const db = require('../../lib/db');
const { generatePromptPayPayload } = require('../../lib/promptpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { productId, email, phone } = req.body;
    if (!productId || !email) {
      return res.status(400).json({ success: false, error: 'กรุณากรอกข้อมูลสินค้าและอีเมลให้ครบถ้วน' });
    }

    const product = db.getProductBySlug(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'ไม่พบรายการสินค้าที่เลือก' });
    }

    const settings = db.getSettings();
    const promptpayId = settings.promptpayId || '0812345678';
    const amount = Number(product.price);

    // Generate Genuine EMVCo PromptPay QR string
    const qrPayload = generatePromptPayPayload(promptpayId, amount);
    
    // Standard High-Res QR code image endpoint
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(qrPayload)}`;

    const orderId = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      customerEmail: String(email).trim().toLowerCase(),
      customerPhone: phone ? String(phone).trim() : '',
      productId: product.id,
      productName: product.name,
      amount: amount,
      paymentMethod: 'PromptPay QR',
      paymentStatus: 'PENDING',
      qrPayload: qrPayload,
      qrImageUrl: qrImageUrl,
      promptpayReceiver: settings.promptpayName,
      promptpayTarget: promptpayId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      licenseKey: null
    };

    db.createOrder(newOrder);

    return res.status(200).json({
      success: true,
      order: newOrder,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        formattedPrice: `฿${product.price.toLocaleString()}`
      }
    });
  } catch (err) {
    console.error('Create checkout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
