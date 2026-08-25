// lib/promptpay.js
// Standard EMVCo QR Code Payload Generator for Thai PromptPay
// Supports Mobile Phone (08x-xxx-xxxx) and Tax ID / National ID (13 digits)

function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return ('0000' + crc.toString(16).toUpperCase()).slice(-4);
}

function formatTag(id, value) {
  const len = ('00' + value.length).slice(-2);
  return `${id}${len}${value}`;
}

function sanitizeTarget(target) {
  const cleaned = String(target).replace(/[^0-9]/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Mobile Phone (e.g. 0812345678 -> 0066812345678)
    return '0066' + cleaned.slice(1);
  }
  return cleaned; // 13-digit National ID or e-Wallet ID
}

/**
 * Generate EMVCo PromptPay QR Code string
 * @param {string} target - PromptPay Phone (08x...) or National ID (13 digits)
 * @param {number|null} amount - Amount in Baht (optional)
 * @returns {string} EMVCo QR Payload
 */
function generatePromptPayPayload(target = '0812345678', amount = null) {
  const sanitized = sanitizeTarget(target);
  const isPhone = sanitized.length === 11 && sanitized.startsWith('0066');
  
  // Tag 29: PromptPay Merchant Identifier
  const aid = formatTag('00', 'A000000677010111');
  const targetTag = formatTag(isPhone ? '01' : '02', sanitized);
  const tag29 = formatTag('29', aid + targetTag);

  // Mandatory Tags
  const tag00 = formatTag('00', '01'); // Payload Format Indicator
  const tag01 = formatTag('01', amount ? '12' : '11'); // Point of Initiation (12 = Dynamic, 11 = Static)
  const tag53 = formatTag('53', '764'); // Currency (THB = 764)
  const tag58 = formatTag('58', 'TH');  // Country Code

  let payload = tag00 + tag01 + tag29 + tag53;

  if (amount && Number(amount) > 0) {
    const formattedAmount = Number(amount).toFixed(2);
    payload += formatTag('54', formattedAmount);
  }

  payload += tag58;

  // Tag 63: CRC16 Checksum
  payload += '6304';
  const checksum = crc16(payload);
  return payload + checksum;
}

module.exports = {
  generatePromptPayPayload,
  sanitizeTarget
};
