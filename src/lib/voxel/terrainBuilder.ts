import type { VoxelBlock } from './types';
import type { VoxelTheme } from '../themes';

/**
 * 1. Build High-Contrast Finder Pattern Corner Anchors (7x7 Modules)
 * Procedurally generates thematic architectural fortresses, shrines, and gazebos
 * for all 3 corners (NW, NE, SW) tailored to each theme.
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

  if (!isTopLeft && !isTopRight && !isBottomLeft) {
    return list;
  }

  const isCore = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  const isMidGap = lr >= 1 && lr <= 5 && lc >= 1 && lc <= 5 && !isCore;
  const isOuter = !isCore && !isMidGap;
  const themeId = theme.id;

  const isCornerOuter = (lr === 0 || lr === 6) && (lc === 0 || lc === 6);
  const isCoreCenter = lr === 3 && lc === 3;
  const isCoreCorner = (lr === 2 || lr === 4) && (lc === 2 || lc === 4);

  // ==========================================
  // A. JAPANESE GARDEN: TEMPLE SANCTUARY ANCHOR
  // ==========================================
  if (themeId === 'japanese-garden') {
    if (isOuter) {
      // Tamagaki Sacred Sanctuary Wall
      list.push({ x, y: 0.12, z, sx: 0.94, sy: 0.24, sz: 0.94, color: '#1e293b' });
      list.push({ x, y: 0.32 * heightMultiplier, z, sx: 0.88, sy: 0.22 * heightMultiplier, sz: 0.88, color: '#991b1b' });
      list.push({ x, y: 0.48 * heightMultiplier, z, sx: 0.94, sy: 0.12 * heightMultiplier, sz: 0.94, color: '#09090b' });
      if (isCornerOuter) {
        // Elevated Torii gate pillar posts with gold finial cap
        list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.46, sy: 0.35 * heightMultiplier, sz: 0.46, color: '#dc2626' });
        list.push({ x, y: 0.86 * heightMultiplier, z, sx: 0.28, sy: 0.12 * heightMultiplier, sz: 0.28, color: '#1e293b' });
      }
    } else if (isMidGap) {
      // Pure White Raked Zen Gravel & Stepping Stones
      list.push({ x, y: 0.03, z, sx: 0.98, sy: 0.06, sz: 0.98, color: '#ffffff' });
      if ((lr + lc) % 2 === 0) {
        list.push({ x, y: 0.06, z, sx: 0.72, sy: 0.04, sz: 0.72, color: '#f8fafc' });
      }
    } else if (isCore) {
      // Sacred Shinto Bell Shrine (Shoro)
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#271711' }); // Timber deck
      if (isCoreCorner) {
        // Vermilion Lacquered Columns
        list.push({ x, y: 0.58 * heightMultiplier, z, sx: 0.38, sy: 0.68 * heightMultiplier, sz: 0.38, color: '#dc2626' });
      } else if (isCoreCenter) {
        // Suspended Sacred Bronze Bell (Bonsho)
        list.push({ x, y: 0.46 * heightMultiplier, z, sx: 0.52, sy: 0.38 * heightMultiplier, sz: 0.52, color: '#451a03' });
        list.push({ x, y: 0.68 * heightMultiplier, z, sx: 0.22, sy: 0.16 * heightMultiplier, sz: 0.22, color: '#3e2723' });
      } else {
        // Shoji Screen Inner Walls
        list.push({ x, y: 0.48 * heightMultiplier, z, sx: 0.86, sy: 0.5 * heightMultiplier, sz: 0.86, color: '#09090b' });
      }
      // Curved Temple Roof Canopy
      list.push({ x, y: 0.88 * heightMultiplier, z, sx: 0.96, sy: 0.22 * heightMultiplier, sz: 0.96, color: '#09090b' });
      if (isCoreCenter) {
        list.push({ x, y: 1.12 * heightMultiplier, z, sx: 0.36, sy: 0.28 * heightMultiplier, sz: 0.36, color: '#09090b' });
      }
    }
  }

  // ==========================================
  // B. FOREST CABIN: TIMBER PALISADE & LOOKOUT
  // ==========================================
  else if (themeId === 'forest-cabin') {
    if (isOuter) {
      // Alpine Frontier Palisade & Stone Wall
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#334155' });
      list.push({ x, y: 0.38 * heightMultiplier, z, sx: 0.88, sy: 0.26 * heightMultiplier, sz: 0.88, color: '#451a03' });
      list.push({ x, y: 0.54 * heightMultiplier, z, sx: 0.92, sy: 0.12 * heightMultiplier, sz: 0.92, color: '#1e293b' });
      if (isCornerOuter) {
        // High timber watchpost bastions
        list.push({ x, y: 0.68 * heightMultiplier, z, sx: 0.5, sy: 0.38 * heightMultiplier, sz: 0.5, color: '#271711' });
        list.push({ x, y: 0.9 * heightMultiplier, z, sx: 0.32, sy: 0.14 * heightMultiplier, sz: 0.32, color: '#09090b' });
      }
    } else if (isMidGap) {
      // Light River Gravel & Pine Clearing
      list.push({ x, y: 0.03, z, sx: 0.98, sy: 0.06, sz: 0.98, color: '#ffffff' });
      if ((lr + lc) % 2 === 0) {
        list.push({ x, y: 0.06, z, sx: 0.74, sy: 0.04, sz: 0.74, color: '#f1f5f9' });
      }
    } else if (isCore) {
      // Alpine Fire Lookout Watchtower
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#1e293b' }); // Fieldstone base
      if (isCoreCorner) {
        // Heavy rustic log stilt posts
        list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.42, sy: 0.74 * heightMultiplier, sz: 0.42, color: '#382213' });
      } else if (isCoreCenter) {
        // Lookout interior with glowing amber observation lantern
        list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.58, sy: 0.44 * heightMultiplier, sz: 0.58, color: '#f59e0b' });
      } else {
        // Cabin log siding
        list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.88, sy: 0.54 * heightMultiplier, sz: 0.88, color: '#451a03' });
      }
      // Steep A-frame shake roof
      list.push({ x, y: 0.88 * heightMultiplier, z, sx: 0.96, sy: 0.26 * heightMultiplier, sz: 0.96, color: '#09090b' });
      if (isCoreCenter) {
        list.push({ x, y: 1.1 * heightMultiplier, z, sx: 0.42, sy: 0.22 * heightMultiplier, sz: 0.42, color: '#271711' });
      }
    }
  }

  // ==========================================
  // C. MODERN VILLA: MINIMALIST GLASS GAZEBO
  // ==========================================
  else if (themeId === 'modern-villa') {
    if (isOuter) {
      // Bauhaus Basalt Perimeter Plinth & Charcoal Wall
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#09090b' });
      list.push({ x, y: 0.38 * heightMultiplier, z, sx: 0.88, sy: 0.24 * heightMultiplier, sz: 0.88, color: '#1e293b' });
      list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.92, sy: 0.12 * heightMultiplier, sz: 0.92, color: '#09090b' });
      if (isCornerOuter) {
        // Architectural corner pylons
        list.push({ x, y: 0.68 * heightMultiplier, z, sx: 0.48, sy: 0.38 * heightMultiplier, sz: 0.48, color: '#09090b' });
        list.push({ x, y: 0.88 * heightMultiplier, z, sx: 0.32, sy: 0.12 * heightMultiplier, sz: 0.32, color: '#334155' });
      }
    } else if (isMidGap) {
      // Polished Thassos White Marble Terrace
      list.push({ x, y: 0.03, z, sx: 0.98, sy: 0.06, sz: 0.98, color: '#ffffff' });
      if ((lr + lc) % 2 === 0) {
        list.push({ x, y: 0.06, z, sx: 0.75, sy: 0.04, sz: 0.75, color: '#f1f5f9' });
      }
    } else if (isCore) {
      // Modernist Glass Cube Gazebo & Pool Lounge
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#09090b' }); // Dark slate plinth
      if (isCoreCorner) {
        // Matte black steel structural posts
        list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.34, sy: 0.76 * heightMultiplier, sz: 0.34, color: '#000000' });
      } else if (isCoreCenter) {
        // Teak lounge seating with warm ambient glow
        list.push({ x, y: 0.48 * heightMultiplier, z, sx: 0.62, sy: 0.4 * heightMultiplier, sz: 0.62, color: '#b45309' });
      } else {
        // Tinted architectural structural glass panels
        list.push({ x, y: 0.54 * heightMultiplier, z, sx: 0.86, sy: 0.62 * heightMultiplier, sz: 0.86, color: '#0284c7' });
      }
      // Cantilevered ultra-slim architectural roof slab
      list.push({ x, y: 0.88 * heightMultiplier, z, sx: 0.96, sy: 0.16 * heightMultiplier, sz: 0.96, color: '#09090b' });
      list.push({ x, y: 0.98 * heightMultiplier, z, sx: 0.84, sy: 0.08 * heightMultiplier, sz: 0.84, color: '#1e293b' });
    }
  }

  // ==========================================
  // D. COASTAL LIGHTHOUSE: HARBOR BEACON FORT
  // ==========================================
  else {
    if (isOuter) {
      // Coastal Sea Wall & Granite Bastions
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#1e293b' });
      list.push({ x, y: 0.40 * heightMultiplier, z, sx: 0.88, sy: 0.24 * heightMultiplier, sz: 0.88, color: '#334155' });
      list.push({ x, y: 0.58 * heightMultiplier, z, sx: 0.92, sy: 0.12 * heightMultiplier, sz: 0.92, color: '#09090b' });
      if (isCornerOuter) {
        // Heavy seawall bastion with mooring bollards
        list.push({ x, y: 0.74 * heightMultiplier, z, sx: 0.48, sy: 0.20 * heightMultiplier, sz: 0.48, color: '#09090b' });
        list.push({ x, y: 0.88 * heightMultiplier, z, sx: 0.28, sy: 0.08 * heightMultiplier, sz: 0.28, color: '#475569' });
      }
    } else if (isMidGap) {
      // Bleached Coastal Sand & Quartz Sea-Spray Walkway
      list.push({ x, y: 0.03, z, sx: 0.98, sy: 0.06, sz: 0.98, color: '#ffffff' });
      if ((lr + lc) % 2 === 0) {
        list.push({ x, y: 0.06, z, sx: 0.74, sy: 0.04, sz: 0.74, color: '#f8fafc' });
      }
    } else if (isCore) {
      // Harbor Foghorn Station & Navigation Beacon Fort
      list.push({ x, y: 0.14, z, sx: 0.94, sy: 0.28, sz: 0.94, color: '#1e293b' }); // Granite foundation (y: 0 -> 0.28)
      if (isCoreCorner) {
        // Stone pillar arches (y: 0.28 -> 0.76)
        list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.40, sy: 0.48 * heightMultiplier, sz: 0.40, color: '#1e293b' });
      } else if (isCoreCenter) {
        // Intense amber beacon lantern (y: 0.28 -> 0.76)
        list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.60, sy: 0.44 * heightMultiplier, sz: 0.60, color: '#f59e0b' });
      } else {
        // Non-overlapping banded masonry walls:
        // Crimson band: y: 0.28 -> 0.52 (zero vertical overlap with black band)
        list.push({ x, y: 0.40 * heightMultiplier, z, sx: 0.86, sy: 0.24 * heightMultiplier, sz: 0.86, color: '#dc2626' });
        // Dark masonry band: y: 0.52 -> 0.76 (sits flush on top of crimson band)
        list.push({ x, y: 0.64 * heightMultiplier, z, sx: 0.86, sy: 0.24 * heightMultiplier, sz: 0.86, color: '#09090b' });
      }
      // Weathered copper roof cornice cap (y: 0.76 -> 0.96)
      list.push({ x, y: 0.86 * heightMultiplier, z, sx: 0.96, sy: 0.20 * heightMultiplier, sz: 0.96, color: '#09090b' });
      if (isCoreCenter) {
        // Central roof finial spire (y: 0.96 -> 1.16)
        list.push({ x, y: 1.06 * heightMultiplier, z, sx: 0.24, sy: 0.20 * heightMultiplier, sz: 0.24, color: '#09090b' });
      }
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
    // Modern Villa: Polished Limestone, Marble Walkways & Clear Pool Channels
    const isPoolWater = (r % 6 === 0 || c % 6 === 0) && dist > landmarkRadius && dist < size * 0.4;
    const isMarbleWalkway = (r + c * 2) % 6 === 0;

    if (isPoolWater) {
      list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#7dd3fc' });
    } else if (isMarbleWalkway) {
      list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#f1f5f9' });
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
 * All botanical trunks and structures are strictly grounded (y = 0.08)
 * with continuous vertical stacking to eliminate all floating gaps.
 */
