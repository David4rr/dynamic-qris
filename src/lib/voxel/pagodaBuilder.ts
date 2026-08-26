import type { VoxelBlock } from './types';

/**
 * Procedural 5-Tier Japanese Pagoda Temple Builder
 * Constructs traditional Sōrin spire, Kururin bronze rings, Hōju jewel,
 * and flared Yakisugi cedar eaves.
 */
export function buildJapanesePagoda(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const baseW = 4.8;
  const tiers = [
    { bodyW: baseW * 0.82, eaveW: baseW * 1.18, h: 1.8 * heightMultiplier },
    { bodyW: baseW * 0.68, eaveW: baseW * 1.02, h: 1.6 * heightMultiplier },
    { bodyW: baseW * 0.54, eaveW: baseW * 0.86, h: 1.4 * heightMultiplier },
    { bodyW: baseW * 0.40, eaveW: baseW * 0.70, h: 1.2 * heightMultiplier },
    { bodyW: baseW * 0.28, eaveW: baseW * 0.54, h: 1.0 * heightMultiplier },
  ];

  // Stepped Stone Foundation Podium (Charcoal granite)
  list.push({ x: 0, y: 0.3, z: 0, sx: baseW * 1.15, sy: 0.6, sz: baseW * 1.15, color: '#1e293b' });

  let curY = 0.6;

  tiers.forEach((t) => {
    // Recessed Dark Yakisugi Wood Core Walls
    const wallW = t.bodyW - 0.4;
    list.push({ x: 0, y: curY + t.h / 2, z: 0, sx: wallW, sy: t.h - 0.04, sz: wallW, color: '#09090b' });

    // Red Lacquered Corner Support Pillars
    const pOff = (t.bodyW - 0.32) / 2;
    [[-pOff, -pOff], [pOff, -pOff], [-pOff, pOff], [pOff, pOff]].forEach(([px, pz]) => {
      list.push({ x: px, y: curY + t.h / 2, z: pz, sx: 0.34, sy: t.h - 0.02, sz: 0.34, color: '#b91c1c' });
    });

    // Balcony Railing Rim
    list.push({ x: 0, y: curY + 0.12, z: 0, sx: t.bodyW + 0.18, sy: 0.18, sz: t.bodyW + 0.18, color: '#b91c1c' });

    // Flared Overhang Roof Eave
    const eaveY = curY + t.h;
    list.push({ x: 0, y: eaveY + 0.1, z: 0, sx: t.eaveW, sy: 0.2, sz: t.eaveW, color: '#991b1b' });
    list.push({ x: 0, y: eaveY + 0.25, z: 0, sx: t.eaveW * 0.76, sy: 0.14, sz: t.eaveW * 0.76, color: '#991b1b' });

    // Gold Corner Eave Finials
    const cOff = (t.eaveW - 0.32) / 2;
    [[-cOff, -cOff], [cOff, -cOff], [-cOff, cOff], [cOff, cOff]].forEach(([cx, cz]) => {
      list.push({ x: cx, y: eaveY + 0.26, z: cz, sx: 0.34, sy: 0.16, sz: 0.34, color: '#fbbf24' });
    });

    curY += t.h + 0.4;
  });

  // Top Roof Pyramid Cap
  list.push({ x: 0, y: curY + 0.2, z: 0, sx: 2.2, sy: 0.4, sz: 2.2, color: '#991b1b' });
  list.push({ x: 0, y: curY + 0.5, z: 0, sx: 1.4, sy: 0.32, sz: 1.4, color: '#991b1b' });
  curY += 0.65;

  // Towering Golden Sōrin Spire
  const spireH = 4.2 * heightMultiplier;
  list.push({ x: 0, y: curY + spireH / 2, z: 0, sx: 0.3, sy: spireH, sz: 0.3, color: '#fbbf24' });

  // 9 Sacred Kururin Bronze Rings
  for (let r = 0; r < 9; r++) {
    const ringY = curY + 0.35 + r * 0.36 * heightMultiplier;
    list.push({ x: 0, y: ringY, z: 0, sx: 0.85 - r * 0.035, sy: 0.12, sz: 0.85 - r * 0.035, color: '#fbbf24' });
  }

  // Sacred Flaming Jewel (Hōju)
  list.push({ x: 0, y: curY + spireH + 0.2, z: 0, sx: 0.5, sy: 0.5, sz: 0.5, color: '#fef08a' });

  return list;
}
