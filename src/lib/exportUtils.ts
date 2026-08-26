/**
 * Export Suite for QRIScape 3D
 * Provides high-resolution Neobrutalism PNG Scan Card generation (Canvas 2D)
 * and binary 3D GLTF (.glb) model exporting.
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { QRMatrixResult, ParsedQris, QRMode, LinkConfig } from './qris';
import type { VoxelTheme } from './themes';
import { generateVoxelDiorama } from './voxelGenerator';
import { detectAcquirerInfo } from './qrScanner';
import qrisSvg from 'idn-finlogos/icons/qris';
import gpnSvg from 'idn-finlogos/icons/gpn';

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
 * Generate a high-DPI (1200x1600) master-grade Neobrutalism printable QRIS standee card
 */
export async function generateScanCardPNG(options: CardExportOptions): Promise<void> {
  const {
    qrMode = 'qris',
    linkConfig,
    merchantName = '',
    merchantCity = '',
    amount = 0,
    invoiceId = '',
    matrix,
    parsedQris,
  } = options;

  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Clean Studio Backdrop
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // 2. Main Merah Putih Poster Card with Hard Solid Black Shadow
  const cardX = 50;
  const cardY = 50;
  const cardW = width - 100; // 1100px
  const cardH = height - 100; // 1500px

  // Flat 14px Solid Black Shadow
  drawNeoBox(ctx, cardX, cardY, cardW, cardH, '#FFFFFF', 14, 5);

  if (qrMode === 'link') {
    // =========================================================================
    // --- LINK / URL RED & WHITE CARD ---
    // =========================================================================

    // Top Header Banner (National Red #DC2626)
    const headerH = 150;
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cardX, cardY, cardW, headerH);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeRect(cardX, cardY, cardW, headerH);

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CONNECT & SCAN', cardX + 45, cardY + 92);

    // Pill Badge Right
    drawNeoBadge(ctx, cardX + cardW - 245, cardY + 52, 200, 46, '#FFFFFF', 'DIRECT LINK');

    // Link Title & Subtitle Card
    const titleBoxY = cardY + 180;
    const linkTitle = (linkConfig?.title || 'WEB DESTINATION').toUpperCase();
    const linkDesc = linkConfig?.description || 'Scan QR Code with smartphone camera to connect';

    drawNeoBox(ctx, cardX + 40, titleBoxY, cardW - 80, 130, '#FFFFFF', 6, 4);

    ctx.fillStyle = '#000000';
    ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(linkTitle, width / 2, titleBoxY + 58);

    ctx.fillStyle = '#475569';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(linkDesc, width / 2, titleBoxY + 98);

    // QR Code Frame
    const qrSizePx = 700;
    const startX = (width - qrSizePx) / 2;
    const startY = cardY + 345;

    drawNeoBox(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50, '#FFFFFF', 8, 4);
    drawNeoCornerReticles(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50);
    drawPureBlackQRMatrix(ctx, matrix, startX, startY, qrSizePx);

    // Destination URL Banner
    const urlY = cardY + 1120;
    drawNeoBox(ctx, cardX + 40, urlY, cardW - 80, 150, '#FFFFFF', 8, 4);

    ctx.fillStyle = '#DC2626';
    ctx.font = '900 20px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('TARGET DESTINATION URL:', cardX + 70, urlY + 48);

    const url = linkConfig?.url || 'https://github.com';
    ctx.fillStyle = '#000000';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    const displayUrl = url.length > 38 ? `${url.slice(0, 35)}...` : url;
    ctx.fillText(displayUrl, cardX + 70, urlY + 105);

    // Footer
    drawNeoFooter(ctx, width, height, 'KOMPATIBEL DENGAN SEMUA APLIKASI KAMERA DAN SCANNER');

    // Trigger Download
    const cleanTitle = (linkConfig?.title || 'link').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    downloadCanvas(canvas, `LINK_${cleanTitle}.png`);
  } else {
    // =========================================================================
    // --- OFFICIAL INDONESIAN MERAH PUTIH QRIS STANDEE CARD ---
    // =========================================================================

    const acquirerInfo = parsedQris ? detectAcquirerInfo(parsedQris) : null;
    const displayName = (merchantName || parsedQris?.merchantName || 'MERCHANT QRIS').toUpperCase();
    const displayCity = (merchantCity || parsedQris?.merchantCity || 'INDONESIA').toUpperCase();
    const displayNmid = acquirerInfo?.nmid || 'ID1020030040';
    const acquirerName = acquirerInfo?.acquirerName || 'ASPI / Bank Indonesia';

    // 1. Top Header Banner (Official Red #DC2626)
    const headerH = 150;
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cardX, cardY, cardW, headerH);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeRect(cardX, cardY, cardW, headerH);

    // Left: Real Official QRIS Logo in Clean White Neo Box
    const qrisBoxW = 220;
    const qrisBoxH = 84;
    const qrisX = cardX + 45;
    const qrisY = cardY + 33;

    drawNeoBox(ctx, qrisX, qrisY, qrisBoxW, qrisBoxH, '#FFFFFF', 4, 3);
    await drawSvgStringToCanvas(ctx, qrisSvg, qrisX + 12, qrisY + 12, qrisBoxW - 24, qrisBoxH - 24);

    // Header Subtitle Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('STANDAR PEMBAYARAN DIGITAL NASIONAL', qrisX + qrisBoxW + 24, cardY + 84);

    // Right: Real Official GPN Logo in Clean White Neo Box
    const gpnBoxW = 120;
    const gpnBoxH = 84;
    const gpnX = cardX + cardW - 45 - gpnBoxW;
    const gpnY = cardY + 33;

    drawNeoBox(ctx, gpnX, gpnY, gpnBoxW, gpnBoxH, '#FFFFFF', 4, 3);
    await drawSvgStringToCanvas(ctx, gpnSvg, gpnX + 12, gpnY + 10, gpnBoxW - 24, gpnBoxH - 20);

    // 2. Floating Merchant Profile Card (Solid White with Hard Shadow)
    const merchantY = cardY + 180;
    const merchantH = 135;

    drawNeoBox(ctx, cardX + 40, merchantY, cardW - 80, merchantH, '#FFFFFF', 6, 4);

    // Sticker Badge Top Left: NMID
    drawNeoBadge(ctx, cardX + 65, merchantY - 14, 280, 30, '#DC2626', `NMID: ${displayNmid}`, '#FFFFFF');

    // Sticker Badge Top Right: Acquirer
    drawNeoBadge(ctx, cardX + cardW - 295, merchantY - 14, 230, 30, '#000000', acquirerName.toUpperCase(), '#FFFFFF');

    // Merchant Name (Clean, Heavyweight, Highly Legible)
    ctx.fillStyle = '#000000';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(displayName, width / 2, merchantY + 68);

    // Location / City Tag (No emojis)
    ctx.fillStyle = '#475569';
    ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.fillText(`KOTA: ${displayCity}`, width / 2, merchantY + 108);

    // 3. Central Acrylic Pure Black QR Matrix Container
    const qrSizePx = 680;
    const startX = (width - qrSizePx) / 2;
    const startY = cardY + 350;

    // Solid White Canvas with Thick 5px Black Border & 10px Hard Shadow
    drawNeoBox(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50, '#FFFFFF', 10, 5);

    // Neo Corner Bracket Reticles (Red #DC2626)
    drawNeoCornerReticles(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50);

    // Draw Pure Black (#000000) QR Modules
    drawPureBlackQRMatrix(ctx, matrix, startX, startY, qrSizePx);

    // 4. Merah Putih Dynamic / Static Payment Banner
    const amountBoxY = cardY + 1090;
    const amountBoxH = 175;

    if (amount > 0) {
      // Dynamic Amount in Official Red (#DC2626)
      drawNeoBox(ctx, cardX + 40, amountBoxY, cardW - 80, amountBoxH, '#DC2626', 8, 5);

      // Status Pill Tag
      drawNeoBadge(ctx, cardX + 70, amountBoxY + 20, 200, 34, '#FFFFFF', 'DYNAMIC AMOUNT', '#000000');

      if (invoiceId) {
        drawNeoBadge(ctx, cardX + cardW - 270, amountBoxY + 20, 200, 34, '#000000', `INV: ${invoiceId}`, '#FFFFFF');
      }

      // Large Formatted Rupiah Amount
      const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formattedAmount, cardX + 70, amountBoxY + 120);

      // Sub-label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('NOMINAL TERKUNCI OTOMATIS', cardX + cardW - 70, amountBoxY + 118);
    } else {
      // Static Standee Mode in Clean White with Red Accent
      drawNeoBox(ctx, cardX + 40, amountBoxY, cardW - 80, amountBoxH, '#FFFFFF', 8, 5);

      ctx.fillStyle = '#DC2626';
      ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN DAN MASUKKAN NOMINAL PEMBAYARAN', width / 2, amountBoxY + 76);

      ctx.fillStyle = '#000000';
      ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.fillText('MENERIMA SEMUA APLIKASI M-BANKING DAN E-WALLET', width / 2, amountBoxY + 122);
    }

    // 5. Professional Red & White Feature Pill Badges (No emojis)
    const badgeY = cardY + 1295;
    const badgeW = 290;
    const badgeGap = 20;
    const totalBadgesW = 3 * badgeW + 2 * badgeGap;
    const startBadgeX = cardX + (cardW - totalBadgesW) / 2;

    drawNeoBadge(ctx, startBadgeX, badgeY, badgeW, 44, '#FFFFFF', 'TERVERIFIKASI RESMI');
    drawNeoBadge(ctx, startBadgeX + badgeW + badgeGap, badgeY, badgeW, 44, '#FFFFFF', 'PEMBAYARAN INSTAN');
    drawNeoBadge(ctx, startBadgeX + (badgeW + badgeGap) * 2, badgeY, badgeW, 44, '#FFFFFF', 'SEMUA BANK DAN EWALLET');

    // 6. Security Footer
    drawNeoFooter(
      ctx,
      width,
      height,
      `STANDAR RESMI ASPI DAN BANK INDONESIA • ACQUIRER: ${acquirerName.toUpperCase()}`
    );

    // 7. Trigger Download
    const cleanName = displayName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const amountTag = amount > 0 ? `_Rp${amount}` : '_Statis';
    downloadCanvas(canvas, `QRIS_${cleanName}${amountTag}.png`);
  }
}

