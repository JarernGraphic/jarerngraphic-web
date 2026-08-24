# คู่มือการเชื่อมต่อระบบ License Key เข้ากับ CEP Extension (Photoshop / Illustrator)

ไฟล์ `licenseClient.js` ถูกออกแบบมาให้ใช้งานกับพาเนล CEP Extension ได้ทันที (รันได้ทั้งบน Windows และ macOS)

---

## 1. วิธีติดตั้งในโปรเจกต์ Extension
1. คัดลอกไฟล์ `licenseClient.js` ไปวางในโฟลเดอร์ `js/` ของ Extension
2. ใน `index.html` ของพาเนล Extension ให้เพิ่มแท็กสคริปต์:
```html
<script src="js/licenseClient.js"></script>
<script src="js/main.js"></script>
```

---

## 2. ตัวอย่างโค้ดเรียกใช้งานใน `main.js`

### ตรวจสอบสถานะเมื่อเปิดพาเนล (Check Status):
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const status = window.JGLicense.checkLicenseStatus();
  if (status.active) {
    console.log('เปิดใช้งานแล้ว: ', status.licenseKey);
    // แสดงหน้าจอทำงานปกติ
    document.getElementById('licenseModal').style.display = 'none';
  } else {
    // แสดงหน้าต่างให้กรอก License Key
    document.getElementById('licenseModal').style.display = 'flex';
  }
});
```

### เมื่อผู้ใช้กดปุ่มยืนยันคีย์ (Activate Key):
```javascript
async function onActivateClick() {
  const keyInput = document.getElementById('keyInput').value;
  const result = await window.JGLicense.activateLicense(keyInput);

  if (result.success) {
    alert('เปิดใช้งานสำเร็จ!');
    location.reload();
  } else {
    alert('เกิดข้อผิดพลาด: ' + result.message);
  }
}
```

### เมื่อผู้ใช้ต้องการย้ายเครื่อง (Deactivate / Move Machine):
```javascript
async function onDeactivateClick() {
  if (confirm('คุณต้องการยกเลิกสิทธิ์บนเครื่องนี้เพื่อย้ายไปเครื่องใหม่หรือไม่?')) {
    const result = await window.JGLicense.deactivateLicense();
    alert(result.message);
    location.reload();
  }
}
```
