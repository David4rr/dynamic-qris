import type { VoxelBlock } from './types';

/**
 * Procedural Luxury Architectural Modern Villa Builder
 * Constructs cantilevered concrete master suite, teak louvers, infinity pool,
 * floor-to-ceiling glass pavilion, and rooftop pergola.
 */
export function buildModernVilla(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const vW = 5.0;
  const vD = 4.8;

  // 1. GROUND PODIUM & POOL TERRACE (y: 0.0 -> 0.5)
  list.push({ x: 0, y: 0.25, z: 0, sx: vW * 1.12, sy: 0.5, sz: vD * 1.12, color: '#1e293b' });
  list.push({ x: 0.2, y: 0.52, z: vD * 0.24, sx: vW * 0.7, sy: 0.08, sz: vD * 0.56, color: '#b45309' });
  list.push({ x: -vW * 0.3, y: 0.51, z: vD * 0.24, sx: vW * 0.36, sy: 0.06, sz: vD * 0.52, color: '#38bdf8' });
  list.push({ x: -vW * 0.3, y: 0.53, z: vD * 0.52, sx: vW * 0.38, sy: 0.08, sz: 0.08, color: '#ffffff' });

  // Minimalist Pool Daybed
  list.push({ x: vW * 0.28, y: 0.62, z: vD * 0.35, sx: 0.55, sy: 0.14, sz: 1.1, color: '#ffffff' });
  list.push({ x: vW * 0.28, y: 0.72, z: vD * 0.15, sx: 0.55, sy: 0.12, sz: 0.35, color: '#78350f' });

  // 2. GROUND FLOOR LIVING PAVILION (y: 0.5 -> 2.1)
  const f1H = 1.6 * heightMultiplier;
  const f1Y = 0.54;

  const pOffX = (vW * 0.88) / 2;
  const pOffZ = (vD * 0.88) / 2;
  [
    [-pOffX, -pOffZ],
    [pOffX, -pOffZ],
    [-pOffX, pOffZ],
    [pOffX, pOffZ],
  ].forEach(([px, pz]) => {
    list.push({ x: px, y: f1Y + f1H / 2, z: pz, sx: 0.32, sy: f1H, sz: 0.32, color: '#09090b' });
  });

  list.push({ x: -vW * 0.28, y: f1Y + f1H / 2, z: -vD * 0.12, sx: 0.45, sy: f1H, sz: vD * 0.68, color: '#0f172a' });
  list.push({ x: 0, y: f1Y + f1H / 2, z: -vD * 0.38, sx: vW * 0.76, sy: f1H, sz: 0.35, color: '#1e293b' });

  // Tinted Glass Facade
  list.push({ x: vW * 0.14, y: f1Y + f1H / 2, z: vD * 0.08, sx: vW * 0.52, sy: f1H - 0.1, sz: 0.18, color: '#0284c7' });
  list.push({ x: vW * 0.36, y: f1Y + f1H / 2, z: -vD * 0.12, sx: 0.18, sy: f1H - 0.1, sz: vD * 0.46, color: '#0284c7' });
  list.push({ x: -0.1, y: f1Y + f1H / 2, z: 0, sx: vW * 0.45, sy: f1H - 0.1, sz: vD * 0.4, color: '#78350f' });

  // 3. FLOOR 2: CANTILEVERED MASTER SUITE (y: 2.14 -> 3.8)
  const f2Y = f1Y + f1H;
  const f2H = 1.6 * heightMultiplier;

  list.push({ x: 0.1, y: f2Y + 0.08, z: 0.1, sx: vW * 0.98, sy: 0.16, sz: vD * 0.98, color: '#f8fafc' });
  list.push({ x: 0.08, y: f2Y + 0.16 + f2H / 2, z: 0.06, sx: vW * 0.88, sy: f2H, sz: vD * 0.82, color: '#ffffff' });
  list.push({ x: -vW * 0.28, y: f2Y + 0.16 + f2H / 2, z: vD * 0.28, sx: 0.18, sy: f2H - 0.15, sz: vD * 0.42, color: '#b45309' });
  list.push({ x: 0.16, y: f2Y + 0.16 + f2H / 2, z: vD * 0.46, sx: vW * 0.48, sy: f2H - 0.15, sz: 0.14, color: '#b45309' });

  // Panoramic Corner Master Bedroom Glass & Balcony
  list.push({ x: vW * 0.26, y: f2Y + 0.16 + f2H / 2, z: 0.1, sx: 0.14, sy: f2H - 0.2, sz: vD * 0.52, color: '#0369a1' });
  list.push({ x: 0.12, y: f2Y + 0.16 + f2H / 2, z: -vD * 0.28, sx: vW * 0.62, sy: f2H - 0.2, sz: 0.14, color: '#0369a1' });
  list.push({ x: 0.12, y: f2Y + 0.22, z: vD * 0.54, sx: vW * 0.65, sy: 0.38, sz: 0.08, color: '#38bdf8' });
  list.push({ x: 0.12, y: f2Y + 0.42, z: vD * 0.54, sx: vW * 0.68, sy: 0.06, sz: 0.1, color: '#09090b' });

  // 4. FLOOR 3: ROOFTOP SKY LOUNGE & PERGOLA (y: 3.8 -> 5.2)
  const roofY = f2Y + 0.16 + f2H;

  list.push({ x: 0.08, y: roofY + 0.1, z: 0.06, sx: vW * 0.84, sy: 0.2, sz: vD * 0.78, color: '#ffffff' });

  const pergX = vW * 0.2;
  const pergZ = -vD * 0.06;
  const pergH = 1.2 * heightMultiplier;

  [
    [-0.8, -0.8],
    [0.8, -0.8],
    [-0.8, 0.8],
    [0.8, 0.8],
  ].forEach(([dx, dz]) => {
    list.push({ x: pergX + dx * 0.7, y: roofY + 0.2 + pergH / 2, z: pergZ + dz * 0.7, sx: 0.12, sy: pergH, sz: 0.12, color: '#09090b' });
  });

  for (let b = -3; b <= 3; b++) {
    list.push({ x: pergX + b * 0.22, y: roofY + 0.2 + pergH + 0.05, z: pergZ, sx: 0.1, sy: 0.08, sz: 1.45, color: '#b45309' });
  }

  // Rooftop Jacuzzi & Planter
  list.push({ x: -vW * 0.18, y: roofY + 0.26, z: vD * 0.1, sx: vW * 0.3, sy: 0.32, sz: vD * 0.34, color: '#38bdf8' });
  list.push({ x: -vW * 0.18, y: roofY + 0.42, z: vD * 0.27, sx: vW * 0.32, sy: 0.06, sz: 0.06, color: '#0284c7' });
  list.push({ x: -vW * 0.22, y: roofY + 0.26, z: -vD * 0.18, sx: 0.55, sy: 0.3, sz: 0.55, color: '#ffffff' });
  list.push({ x: -vW * 0.22, y: roofY + 0.48, z: -vD * 0.18, sx: 0.45, sy: 0.25, sz: 0.45, color: '#15803d' });

  return list;
}
