/**
 * Cryptographic & APAAR Data Protection Utilities
 * Implements privacy-preserving deterministic identifier matching,
 * APAAR 12-digit validation, masking, and CSV sanitization.
 */

// Simulated internal HMAC key for deterministic duplicate detection
const HMAC_SALT = 'APAAR_AICTE_KEYED_HASH_SALT_2026';

/**
 * Generates deterministic SHA-256 hash of APAAR ID + salt.
 * Ensures the platform can find duplicate candidates across submissions
 * without storing or exposing cleartext identifiers.
 */
export async function computeApaarHmac(rawApaar: string): Promise<string> {
  const cleanId = rawApaar.replace(/[\s-]/g, '').trim();
  const data = new TextEncoder().encode(`${cleanId}:${HMAC_SALT}`);
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback simple hash for older environments
      return simpleStringHash(`${cleanId}:${HMAC_SALT}`);
    }
  }
  return simpleStringHash(`${cleanId}:${HMAC_SALT}`);
}

function simpleStringHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Masks APAAR identifier according to privacy standards.
 * Raw: "123456789012" -> "••••-••••-9012"
 */
export function maskApaar(raw: string): string {
  if (!raw) return '••••-••••-••••';
  const clean = raw.replace(/[\s-]/g, '');
  if (clean.length < 4) return '••••-••••-••••';
  const last4 = clean.slice(-4);
  return `••••-••••-${last4}`;
}

/**
 * Verhoeff checksum algorithm used by Indian identification & academic registry standards
 */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

export function validateVerhoeffChecksum(numStr: string): boolean {
  let c = 0;
  const reversedArray = numStr.split('').reverse().map(Number);
  for (let i = 0; i < reversedArray.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][reversedArray[i]]];
  }
  return c === 0;
}

export interface ApaarFormatValidationResult {
  isValid: boolean;
  normalized: string;
  masked: string;
  errors: string[];
}

export function validateApaarFormat(raw: string): ApaarFormatValidationResult {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'string') {
    return { isValid: false, normalized: '', masked: '••••-••••-••••', errors: ['APAAR ID is missing or empty'] };
  }

  const clean = raw.replace(/[\s-]/g, '').trim();

  if (!/^\d+$/.test(clean)) {
    errors.push('APAAR ID must contain numerical digits only (no letters or symbols)');
  }

  if (clean.length !== 12) {
    errors.push(`APAAR ID must be exactly 12 digits (found ${clean.length} digits)`);
  }

  // Check against obvious test sequences
  if (/^(\d)\1{11}$/.test(clean)) {
    errors.push('Invalid sequence: APAAR ID cannot consist of 12 repeating identical digits');
  }

  // Format check passed
  const isValid = errors.length === 0;
  const masked = clean.length >= 4 ? `••••-••••-${clean.slice(-4)}` : '••••-••••-••••';

  return {
    isValid,
    normalized: clean,
    masked,
    errors
  };
}

/**
 * Sanitizes strings for CSV export to prevent formula injection
 * (OWASP CSV Injection defense: prefixing `=, +, -, @` with a single quote)
 */
export function sanitizeForCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  // Escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