/**
 * Draw a clean Neobrutalism Card Box with Hard Offset Black Shadow
 */
function drawNeoBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string,
  shadowOffset = 6,
  strokeW = 4
) {
  // Hard Solid Black Shadow
  if (shadowOffset > 0) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + shadowOffset, y + shadowOffset, w, h);
  }

  // Card Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);

  // Solid Black Border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = strokeW;
  ctx.strokeRect(x, y, w, h);
}

/**
 * Draw a Neobrutalist Sticker Badge
 */
function drawNeoBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string,
  text: string,
  textColor = '#000000'
) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 3, y + 3, w, h);

  // Body
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);

  // Border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // Text
  ctx.fillStyle = textColor;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + w / 2, y + h / 2 + 5);
}

/**
 * Draw decorative corner reticle brackets in Neobrutalism Merah Putih style
 */
function drawNeoCornerReticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const arm = 24;
  const thickness = 6;
  ctx.fillStyle = '#DC2626';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  const corners = [
    [x - 4, y - 4, 1, 1],
    [x + w + 4, y - 4, -1, 1],
    [x - 4, y + h + 4, 1, -1],
    [x + w + 4, y + h + 4, -1, -1],
  ];

  corners.forEach(([cx, cy, dx, dy]) => {
    // Horizontal arm
    ctx.fillRect(cx, cy, arm * dx, thickness * dy);
    ctx.strokeRect(cx, cy, arm * dx, thickness * dy);
    // Vertical arm
    ctx.fillRect(cx, cy, thickness * dx, arm * dy);
    ctx.strokeRect(cx, cy, thickness * dx, arm * dy);
  });
}

