/**
 * QRIS (Quick Response Code Indonesian Standard) & EMVCo TLV Engine
 * Pure TypeScript, zero-dependency, 100% client-side secure implementation.
 * Standard: EMVCo QR Code Specification for Payment Systems (CPM/MPM) & ASPI QRIS
 */

import qrcode from 'qrcode-generator';

export interface TLVRecord {
  tag: string;
  length: number;
  value: string;
}

export interface DynamicQrisOptions {
  amount?: number;
  tipType?: 'none' | 'fixed' | 'percentage';
  feeValue?: number;
  invoiceId?: string;
  terminalId?: string;
  customerNote?: string;
}

export interface NewQrisOptions {
  merchantName: string;
  merchantCity: string;
  postalCode?: string;
  merchantId?: string;
  acquirerId?: string;
  amount?: number;
  mcc?: string;
  invoiceId?: string;
}

export interface ParsedQris {
  isValid: boolean;
  isDynamic: boolean;
  crcPassed: boolean;
  merchantName?: string;
  merchantCity?: string;
  postalCode?: string;
  amount?: number;
  currency?: string;
  countryCode?: string;
  mcc?: string;
  invoiceId?: string;
  rawTags: Record<string, string>;
  error?: string;
}

export type QRMode = 'qris' | 'link';

export interface LinkConfig {
  url: string;
  title: string;
  description: string;
}

export const DEFAULT_LINK_CONFIG: LinkConfig = {
  url: 'https://github.com',
  title: 'GITHUB REPOSITORY',
  description: 'Scan to view open-source project',
};

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRMatrixResult {
  size: number;
  modules: boolean[][];
  errorCorrectionLevel: ErrorCorrectionLevel;
  isFinderPattern: (row: number, col: number) => boolean;
  isAlignmentPattern: (row: number, col: number) => boolean;
  isTimingPattern: (row: number, col: number) => boolean;
}

/**
 * Calculate CRC-16/CCITT-FALSE checksum for EMVCo QR Code.
 * Poly: 0x1021, Init: 0xFFFF, RefIn: false, RefOut: false, XorOut: 0x0000
 */
export function calculateCRC16(data: string): string {
  let crc = 0xffff;
  const poly = 0x1021;

  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i);
    crc ^= (byte & 0xff) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ poly) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Format a single TLV entry: Tag (2 digits) + Length (2 digits) + Value
 */
export function formatTLV(tag: string, value: string): string {
  const sanitizedTag = tag.padStart(2, '0');
  const lenStr = value.length.toString().padStart(2, '0');
  return `${sanitizedTag}${lenStr}${value}`;
}

/**
 * Parse an EMVCo TLV string into key-value pairs
 */
export function parseTLV(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  let i = 0;

  while (i < raw.length) {
    if (i + 4 > raw.length) break;

    const tag = raw.substring(i, i + 2);
    const lengthStr = raw.substring(i + 2, i + 4);
    const length = parseInt(lengthStr, 10);

    if (isNaN(length) || i + 4 + length > raw.length) {
      break;
    }

    const value = raw.substring(i + 4, i + 4 + length);
    result[tag] = value;
    i += 4 + length;
  }

  return result;
}

/**
 * Build a sub-TLV string (e.g. for Tag 26, 51, 62 Additional Data)
 */
export function buildSubTLV(records: Record<string, string>): string {
  let out = '';
  const sortedTags = Object.keys(records).sort();
  for (const tag of sortedTags) {
    const val = records[tag];
    if (val !== undefined && val !== '') {
      out += formatTLV(tag, val);
    }
  }
  return out;
}

/**
 * Verify and parse a complete QRIS string
 */
