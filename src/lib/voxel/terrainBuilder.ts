import type { VoxelBlock } from './types';
import type { VoxelTheme } from '../themes';

/**
 * 1. Build High-Contrast Finder Pattern Corner Anchors (7x7 Modules)
 */
export function buildFinderAnchorVoxels(
  r: number,
  c: number,
  size: number,
  theme: VoxelTheme,
  heightMultiplier: number,
  x: number,
  z: number
): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const isTopLeft = r <= 6 && c <= 6;
  const isTopRight = r <= 6 && c >= size - 7;
  const isBottomLeft = r >= size - 7 && c <= 6;

  let lr = r;
  let lc = c;
  if (isTopRight) lc = c - (size - 7);
  if (isBottomLeft) lr = r - (size - 7);

  if (isTopLeft || isTopRight || isBottomLeft) {
    const isCore = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    const isMidGap = lr >= 1 && lr <= 5 && lc >= 1 && lc <= 5 && !isCore;
    const isOuter = !isCore && !isMidGap;

    if (isCore) {
      // 3x3 Center Core
      list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#09090b' });
      list.push({
        x,
        y: 0.65 * heightMultiplier,
        z,
        sx: 0.88,
        sy: 0.4 * heightMultiplier,
        sz: 0.88,
        color: theme.finderAnchor.center || '#09090b',
      });
    } else if (isMidGap) {
      // 5x5 Inner Gap
      list.push({ x, y: 0.02, z, sx: 0.98, sy: 0.04, sz: 0.98, color: '#ffffff' });
    } else if (isOuter) {
      // 7x7 Perimeter Wall
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({
        x,
        y: 0.55 * heightMultiplier,
        z,
        sx: 0.92,
        sy: 0.35 * heightMultiplier,
        sz: 0.92,
        color: theme.finderAnchor.outer || '#09090b',
      });
    }
  }

  return list;
}

/**
 * 2. Build Theme-Tailored 3D Ground Tiles (Light Modules)
 */
export function buildGroundTileVoxels(
  r: number,
  c: number,
  size: number,
  themeId: string,
  rand: number,
  dist: number,
  landmarkRadius: number,
  x: number,
  z: number
): VoxelBlock[] {
  const list: VoxelBlock[] = [];

  if (themeId === 'japanese-garden') {
    // Zen Garden: White Gravel, Stone Stepping Paths & Azure Koi Pond Basin
    const isKoiWater = (r % 6 === 0 || c % 6 === 0) && dist > landmarkRadius && dist < size * 0.42;
    const isStonePath = (r + c) % 4 === 0 || Math.abs(x) === 1 || Math.abs(z) === 1;

    if (isKoiWater) {
      list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#38bdf8' });
    } else if (isStonePath) {
      list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#e2e8f0' });
    } else {
      const h = 0.04 + (rand > 0.6 ? 0.02 : 0);
      list.push({ x, y: h / 2, z, sx: 0.96, sy: h, sz: 0.96, color: rand > 0.5 ? '#ffffff' : '#f8fafc' });
    }
  } else if (themeId === 'forest-cabin') {
    // Alpine Forest: Snow Clearing, Sandy Dirt Trails & Mountain Creek
    const isCreek = (r % 7 === 0 || c % 7 === 0) && dist > landmarkRadius;
    const isTrail = (r * 2 + c) % 5 === 0 || Math.abs(x - z) <= 1;

    if (isCreek) {
      list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#7dd3fc' });
    } else if (isTrail) {
      list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#fef3c7' });
    } else {
      list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
    }
  } else if (themeId === 'modern-villa') {
    // Modern Villa: Polished Limestone, Teak Deck Walkways & Plunge Pool Channels
    const isPoolWater = (r % 5 === 0 || c % 5 === 0) && dist > landmarkRadius && dist < size * 0.4;
    const isTeakWalkway = (r + c * 2) % 6 === 0;

    if (isPoolWater) {
      list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#38bdf8' });
    } else if (isTeakWalkway) {
      list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#fde68a' });
    } else {
      list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
    }
  } else {
    // Coastal Lighthouse: Sand Dunes, Wooden Boardwalks & Ocean Surf
    const isOceanSurf = (r % 6 === 0 || c % 6 === 0) && dist > landmarkRadius;
    const isBoardwalk = (r - c) % 5 === 0;

    if (isOceanSurf) {
      list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#38bdf8' });
    } else if (isBoardwalk) {
      list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#fed7aa' });
    } else {
      list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
    }
  }

  return list;
}

/**
 * 3. Build Dark Module 3D Botanical & Architectural Blocks
 */
