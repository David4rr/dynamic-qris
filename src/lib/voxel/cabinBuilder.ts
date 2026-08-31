import type { VoxelBlock } from './types';

/**
 * Procedural Alpine Mountain Log Cabin Builder
 * Constructs an authentic high-altitude A-frame alpine lodge with steep pine roofs,
 * fieldstone chimney, covered front porch veranda, timber log corners,
 * warm glowing windows, and stacked firewood store.
 */
export function buildAlpineCabin(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const cW = 4.8;
  const cD = 4.4;

  // 1. RUGGED GRANITE FOUNDATION & ENTRANCE STEPS (y: 0.0 -> 0.6)
  list.push({ x: 0, y: 0.25, z: 0, sx: cW * 1.08, sy: 0.5, sz: cD * 1.08, color: '#1e293b' });
  list.push({ x: 0, y: 0.52, z: 0, sx: cW * 1.02, sy: 0.1, sz: cD * 1.02, color: '#334155' });
  // Front entrance porch steps
  list.push({ x: 0, y: 0.18, z: cD * 0.58, sx: 1.8, sy: 0.36, sz: 0.6, color: '#1e293b' });
  list.push({ x: 0, y: 0.38, z: cD * 0.54, sx: 1.4, sy: 0.18, sz: 0.45, color: '#334155' });

  // 2. FRONT PORCH VERANDA & LOG POSTS (y: 0.55 -> 2.2)
  const porchZ = cD * 0.34;
  const porchW = cW * 0.88;
  const porchH = 1.6 * heightMultiplier;

  // Veranda deck planking
  list.push({ x: 0, y: 0.58, z: porchZ, sx: porchW, sy: 0.08, sz: 1.4, color: '#78350f' });

  // Front porch log corner columns
  [[-porchW * 0.45, porchZ + 0.55], [porchW * 0.45, porchZ + 0.55]].forEach(([px, pz]) => {
    list.push({ x: px, y: 0.6 + porchH / 2, z: pz, sx: 0.28, sy: porchH, sz: 0.28, color: '#451a03' });
  });

  // Veranda safety railing & crossbeam
  list.push({ x: 0, y: 0.6 + porchH, z: porchZ + 0.55, sx: porchW * 0.94, sy: 0.16, sz: 0.24, color: '#451a03' });
  list.push({ x: -porchW * 0.3, y: 0.9, z: porchZ + 0.55, sx: porchW * 0.32, sy: 0.12, sz: 0.12, color: '#78350f' });
  list.push({ x: porchW * 0.3, y: 0.9, z: porchZ + 0.55, sx: porchW * 0.32, sy: 0.12, sz: 0.12, color: '#78350f' });

  // 3. MAIN TIMBER LOG WALLS & ROOM (y: 0.6 -> 2.2)
  const wallH = 1.6 * heightMultiplier;
  const mainBodyW = cW * 0.84;
  const mainBodyD = cD * 0.76;
  const wallCenterZ = -0.25;

  // Solid dark cedar timber core
  list.push({ x: 0, y: 0.6 + wallH / 2, z: wallCenterZ, sx: mainBodyW, sy: wallH, sz: mainBodyD, color: '#271711' });

  // Authentic interlocking log corners (notched log ends protruding)
  const cornerOffsetX = mainBodyW / 2;
  const cornerOffsetZ = mainBodyD / 2;
  [
    [-cornerOffsetX, wallCenterZ - cornerOffsetZ],
    [cornerOffsetX, wallCenterZ - cornerOffsetZ],
    [-cornerOffsetX, wallCenterZ + cornerOffsetZ],
    [cornerOffsetX, wallCenterZ + cornerOffsetZ],
  ].forEach(([cx, cz]) => {
    list.push({ x: cx, y: 0.6 + wallH / 2, z: cz, sx: 0.34, sy: wallH + 0.04, sz: 0.34, color: '#451a03' });
  });

  // Front cabin wooden entrance door
  list.push({ x: 0, y: 0.6 + 0.65 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.04, sx: 0.65, sy: 1.25 * heightMultiplier, sz: 0.1, color: '#78350f' });
  list.push({ x: 0.22, y: 0.6 + 0.65 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.1, sx: 0.06, sy: 0.06, sz: 0.06, color: '#f59e0b' }); // Brass door handle

  // Cozy warm glowing amber windows
  list.push({ x: -1.05, y: 1.35 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.03, sx: 0.65, sy: 0.65 * heightMultiplier, sz: 0.08, color: '#f59e0b' });
  list.push({ x: 1.05, y: 1.35 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.03, sx: 0.65, sy: 0.65 * heightMultiplier, sz: 0.08, color: '#f59e0b' });
  // Window muntin bars (cross grid)
  list.push({ x: -1.05, y: 1.35 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.07, sx: 0.65, sy: 0.06, sz: 0.04, color: '#1c120c' });
  list.push({ x: 1.05, y: 1.35 * heightMultiplier, z: wallCenterZ + cornerOffsetZ + 0.07, sx: 0.65, sy: 0.06, sz: 0.04, color: '#1c120c' });

  // 4. STEEP ALPINE A-FRAME TIMBER ROOF (y: 2.2 -> 4.5)
  const roofStartY = 0.6 + wallH;
  const roofTiers = [
    { w: mainBodyW * 1.28, d: mainBodyD * 1.24, h: 0.32, yOff: 0.16 },
    { w: mainBodyW * 1.05, d: mainBodyD * 1.15, h: 0.34, yOff: 0.48 },
    { w: mainBodyW * 0.82, d: mainBodyD * 1.05, h: 0.36, yOff: 0.82 },
    { w: mainBodyW * 0.58, d: mainBodyD * 0.96, h: 0.38, yOff: 1.18 },
    { w: mainBodyW * 0.35, d: mainBodyD * 0.88, h: 0.40, yOff: 1.56 },
    { w: mainBodyW * 0.16, d: mainBodyD * 0.82, h: 0.28, yOff: 1.88 },
  ];

  roofTiers.forEach((rt) => {
    list.push({
      x: 0,
      y: roofStartY + rt.yOff * heightMultiplier,
      z: wallCenterZ,
      sx: rt.w,
      sy: rt.h * heightMultiplier,
      sz: rt.d,
      color: '#14532d', // Deep Alpine evergreen pine shingle
    });
  });

  // Roof Gable Ridge Beam Cap
  list.push({
    x: 0,
    y: roofStartY + 2.06 * heightMultiplier,
    z: wallCenterZ,
    sx: 0.22,
    sy: 0.16 * heightMultiplier,
    sz: mainBodyD * 1.32,
    color: '#064e3b',
  });

  // Gable Peak Attic Dormer Window
  list.push({
    x: 0,
    y: roofStartY + 0.85 * heightMultiplier,
    z: wallCenterZ + cornerOffsetZ * 0.95,
    sx: 0.45,
    sy: 0.45 * heightMultiplier,
    sz: 0.12,
    color: '#fbbf24',
  });

  // 5. TALL FIELDSTONE CHIMNEY & SMOKE PUFFS (Right flank)
  const chimX = mainBodyW * 0.46;
  const chimZ = wallCenterZ - 0.2;
  const chimH = 4.4 * heightMultiplier;

  // Rugged stone chimney stack
  list.push({ x: chimX, y: chimH / 2, z: chimZ, sx: 0.72, sy: chimH, sz: 0.72, color: '#334155' });
  list.push({ x: chimX, y: chimH + 0.12, z: chimZ, sx: 0.84, sy: 0.24, sz: 0.84, color: '#1e293b' }); // Chimney cap crown
  list.push({ x: chimX, y: chimH + 0.32, z: chimZ, sx: 0.42, sy: 0.18, sz: 0.42, color: '#09090b' }); // Flue pipe

  // Realistic voxel smoke puffs rising into the cold alpine air
  list.push({ x: chimX + 0.08, y: chimH + 0.65 * heightMultiplier, z: chimZ - 0.05, sx: 0.28, sy: 0.28, sz: 0.28, color: '#e2e8f0' });
  list.push({ x: chimX + 0.18, y: chimH + 1.05 * heightMultiplier, z: chimZ - 0.12, sx: 0.38, sy: 0.36, sz: 0.38, color: '#cbd5e1' });
  list.push({ x: chimX + 0.32, y: chimH + 1.5 * heightMultiplier, z: chimZ - 0.22, sx: 0.48, sy: 0.42, sz: 0.48, color: '#f1f5f9' });

  // 6. ATTACHED SIDE WOODSHED & AXE BLOCK (Left flank)
  const shedX = -mainBodyW * 0.46;
  const shedZ = wallCenterZ + 0.1;
  // Lean-to roof over firewood
  list.push({ x: shedX, y: 1.15 * heightMultiplier, z: shedZ, sx: 0.65, sy: 0.12, sz: 1.1, color: '#14532d' });
  // Stacked cedar firewood logs under shed
  list.push({ x: shedX, y: 0.55 * heightMultiplier, z: shedZ, sx: 0.55, sy: 0.65 * heightMultiplier, sz: 0.95, color: '#78350f' });
  // Log chopping block with axe
  list.push({ x: shedX - 0.25, y: 0.25, z: shedZ + 0.75, sx: 0.32, sy: 0.4, sz: 0.32, color: '#451a03' });

  return list;
}
