import type { VoxelBlock } from './types';

/**
 * Procedural Coastal Lighthouse & Keeper's Cottage Builder
 * Constructs red-and-white conical tower, glowing Fresnel beacon,
 * keeper's cottage, and rocky granite island base.
 */
export function buildLighthouse(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const rockW = 5.2;

  // Rocky Granite Island Base
  list.push({ x: 0, y: 0.35, z: 0, sx: rockW * 1.1, sy: 0.7, sz: rockW * 1.05, color: '#1e293b' });

  // Keeper's Cottage beside the lighthouse
  list.push({ x: -1.5, y: 1.2, z: 0.4, sx: 1.8, sy: 1.2, sz: 1.8, color: '#78350f' });
  list.push({ x: -1.5, y: 1.9, z: 0.4, sx: 2.1, sy: 0.5, sz: 2.1, color: '#dc2626' });

  // Conical Striped Lighthouse Tower (Red & White Alternating Bands)
  const towerTiers = [
    { y: 1.2, h: 1.6, w: 2.8, color: '#dc2626' },
    { y: 2.8, h: 1.6, w: 2.5, color: '#ffffff' },
    { y: 4.4, h: 1.6, w: 2.2, color: '#dc2626' },
    { y: 6.0, h: 1.6, w: 1.9, color: '#ffffff' },
    { y: 7.6, h: 1.6, w: 1.7, color: '#dc2626' },
    { y: 9.2, h: 1.4, w: 1.5, color: '#ffffff' },
  ];

  towerTiers.forEach((t) => {
    list.push({
      x: 0.6,
      y: (t.y + t.h / 2) * heightMultiplier,
      z: -0.3,
      sx: t.w,
      sy: t.h * heightMultiplier,
      sz: t.w,
      color: t.color,
    });
  });

  const topY = 10.6 * heightMultiplier;
  // Observation Gallery Balcony
  list.push({ x: 0.6, y: topY + 0.12, z: -0.3, sx: 2.0, sy: 0.24, sz: 2.0, color: '#09090b' });
  // Fresnel Beacon Lantern Chamber (Glowing Warm Gold)
  list.push({ x: 0.6, y: topY + 0.9, z: -0.3, sx: 1.4, sy: 0.85 * heightMultiplier, sz: 1.4, color: '#fef08a' });
  // Domed Copper Roof Cupola & Lightning Rod
  list.push({ x: 0.6, y: topY + 1.5 * heightMultiplier, z: -0.3, sx: 1.7, sy: 0.35, sz: 1.7, color: '#1e293b' });
  list.push({ x: 0.6, y: topY + 2.1 * heightMultiplier, z: -0.3, sx: 0.16, sy: 0.7, sz: 0.16, color: '#fbbf24' });

  return list;
}
