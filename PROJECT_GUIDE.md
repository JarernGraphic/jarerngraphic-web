# 📘 JarernGraphic — คู่มือสถาปัตยกรรมและแนวทางการพัฒนาต่อ (Full Project Guide)

เอกสารฉบับนี้สรุปโครงสร้าง ระบบทั้งหมด และขั้นตอนการนำโปรเจกต์ไปพัฒนาต่อบนเครื่องอื่น สำหรับสโตร์จำหน่ายโปรแกรมเสริมและสคริปต์ **Adobe Photoshop & Illustrator**

---

## 📁 1. แผนผังโครงสร้างโปรเจกต์ (Project Structure)

```
ecut web/
├── index.html                  # หน้าแรก (Hero Fan Cards, Compatibility Strip, Product Catalog, Highlights, FAQ)
├── saiscale.html               # หน้ารายละเอียดสินค้า saiscale (iHaveCPU Split-View E-Commerce Layout)
├── eznest.html                 # หน้ารายละเอียดสินค้า ez nest (True-Shape Nesting)
├── cutprep.html                # หน้ารายละเอียดสินค้า jarerngraphic CutPrep (ล้างเส้นซ้อน & DXF)
├── costboard.html              # หน้ารายละเอียดสินค้า jarerngraphic Print & Cost (มาร์กพิมพ์ตัด & คำนวณต้นทุน)
├── pricing.html                # หน้าตารางเปรียบเทียบราคาสินค้าทั้งหมด
├── admin.html                  # ระบบ Admin Dashboard (จัดการโปรแกรม, คีย์, ออเดอร์, ปลดล็อกย้ายเครื่อง)
├── style.css                   # สไตล์หลักทั้งระบบ (Unified Modern Dark/Light Theme, Soft Glows, Responsive)
├── app.js                      # JavaScript จัดการอนิเมชัน GSAP, Scroll Reveal, FAQ Accordion และ Checkout Modal
├── vercel.json                 # ไฟล์คอนฟิกสำหรับ Deploy ขึ้น Vercel ฟรี 100%
│
├── assets/                     # โฟลเดอร์เก็บไฟล์ภาพและไอคอน
│   └── logo.png                # โลโก้แบรนด์ JarernGraphic แบบสมมาตร (Red Squircle SJ)
│
├── api/                        # โฟลเดอร์ Serverless Functions (สำหรับรันบน Vercel อัตโนมัติ)
│   ├── license/
│   │   ├── activate.js         # API เปิดใช้งานคีย์ + ผูก Hardware ID (HWID)
│   │   └── deactivate.js       # API กดยกเลิกสิทธิ์เดิม เพื่อย้ายไปลงเครื่องใหม่
│   └── payment/
│       ├── create-checkout.js  # API สร้างคำสั่งซื้อและรับยอด PromptPay QR
│       └── webhook.js          # API รับสัญญาณชำระเงินสำเร็จจาก Gateway และออก License Key อัตโนมัติ
│
├── lib/
│   └── licenseUtils.js         # ระบบ Cryptographic Signature (HMAC/SHA-256) และฟังก์ชันสร้างคีย์ JG-XXXX-XXXX
│
└── extension-integration/      # โค้ดสำหรับฝังลงในพาเนล CEP Extension (Photoshop / Illustrator)
    ├── licenseClient.js        # ตัวเชื่อมต่อระบบคีย์ในพาเนล (อ่าน Node.js HWID, ตรวจสิทธิ์, รองรับ Offline Mode)
    └── README.md               # คู่มือการเรียกใช้ licenseClient.js ใน main.js ของ Extension
```

---

## 💻 2. วิธีเปิดรันและทดสอบบนเครื่องใหม่ (Local Development)

เมื่อนำไฟล์ ZIP ไปแตกบนเครื่องใหม่ สามารถเปิดเว็บทดสอบได้ง่ายๆ ด้วยคำสั่งต่อไปนี้ใน Terminal / PowerShell:

### วิธีที่ 1: ใช้ Python (ง่ายที่สุด ไม่ต้องลงโปรแกรมเพิ่ม)
```bash
# รันคำสั่งนี้ในโฟลเดอร์โปรเจกต์
python -m http.server 5000
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:5000`