export function buildDarkModuleVoxels(
  themeId: string,
  rand: number,
  heightMultiplier: number,
  x: number,
  z: number
): VoxelBlock[] {
  const list: VoxelBlock[] = [];

  if (themeId === 'japanese-garden') {
    if (rand < 0.45) {
      // Matsu Pine Tree
      const treeH = (1.2 + rand * 1.3) * heightMultiplier;
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({ x, y: treeH * 0.35, z, sx: 0.35, sy: treeH * 0.5, sz: 0.35, color: '#3e2723' });
      list.push({ x, y: treeH * 0.7, z, sx: 0.92, sy: treeH * 0.35, sz: 0.92, color: '#064e3b' });
      list.push({ x, y: treeH * 0.95, z, sx: 0.72, sy: treeH * 0.25, sz: 0.72, color: '#14532d' });
    } else if (rand < 0.75) {
      // Sakura Bonsai
      const treeH = (1.0 + rand * 1.1) * heightMultiplier;
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({ x, y: treeH * 0.35, z, sx: 0.35, sy: treeH * 0.5, sz: 0.35, color: '#3e2723' });
      list.push({ x, y: treeH * 0.7, z, sx: 0.92, sy: treeH * 0.35, sz: 0.92, color: '#be123c' });
      list.push({ x, y: treeH * 0.95, z, sx: 0.72, sy: treeH * 0.25, sz: 0.72, color: '#e11d48' });
    } else {
      // Kasuga Stone Lantern
      list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#09090b' });
      list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.55, sy: 0.45 * heightMultiplier, sz: 0.55, color: '#1e293b' });
      list.push({ x, y: 0.95 * heightMultiplier, z, sx: 0.88, sy: 0.25 * heightMultiplier, sz: 0.88, color: '#09090b' });
    }
  } else if (themeId === 'forest-cabin') {
    if (rand < 0.55) {
      // Alpine Evergreen Spruce Tree
      const treeH = (1.4 + rand * 1.5) * heightMultiplier;
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#1c120c' });
      list.push({ x, y: treeH * 0.3, z, sx: 0.36, sy: treeH * 0.4, sz: 0.36, color: '#451a03' });
      list.push({ x, y: treeH * 0.65, z, sx: 0.94, sy: treeH * 0.4, sz: 0.94, color: '#064e3b' });
      list.push({ x, y: treeH * 0.92, z, sx: 0.72, sy: treeH * 0.3, sz: 0.72, color: '#14532d' });
    } else if (rand < 0.8) {
      // Timber Cabin Block
      list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#451a03' });
      list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.86, sy: 0.45 * heightMultiplier, sz: 0.86, color: '#78350f' });
      list.push({ x, y: 0.95 * heightMultiplier, z, sx: 0.92, sy: 0.25 * heightMultiplier, sz: 0.92, color: '#14532d' });
    } else {
      // Riverbed Granite Boulder
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#1e293b' });
      list.push({ x, y: 0.55 * heightMultiplier, z, sx: 0.75, sy: 0.4 * heightMultiplier, sz: 0.75, color: '#475569' });
    }
  } else if (themeId === 'modern-villa') {
    if (rand < 0.5) {
      // Royal Palm Tree
      const palmH = (1.3 + rand * 1.3) * heightMultiplier;
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({ x, y: palmH * 0.4, z, sx: 0.3, sy: palmH * 0.6, sz: 0.3, color: '#78350f' });
      list.push({ x, y: palmH * 0.85, z, sx: 0.94, sy: palmH * 0.25, sz: 0.94, color: '#15803d' });
    } else if (rand < 0.8) {
      // Architecture Charcoal Concrete Block
      list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#09090b' });
      list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.86, sy: 0.4 * heightMultiplier, sz: 0.86, color: '#1e293b' });
    } else {
      // Teak Feature Column
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.6, sy: 0.5 * heightMultiplier, sz: 0.6, color: '#b45309' });
    }
  } else {
    // Coastal Coconut Palm & Sea Rock
    if (rand < 0.55) {
      const palmH = (1.3 + rand * 1.4) * heightMultiplier;
      list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
      list.push({ x, y: palmH * 0.4, z, sx: 0.3, sy: palmH * 0.6, sz: 0.3, color: '#78350f' });
      list.push({ x, y: palmH * 0.85, z, sx: 0.94, sy: palmH * 0.25, sz: 0.94, color: '#15803d' });
    } else {
      list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#1e293b' });
      list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.82, sy: 0.35 * heightMultiplier, sz: 0.82, color: '#334155' });
    }
  }

  return list;
}
