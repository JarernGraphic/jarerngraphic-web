// lib/db.js
// Persistent Database Engine for JarernGraphic Store & Licensing Platform
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Realistic Seed Data
const INITIAL_DATA = {
  settings: {
    storeName: 'JarernGraphic',
    promptpayId: '0812345678', // Changeable in Admin Dashboard
    promptpayName: 'เจริญกราฟิก (JarernGraphic Store)',
    adminEmail: 'admin@jarerngraphic.com',
    adminPass: 'admin1234',
    supportLine: '@jarerngraphic',
    version: '2.5.0'
  },
  products: [
    {
      id: 'prod-saiscale',
      sku: 'JG-SAISCALE-01',
      name: 'saiscale',
      slug: 'saiscale',
      tag: 'ยอดนิยม · บอกขนาด & สเกล',
      price: 2490,
      originalPrice: 3500,
      apps: 'Photoshop & Illustrator CC 2021+',
      subtitle: 'Auto Dimensions & Scale CEP Panel',
      description: 'วาดเส้นบอกขนาด (Dimensions), คำนวณขยาย Canvas, พิมพ์ตัวเลข และ Export JPG อัตโนมัติใน Photoshop & AI',
      chips: ['Auto Dimensions', 'Canvas Expand', 'Batch JPG Export', 'Watermark System'],
      symbol: 'Ss',
      theme: 'display-saiscale',
      status: 'Active',
      salesCount: 68,
      downloadUrl: '/downloads/saiscale-latest.zip'
    },
    {
      id: 'prod-eznest',
      sku: 'JG-EZNEST-02',
      name: 'ez nest',
      slug: 'eznest',
      tag: 'จัดวางไฟล์ตัด · ประหยัดวัสดุ',
      price: 1390,
      originalPrice: 1990,
      apps: 'Illustrator CC 2021+',
      subtitle: 'True-Shape Nesting Optimizer',
      description: 'True-Shape Nesting จัดวางชิ้นงานอัตโนมัติแนบสนิทตามรูปทรงจริง ประหยัดพื้นที่วัสดุสูงสุด 90%',
      chips: ['True-Shape', 'Laser / CNC', 'Yield 90%+', 'Multi-Sheet'],
      symbol: 'EZ',
      theme: 'display-eznest',
      status: 'Active',
      salesCount: 54,
      downloadUrl: '/downloads/eznest-latest.zip'
    },
    {
      id: 'prod-cutprep',
      sku: 'JG-CUTPREP-03',
      name: 'jarerngraphic CutPrep',
      slug: 'cutprep',
      tag: 'เตรียมไฟล์ตัด & CNC',
      price: 1190,
      originalPrice: 1790,
      apps: 'Illustrator CC 2021+',
      subtitle: 'CutPrep & Clean Path Extension',
      description: 'ล้างเส้นซ้ำ รวม Path ตรวจสอบจุดเปิด และส่งออกไฟล์ตัด DXF/PDF พร้อมขึ้นเครื่องทันที',
      chips: ['Clean Paths', 'DXF / PDF', 'Join Points', 'Laser Guard'],
      symbol: 'JG',
      theme: 'display-jg-1',
      status: 'Active',
      salesCount: 38,
      downloadUrl: '/downloads/cutprep-latest.zip'
    },
    {
      id: 'prod-costboard',
      sku: 'JG-PRINTCOST-04',
      name: 'jarerngraphic Print & Cost',
      slug: 'costboard',
      tag: 'มาร์กพิมพ์ตัด & คิดต้นทุน',
      price: 1290,
      originalPrice: 1890,
      apps: 'Photoshop & Illustrator CC 2021+',
      subtitle: 'PrintMark, Bleed & Cost Estimation Suite',
      description: 'สร้าง Registration Mark, Bleed อัตโนมัติ และคำนวณพื้นที่วัสดุจริงเพื่อสรุปราคาต่อชิ้น',
      chips: ['Print & Cut', 'Auto Bleed', 'Cost Estimator', 'Yield Tracker'],
      symbol: 'JG',
      theme: 'display-jg-2',
      status: 'Active',
      salesCount: 42,
      downloadUrl: '/downloads/costboard-latest.zip'
    }
  ],
  licenses: [
    {
      key: 'JG-SAIS-9A2F-4B1C-8E7D',
      productId: 'prod-saiscale',
      productName: 'saiscale',
      email: 'somchai.studio@gmail.com',
      phone: '0891234567',
      hwid: 'WIN-DESKTOP-89F2A1',
      hwidHash: 'a7c8e9f2b4...',
      activatedAt: '2026-08-20 14:22:10',
      lastPing: '2026-08-25 10:15:00',
      status: 'Active',
      orderId: 'ORD-202608-1001',
      migrationsCount: 0
    },
    {
      key: 'JG-NEST-88CD-11FA-992B',
      productId: 'prod-eznest',
      productName: 'ez nest',
      email: 'laser.craft.bkk@gmail.com',
      phone: '0819876543',
      hwid: 'MAC-M3PRO-33E1D4',
      hwidHash: 'b5e1c8d4f0...',
      activatedAt: '2026-08-22 09:45:00',
      lastPing: '2026-08-25 11:30:00',
      status: 'Active',
      orderId: 'ORD-202608-1002',
      migrationsCount: 1
    },
    {
      key: 'JG-PREP-77AA-55DF-2201',
      productId: 'prod-cutprep',
      productName: 'jarerngraphic CutPrep',
      email: 'signage.pro@yahoo.com',
      phone: '0865551234',
      hwid: 'UNLOCKED',
      hwidHash: null,
      activatedAt: '2026-08-23 16:10:00',
      lastPing: null,
      status: 'Active',
      orderId: 'ORD-202608-1003',
      migrationsCount: 2
    },
    {
      key: 'JG-COST-1029-3388-7744',
      productId: 'prod-costboard',
      productName: 'jarerngraphic Print & Cost',
      email: 'somchai.studio@gmail.com',
      phone: '0891234567',
      hwid: 'WIN-DESKTOP-89F2A1',
      hwidHash: 'a7c8e9f2b4...',
      activatedAt: '2026-08-24 11:00:00',
      lastPing: '2026-08-25 09:00:00',
      status: 'Active',
      orderId: 'ORD-202608-1004',
      migrationsCount: 0
    }
  ],
  orders: [
    {
      id: 'ORD-202608-1001',
      customerEmail: 'somchai.studio@gmail.com',
      customerPhone: '0891234567',
      productId: 'prod-saiscale',
      productName: 'saiscale',
      amount: 2490,
      paymentMethod: 'PromptPay QR',
      paymentStatus: 'PAID',
      createdAt: '2026-08-20 14:20:00',
      paidAt: '2026-08-20 14:21:05',
      licenseKey: 'JG-SAIS-9A2F-4B1C-8E7D'
    },
    {
      id: 'ORD-202608-1002',
      customerEmail: 'laser.craft.bkk@gmail.com',
      customerPhone: '0819876543',
      productId: 'prod-eznest',
      productName: 'ez nest',
      amount: 1390,
      paymentMethod: 'PromptPay QR',
      paymentStatus: 'PAID',
      createdAt: '2026-08-22 09:42:00',
      paidAt: '2026-08-22 09:43:18',
      licenseKey: 'JG-NEST-88CD-11FA-992B'
    },
    {
      id: 'ORD-202608-1003',
      customerEmail: 'signage.pro@yahoo.com',
      customerPhone: '0865551234',
      productId: 'prod-cutprep',
      productName: 'jarerngraphic CutPrep',
      amount: 1190,
      paymentMethod: 'PromptPay QR',
      paymentStatus: 'PAID',
      createdAt: '2026-08-23 16:05:00',
      paidAt: '2026-08-23 16:06:40',
      licenseKey: 'JG-PREP-77AA-55DF-2201'
    },
    {
      id: 'ORD-202608-1004',
      customerEmail: 'somchai.studio@gmail.com',
      customerPhone: '0891234567',
      productId: 'prod-costboard',
      productName: 'jarerngraphic Print & Cost',
      amount: 1290,
      paymentMethod: 'PromptPay QR',
      paymentStatus: 'PAID',
      createdAt: '2026-08-24 10:55:00',
      paidAt: '2026-08-24 10:56:12',
      licenseKey: 'JG-COST-1029-3388-7744'
    }
  ],
  otps: {} // In-memory/file session OTPs: { "email": { code: "123456", expiresAt: 123456789 } }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading db.json, returning fallback:', e);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing db.json:', e);
    return false;
  }
}

