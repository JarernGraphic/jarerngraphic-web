# JarernGraphic — Store & Licensing Platform

สโตร์จำหน่ายโปรแกรมเสริมและสคริปต์สำหรับ **Adobe Photoshop & Adobe Illustrator** (เช่น `saiscale`, `ez nest`, `CutPrep`, `Print & Cost`) พร้อมระบบ Node-Locked License Key และระบบชำระเงินอัตโนมัติ 24 ชม.

---

## 🚀 วิธีเปิดใช้งานแบบ Local (ด่วน)

```bash
# เปิด Local Server ผ่าน Python
python -m http.server 5000
```
เปิดเบราว์เซอร์: [http://localhost:5000](http://localhost:5000)

---

## 📑 แผนผังหน้าเว็บในโปรเจกต์

- **หน้าแรก (Storefront)**: `index.html`
- **หน้ารายละเอียด saiscale**: `saiscale.html`
- **หน้ารายละเอียด ez nest**: `eznest.html`
- **หน้ารายละเอียด CutPrep**: `cutprep.html`
- **หน้ารายละเอียด Print & Cost**: `costboard.html`
- **ตารางราคารวม**: `pricing.html`
- **ระบบ Admin Dashboard**: `admin.html` *(รหัสผ่านตั้งต้น: `admin1234`)*

---

## 📚 เอกสารคู่มือฉบับเต็ม

ดูรายละเอียดสถาปัตยกรรมระบบ, การ Deploy ขึ้น Vercel ฟรี, การเชื่อมต่อ CEP Extension และการต่อ Payment Gateway ได้ในไฟล์ **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)**