/**
 * Render QR Matrix in Pure Black (#000000) for standard official compliance
 */
function drawPureBlackQRMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: QRMatrixResult,
  startX: number,
  startY: number,
  qrSizePx: number
) {
  const moduleSize = qrSizePx / matrix.size;

  ctx.fillStyle = '#000000';
  for (let r = 0; r < matrix.size; r++) {
    for (let c = 0; c < matrix.size; c++) {
      if (matrix.modules[r][c]) {
        const px = startX + c * moduleSize;
        const py = startY + r * moduleSize;
        ctx.fillRect(px, py, moduleSize + 0.35, moduleSize + 0.35);
      }
    }
  }
}

/**
 * Normalize raw SVG string with proper xmlns and explicit dimensions
 */
function normalizeSvg(rawSvg: string): { svg: string; width: number; height: number } {
  let svg = rawSvg.trim();

  const viewBoxMatch = svg.match(/viewBox=["']\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s*["']/i);
  let vbWidth = 80;
  let vbHeight = 30;
  if (viewBoxMatch) {
    vbWidth = parseFloat(viewBoxMatch[3]) || 80;
    vbHeight = parseFloat(viewBoxMatch[4]) || 30;
  }

  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!/width=["']/.test(svg)) {
    svg = svg.replace('<svg', `<svg width="${vbWidth}"`);
  }
  if (!/height=["']/.test(svg)) {
    svg = svg.replace('<svg', `<svg height="${vbHeight}"`);
  }

  return { svg, width: vbWidth, height: vbHeight };
}

/**
 * Render any SVG string directly onto Canvas 2D with aspect-ratio preservation
 */
function drawSvgStringToCanvas(
  ctx: CanvasRenderingContext2D,
  rawSvg: string,
  targetX: number,
  targetY: number,
  maxW: number,
  maxH: number
): Promise<void> {
  const { svg, width: naturalW, height: naturalH } = normalizeSvg(rawSvg);
  const imgAspect = naturalW / naturalH;
  let drawW = maxW;
  let drawH = maxW / imgAspect;

  if (drawH > maxH) {
    drawH = maxH;
    drawW = maxH * imgAspect;
  }

  const drawX = targetX + (maxW - drawW) / 2;
  const drawY = targetY + (maxH - drawH) / 2;

  const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new Image();

  return new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      resolve();
    };
    img.onerror = () => {
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        ctx.drawImage(fallbackImg, drawX, drawY, drawW, drawH);
        URL.revokeObjectURL(blobUrl);
        resolve();
      };
      fallbackImg.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve();
      };
      fallbackImg.src = blobUrl;
    };
    img.src = dataUri;
  });
}

