// lib/licenseUtils.js
// Utility module for JarernGraphic licensing & cryptographic validation
const crypto = require('crypto');

const SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'jarern-graphic-dev-secret-key-change-in-prod';

/**
 * Generate a formatted license key
 * Example: JG-NEST-A8F2-9C1D-7E3B
 */
function generateLicenseKey(productCode = 'PRO') {
  const code = (productCode || 'PRO').toUpperCase().slice(0, 4);
  const seg1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const seg2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const seg3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `JG-${code}-${seg1}-${seg2}-${seg3}`;
}

/**
 * Hash Hardware Identifier (HWID) to prevent spoofing
 */
function hashMachineId(rawMachineId) {
  if (!rawMachineId) throw new Error('Machine ID is required');
  return crypto.createHmac('sha256', SECRET_KEY).update(String(rawMachineId).trim()).digest('hex');
}

/**
 * Create a signed activation token payload for the CEP client
 * Valid for offline grace period (default 14 days)
 */
function createActivationToken(licenseKey, machineIdHash, productCode, validityDays = 14) {
  const now = Date.now();
  const expiresAt = now + (validityDays * 24 * 60 * 60 * 1000);
  
  const payload = {
    key: licenseKey,
    mid: machineIdHash,
    prod: productCode,
    iat: now,
    exp: expiresAt,
    status: 'ACTIVE'
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verify a signed activation token
 */
function verifyActivationToken(token, expectedMachineIdHash) {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return { valid: false, reason: 'INVALID_FORMAT' };

    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).digest('base64url');
    if (signature !== expectedSig) {
      return { valid: false, reason: 'SIGNATURE_MISMATCH' };
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    
    // Check machine match
    if (expectedMachineIdHash && payload.mid !== expectedMachineIdHash) {
      return { valid: false, reason: 'MACHINE_MISMATCH' };
    }

    // Check expiration for offline lease
    if (Date.now() > payload.exp) {
      return { valid: false, reason: 'LEASE_EXPIRED', payload };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: 'MALFORMED_TOKEN', error: err.message };
  }
}

module.exports = {
  generateLicenseKey,
  hashMachineId,
  createActivationToken,
  verifyActivationToken
};