// Database API Methods
const db = {
  getSettings() {
    const data = readDb();
    return data.settings || INITIAL_DATA.settings;
  },
  updateSettings(updates) {
    const data = readDb();
    data.settings = { ...data.settings, ...updates };
    writeDb(data);
    return data.settings;
  },

  getProducts() {
    const data = readDb();
    return data.products || [];
  },
  getProductBySlug(slug) {
    const data = readDb();
    return (data.products || []).find(p => p.slug === slug || p.id === slug);
  },
  saveProduct(productData) {
    const data = readDb();
    const index = (data.products || []).findIndex(p => p.id === productData.id || p.sku === productData.sku);
    if (index >= 0) {
      data.products[index] = { ...data.products[index], ...productData };
    } else {
      data.products.push({
        id: productData.id || `prod-${Date.now()}`,
        salesCount: 0,
        status: 'Active',
        ...productData
      });
    }
    writeDb(data);
    return productData;
  },

  getLicenses() {
    const data = readDb();
    return data.licenses || [];
  },
  getLicensesByEmail(email) {
    const data = readDb();
    const target = String(email).trim().toLowerCase();
    return (data.licenses || []).filter(l => String(l.email).trim().toLowerCase() === target);
  },
  findLicenseByKey(key) {
    const data = readDb();
    const target = String(key).trim().toUpperCase();
    return (data.licenses || []).find(l => String(l.key).trim().toUpperCase() === target);
  },
  createLicense(license) {
    const data = readDb();
    data.licenses = data.licenses || [];
    data.licenses.unshift(license);
    writeDb(data);
    return license;
  },
  updateLicense(key, updates) {
    const data = readDb();
    const target = String(key).trim().toUpperCase();
    const index = (data.licenses || []).findIndex(l => String(l.key).trim().toUpperCase() === target);
    if (index >= 0) {
      data.licenses[index] = { ...data.licenses[index], ...updates };
      writeDb(data);
      return data.licenses[index];
    }
    return null;
  },

  getOrders() {
    const data = readDb();
    return data.orders || [];
  },
  getOrdersByEmail(email) {
    const data = readDb();
    const target = String(email).trim().toLowerCase();
    return (data.orders || []).filter(o => String(o.customerEmail).trim().toLowerCase() === target);
  },
  createOrder(order) {
    const data = readDb();
    data.orders = data.orders || [];
    data.orders.unshift(order);
    writeDb(data);
    return order;
  },
  updateOrder(orderId, updates) {
    const data = readDb();
    const index = (data.orders || []).findIndex(o => o.id === orderId);
    if (index >= 0) {
      data.orders[index] = { ...data.orders[index], ...updates };
      writeDb(data);
      return data.orders[index];
    }
    return null;
  },

  getStats() {
    const data = readDb();
    const orders = data.orders || [];
    const licenses = data.licenses || [];
    const products = data.products || [];

    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const activeKeys = licenses.filter(l => l.status === 'Active').length;
    const totalMigrations = licenses.reduce((sum, l) => sum + (Number(l.migrationsCount) || 0), 0);

    return {
      totalRevenue,
      formattedRevenue: `฿${totalRevenue.toLocaleString()}`,
      activeKeys,
      totalProducts: products.length,
      totalOrders: paidOrders.length,
      totalMigrations,
      recentOrders: orders.slice(0, 10),
      recentLicenses: licenses.slice(0, 10)
    };
  },

  // Member OTP Store
  saveOtp(email, code) {
    const data = readDb();
    data.otps = data.otps || {};
    data.otps[String(email).trim().toLowerCase()] = {
      code: String(code),
      expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
    };
    writeDb(data);
  },
  verifyOtp(email, code) {
    const data = readDb();
    data.otps = data.otps || {};
    const target = String(email).trim().toLowerCase();
    const record = data.otps[target];
    if (!record) return { valid: false, reason: 'OTP_NOT_FOUND' };
    if (Date.now() > record.expiresAt) return { valid: false, reason: 'OTP_EXPIRED' };
    if (record.code !== String(code).trim()) return { valid: false, reason: 'OTP_INCORRECT' };

    delete data.otps[target];
    writeDb(data);
    return { valid: true };
  }
};

module.exports = db;