### วิธีที่ 2: ใช้ Node.js (Vercel CLI สำหรับทดสอบระบบ API)
```bash
# ติดตั้ง Vercel CLI (ครั้งแรก)
npm install -g vercel

# รันเซิร์ฟเวอร์เสมือนจริงที่มี API รองรับ
vercel dev
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 🌐 3. ขั้นตอนการนำเว็บขึ้นออนไลน์ฟรี 100% (GitHub + Vercel)

คุณสามารถเปิดให้คนภายนอกเข้าใช้งานและทดลองตลาดได้ฟรี โดยไม่ต้องซื้อโดเมนหรือเช่าโฮสติ้ง:

1. **สร้าง Git Repository**:
   - เปิดโฟลเดอร์โปรเจกต์ในเครื่องใหม่ แล้วพิมพ์คำสั่ง:
   ```bash
   git init
   git add .
   git commit -m "Initial JarernGraphic Store commit"
   ```
2. **Push ขึ้น GitHub**:
   - สร้าง Repository ใหม่ใน [GitHub](https://github.com) ชื่อ `jarerngraphic-store`
   - เชื่อมและ Push โค้ดขึ้นไป:
   ```bash
   git remote add origin https://github.com/<your-username>/jarerngraphic-store.git
   git branch -M main
   git push -u origin main
   ```
3. **เชื่อมต่อกับ Vercel**:
   - ล็อกอินเข้า [Vercel](https://vercel.com) ด้วยบัญชี GitHub
   - กดปุ่ม **"Add New Project"** → เลือก Repository `jarerngraphic-store`
   - กด **"Deploy"**
4. **ผลลัพธ์**: 
   - ภายใน 30 วินาที คุณจะได้ลิงก์เว็บไซต์จริง เช่น `https://jarerngraphic.vercel.app`
   - มีใบรับรองความปลอดภัย **HTTPS (SSL) ฟรีตลอดชีพ**
   - รองรับ **Serverless API (`/api/license/*`)** ทำงานได้ทันที

---

## 🔒 4. สถาปัตยกรรมระบบ License Key & CEP Extension

ระบบถูกออกแบบให้รองรับการทำงานกับพาเนล CEP Extension (Chromium + Node.js) โดยมีหลักการทำงานดังนี้:

```
[ ลูกค้าเปิด Extension ใน Photoshop/Illustrator ]
                        ↓
[ โปรแกรมดึง Hardware ID (CPU, Platform, MAC) ผ่าน Node.js ]
                        ↓
[ ส่ง (LicenseKey, MachineID) ไปที่ https://your-site.vercel.app/api/license/activate ]
                        ↓
[ Server ตรวจสอบความถูกต้อง → สร้าง Token เข้ารหัสด้วย HMAC SHA-256 ]
                        ↓
[ Extension บันทึก Token ลง localStorage → ปลดล็อกให้ใช้งาน ]
                        ↓
[ * โหมดออฟไลน์: สามารถเปิดใช้งานต่อได้ 14 วันโดยไม่ต้องต่อเน็ตตลอดเวลา * ]
```

### การฝังใน CEP Extension:
1. นำไฟล์ `extension-integration/licenseClient.js` ไปวางในโฟลเดอร์ `js/` ของ Extension
2. นำสคริปต์ไปเรียกใช้ใน `index.html` ของ Extension:
   `<script src="js/licenseClient.js"></script>`
3. ใน `main.js` สามารถเรียกใช้คำสั่ง:
   - `window.JGLicense.checkLicenseStatus()` (ตรวจสิทธิ์ตอนเปิดพาเนล)
   - `window.JGLicense.activateLicense(key)` (เมื่อผู้ใช้กรอกคีย์แล้วกดยืนยัน)
   - `window.JGLicense.deactivateLicense()` (เมื่อผู้ใช้ต้องการย้ายเครื่อง)

---

## 💳 5. แนวทางการเชื่อมต่อ Payment Gateway (PromptPay QR)