export function buildDarkModuleVoxels(
  themeId: string,
  rand: number,
  heightMultiplier: number,
  x: number,
  z: number
): VoxelBlock[] {
  const list: VoxelBlock[] = [];

  // Foundational Ground Base Tile (Guarantees zero voids/holes and zero floating trunks)
  const baseColor =
    themeId === 'japanese-garden'
      ? '#1e293b'
      : themeId === 'forest-cabin'
        ? '#271711'
        : themeId === 'modern-villa'
          ? '#09090b'
          : '#1e293b';

  list.push({ x, y: 0.04, z, sx: 0.94, sy: 0.08, sz: 0.94, color: baseColor });
  const groundTopY = 0.08;

  // ==========================================
  // A. JAPANESE GARDEN VEGETATION & MONUMENTS
  // ==========================================
  if (themeId === 'japanese-garden') {
    if (rand < 0.45) {
      // Sculpted Matsu Pine Tree (Bonsai branching style)
      const h = (1.2 + rand * 1.3) * heightMultiplier;
      // Root Collar (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.44, sy: 0.14, sz: 0.44, color: '#271711' });

      // Lower Trunk (y: 0.22 -> 0.22 + 0.55 * h)
      const t1H = 0.55 * h;
      list.push({ x: x + 0.06, y: groundTopY + 0.14 + t1H / 2, z: z - 0.04, sx: 0.28, sy: t1H, sz: 0.28, color: '#3e2723' });

      // Upper Bent Trunk (y: 0.22 + t1H -> 0.22 + t1H + 0.45 * h)
      const t2H = 0.45 * h;
      const t2BaseY = groundTopY + 0.14 + t1H;
      list.push({ x: x - 0.08, y: t2BaseY + t2H / 2, z: z + 0.06, sx: 0.22, sy: t2H, sz: 0.22, color: '#3e2723' });

      // Continuous Overlapping Cloud Foliage Shelves (Zero air gaps)
      list.push({ x: x - 0.12, y: t2BaseY + 0.1 * h, z: z + 0.08, sx: 0.56, sy: 0.22 * h, sz: 0.56, color: '#064e3b' });
      list.push({ x: x + 0.08, y: t2BaseY + t2H + 0.06 * h, z: z - 0.06, sx: 0.66, sy: 0.26 * h, sz: 0.66, color: '#064e3b' });
      list.push({ x, y: t2BaseY + t2H + 0.26 * h, z, sx: 0.52, sy: 0.2 * h, sz: 0.52, color: '#14532d' });
      list.push({ x: x + 0.04, y: t2BaseY + t2H + 0.42 * h, z: z - 0.02, sx: 0.28, sy: 0.14 * h, sz: 0.28, color: '#15803d' });
    } else if (rand < 0.75) {
      // Sculpted Japanese Autumn Red Maple Bonsai (Momiji)
      const h = (1.1 + rand * 1.2) * heightMultiplier;
      // Root Collar (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.44, sy: 0.14, sz: 0.44, color: '#2d1810' });

      // Lower Trunk Segment (y: 0.22 -> 0.22 + 0.45 * h)
      const s1H = 0.45 * h;
      list.push({ x: x - 0.04, y: groundTopY + 0.14 + s1H / 2, z: z + 0.03, sx: 0.26, sy: s1H, sz: 0.26, color: '#3e2723' });

      // Upper Angled Branch Segment (y: 0.22 + s1H -> 0.22 + s1H + 0.40 * h)
      const s2H = 0.40 * h;
      const branchBaseY = groundTopY + 0.14 + s1H;
      list.push({ x: x + 0.04, y: branchBaseY + s2H / 2, z: z - 0.03, sx: 0.22, sy: s2H, sz: 0.22, color: '#451a03' });

      // Asymmetric Tiered Autumn Maple Foliage Clouds (Non-overlapping, non-coplanar, zero z-fighting)
      // Lower tiered foliage canopy (Deep crimson)
      list.push({ x: x - 0.12, y: branchBaseY + 0.12 * h, z: z + 0.10, sx: 0.50, sy: 0.22 * h, sz: 0.50, color: '#881337' });
      // Main central foliage canopy (Rich autumn scarlet)
      list.push({ x: x + 0.08, y: branchBaseY + 0.30 * h, z: z - 0.06, sx: 0.54, sy: 0.24 * h, sz: 0.54, color: '#9f1239' });
      // Upper crown canopy (Vibrant Japanese red maple)
      list.push({ x: x - 0.02, y: branchBaseY + 0.48 * h, z: z + 0.02, sx: 0.40, sy: 0.18 * h, sz: 0.40, color: '#be123c' });
      // Apex highlight tip (Deep wine accent)
      list.push({ x: x + 0.03, y: branchBaseY + 0.60 * h, z: z - 0.02, sx: 0.22, sy: 0.12 * h, sz: 0.22, color: '#881337' });
    } else {
      // Kasuga Stone Lantern (Tōrō)
      const h = (1.0 + rand * 0.4) * heightMultiplier;
      // Pedestal Base (y: 0.08 -> 0.24)
      list.push({ x, y: 0.16, z, sx: 0.72, sy: 0.16, sz: 0.72, color: '#1e293b' });
      // Stone Shaft
      const colH = 0.36 * h;
      list.push({ x, y: 0.24 + colH / 2, z, sx: 0.32, sy: colH, sz: 0.32, color: '#334155' });
      // Middle Platform
      const midY = 0.24 + colH;
      list.push({ x, y: midY + 0.06 * h, z, sx: 0.64, sy: 0.12 * h, sz: 0.64, color: '#1e293b' });
      // Fire Chamber with glowing window slit
      list.push({ x, y: midY + 0.22 * h, z, sx: 0.46, sy: 0.2 * h, sz: 0.46, color: '#09090b' });
      list.push({ x, y: midY + 0.22 * h, z: z + 0.24, sx: 0.18, sy: 0.1 * h, sz: 0.06, color: '#f59e0b' }); // Lantern glow
      // Lantern Pagoda Roof & Lotus Finial
      list.push({ x, y: midY + 0.38 * h, z, sx: 0.76, sy: 0.14 * h, sz: 0.76, color: '#1e293b' });
      list.push({ x, y: midY + 0.5 * h, z, sx: 0.26, sy: 0.14 * h, sz: 0.26, color: '#0f172a' });
    }
  }

  // ==========================================
  // B. FOREST CABIN VEGETATION & FORESTRY
  // ==========================================
  else if (themeId === 'forest-cabin') {
    if (rand < 0.55) {
      // 4-Tier Graduated Conical Alpine Spruce
      const h = (1.4 + rand * 1.5) * heightMultiplier;
      // Root Collar (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.44, sy: 0.14, sz: 0.44, color: '#271711' });

      // Central Trunk (y: 0.22 -> 0.22 + 0.65 * h)
      const spH = 0.65 * h;
      list.push({ x, y: groundTopY + 0.14 + spH / 2, z, sx: 0.26, sy: spH, sz: 0.26, color: '#382213' });

      // 4-Tier Needles stacking smoothly from lower trunk upwards
      const spBaseY = groundTopY + 0.14 + spH * 0.5;
      list.push({ x, y: spBaseY + 0.12 * h, z, sx: 0.86, sy: 0.26 * h, sz: 0.86, color: '#064e3b' });
      list.push({ x, y: spBaseY + 0.32 * h, z, sx: 0.70, sy: 0.24 * h, sz: 0.70, color: '#064e3b' });
      list.push({ x, y: spBaseY + 0.52 * h, z, sx: 0.52, sy: 0.22 * h, sz: 0.52, color: '#14532d' });
      list.push({ x, y: spBaseY + 0.70 * h, z, sx: 0.34, sy: 0.18 * h, sz: 0.34, color: '#15803d' });
      list.push({ x, y: spBaseY + 0.84 * h, z, sx: 0.16, sy: 0.12 * h, sz: 0.16, color: '#166534' });
    } else if (rand < 0.8) {
      // Authentic Rustic Split-Log Woodpile Rack (Zero Z-fighting, rich cedar tones, no yellow glitch)
      const h = (0.9 + rand * 0.5) * heightMultiplier;
      // Plinth (y: 0.08 -> 0.18)
      list.push({ x, y: 0.13, z, sx: 0.82, sy: 0.1, sz: 0.82, color: '#1e293b' });

      // Woodpile Rack Timber End Stakes
      list.push({ x: x - 0.34, y: 0.18 + 0.25 * h, z, sx: 0.08, sy: 0.5 * h, sz: 0.62, color: '#382213' });
      list.push({ x: x + 0.34, y: 0.18 + 0.25 * h, z, sx: 0.08, sy: 0.5 * h, sz: 0.62, color: '#382213' });

      // Stacked Split Logs (Non-overlapping vertical tiers in rich cedar/pine bark)
      list.push({ x, y: 0.18 + 0.11 * h, z, sx: 0.62, sy: 0.22 * h, sz: 0.58, color: '#451a03' }); // Tier 1: Dark cedar bark
      list.push({ x, y: 0.18 + 0.29 * h, z, sx: 0.54, sy: 0.18 * h, sz: 0.54, color: '#78350f' }); // Tier 2: Honey aged pine
      list.push({ x, y: 0.18 + 0.44 * h, z, sx: 0.42, sy: 0.14 * h, sz: 0.48, color: '#92400e' }); // Tier 3: Stack peak
      // Forest moss patch on top of woodpile
      list.push({ x, y: 0.18 + 0.54 * h, z, sx: 0.36, sy: 0.08 * h, sz: 0.40, color: '#14532d' });
    } else {
      // Mossy Riverbed Granite Boulder
      const h = (0.9 + rand * 0.5) * heightMultiplier;
      // Boulder base (y: 0.08 -> 0.28)
      list.push({ x, y: 0.18, z, sx: 0.84, sy: 0.2, sz: 0.84, color: '#1e293b' });
      // Mid stone volume
      list.push({ x: x + 0.06, y: 0.28 + 0.18 * h, z: z - 0.05, sx: 0.66, sy: 0.36 * h, sz: 0.66, color: '#334155' });
      // Boulder summit with alpine moss
      list.push({ x: x - 0.04, y: 0.28 + 0.36 * h + 0.08 * h, z: z + 0.04, sx: 0.48, sy: 0.16 * h, sz: 0.48, color: '#14532d' });
    }
  }

  // ==========================================
  // C. MODERN VILLA VEGETATION & LANDSCAPING
  // ==========================================
  else if (themeId === 'modern-villa') {
    if (rand < 0.5) {
      // Architectural Royal Palm Tree
      const h = (1.3 + rand * 1.3) * heightMultiplier;
      // Base Plinth (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.42, sy: 0.14, sz: 0.42, color: '#09090b' });

      // Lower Trunk (y: 0.22 -> 0.22 + 0.55 * h)
      const p1H = 0.55 * h;
      list.push({ x: x + 0.04, y: groundTopY + 0.14 + p1H / 2, z: z - 0.03, sx: 0.28, sy: p1H, sz: 0.28, color: '#382213' });

      // Upper Leaning Trunk (y: 0.22 + p1H -> 0.22 + p1H + 0.5 * h)
      const p2H = 0.5 * h;
      const p2BaseY = groundTopY + 0.14 + p1H;
      list.push({ x: x + 0.08, y: p2BaseY + p2H / 2, z: z - 0.06, sx: 0.24, sy: p2H, sz: 0.24, color: '#543310' });

      // Emerald Crown Shaft
      const pTopY = p2BaseY + p2H;
      list.push({ x: x + 0.08, y: pTopY + 0.12 * h, z: z - 0.06, sx: 0.22, sy: 0.24 * h, sz: 0.22, color: '#064e3b' });

      // Spreading Architectural Fronds (Strictly bounded <= 0.42 from cell center)
      list.push({ x: x + 0.06, y: pTopY + 0.28 * h, z: z - 0.04, sx: 0.42, sy: 0.16 * h, sz: 0.42, color: '#064e3b' });
      list.push({ x: x + 0.06, y: pTopY + 0.22 * h, z: z - 0.22, sx: 0.22, sy: 0.12 * h, sz: 0.32, color: '#14532d' });
      list.push({ x: x + 0.06, y: pTopY + 0.22 * h, z: z + 0.18, sx: 0.22, sy: 0.12 * h, sz: 0.32, color: '#14532d' });
      list.push({ x: x + 0.22, y: pTopY + 0.22 * h, z: z - 0.04, sx: 0.32, sy: 0.12 * h, sz: 0.22, color: '#14532d' });
      list.push({ x: x - 0.14, y: pTopY + 0.22 * h, z: z - 0.04, sx: 0.32, sy: 0.12 * h, sz: 0.22, color: '#14532d' });
    } else if (rand < 0.78) {
      // Architectural Charcoal Planter Box with Tropical Monstera Leaves
      const h = (1.0 + rand * 0.6) * heightMultiplier;
      // Charcoal Planter Pot (y: 0.08 -> 0.58)
      list.push({ x, y: 0.33, z, sx: 0.82, sy: 0.5, sz: 0.82, color: '#09090b' });
      list.push({ x, y: 0.59, z, sx: 0.86, sy: 0.08, sz: 0.86, color: '#78350f' }); // Dark teak rim
      list.push({ x, y: 0.64, z, sx: 0.78, sy: 0.04, sz: 0.78, color: '#271711' }); // Potting soil

      // Tropical Broadleaf Stems & Leaves
      list.push({ x, y: 0.66 + 0.32 * h, z, sx: 0.24, sy: 0.64 * h, sz: 0.24, color: '#064e3b' });
      list.push({ x: x + 0.16, y: 0.66 + 0.22 * h, z: z - 0.12, sx: 0.2, sy: 0.44 * h, sz: 0.2, color: '#14532d' });
      list.push({ x: x - 0.16, y: 0.66 + 0.2 * h, z: z + 0.12, sx: 0.2, sy: 0.4 * h, sz: 0.2, color: '#14532d' });
    } else {
      // Architectural Black Granite Water Feature Monolith
      const h = (1.0 + rand * 0.5) * heightMultiplier;
      // Concrete plinth (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.78, sy: 0.14, sz: 0.78, color: '#09090b' });
      // Honed black granite water cube monolith
      list.push({ x, y: 0.22 + 0.3 * h, z, sx: 0.62, sy: 0.6 * h, sz: 0.62, color: '#0f172a' });
      // Top reflecting water surface
      list.push({ x, y: 0.22 + 0.6 * h + 0.02 * h, z, sx: 0.56, sy: 0.04 * h, sz: 0.56, color: '#0369a1' });
    }
  }

  // ==========================================
  // D. COASTAL LIGHTHOUSE VEGETATION & REEFS
  // ==========================================
  else {
    if (rand < 0.55) {
      // Leaning Coastal Coconut Palm
      const h = (1.3 + rand * 1.3) * heightMultiplier;
      // Rock Collar (y: 0.08 -> 0.22)
      list.push({ x, y: 0.15, z, sx: 0.42, sy: 0.14, sz: 0.42, color: '#1e293b' });

      // Lower Trunk Segment (y: 0.22 -> 0.22 + 0.55 * h)
      const c1H = 0.55 * h;
      list.push({ x: x + 0.04, y: groundTopY + 0.14 + c1H / 2, z: z - 0.03, sx: 0.28, sy: c1H, sz: 0.28, color: '#2d1810' });

      // Upper Leaning Segment (y: 0.22 + c1H -> 0.22 + c1H + 0.5 * h)
      const c2H = 0.5 * h;
      const c2BaseY = groundTopY + 0.14 + c1H;
      list.push({ x: x + 0.08, y: c2BaseY + c2H / 2, z: z - 0.06, sx: 0.24, sy: c2H, sz: 0.24, color: '#451a03' });

      // Palm Crown & Hanging Coconuts
      const cTopY = c2BaseY + c2H;
      // Palm Crown & Hanging Coconuts (Strictly bounded <= 0.42 from cell center)
      list.push({ x: x + 0.06, y: cTopY + 0.08 * h, z: z - 0.04, sx: 0.26, sy: 0.16 * h, sz: 0.26, color: '#382213' }); // Coconuts
      list.push({ x: x + 0.06, y: cTopY + 0.22 * h, z: z - 0.04, sx: 0.42, sy: 0.18 * h, sz: 0.42, color: '#14532d' });
      list.push({ x: x + 0.06, y: cTopY + 0.16 * h, z: z - 0.22, sx: 0.22, sy: 0.12 * h, sz: 0.32, color: '#15803d' });
      list.push({ x: x + 0.06, y: cTopY + 0.16 * h, z: z + 0.18, sx: 0.22, sy: 0.12 * h, sz: 0.32, color: '#15803d' });
      list.push({ x: x + 0.22, y: cTopY + 0.16 * h, z: z - 0.04, sx: 0.32, sy: 0.12 * h, sz: 0.22, color: '#15803d' });
      list.push({ x: x - 0.14, y: cTopY + 0.16 * h, z: z - 0.04, sx: 0.32, sy: 0.12 * h, sz: 0.22, color: '#15803d' });
    } else {
      // Oceanic Basalt Sea Stack with Tidal Barnacles
      const h = (0.9 + rand * 0.5) * heightMultiplier;
      // Reef foundation (y: 0.08 -> 0.28)
      list.push({ x, y: 0.18, z, sx: 0.84, sy: 0.2, sz: 0.84, color: '#1e293b' });
      // Basalt column
      list.push({ x: x + 0.06, y: 0.28 + 0.2 * h, z: z - 0.05, sx: 0.64, sy: 0.4 * h, sz: 0.64, color: '#334155' });
      // Jagged peak with ocean spray weathering
      list.push({ x, y: 0.28 + 0.4 * h + 0.12 * h, z, sx: 0.42, sy: 0.24 * h, sz: 0.42, color: '#0f172a' });
    }
  }

  return list;
}