export function parseQris(raw: string): ParsedQris {
  const clean = raw.trim();
  if (!clean) {
    return { isValid: false, isDynamic: false, crcPassed: false, rawTags: {}, error: 'QRIS string is empty' };
  }

  const tags = parseTLV(clean);
  const providedCRC = tags['63'];

  // Check CRC16
  const payloadWithoutCRC = clean.substring(0, clean.lastIndexOf('6304') + 4);
  const calculatedCRC = calculateCRC16(payloadWithoutCRC);
  const crcPassed = providedCRC?.toUpperCase() === calculatedCRC;

  const isDynamic = tags['01'] === '12';
  const amount = tags['54'] ? parseFloat(tags['54']) : undefined;

  let invoiceId: string | undefined;
  if (tags['62']) {
    const subTags = parseTLV(tags['62']);
    invoiceId = subTags['01'] || subTags['05'];
  }

  const isValid = Boolean(tags['00'] === '01' && (tags['01'] === '11' || tags['01'] === '12') && tags['58'] === 'ID');

  return {
    isValid,
    isDynamic,
    crcPassed,
    merchantName: tags['59'],
    merchantCity: tags['60'],
    postalCode: tags['61'],
    amount,
    currency: tags['53'] === '360' ? 'IDR' : tags['53'],
    countryCode: tags['58'],
    mcc: tags['52'],
    invoiceId,
    rawTags: tags,
    error: !isValid ? 'Invalid EMVCo/QRIS structure' : !crcPassed ? 'CRC-16 Checksum mismatch' : undefined,
  };
}

/**
 * Convert a Static QRIS to Dynamic QRIS with an exact amount and optional fee/invoice
 */
export function convertStaticToDynamic(
  staticQris: string,
  options: DynamicQrisOptions = {}
): { dynamicQris: string; parsed: ParsedQris } {
  const clean = staticQris.trim();
  const tags = parseTLV(clean);

  // Set Point of Initiation Method to Dynamic ("12")
  tags['01'] = '12';

  // Set Transaction Currency to IDR (360) if not present
  if (!tags['53']) tags['53'] = '360';

  // Set Country Code ID if not present
  if (!tags['58']) tags['58'] = 'ID';

  // Set Transaction Amount (Tag 54)
  if (options.amount !== undefined && options.amount > 0) {
    const formattedAmount = Number.isInteger(options.amount)
      ? options.amount.toString()
      : options.amount.toFixed(2);
    tags['54'] = formattedAmount;
  } else {
    delete tags['54'];
  }

  // Handle Tip / Convenience Fee (Tags 55, 56, 57)
  if (options.tipType === 'fixed' && options.feeValue && options.feeValue > 0) {
    tags['55'] = '02';
    tags['56'] = options.feeValue.toString();
    delete tags['57'];
  } else if (options.tipType === 'percentage' && options.feeValue && options.feeValue > 0) {
    tags['55'] = '03';
    tags['57'] = options.feeValue.toString();
    delete tags['56'];
  } else {
    delete tags['55'];
    delete tags['56'];
    delete tags['57'];
  }

  // Additional Data (Tag 62) - Invoice / Reference / Terminal
  if (options.invoiceId || options.terminalId || options.customerNote) {
    const currentSubTags = tags['62'] ? parseTLV(tags['62']) : {};
    if (options.invoiceId) currentSubTags['01'] = options.invoiceId;
    if (options.terminalId) currentSubTags['07'] = options.terminalId;
    if (options.customerNote) currentSubTags['08'] = options.customerNote;
    tags['62'] = buildSubTLV(currentSubTags);
  }

  // Standard EMVCo tag sequence
  const standardTagOrder = [
    '00', '01', '02', '03', '04', '05',
    '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62'
  ];

  let rawWithoutCRC = '';
  for (const tag of standardTagOrder) {
    if (tags[tag] !== undefined) {
      rawWithoutCRC += formatTLV(tag, tags[tag]);
    }
  }

  for (const tag of Object.keys(tags)) {
    if (!standardTagOrder.includes(tag) && tag !== '63') {
      rawWithoutCRC += formatTLV(tag, tags[tag]);
    }
  }

  rawWithoutCRC += '6304';
  const crc = calculateCRC16(rawWithoutCRC);
  const fullDynamicQris = `${rawWithoutCRC}${crc}`;

  return {
    dynamicQris: fullDynamicQris,
    parsed: parseQris(fullDynamicQris),
  };
}

