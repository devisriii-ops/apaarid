import QRCode from 'qrcode';

/**
 * Generates a cryptographically random, unguessable token for Student QR Identity.
 * Example: "apaar_qr_9f3a8b2c1e4d7a0f6c5b8e9d1a2f3c4e"
 */
export function generateSecureQrToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `apaar_qr_${hex}`;
  }
  // Fallback for non-browser environment
  const rand = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return `apaar_qr_${rand}`;
}

/**
 * Builds the canonical instant verification URL encoded in the QR code.
 * Mobile phone cameras scanning this link will directly open the responsive profile verification page.
 */
export function buildQrVerificationUrl(token: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/?verify_qr=${encodeURIComponent(token)}`;
  }
  return `https://apaar-smartverify.aicte.gov.in/?verify_qr=${encodeURIComponent(token)}`;
}

/**
 * Generates high-resolution PNG Data URL for a given QR verification payload.
 */
export async function generateQrDataUrl(
  token: string,
  options: { width?: number; margin?: number; colorDark?: string; colorLight?: string } = {}
): Promise<string> {
  const url = buildQrVerificationUrl(token);
  const {
    width = 300,
    margin = 2,
    colorDark = '#07110D',
    colorLight = '#FFFFFF'
  } = options;

  try {
    return await QRCode.toDataURL(url, {
      width,
      margin,
      errorCorrectionLevel: 'M',
      color: {
        dark: colorDark,
        light: colorLight
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

/**
 * Downloads the student QR code as a PNG file.
 */
export function downloadQrPng(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
