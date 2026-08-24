// extension-integration/licenseClient.js
// Drop-in License Client for Photoshop & Illustrator CEP Extension (main.js)
// Compatible with CEP HTML5 / Node.js runtime on Windows & macOS

(function(window) {
  'use strict';

  // Endpoint where your Vercel site is deployed
  // During local testing: 'http://localhost:3000'
  // In production: 'https://jarerngraphic.vercel.app'
  const API_BASE_URL = window.JG_API_URL || 'https://jarerngraphic.vercel.app';
  const STORAGE_KEY = 'jg_activation_token';
  const PRODUCT_CODE = 'NEST'; // Change according to product (NEST, CUT, PRINT, COST)

  /**
   * Get unique Machine ID using Node.js inside CEP
   */
  function getMachineId() {
    try {
      if (typeof require !== 'undefined') {
        const os = require('os');
        const crypto = require('crypto');
        
        // Combine Hostname, Network Interfaces MAC, and Username
        const network = JSON.stringify(os.networkInterfaces());
        const rawId = `${os.hostname()}-${os.platform()}-${os.arch()}-${network}-${os.userInfo().username}`;
        return crypto.createHash('sha256').update(rawId).digest('hex');
      }
    } catch (e) {
      console.warn('Node.js HWID fallback:', e);
    }
    // Fallback if Node.js is not enabled in manifest
    let localId = localStorage.getItem('jg_mid_fallback');
    if (!localId) {
      localId = 'mid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('jg_mid_fallback', localId);
    }
    return localId;
  }

  /**
   * Activate License Key
   */
  async function activateLicense(licenseKey) {
    const machineId = getMachineId();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/license/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: licenseKey.trim().toUpperCase(),
          machineId: machineId,
          productCode: PRODUCT_CODE
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data && resData.data.token) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.data));
        return { success: true, message: 'เปิดใช้งานไลเซนส์สำเร็จ!' };
      } else {
        return { success: false, message: resData.message || 'ไม่สามารถเปิดใช้งานคีย์นี้ได้' };
      }
    } catch (error) {
      return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ตรวจสอบได้: ' + error.message };
    }
  }

  /**
   * Check if license is currently valid (Supports Offline Mode)
   */
  function checkLicenseStatus() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { active: false, reason: 'NO_LICENSE' };

    try {
      const data = JSON.parse(stored);
      // In offline mode: Check if token exists and grace period is active
      if (data && data.token) {
        return {
          active: true,
          licenseKey: data.licenseKey,
          productCode: data.productCode,
          activatedAt: data.activatedAt
        };
      }
    } catch (e) {
      return { active: false, reason: 'CORRUPTED_DATA' };
    }
    return { active: false, reason: 'NOT_ACTIVE' };
  }

  /**
   * Deactivate license for machine migration
   */
  async function deactivateLicense() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { success: true };

    try {
      const data = JSON.parse(stored);
      const machineId = getMachineId();

      await fetch(`${API_BASE_URL}/api/license/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: data.licenseKey,
          machineId: machineId
        })
      });

      localStorage.removeItem(STORAGE_KEY);
      return { success: true, message: 'ยกเลิกการผูกสิทธิ์เครื่องเดิมเรียบร้อย' };
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      return { success: true, message: 'ลบไลเซนส์ออกจากเครื่องเรียบร้อย' };
    }
  }

  // Export to window
  window.JGLicense = {
    getMachineId,
    activateLicense,
    checkLicenseStatus,
    deactivateLicense
  };

})(window);