/**
 * Common Card Neobrutalism Footer
 */
function drawNeoFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  subText: string
) {
  const footerY = height - 72;

  ctx.fillStyle = '#000000';
  ctx.font = '900 15px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(subText, width / 2, footerY);

  ctx.fillStyle = '#64748b';
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
  ctx.fillText('100% CLIENT-SIDE VERIFIED • GENERATED WITH QRISCAPE 3D', width / 2, footerY + 22);
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Export the procedural 3D Voxel Scene to a standard binary GLTF (.glb) file
 */
export async function exportSceneToGLB(
  matrix: QRMatrixResult,
  theme: VoxelTheme,
  heightMultiplier = 1.0
): Promise<void> {
  const scene = new THREE.Scene();
  const diorama = generateVoxelDiorama(matrix, theme, heightMultiplier);

  const geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.05 });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, diorama.voxels.length);
  const dummy = new THREE.Object3D();

  diorama.voxels.forEach((v, i) => {
    dummy.position.set(v.x, v.y * 0.9, v.z);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
    instancedMesh.setColorAt(i, v.color);
  });
  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

  scene.add(instancedMesh);
  const exporter = new GLTFExporter();
  const options = { binary: true };

  try {
    const glbBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        scene,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            resolve(gltf);
          } else {
            reject(new Error('Expected ArrayBuffer for GLB binary export'));
          }
        },
        (err) => reject(err),
        options
      );
    });

    const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QRIS_3D_Scene_${theme.id}.glb`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export GLTF scene:', error);
    throw error;
  }
}
