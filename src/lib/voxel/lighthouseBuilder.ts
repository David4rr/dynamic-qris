import type { VoxelBlock } from './types';

/**
 * Procedural Coastal Lighthouse & Keeper's Cottage Builder
 * Constructs an ultra-detailed maritime coastal headland with:
 * - Fractured craggy basalt sea-cliff foundation with tidal rock pool
 * - Wooden boat pier jetty with moored rowboat and oars
 * - Keeper's cottage with covered porch, glowing lantern, white 4-pane windows,
 *   fieldstone chimney with rising smoke puffs, and woodshed
 * - Tapered red-and-white conical lighthouse tower with arched entrance door,
 *   window slits, helical maintenance catwalk stairs, and foghorn bells
 * - Observation gallery with corbel brackets and iron safety balustrade
 * - Glowing 360° Fresnel beacon lantern chamber with internal brass optics
 * - Weathered copper domed cupola, brass weather vane (N-S-E-W), and lightning rod
 */
export function buildLighthouse(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const rockW = 4.8;

  // =========================================================================
  // 1. CRAGGY BASALT SEA-CLIFF, TIDAL POOL & BOAT JETTY (y: 0.0 -> 0.6)
  // =========================================================================
  // Multi-tiered sea cliff foundation
  list.push({ x: 0, y: 0.22, z: 0, sx: rockW * 1.08, sy: 0.44, sz: rockW * 1.05, color: '#1e293b' });
  list.push({ x: 0.1, y: 0.48, z: -0.05, sx: rockW * 0.96, sy: 0.12, sz: rockW * 0.94, color: '#334155' });
  // Fractured granite rock ledges
  list.push({ x: -rockW * 0.42, y: 0.32, z: -rockW * 0.35, sx: 1.1, sy: 0.34, sz: 1.1, color: '#1e293b' });
  list.push({ x: rockW * 0.38, y: 0.36, z: rockW * 0.38, sx: 0.9, sy: 0.38, sz: 0.9, color: '#334155' });

  // A. Tidal Rock Pool (Deep sea blue with foam rim)
  const poolX = -rockW * 0.32;
  const poolZ = rockW * 0.35;
  list.push({ x: poolX, y: 0.34, z: poolZ, sx: 0.9, sy: 0.14, sz: 0.8, color: '#0369a1' });
  list.push({ x: poolX, y: 0.42, z: poolZ, sx: 0.82, sy: 0.05, sz: 0.72, color: '#38bdf8' }); // Clear water
  list.push({ x: poolX + 0.36, y: 0.43, z: poolZ, sx: 0.12, sy: 0.05, sz: 0.6, color: '#e0f2fe' }); // Sea foam edge

  // B. Wooden Boat Pier Jetty & Moored Rowboat
  const pierX = 0.75;
  const pierZ = rockW * 0.44;
  // Timber pilings
  list.push({ x: pierX - 0.35, y: 0.22, z: pierZ, sx: 0.12, sy: 0.44, sz: 0.12, color: '#382213' });
  list.push({ x: pierX + 0.35, y: 0.22, z: pierZ, sx: 0.12, sy: 0.44, sz: 0.12, color: '#382213' });
  // Wooden plank dock deck
  list.push({ x: pierX, y: 0.46, z: pierZ, sx: 1.4, sy: 0.08, sz: 0.55, color: '#78350f' });
  // Iron mooring cleat bollard
  list.push({ x: pierX + 0.55, y: 0.54, z: pierZ, sx: 0.08, sy: 0.12, sz: 0.14, color: '#09090b' });
  // Moored Wooden Rowboat
  list.push({ x: pierX, y: 0.38, z: pierZ + 0.5, sx: 1.1, sy: 0.16, sz: 0.42, color: '#b45309' });
  list.push({ x: pierX, y: 0.44, z: pierZ + 0.5, sx: 0.9, sy: 0.06, sz: 0.28, color: '#451a03' }); // Boat interior
  list.push({ x: pierX + 0.1, y: 0.49, z: pierZ + 0.5, sx: 0.06, sy: 0.04, sz: 0.6, color: '#78350f' }); // Wooden oar

  // =========================================================================
  // 2. KEEPER'S COTTAGE, PORCH & SMOKE PUFFS (y: 0.54 -> 2.6)
  // =========================================================================
  const cotX = -1.45;
  const cotZ = 0.18;
  const cotW = 1.95;
  const cotD = 1.95;
  const cotH = 1.25 * heightMultiplier;

  // Cottage Timber Weatherboard Walls
  list.push({ x: cotX, y: 0.54 + cotH / 2, z: cotZ, sx: cotW, sy: cotH, sz: cotD, color: '#451a03' });
  // White corner trim boards
  [
    [-cotW / 2, -cotD / 2],
    [cotW / 2, -cotD / 2],
    [-cotW / 2, cotD / 2],
    [cotW / 2, cotD / 2],
  ].forEach(([cx, cz]) => {
    list.push({ x: cotX + cx, y: 0.54 + cotH / 2, z: cotZ + cz, sx: 0.1, sy: cotH, sz: 0.1, color: '#ffffff' });
  });

  // Cottage Pitch Gable Roof (Crimson Lacquered Metal & Overhanging Eaves)
  list.push({ x: cotX, y: 0.54 + cotH + 0.18, z: cotZ, sx: cotW * 1.15, sy: 0.32, sz: cotD * 1.15, color: '#dc2626' });
  list.push({ x: cotX, y: 0.54 + cotH + 0.38, z: cotZ, sx: cotW * 0.65, sy: 0.22, sz: cotD * 1.05, color: '#b91c1c' });
  list.push({ x: cotX, y: 0.54 + cotH + 0.52, z: cotZ, sx: 0.18, sy: 0.1, sz: cotD * 1.05, color: '#991b1b' }); // Roof ridge cap

  // Covered Front Entry Porch & Lantern
  const porchZ = cotZ + cotD / 2 + 0.25;
  list.push({ x: cotX, y: 0.52, z: porchZ, sx: 1.1, sy: 0.08, sz: 0.52, color: '#78350f' }); // Porch deck
  list.push({ x: cotX - 0.45, y: 0.54 + 0.5 * cotH, z: porchZ + 0.18, sx: 0.08, sy: cotH, sz: 0.08, color: '#ffffff' }); // Left post
  list.push({ x: cotX + 0.45, y: 0.54 + 0.5 * cotH, z: porchZ + 0.18, sx: 0.08, sy: cotH, sz: 0.08, color: '#ffffff' }); // Right post
  list.push({ x: cotX, y: 0.54 + cotH + 0.05, z: porchZ + 0.08, sx: 1.2, sy: 0.1, sz: 0.65, color: '#dc2626' }); // Porch roof
  // Glowing Ship Oil Lantern hanging by the door
  list.push({ x: cotX + 0.32, y: 0.54 + 0.75 * heightMultiplier, z: cotZ + cotD / 2 + 0.06, sx: 0.12, sy: 0.16, sz: 0.12, color: '#f59e0b' });

  // Cottage Wooden Door & Glowing 4-Pane Windows
  list.push({ x: cotX, y: 0.54 + 0.5 * heightMultiplier, z: cotZ + cotD / 2 + 0.04, sx: 0.52, sy: 0.95 * heightMultiplier, sz: 0.08, color: '#78350f' }); // Door
  list.push({ x: cotX - 0.65, y: 0.54 + 0.65 * heightMultiplier, z: cotZ + cotD / 2 + 0.04, sx: 0.45, sy: 0.45 * heightMultiplier, sz: 0.08, color: '#fef08a' }); // Front window
  list.push({ x: cotX - cotW / 2 - 0.04, y: 0.54 + 0.65 * heightMultiplier, z: cotZ, sx: 0.08, sy: 0.45 * heightMultiplier, sz: 0.45, color: '#fef08a' }); // Side window

  // Fieldstone Chimney & Rising Voxel Smoke Puffs
  const chimX = cotX - 0.75;
  const chimZ = cotZ - 0.45;
  list.push({ x: chimX, y: 1.5 * heightMultiplier, z: chimZ, sx: 0.44, sy: 1.8 * heightMultiplier, sz: 0.44, color: '#334155' });
  list.push({ x: chimX, y: 2.45 * heightMultiplier, z: chimZ, sx: 0.52, sy: 0.16, sz: 0.52, color: '#1e293b' });
  // Rising Smoke Puffs drifting in the coastal breeze
  list.push({ x: chimX + 0.05, y: 2.65 * heightMultiplier, z: chimZ + 0.05, sx: 0.22, sy: 0.22, sz: 0.22, color: '#f8fafc' });
  list.push({ x: chimX + 0.18, y: 2.95 * heightMultiplier, z: chimZ + 0.15, sx: 0.28, sy: 0.28, sz: 0.28, color: '#e2e8f0' });
  list.push({ x: chimX + 0.35, y: 3.3 * heightMultiplier, z: chimZ + 0.28, sx: 0.34, sy: 0.34, sz: 0.34, color: '#cbd5e1' });

  // Lean-to Woodshed on Cottage Side
  list.push({ x: cotX + cotW / 2 + 0.22, y: 0.54 + 0.4 * heightMultiplier, z: cotZ - 0.25, sx: 0.45, sy: 0.75 * heightMultiplier, sz: 0.85, color: '#78350f' });
  list.push({ x: cotX + cotW / 2 + 0.22, y: 0.54 + 0.8 * heightMultiplier, z: cotZ - 0.25, sx: 0.55, sy: 0.08, sz: 0.95, color: '#b91c1c' }); // Shed roof
  list.push({ x: cotX + cotW / 2 + 0.25, y: 0.54 + 0.25 * heightMultiplier, z: cotZ - 0.25, sx: 0.3, sy: 0.45 * heightMultiplier, sz: 0.65, color: '#92400e' }); // Split logs

  // =========================================================================
  // 3. TAPERED CONICAL LIGHTHOUSE TOWER (y: 0.6 -> 9.4)
  // =========================================================================
  const towerX = 0.55;
  const towerZ = -0.3;

  // Granite Base Plinth with Arched Entrance Door
  list.push({ x: towerX, y: 0.68, z: towerZ, sx: 3.1, sy: 0.28, sz: 3.1, color: '#1e293b' });
  list.push({ x: towerX, y: 0.6 + 0.55 * heightMultiplier, z: towerZ + 1.45, sx: 0.6, sy: 0.85 * heightMultiplier, sz: 0.12, color: '#451a03' }); // Heavy oak door
  list.push({ x: towerX, y: 0.6 + 0.55 * heightMultiplier, z: towerZ + 1.52, sx: 0.08, sy: 0.08, sz: 0.04, color: '#fbbf24' }); // Brass door knocker

  // 6 Tapered Conical Tiers (Alternating Crimson & White Bands)
  const towerTiers = [
    { y: 0.6, h: 1.5, w: 2.8, color: '#dc2626' },
    { y: 2.1, h: 1.5, w: 2.5, color: '#ffffff' },
    { y: 3.6, h: 1.5, w: 2.2, color: '#dc2626' },
    { y: 5.1, h: 1.5, w: 1.9, color: '#ffffff' },
    { y: 6.6, h: 1.5, w: 1.7, color: '#dc2626' },
    { y: 8.1, h: 1.3, w: 1.5, color: '#ffffff' },
  ];

  towerTiers.forEach((t, idx) => {
    // Tower main body
    list.push({
      x: towerX,
      y: (t.y + t.h / 2) * heightMultiplier,
      z: towerZ,
      sx: t.w,
      sy: t.h * heightMultiplier,
      sz: t.w,
      color: t.color,
    });

    // Lookout Arched Window Slits on alternating bands
    if (idx % 2 === 1) {
      list.push({
        x: towerX,
        y: (t.y + t.h / 2) * heightMultiplier,
        z: towerZ + t.w / 2 + 0.03,
        sx: 0.32,
        sy: 0.5 * heightMultiplier,
        sz: 0.08,
        color: '#09090b',
      });
      // Stone window sill
      list.push({
        x: towerX,
        y: (t.y + t.h / 2 - 0.28) * heightMultiplier,
        z: towerZ + t.w / 2 + 0.06,
        sx: 0.44,
        sy: 0.08,
        sz: 0.12,
        color: '#1e293b',
      });
    }

    // Helical maintenance catwalk stair segment (winding around the conical tower)
    const angle = (idx * Math.PI) / 3;
    const stairDist = t.w / 2 + 0.16;
    list.push({
      x: towerX + Math.cos(angle) * stairDist,
      y: (t.y + t.h * 0.4) * heightMultiplier,
      z: towerZ + Math.sin(angle) * stairDist,
      sx: 0.38,
      sy: 0.08 * heightMultiplier,
      sz: 0.38,
      color: '#1e293b',
    });
  });

  // Brass Foghorn Warning Horn below gallery
  list.push({ x: towerX - 0.95, y: 9.0 * heightMultiplier, z: towerZ, sx: 0.35, sy: 0.22, sz: 0.22, color: '#fbbf24' });

  const topY = 9.4 * heightMultiplier;

  // =========================================================================
  // 4. OBSERVATION GALLERY & CATWALK BALCONY (y: 9.4 -> 10.2)
  // =========================================================================
  // Supporting cantilever corbel bracket cornice
  list.push({ x: towerX, y: topY + 0.08, z: towerZ, sx: 1.85, sy: 0.16, sz: 1.85, color: '#1e293b' });
  // Observation gallery floor slab
  list.push({ x: towerX, y: topY + 0.22, z: towerZ, sx: 2.24, sy: 0.12, sz: 2.24, color: '#09090b' });
  // Wrought-iron safety perimeter balustrade (Lower base rim)
  list.push({ x: towerX, y: topY + 0.38, z: towerZ, sx: 2.24, sy: 0.20, sz: 2.24, color: '#1e293b' });
  // Gallery inner walkway floor (Stone deck, strictly below lantern base)
  list.push({ x: towerX, y: topY + 0.34, z: towerZ, sx: 1.96, sy: 0.12, sz: 1.96, color: '#cbd5e1' });

  // Lantern plinth pedestal base (y: topY + 0.40 -> topY + 0.56)
  list.push({ x: towerX, y: topY + 0.48, z: towerZ, sx: 1.68, sy: 0.16, sz: 1.68, color: '#09090b' });

  // =========================================================================
  // 5. FRESNEL BEACON LANTERN CHAMBER (y: topY + 0.56 -> topY + 0.56 + beaconH)
  // =========================================================================
  const lanternBaseY = topY + 0.56;
  const beaconH = 1.15 * heightMultiplier;
  const lanternCenterY = lanternBaseY + beaconH / 2;

  // A. Radiant Glowing Fresnel Beacon Lamp & Optics
  // Intense glowing warm-golden beacon chamber (Primary light emitter)
  list.push({ x: towerX, y: lanternCenterY, z: towerZ, sx: 1.40, sy: beaconH * 0.94, sz: 1.40, color: '#fef08a' });
  // Ultra-bright glowing white filament core
  list.push({ x: towerX, y: lanternCenterY, z: towerZ, sx: 1.04, sy: beaconH * 0.82, sz: 1.04, color: '#ffffff' });
  // Projecting Fresnel stepped lens equator ring (Bright radiant gold)
  list.push({ x: towerX, y: lanternCenterY, z: towerZ, sx: 1.48, sy: 0.24 * heightMultiplier, sz: 1.48, color: '#fde047' });
  // Internal brass rotating lens cage
  list.push({ x: towerX, y: lanternCenterY, z: towerZ, sx: 0.56, sy: beaconH * 0.70, sz: 0.56, color: '#fbbf24' });

  // B. Cast-Bronze Structural Framing Posts / Tiang (Outer corner brackets, zero Z-fighting)
  [
    [-0.72, -0.72],
    [0.72, -0.72],
    [-0.72, 0.72],
    [0.72, 0.72],
  ].forEach(([mx, mz]) => {
    list.push({
      x: towerX + mx,
      y: lanternCenterY,
      z: towerZ + mz,
      sx: 0.16,
      sy: beaconH,
      sz: 0.16,
      color: '#09090b',
    });
  });

  // C. Sweeping Lighthouse Searchlight Beacon Beam (Iconic shining light ray)
  // Originating at lantern and projecting diagonally over the sea (strictly bounded <= 2.88)
  list.push({ x: towerX + 0.80, y: lanternCenterY, z: towerZ - 0.70, sx: 0.38, sy: 0.38, sz: 0.38, color: '#ffffff' });
  list.push({ x: towerX + 1.25, y: lanternCenterY - 0.04, z: towerZ - 1.10, sx: 0.58, sy: 0.52, sz: 0.58, color: '#fef08a' });
  list.push({ x: towerX + 1.70, y: lanternCenterY - 0.08, z: towerZ - 1.50, sx: 0.82, sy: 0.68, sz: 0.82, color: '#fde047' });

  // =========================================================================
  // 6. DOMED WEATHERED COPPER ROOF CUPOLA & WEATHER VANE
  // =========================================================================
  const cupolaBaseY = lanternBaseY + beaconH;
  // Cupola overhanging eave cornice
  list.push({ x: towerX, y: cupolaBaseY + 0.08, z: towerZ, sx: 1.84, sy: 0.16, sz: 1.84, color: '#09090b' });
  // Weathered copper domed roof tiers (Verdigris patina & dark bronze)
  list.push({ x: towerX, y: cupolaBaseY + 0.24, z: towerZ, sx: 1.52, sy: 0.18, sz: 1.52, color: '#064e3b' });
  list.push({ x: towerX, y: cupolaBaseY + 0.40, z: towerZ, sx: 1.16, sy: 0.16, sz: 1.16, color: '#064e3b' });
  list.push({ x: towerX, y: cupolaBaseY + 0.54, z: towerZ, sx: 0.76, sy: 0.14, sz: 0.76, color: '#1e293b' });

  // Gilded Weather Vane Spindle & Lightning Rod
  const vaneBaseY = cupolaBaseY + 0.61;
  list.push({ x: towerX, y: vaneBaseY + 0.4 * heightMultiplier, z: towerZ, sx: 0.10, sy: 0.8 * heightMultiplier, sz: 0.10, color: '#fbbf24' });
  // Weather vane cardinal arrows (N-S & E-W)
  list.push({ x: towerX, y: vaneBaseY + 0.72 * heightMultiplier, z: towerZ, sx: 0.56, sy: 0.08, sz: 0.08, color: '#f59e0b' });
  list.push({ x: towerX, y: vaneBaseY + 0.72 * heightMultiplier, z: towerZ, sx: 0.08, sy: 0.08, sz: 0.56, color: '#f59e0b' });
  // Golden top finial sphere
  list.push({ x: towerX, y: vaneBaseY + 0.85 * heightMultiplier, z: towerZ, sx: 0.18, sy: 0.18, sz: 0.18, color: '#fbbf24' });
  return list;
}
