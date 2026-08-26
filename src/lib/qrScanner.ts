import jsQR from 'jsqr';
import { parseQris, type ParsedQris } from './qris';

export interface ScanQRResult {
  raw: string;
  isQris: boolean;
  parsed?: ParsedQris;
}

/**
 * Scan and decode QR code from an image File or Blob (PNG, JPG, WebP, SVG, etc.)
 */
export async function scanQRCodeFromImage(file: File | Blob): Promise<ScanQRResult> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(imageUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D context not available');

    // 1. Try scanning original resolution
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    // 2. If not found and image is very large (e.g. 4K camera photo), try downscaled sizes
    if (!code && (canvas.width > 1200 || canvas.height > 1200)) {
      const maxDim = 1000;
      const scale = Math.min(maxDim / canvas.width, maxDim / canvas.height);
      const scaledW = Math.round(canvas.width * scale);
      const scaledH = Math.round(canvas.height * scale);

      canvas.width = scaledW;
      canvas.height = scaledH;
      ctx.drawImage(img, 0, 0, scaledW, scaledH);

      imageData = ctx.getImageData(0, 0, scaledW, scaledH);
      code = jsQR(imageData.data, scaledW, scaledH, {
        inversionAttempts: 'attemptBoth',
      });
    }

    // 3. If still not found, try a higher contrast attempt
    if (!code) {
      enhanceContrast(imageData.data);
      ctx.putImageData(imageData, 0, 0);
      code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: 'attemptBoth',
      });
    }

    if (!code || !code.data) {
      throw new Error('QR Code tidak ditemukan dalam gambar. Pastikan gambar jelas dan tidak blur.');
    }

    const raw = code.data.trim();
    const parsed = parseQris(raw);
    return {
      raw,
      isQris: parsed.isValid,
      parsed: parsed.isValid ? parsed : undefined,
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Scan a single video frame from live camera stream
 */
export function scanQRCodeFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): ScanQRResult | null {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return null;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (code && code.data) {
    const raw = code.data.trim();
    const parsed = parseQris(raw);
    return {
      raw,
      isQris: parsed.isValid,
      parsed: parsed.isValid ? parsed : undefined,
    };
  }

  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = src;
  });
}
function enhanceContrast(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    // Binarize / high contrast
    const val = avg > 128 ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
}

/**
 * Helper to identify known acquirer name from QRIS tags (DANA, ShopeePay, GoPay, BCA, Nobu, etc.)
 */
export function detectAcquirerInfo(parsed: ParsedQris): {
  acquirerName: string;
  nmid?: string;
  merchantPan?: string;
} {
  const rawTags = parsed.rawTags || {};
  
  // Check Tag 26 to 51
  for (let t = 26; t <= 51; t++) {
    const tagStr = t.toString().padStart(2, '0');
    if (rawTags[tagStr]) {
      const sub = parseSubTags(rawTags[tagStr]);
      const domain = (sub['00'] || '').toUpperCase();
      const pan = sub['01'];
      const nmid = sub['02'];

      let name = 'QRIS Merchant';
      if (domain.includes('DANA')) name = 'DANA Bisnis';
      else if (domain.includes('SHOPEE') || domain.includes('AIRPAY')) name = 'ShopeePay';
      else if (domain.includes('GOPAY') || domain.includes('GOJEK')) name = 'GoPay';
      else if (domain.includes('LINKAJA') || domain.includes('TELKOM')) name = 'LinkAja';
      else if (domain.includes('OVO') || domain.includes('VISIONET')) name = 'OVO';
      else if (domain.includes('BCA')) name = 'BCA QRIS';
      else if (domain.includes('MANDIRI')) name = 'Bank Mandiri';
      else if (domain.includes('BRI')) name = 'Bank BRI';
      else if (domain.includes('BNI')) name = 'Bank BNI';
      else if (domain.includes('NOBU')) name = 'Bank Nobu';
      else if (domain.includes('CIMB')) name = 'CIMB Niaga';
      else if (domain.includes('XENDIT')) name = 'Xendit Gateway';
      else if (domain.includes('MIDTRANS')) name = 'Midtrans Gateway';
      else if (domain) name = domain;

      return {
        acquirerName: name,
        nmid,
        merchantPan: pan,
      };
    }
  }

  return { acquirerName: 'Standard QRIS' };
}

function parseSubTags(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  let idx = 0;
  while (idx < raw.length) {
    const tag = raw.substring(idx, idx + 2);
    const len = parseInt(raw.substring(idx + 2, idx + 4), 10);
    if (isNaN(len)) break;
    const val = raw.substring(idx + 4, idx + 4 + len);
    result[tag] = val;
    idx += 4 + len;
  }
  return result;
}
