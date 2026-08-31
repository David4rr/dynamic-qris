import { describe, it, expect } from 'bun:test';
import jsQR from 'jsqr';
import { generateQRMatrix, type QRMatrixResult } from './qris';
import { VOXEL_THEMES } from './themes';
import { generateSceneVoxels } from './voxel/sceneVoxelGenerator';

function scanSceneTopDown(matrix: QRMatrixResult, themeId: keyof typeof VOXEL_THEMES) {
  const theme = VOXEL_THEMES[themeId];
  const voxels = generateSceneVoxels(matrix, theme, 1.0);
  const size = matrix.size;
  const scale = 8;
  const border = 4;
  const totalModules = size + border * 2;
  const imgSize = totalModules * scale;
  const pixels = new Uint8ClampedArray(imgSize * imgSize * 4);

  // Background white
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = 255;
  }

  // Painter's algorithm from lowest to highest voxel
  const sorted = [...voxels].sort((a, b) => a.y - b.y);
  const center = (size - 1) / 2;

  for (const v of sorted) {
    const minX = v.x - (v.sx || 1) / 2;
    const maxX = v.x + (v.sx || 1) / 2;
    const minZ = v.z - (v.sz || 1) / 2;
    const maxZ = v.z + (v.sz || 1) / 2;

    const colStart = minX + center + border;
    const colEnd = maxX + center + border;
    const rowStart = minZ + center + border;
    const rowEnd = maxZ + center + border;

    const px0 = Math.max(0, Math.floor(colStart * scale));
    const px1 = Math.min(imgSize - 1, Math.ceil(colEnd * scale));
    const py0 = Math.max(0, Math.floor(rowStart * scale));
    const py1 = Math.min(imgSize - 1, Math.ceil(rowEnd * scale));

    const hex = v.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    for (let py = py0; py <= py1; py++) {
      for (let px = px0; px <= px1; px++) {
        const idx = (py * imgSize + px) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
      }
    }
  }

  const result = jsQR(pixels, imgSize, imgSize, { inversionAttempts: 'attemptBoth' });
  return result?.data ?? null;
}

describe('Voxel QR Top-Down Scannability', () => {
  const testThemes: (keyof typeof VOXEL_THEMES)[] = [
    'japanese-garden',
    'forest-cabin',
    'modern-villa',
    'cyberpunk',
  ];

  it('scans Link QR across all themes for various URL lengths', () => {
    const sampleUrls = [
      'https://instagram.com/',
      'https://wa.me/628123456789',
      'https://github.com',
    ];

    for (const linkUrl of sampleUrls) {
      const matrix = generateQRMatrix(linkUrl, 'H');
      for (const themeId of testThemes) {
        const decoded = scanSceneTopDown(matrix, themeId);
        expect(decoded).toBe(linkUrl);
      }
    }
  });

  it('scans QRIS Dynamic payload across all themes', () => {
    const qrisPayload =
      '00020101021226600016ID.CO.QRIS.WWW01189360091800000000000210ID10200300400303UME51440014ID.CO.QRIS.WWW0215ID10200210000000303UME5204581253033605405500005802ID5917WARUNG KOPI SENJA6007JAKARTA61051295062190115INV-2026-0016304C74A';
    const matrix = generateQRMatrix(qrisPayload, 'H');

    for (const themeId of testThemes) {
      const decoded = scanSceneTopDown(matrix, themeId);
      expect(decoded).toBe(qrisPayload);
    }
  });
});