ในอนาคตเมื่อคุณพร้อมเปิดรับชำระเงินจริง แนะนำขั้นตอนดังนี้:

1. **สมัครบัญชี Payment Gateway**:
   - **Stripe (Thailand)**: สมัครง่าย รองรับ PromptPay QR และบัตรเครดิต
   - **GB Prime Pay**: ของไทย รองรับ PromptPay Dynamic QR และ Mobile Banking
2. **นำ Secret Key มาใส่ใน Vercel**:
   - ใน Vercel Dashboard → ไปที่ Project Settings → **Environment Variables**
   - เพิ่มตัวแปร:
     - `PAYMENT_GATEWAY_KEY`: คีย์จากผู้ให้บริการ
     - `LICENSE_SECRET_KEY`: คีย์ลับสำหรับ Sign ข้อมูลไลเซนส์
     - `RESEND_API_KEY`: คีย์สำหรับส่งอีเมลอัตโนมัติ (จาก [Resend.com](https://resend.com))
3. **การทำงานเมื่อลูกค้าจ่ายเงิน**:
   - เมื่อลูกค้าสแกนจ่ายเงินสำเร็จ Gateway จะยิง Webhook ไปที่ `/api/payment/webhook`
   - ฟังก์ชันจะสร้าง License Key จริง และส่งอีเมลพร้อมลิงก์ดาวน์โหลดให้ลูกค้าใน 2 วินาที

---

## 👤 6. แนวทางระบบสมาชิกและเข้าสู่ระบบ (Authentication & Member Portal)

- **สำหรับลูกค้า**: แนะนำระบบ **Magic Link / OTP หรือ Google Login (Passwordless)** ผ่าน **Supabase Auth**
  - ลูกค้าไม่ต้องตั้งรหัสผ่าน เพียงกรอกอีเมลเดิมที่เคยซื้อ ระบบจะส่งลิงก์เข้าอีเมลเพื่อเข้าหน้า Portal ไปดูประวัติคีย์และกดย้ายเครื่องเองได้
- **สำหรับ Admin**: ล็อกอินผ่านหน้า `admin.html` (รหัสผ่านตั้งต้นสำหรับทดสอบ: `admin1234`) สามารถใช้ดูสถิติ, เพิ่มโปรแกรมใหม่, และรีเซ็ตคีย์ให้ลูกค้าได้ทันที

---

## 🎯 7. สิ่งที่ทำเสร็จสมบูรณ์แล้วในโปรเจกต์นี้

- [x] ออกแบบหน้าแรก (`index.html`) ให้คลีน มินิมอล นุ่มนวล คุมโทนสี Obsidian & Crimson Red
- [x] อนิเมชันการ์ด Fan Deck พริ้วไหวด้วย GSAP พร้อมป้าย `@Illustrator & PS`, `@CNC, Laser & Print`
- [x] การ์ดแสดงผลสไตล์ App Icon Typography สำหรับ 4 โปรแกรมหลัก (`saiscale`, `ez nest`, `CutPrep`, `Print & Cost`)
- [x] แถบรับประกันความเข้ากันได้ (Compatibility Strip) และกล่องความน่าเชื่อถือ
- [x] หน้ารายละเอียดสินค้าแยก 4 หน้าเต็มรูปแบบสไตล์ iHaveCPU Split-View (`saiscale.html`, `eznest.html`, `cutprep.html`, `costboard.html`)
- [x] หน้ารวมตารางราคา (`pricing.html`)
- [x] ระบบ Admin Dashboard (`admin.html`) สำหรับจัดการโปรแกรมและ License Key
- [x] Popup Checkout Modal จำลองการสั่งซื้อผ่าน PromptPay QR
- [x] โครงสร้าง Backend Serverless Function สำหรับ Vercel (`api/license/*`, `api/payment/*`)
- [x] โค้ด Client Integration สำหรับ CEP Extension (`extension-integration/licenseClient.js`)
- [x] กฎการออกแบบเคร่งครัด: **ไม่มี Emoji เลยแม้แต่ตัวเดียว (ใช้ SVG Icon คมชัด 100%)**
