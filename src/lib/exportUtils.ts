/**
 * Export Suite for QRIScape 3D
 * Provides high-resolution PNG Scan Card generation (Canvas 2D)
 * and binary 3D GLTF (.glb) model exporting.
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { QRMatrixResult, ParsedQris, QRMode, LinkConfig } from './qris';
import type { VoxelTheme } from './themes';
import { generateVoxelDiorama } from './voxelGenerator';

export interface CardExportOptions {
  qrMode?: QRMode;
  linkConfig?: LinkConfig;
  merchantName?: string;
  merchantCity?: string;
  amount?: number;
  invoiceId?: string;
  matrix: QRMatrixResult;
  theme: VoxelTheme;
  parsedQris?: ParsedQris;
}
/**
 * Generate a high-DPI (1200x1600) printable and displayable QRIS merchant card
 */
export async function generateScanCardPNG(options: CardExportOptions): Promise<void> {
  const {
    qrMode = 'qris',
    linkConfig,
    merchantName = 'MERCHANT',
    merchantCity = 'INDONESIA',
    amount = 0,
    invoiceId,
    matrix,
    theme,
  } = options;

  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background Base Card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  if (qrMode === 'link') {
    // --- LINK / URL MODE SCAN CARD ---
    // 2. Header Area
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WEB & SOCIAL QR', 80, 105);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Scan to Open & Connect', 510, 105);

    // Cyan accent stripe
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(80, 125, 1040, 6);

    // 3. Link Title & Description
    const linkTitle = (linkConfig?.title || 'WEB DESTINATION').toUpperCase();
    const linkDesc = linkConfig?.description || 'Scan QR Code with any smartphone camera';

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 50px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(linkTitle, width / 2, 280);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(linkDesc, width / 2, 330);

    // 4. Draw QR Code Matrix in Center
    const qrSizePx = 760;
    const startX = (width - qrSizePx) / 2;
    const startY = 380;

    // Background frame around QR code
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(startX - 30, startY - 30, qrSizePx + 60, qrSizePx + 60, 24);
    ctx.fill();
    ctx.stroke();

    const moduleSize = qrSizePx / matrix.size;

    for (let r = 0; r < matrix.size; r++) {
      for (let c = 0; c < matrix.size; c++) {
        const isDark = matrix.modules[r][c];
        const isFinder = matrix.isFinderPattern(r, c);

        const px = startX + c * moduleSize;
        const py = startY + r * moduleSize;

        if (isFinder) {
          ctx.fillStyle = isDark ? theme.finderAnchor.outer : theme.finderAnchor.inner;
        } else if (isDark) {
          ctx.fillStyle = theme.darkPalette.roof;
        } else {
          ctx.fillStyle = theme.lightPalette.ground;
        }

        ctx.fillRect(px, py, moduleSize + 0.5, moduleSize + 0.5);
      }
    }

    // 5. Destination URL Banner
    const amountY = 1240;
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(80, amountY, 1040, 180, 20);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TARGET DESTINATION URL', 120, amountY + 60);

    ctx.fillStyle = '#0284c7';
    ctx.textAlign = 'right';
    ctx.fillText('DIRECT REDIRECT', 1080, amountY + 60);

    const url = linkConfig?.url || 'https://github.com';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "SF Mono", Consolas, Monaco, monospace';
    ctx.textAlign = 'left';
    const displayUrl = url.length > 46 ? `${url.slice(0, 43)}...` : url;
    ctx.fillText(displayUrl, 120, amountY + 130);

    // 6. Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Compatible with iOS Camera, Google Lens & All Standard QR Scanners', width / 2, 1490);
    ctx.fillText('Generated with QRIScape 3D • 100% Client-Side Verified', width / 2, 1530);

    // 7. Trigger Direct Download
    const link = document.createElement('a');
    const cleanTitle = (linkConfig?.title || 'link').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.download = `LINK_${cleanTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else {
    // --- STANDARD INDONESIAN QRIS PAYMENT CARD ---
    // 2. Header Area
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, 180);

    // National QRIS Brand Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('QRIS', 80, 105);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('QR Code Indonesian Standard', 210, 105);

    // Red & Black national stripe
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(80, 125, 1040, 6);

    // 3. Merchant Details Box
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(merchantName.toUpperCase(), width / 2, 280);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`NMID: ID1020030040 • ${merchantCity.toUpperCase()}`, width / 2, 330);

    // 4. Draw QR Code Matrix in Center
    const qrSizePx = 760;
    const startX = (width - qrSizePx) / 2;
    const startY = 380;

    // Background frame around QR code
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(startX - 30, startY - 30, qrSizePx + 60, qrSizePx + 60, 24);
    ctx.fill();
    ctx.stroke();

    const moduleSize = qrSizePx / matrix.size;

    for (let r = 0; r < matrix.size; r++) {
      for (let c = 0; c < matrix.size; c++) {
        const isDark = matrix.modules[r][c];
        const isFinder = matrix.isFinderPattern(r, c);

        const px = startX + c * moduleSize;
        const py = startY + r * moduleSize;

        if (isFinder) {
          ctx.fillStyle = isDark ? theme.finderAnchor.outer : theme.finderAnchor.inner;
        } else if (isDark) {
          ctx.fillStyle = theme.darkPalette.roof;
        } else {
          ctx.fillStyle = theme.lightPalette.ground;
        }

        ctx.fillRect(px, py, moduleSize + 0.5, moduleSize + 0.5);
      }
    }

    // 5. Amount & Invoice Details Banner
    const amountY = 1240;

    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(80, amountY, 1040, 180, 20);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL PEMBAYARAN', 120, amountY + 60);

    if (invoiceId) {
      ctx.textAlign = 'right';
      ctx.fillText(`INVOICE: ${invoiceId}`, 1080, amountY + 60);
    }

    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formattedAmount, 120, amountY + 130);

    // 6. Security Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Terima Pembayaran dari Semua Aplikasi m-Banking & e-Wallet di Indonesia', width / 2, 1490);
    ctx.fillText('Generated with QRIScape 3D • 100% Client-Side Verified', width / 2, 1530);

    // 7. Trigger Direct Download
    const link = document.createElement('a');
    const cleanName = merchantName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.download = `QRIS_${cleanName}_Rp${amount}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

/**
 * Export the procedural 3D Voxel Scene to a standard binary GLTF (.glb) file
 */
export async function exportSceneToGLB(
  matrix: QRMatrixResult,
  theme: VoxelTheme,
  heightMultiplier = 1.0
): Promise<void> {
  const { voxels, gridSize } = generateVoxelDiorama(matrix, theme, heightMultiplier);

  // Create isolated Three.js export scene
  const exportScene = new THREE.Scene();
  exportScene.name = 'QRIScape_3D_Diorama';

  const boxGeometry = new THREE.BoxGeometry(0.94, 1, 0.94);
  const baseplateSize = gridSize + 2.0;

  // Group all voxels
  const voxelGroup = new THREE.Group();
  voxelGroup.name = 'Voxel_Buildings_And_Terrain';

  // Group materials by hex color to minimize meshes in GLTF
  const materialMap = new Map<string, THREE.MeshStandardMaterial>();

  for (const v of voxels) {
    const hex = `#${v.color.getHexString()}`;
    if (!materialMap.has(hex)) {
      materialMap.set(
        hex,
        new THREE.MeshStandardMaterial({
          color: v.color,
          roughness: 0.4,
          metalness: 0.1,
        })
      );
    }
    const mat = materialMap.get(hex)!;

    const mesh = new THREE.Mesh(boxGeometry, mat);
    mesh.position.set(v.x, v.y + 0.5, v.z);
    mesh.scale.set(0.92, 0.92, 0.92);
    mesh.name = `${v.role}_${v.gridRow}_${v.gridCol}_${v.y}`;
    voxelGroup.add(mesh);

  }

  exportScene.add(voxelGroup);

  // Add Baseplate
  const baseplateMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(theme.environment.baseplateColor),
    roughness: 0.8,
    metalness: 0.1,
  });
  const baseplateMesh = new THREE.Mesh(
    new THREE.BoxGeometry(baseplateSize, 0.5, baseplateSize),
    baseplateMat
  );
  baseplateMesh.position.set(0, -0.25, 0);
  baseplateMesh.name = 'Diorama_Baseplate';
  exportScene.add(baseplateMesh);

  // Export to GLB binary
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      exportScene,
      (gltf) => {
        const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
        const link = document.createElement('a');
        link.download = `QRIS_3D_Diorama_${theme.id}.glb`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        resolve();
      },
      (error) => {
        console.error('An error occurred exporting GLTF:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}
