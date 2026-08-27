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

  // Set Canvas Dimensions based on mode: 9:16 Story (1080x1920) for Link, 3:4 Standee (1200x1600) for QRIS
  const isLinkMode = qrMode === 'link';
  const width = isLinkMode ? 1080 : 1200;
  const height = isLinkMode ? 1920 : 1600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (isLinkMode) {
    // =========================================================================
    // --- CUTE & COOL 9:16 INSTAGRAM / WHATSAPP STORY POSTER (1080x1920) ---
    // =========================================================================

    // 1. Pastel Lilac & Cream Funky Background
    ctx.fillStyle = '#F5EEFF';
    ctx.fillRect(0, 0, width, height);

    // Playful Checkerboard Accent Pattern (Top & Bottom Bands)
    drawCheckerBand(ctx, 0, 0, width, 28, 28, '#E9D5FF', '#F5EEFF');
    drawCheckerBand(ctx, 0, height - 28, width, 28, 28, '#E9D5FF', '#F5EEFF');

    // Floating Cute Decorative Badges (Top Left & Top Right)
    drawAestheticSticker(ctx, 45, 65, 175, 46, '#FFDE59', '★ SCAN ME! ★', -4);
    drawAestheticSticker(ctx, width - 225, 65, 180, 46, '#F472B6', '✦ DIRECT LINK ✦', 4);

    // 2. Main Hero Story Card (Chunky Neobrutalist with Bold Violet Shadow)
    const cardX = 45;
    const cardY = 135;
    const cardW = width - 90; // 990px
    const cardH = height - 230; // 1555px

    // Big 14px Solid Black Shadow
    drawNeoBox(ctx, cardX, cardY, cardW, cardH, '#FFFDF5', 14, 5);

    // 3. Funky Header Banner (Cyber Pink #F472B6 & Canary #FFDE59)
    const bannerH = 200;
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(cardX, cardY, cardW, bannerH);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeRect(cardX, cardY, cardW, bannerH);

    // Small Top Pill on Banner
    drawNeoBadge(ctx, width / 2 - 110, cardY + 20, 220, 34, '#FFDE59', '⚡ QUICK ACCESS ⚡', '#000000');

    // Big Funky Headline
    const linkTitle = (linkConfig?.title || "LET'S CONNECT!").toUpperCase();
    ctx.fillStyle = '#000000';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, sans-serif';
    ctx.textAlign = 'center';
    const displayTitle = linkTitle.length > 22 ? `${linkTitle.slice(0, 20)}...` : linkTitle;
    ctx.fillText(displayTitle, width / 2, cardY + 115);

    // Subtitle
    const linkDesc = linkConfig?.description || 'Scan dengan kamera HP-mu untuk buka tautan!';
    ctx.fillStyle = '#000000';
    ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(linkDesc, width / 2, cardY + 160);

    // 4. Central Cute Floating QR Code Container
    const qrSizePx = 680;
    const startX = (width - qrSizePx) / 2;
    const startY = cardY + 260;

    // Chunky White QR Box with 10px Hard Black Shadow
    drawNeoBox(ctx, startX - 30, startY - 30, qrSizePx + 60, qrSizePx + 60, '#FFFFFF', 12, 5);

    // Playful Corner Brackets (Bubblegum Pink)
    drawNeoCornerReticles(ctx, startX - 30, startY - 30, qrSizePx + 60, qrSizePx + 60, '#F472B6');

    // Draw Pure Black (#000000) High-Contrast QR Matrix
    drawPureBlackQRMatrix(ctx, matrix, startX, startY, qrSizePx);

    // Floating Corner Sticker Badge on QR
    drawAestheticSticker(ctx, startX + qrSizePx - 70, startY - 48, 120, 36, '#A3E635', 'TAP TO OPEN', 6);

    // 5. Cute Search Capsule / URL Pill Bar
    const urlBoxY = cardY + 1010;
    const urlBoxH = 190;

    // Container Box in Canary Yellow (#FFDE59)
    drawNeoBox(ctx, cardX + 40, urlBoxY, cardW - 80, urlBoxH, '#FFDE59', 8, 5);

    // Browser Pill Header
    ctx.fillStyle = '#000000';
    ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('TAUTAN TUJUAN (URL):', cardX + 70, urlBoxY + 45);
    // Mini Status Tag Right
    drawNeoBadge(ctx, cardX + cardW - 240, urlBoxY + 20, 160, 32, '#FFFFFF', 'TAP & HOLD', '#000000');

    // URL Display Box (White Pill inside Yellow)
    const pillInnerY = urlBoxY + 75;
    drawNeoBox(ctx, cardX + 65, pillInnerY, cardW - 130, 85, '#FFFFFF', 4, 3);

    const rawUrl = linkConfig?.url || 'https://';
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    const displayUrl = rawUrl.length > 34 ? `${rawUrl.slice(0, 31)}...` : rawUrl;
    ctx.fillText(displayUrl, cardX + 90, pillInnerY + 54);

    // 6. Authentic Instagram / WhatsApp Story Link Sticker Mockup
    const stickerY = cardY + 1235;
    const stickerW = cardW - 140; // 850px
    const stickerH = 95;
    const stickerX = cardX + 70;

    // Floating Link Sticker Capsule with Neobrutalism 8px Shadow
    drawNeoBox(ctx, stickerX, stickerY, stickerW, stickerH, '#FFFFFF', 8, 4);

    // Left Link Badge (Cyan Blue #38BDF8)
    drawNeoBadge(ctx, stickerX + 24, stickerY + 22, 70, 50, '#38BDF8', 'LINK', '#000000');
    const textOffsetX = stickerX + 110;
    // Center Link Text & Domain
    const cleanDomain = rawUrl.replace(/^https?:\/\//, '').split('/')[0] || 'KUNJUNGI TAUTAN';
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(cleanDomain.toUpperCase(), textOffsetX, stickerY + 58);

    // Right CTA Pill Button (Electric Lime #A3E635)
    const ctaW = 230;
    const ctaX = stickerX + stickerW - ctaW - 24;
    drawNeoBadge(ctx, ctaX, stickerY + 24, ctaW, 46, '#A3E635', 'BUKA TAUTAN ↗', '#000000');

    // 7. Clean Story Callout (Aesthetic, Zero Clutter)
    ctx.fillStyle = '#475569';
    ctx.font = '800 18px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCREENSHOT CERITA INI & PINDAI LANGSUNG DARI GALERI HP', width / 2, cardY + 1380);

    // Story Footer
    drawNeoFooter(
      ctx,
      width,
      height - 40,
      'SHARE KE INSTAGRAM & WHATSAPP STORY • QRISCAPE 3D'
    );
    // Trigger Download
    const cleanTitle = (linkConfig?.title || 'story').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    downloadCanvas(canvas, `STORY_${cleanTitle}.png`);
  } else {
    // =========================================================================
    // --- OFFICIAL INDONESIAN MERAH PUTIH QRIS STANDEE CARD (1200x1600) ---
    // =========================================================================

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

    const acquirerInfo = parsedQris ? detectAcquirerInfo(parsedQris) : null;
    const displayName = (merchantName || parsedQris?.merchantName || 'MERCHANT QRIS').toUpperCase();
    const displayCity = (merchantCity || parsedQris?.merchantCity || 'INDONESIA').toUpperCase();
    const displayNmid = acquirerInfo?.nmid || 'ID1020030040';
    const acquirerName = acquirerInfo?.acquirerName || 'ASPI / Bank Indonesia';

    // Top Header Banner (Official Red #DC2626)
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

    // Floating Merchant Profile Card
    const merchantY = cardY + 180;
    const merchantH = 135;

    drawNeoBox(ctx, cardX + 40, merchantY, cardW - 80, merchantH, '#FFFFFF', 6, 4);

    drawNeoBadge(ctx, cardX + 65, merchantY - 14, 280, 30, '#DC2626', `NMID: ${displayNmid}`, '#FFFFFF');
    drawNeoBadge(ctx, cardX + cardW - 295, merchantY - 14, 230, 30, '#000000', acquirerName.toUpperCase(), '#FFFFFF');

    ctx.fillStyle = '#000000';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(displayName, width / 2, merchantY + 68);

    ctx.fillStyle = '#475569';
    ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
    ctx.fillText(`KOTA: ${displayCity}`, width / 2, merchantY + 108);

    // Central Acrylic Pure Black QR Matrix
    const qrSizePx = 680;
    const startX = (width - qrSizePx) / 2;
    const startY = cardY + 350;

    drawNeoBox(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50, '#FFFFFF', 10, 5);
    drawNeoCornerReticles(ctx, startX - 25, startY - 25, qrSizePx + 50, qrSizePx + 50, '#DC2626');
    drawPureBlackQRMatrix(ctx, matrix, startX, startY, qrSizePx);

    // Payment Banner
    const amountBoxY = cardY + 1090;
    const amountBoxH = 175;

    if (amount > 0) {
      drawNeoBox(ctx, cardX + 40, amountBoxY, cardW - 80, amountBoxH, '#DC2626', 8, 5);
      drawNeoBadge(ctx, cardX + 70, amountBoxY + 20, 200, 34, '#FFFFFF', 'DYNAMIC AMOUNT', '#000000');

      if (invoiceId) {
        drawNeoBadge(ctx, cardX + cardW - 270, amountBoxY + 20, 200, 34, '#000000', `INV: ${invoiceId}`, '#FFFFFF');
      }

      const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formattedAmount, cardX + 70, amountBoxY + 120);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('NOMINAL TERKUNCI OTOMATIS', cardX + cardW - 70, amountBoxY + 118);
    } else {
      drawNeoBox(ctx, cardX + 40, amountBoxY, cardW - 80, amountBoxH, '#FFFFFF', 8, 5);

      ctx.fillStyle = '#DC2626';
      ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN DAN MASUKKAN NOMINAL PEMBAYARAN', width / 2, amountBoxY + 76);

      ctx.fillStyle = '#000000';
      ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
      ctx.fillText('MENERIMA SEMUA APLIKASI M-BANKING DAN E-WALLET', width / 2, amountBoxY + 122);
    }

    // Feature Pills
    const badgeY = cardY + 1295;
    const badgeW = 290;
    const badgeGap = 20;
    const totalBadgesW = 3 * badgeW + 2 * badgeGap;
    const startBadgeX = cardX + (cardW - totalBadgesW) / 2;

    drawNeoBadge(ctx, startBadgeX, badgeY, badgeW, 44, '#FFFFFF', 'TERVERIFIKASI RESMI');
    drawNeoBadge(ctx, startBadgeX + badgeW + badgeGap, badgeY, badgeW, 44, '#FFFFFF', 'PEMBAYARAN INSTAN');
    drawNeoBadge(ctx, startBadgeX + (badgeW + badgeGap) * 2, badgeY, badgeW, 44, '#FFFFFF', 'SEMUA BANK DAN EWALLET');

    // Footer
    drawNeoFooter(
      ctx,
      width,
      height,
      `STANDAR RESMI ASPI DAN BANK INDONESIA • ACQUIRER: ${acquirerName.toUpperCase()}`
    );

    // Trigger Download
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
 * Draw a decorative checkered band pattern
 */
function drawCheckerBand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  size: number,
  color1: string,
  color2: string
) {
  const cols = Math.ceil(w / size);
  const rows = Math.ceil(h / size);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? color1 : color2;
      ctx.fillRect(x + c * size, y + r * size, size, size);
    }
  }
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
}

/**
 * Draw a cute rotated aesthetic sticker
 */
function drawAestheticSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string,
  text: string,
  angleDeg = 0
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  if (angleDeg !== 0) {
    ctx.rotate((angleDeg * Math.PI) / 180);
  }
  ctx.translate(-w / 2, -h / 2);

  // Hard solid black offset shadow
  ctx.fillStyle = '#000000';
  ctx.fillRect(4, 4, w, h);

  // Body
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, w, h);

  // Text
  ctx.fillStyle = '#000000';
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "SF Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h / 2 + 5);

  ctx.restore();
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
 * Draw decorative corner reticle brackets in Neobrutalism style
 */
function drawNeoCornerReticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color = '#DC2626'
) {
  const arm = 24;
  const thickness = 6;
  ctx.fillStyle = color;
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
