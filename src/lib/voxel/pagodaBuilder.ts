import type { VoxelBlock } from './types';

/**
 * Procedural Master 5-Tier Japanese Pagoda Temple Builder
 * Constructs authentic cantilevered curved eaves (Sori), interlocking bracket complexes (Dougong),
 * Yakisugi charred cedar lattice walls (Shoji), vermilion lacquered balustrades,
 * front approach stone steps, and sacred 9-ring Sōrin spire with flaming Hōju jewel.
 */
export function buildJapanesePagoda(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const baseW = 4.6;

  // 1. GRANITE PODIUM PLATFORM & 4-WAY STONE APPROACH STEPS (y: 0.0 -> 0.6)
  list.push({ x: 0, y: 0.22, z: 0, sx: baseW * 1.14, sy: 0.44, sz: baseW * 1.14, color: '#1e293b' });
  list.push({ x: 0, y: 0.48, z: 0, sx: baseW * 1.04, sy: 0.12, sz: baseW * 1.04, color: '#334155' });

  // Front stone approach stairway
  list.push({ x: 0, y: 0.16, z: baseW * 0.58, sx: 1.8, sy: 0.32, sz: 0.5, color: '#1e293b' });
  list.push({ x: 0, y: 0.36, z: baseW * 0.54, sx: 1.4, sy: 0.16, sz: 0.4, color: '#334155' });

  // Entrance Vermilion Torii Arch Gate at the front
  const toriiZ = baseW * 0.56;
  const toriiH = 1.4 * heightMultiplier;
  [[-0.65, toriiZ], [0.65, toriiZ]].forEach(([tx, tz]) => {
    list.push({ x: tx, y: 0.48 + toriiH / 2, z: tz, sx: 0.14, sy: toriiH, sz: 0.14, color: '#b91c1c' });
  });
  // Torii Kasagi (Top curved lintel)
  list.push({ x: 0, y: 0.48 + toriiH, z: toriiZ, sx: 1.7, sy: 0.14, sz: 0.18, color: '#991b1b' });
  list.push({ x: 0, y: 0.48 + toriiH - 0.22, z: toriiZ, sx: 1.4, sy: 0.08, sz: 0.12, color: '#b91c1c' });

  const tiers = [
    { bodyW: baseW * 0.80, eaveW: baseW * 1.16, h: 1.7 * heightMultiplier },
    { bodyW: baseW * 0.66, eaveW: baseW * 1.02, h: 1.5 * heightMultiplier },
    { bodyW: baseW * 0.52, eaveW: baseW * 0.88, h: 1.35 * heightMultiplier },
    { bodyW: baseW * 0.40, eaveW: baseW * 0.72, h: 1.2 * heightMultiplier },
    { bodyW: baseW * 0.28, eaveW: baseW * 0.56, h: 1.0 * heightMultiplier },
  ];

  let curY = 0.54;

  tiers.forEach((t, idx) => {
    const wallW = t.bodyW - 0.34;
    const pOff = (t.bodyW - 0.28) / 2;

    // A. Balcony Deck & Vermilion Railings
    list.push({ x: 0, y: curY + 0.06, z: 0, sx: t.bodyW + 0.16, sy: 0.12, sz: t.bodyW + 0.16, color: '#271711' });
    // Railing perimeter balustrade
    list.push({ x: 0, y: curY + 0.18, z: 0, sx: t.bodyW + 0.18, sy: 0.12, sz: t.bodyW + 0.18, color: '#b91c1c' });

    // B. Yakisugi Dark Cedar Core Walls
    list.push({ x: 0, y: curY + t.h / 2, z: 0, sx: wallW, sy: t.h - 0.06, sz: wallW, color: '#09090b' });

    // Shoji / Lattice Relief Insets on 4 wall faces (Tier 1 to 3)
    if (idx < 3) {
      const faceW = wallW * 0.6;
      const shojiH = (t.h - 0.4);
      // North & South Shoji
      list.push({ x: 0, y: curY + t.h / 2, z: -(wallW / 2 + 0.02), sx: faceW, sy: shojiH, sz: 0.05, color: '#451a03' });
      list.push({ x: 0, y: curY + t.h / 2, z: (wallW / 2 + 0.02), sx: faceW, sy: shojiH, sz: 0.05, color: '#451a03' });
      // East & West Shoji
      list.push({ x: -(wallW / 2 + 0.02), y: curY + t.h / 2, z: 0, sx: 0.05, sy: shojiH, sz: faceW, color: '#451a03' });
      list.push({ x: (wallW / 2 + 0.02), y: curY + t.h / 2, z: 0, sx: 0.05, sy: shojiH, sz: faceW, color: '#451a03' });
    }

    // C. Vermilion Corner Support Columns (4 Pillars)
    [[-pOff, -pOff], [pOff, -pOff], [-pOff, pOff], [pOff, pOff]].forEach(([px, pz]) => {
      list.push({ x: px, y: curY + t.h / 2, z: pz, sx: 0.3, sy: t.h - 0.02, sz: 0.3, color: '#b91c1c' });
    });

    // D. Interlocking Dougong Timber Brackets under Eaves
    const eaveY = curY + t.h;
    list.push({ x: 0, y: eaveY - 0.06, z: 0, sx: t.bodyW + 0.08, sy: 0.12, sz: t.bodyW + 0.08, color: '#451a03' });

    // E. Authentic Flared Cantilevered Eaves (Cantilevered with Kick-Up Corners)
    // Main roof plank
    list.push({ x: 0, y: eaveY + 0.08, z: 0, sx: t.eaveW, sy: 0.16, sz: t.eaveW, color: '#991b1b' });
    // Inset upper ridge tier
    list.push({ x: 0, y: eaveY + 0.22, z: 0, sx: t.eaveW * 0.78, sy: 0.14, sz: t.eaveW * 0.78, color: '#991b1b' });
    // Core hip cap
    list.push({ x: 0, y: eaveY + 0.32, z: 0, sx: t.eaveW * 0.54, sy: 0.10, sz: t.eaveW * 0.54, color: '#7f1d1d' });

    // Upturned Golden Corner Finials (Sori / Hien tips)
    const cOff = (t.eaveW - 0.28) / 2;
    [[-cOff, -cOff], [cOff, -cOff], [-cOff, cOff], [cOff, cOff]].forEach(([cx, cz]) => {
      // Corner eave upturn block
      list.push({ x: cx, y: eaveY + 0.18, z: cz, sx: 0.32, sy: 0.14, sz: 0.32, color: '#991b1b' });
      // Gilded bronze finial tip
      list.push({ x: cx, y: eaveY + 0.28, z: cz, sx: 0.22, sy: 0.14, sz: 0.22, color: '#fbbf24' });
    });

    curY += t.h + 0.38;
  });

  // 3. TOP ROOF PYRAMID CAP (Rooftop Hip Structure)
  list.push({ x: 0, y: curY + 0.16, z: 0, sx: 2.1, sy: 0.32, sz: 2.1, color: '#991b1b' });
  list.push({ x: 0, y: curY + 0.42, z: 0, sx: 1.4, sy: 0.26, sz: 1.4, color: '#7f1d1d' });
  // Roban (Square dew basin box)
  list.push({ x: 0, y: curY + 0.62, z: 0, sx: 0.85, sy: 0.16, sz: 0.85, color: '#451a03' });
  // Fukubachi (Inverted bowl pedestal)
  list.push({ x: 0, y: curY + 0.76, z: 0, sx: 0.65, sy: 0.14, sz: 0.65, color: '#fbbf24' });
  curY += 0.82;

  // 4. SACRED GOLDEN SŌRIN SPIRE
  const spireH = 4.2 * heightMultiplier;
  list.push({ x: 0, y: curY + spireH / 2, z: 0, sx: 0.24, sy: spireH, sz: 0.24, color: '#fbbf24' });

  // 9 Sacred Kururin Bronze Rings (Graduated in size from bottom to top)
  for (let r = 0; r < 9; r++) {
    const ringY = curY + 0.32 + r * 0.35 * heightMultiplier;
    const ringW = 0.84 - r * 0.038;
    list.push({ x: 0, y: ringY, z: 0, sx: ringW, sy: 0.11, sz: ringW, color: '#f59e0b' });
  }

  // Suien (Sacred water/flame openwork crest)
  list.push({ x: 0, y: curY + spireH - 0.4, z: 0, sx: 0.52, sy: 0.45, sz: 0.52, color: '#fbbf24' });

  // Sacred Flaming Jewel (Hōju & Ryūsha)
  list.push({ x: 0, y: curY + spireH + 0.18, z: 0, sx: 0.46, sy: 0.46, sz: 0.46, color: '#fef08a' });
  list.push({ x: 0, y: curY + spireH + 0.46, z: 0, sx: 0.16, sy: 0.22, sz: 0.16, color: '#ffffff' });

  return list;
}
