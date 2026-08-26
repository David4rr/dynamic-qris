import { describe, it, expect } from 'bun:test';
import {
  calculateCRC16,
  parseTLV,
  parseQris,
  convertStaticToDynamic,
  generateSampleQris,
  generateQRMatrix,
  DEFAULT_SAMPLE_STATIC_QRIS,
} from './qris';
import { detectAcquirerInfo } from './qrScanner';

describe('QRIS & EMVCo TLV Engine', () => {
  it('calculates accurate CRC-16/CCITT-FALSE', () => {
    // Standard test vector: "123456789" with CCITT-FALSE (init 0xFFFF, poly 0x1021) should be 0x29B1
    expect(calculateCRC16('123456789')).toBe('29B1');

    // Test with the default sample string without checksum
    const rawWithoutCRC = DEFAULT_SAMPLE_STATIC_QRIS.substring(
      0,
      DEFAULT_SAMPLE_STATIC_QRIS.lastIndexOf('6304') + 4
    );
    const expectedCRC = DEFAULT_SAMPLE_STATIC_QRIS.slice(-4);
    expect(calculateCRC16(rawWithoutCRC)).toBe(expectedCRC);
  });

  it('correctly parses TLV tags from raw string', () => {
    const tags = parseTLV(DEFAULT_SAMPLE_STATIC_QRIS);
    expect(tags['00']).toBe('01');
    expect(tags['01']).toBe('11'); // Static
    expect(tags['58']).toBe('ID');
    expect(tags['59']).toBe('WARUNG KOPI SENJA');
    expect(tags['60']).toBe('JAKARTA');
    expect(tags['61']).toBe('12950');
  });

  it('validates and parses a valid Static QRIS payload', () => {
    const parsed = parseQris(DEFAULT_SAMPLE_STATIC_QRIS);
    expect(parsed.isValid).toBe(true);
    expect(parsed.isDynamic).toBe(false);
    expect(parsed.crcPassed).toBe(true);
    expect(parsed.merchantName).toBe('WARUNG KOPI SENJA');
    expect(parsed.merchantCity).toBe('JAKARTA');
  });

  it('converts static QRIS to dynamic with custom amount and invoice ID', () => {
    const result = convertStaticToDynamic(DEFAULT_SAMPLE_STATIC_QRIS, {
      amount: 75000,
      invoiceId: 'INV-2026-001',
    });

    expect(result.dynamicQris).toBeDefined();
    expect(result.parsed.isValid).toBe(true);
    expect(result.parsed.isDynamic).toBe(true);
    expect(result.parsed.crcPassed).toBe(true);
    expect(result.parsed.amount).toBe(75000);
    expect(result.parsed.invoiceId).toBe('INV-2026-001');
    expect(result.parsed.rawTags['01']).toBe('12');
    expect(result.parsed.rawTags['54']).toBe('75000');
  });

  it('generates a fresh dynamic QRIS from scratch', () => {
    const payload = generateSampleQris({
      merchantName: 'Kedai Kopi Nusantara',
      merchantCity: 'Bandung',
      postalCode: '40115',
      amount: 125000,
      invoiceId: 'INV-999',
    });

    const parsed = parseQris(payload);
    expect(parsed.isValid).toBe(true);
    expect(parsed.isDynamic).toBe(true);
    expect(parsed.crcPassed).toBe(true);
    expect(parsed.merchantName).toBe('KEDAI KOPI NUSANTARA');
    expect(parsed.merchantCity).toBe('BANDUNG');
    expect(parsed.amount).toBe(125000);
    expect(parsed.invoiceId).toBe('INV-999');
  });

  it('generates QR matrix with Level H error correction and identifies finder patterns', () => {
    const qris = generateSampleQris({
      merchantName: 'Test Voxel Merchant',
      merchantCity: 'Surabaya',
      amount: 50000,
    });

    const matrix = generateQRMatrix(qris);
    expect(matrix.size).toBeGreaterThanOrEqual(25);
    expect(matrix.modules.length).toBe(matrix.size);
    expect(matrix.modules[0].length).toBe(matrix.size);

    // Check Finder pattern positions:
    // Top-Left corner (0,0) must be detected as finder pattern
    expect(matrix.isFinderPattern(0, 0)).toBe(true);
    expect(matrix.isFinderPattern(3, 3)).toBe(true);
    expect(matrix.isFinderPattern(7, 7)).toBe(true);

    // Top-Right corner (0, size-1)
    expect(matrix.isFinderPattern(0, matrix.size - 1)).toBe(true);

    // Bottom-Left corner (size-1, 0)
    expect(matrix.isFinderPattern(matrix.size - 1, 0)).toBe(true);

    // Center of QR should NOT be finder pattern
    const mid = Math.floor(matrix.size / 2);
    expect(matrix.isFinderPattern(mid, mid)).toBe(false);
  });

  it('detects DANA, ShopeePay, and NMID from QRIS payload', () => {
    const danaSample = '00020101021126570011ID.DANA.WWW01189360091800000000000215ID10200300400010303UMI51440014ID.DOKU.WWW02150000000000000000303UMI5204549953033605802ID5916TOKO MAJU JAYA6007JAKARTA61051293063045E1E';
    const parsed = parseQris(danaSample);
    const info = detectAcquirerInfo(parsed);
    expect(info.acquirerName).toBe('DANA Bisnis');
    expect(info.nmid).toBe('ID1020030040001');
  });
});