/**
 * Generate a clean, standard, compact dynamic QRIS string
 */
export function generateSampleQris(options: NewQrisOptions): string {
  const tags: Record<string, string> = {
    '00': '01', // Payload Format Indicator
    '01': options.amount && options.amount > 0 ? '12' : '11', // Dynamic or Static
    '26': buildSubTLV({
      '00': 'ID.CO.QRIS.WWW',
      '01': options.acquirerId || '936009180000',
      '02': options.merchantId || 'ID1020030040',
      '03': 'UME',
    }),
    '52': options.mcc || '5812',
    '53': '360', // IDR Currency
    '58': 'ID', // Indonesia
    '59': (options.merchantName !== undefined ? options.merchantName : 'WARUNG KOPI SENJA').toUpperCase().slice(0, 25) || 'MERCHANT',
    '60': (options.merchantCity !== undefined ? options.merchantCity : 'JAKARTA').toUpperCase().slice(0, 15) || 'ID',
    '61': options.postalCode || '12950',
  };



  if (options.amount && options.amount > 0) {
    tags['54'] = Number.isInteger(options.amount) ? options.amount.toString() : options.amount.toFixed(2);
  }

  if (options.invoiceId) {
    tags['62'] = buildSubTLV({
      '01': options.invoiceId.slice(0, 15),
    });
  }

  let raw = '';
  const order = ['00', '01', '26', '51', '52', '53', '54', '58', '59', '60', '61', '62'];
  for (const tag of order) {
    if (tags[tag] !== undefined) {
      raw += formatTLV(tag, tags[tag]);
    }
  }

  raw += '6304';
  const crc = calculateCRC16(raw);
  return `${raw}${crc}`;
}

/**
 * Generate 2D QR Code matrix
 * Default to 'M' (15% error correction) or 'Q'/'H' for compact, chunky, beautiful voxels
 */
export function generateQRMatrix(
  payload: string,
  errorCorrectionLevel: ErrorCorrectionLevel = 'M'
): QRMatrixResult {
  const qr = qrcode(0, errorCorrectionLevel);
  qr.addData(payload);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const modules: boolean[][] = [];

  for (let row = 0; row < moduleCount; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < moduleCount; col++) {
      rowData.push(qr.isDark(row, col));
    }
    modules.push(rowData);
  }

  // Finder pattern coordinate detector (7x7 corners)
  const isFinderPattern = (r: number, c: number): boolean => {
    if (r <= 7 && c <= 7) return true;
    if (r <= 7 && c >= moduleCount - 8) return true;
    if (r >= moduleCount - 8 && c <= 7) return true;
    return false;
  };

  const isTimingPattern = (r: number, c: number): boolean => {
    if (isFinderPattern(r, c)) return false;
    return r === 6 || c === 6;
  };

  const isAlignmentPattern = (r: number, c: number): boolean => {
    if (moduleCount <= 21) return false;
    if (isFinderPattern(r, c)) return false;
    const alignCenter = moduleCount - 7;
    return Math.abs(r - alignCenter) <= 2 && Math.abs(c - alignCenter) <= 2;
  };

  return {
    size: moduleCount,
    modules,
    errorCorrectionLevel,
    isFinderPattern,
    isAlignmentPattern,
    isTimingPattern,
  };
}

/**
 * Default sample static QRIS for instant demo & testing
 */
export const DEFAULT_SAMPLE_STATIC_QRIS = generateSampleQris({
  merchantName: 'WARUNG KOPI SENJA',
  merchantCity: 'JAKARTA',
  postalCode: '12950',
});

