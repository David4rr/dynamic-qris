/**
 * True 3D Architectural Voxel Diorama Generator
 * Constructs an authentic, multi-tiered Pagoda Temple (e.g. Six Harmonies / Liuhe style),
 * botanical trees, stone lanterns, and zen garden terrain while preserving exact top-down QRIS contrast.
 */

import * as THREE from 'three';
import type { QRMatrixResult } from './qris';
import type { VoxelTheme } from './themes';

export type VoxelRole =
  | 'pagoda_spire'
  | 'pagoda_roof'
  | 'pagoda_wall'
  | 'pagoda_balcony'
  | 'shrine_roof'
  | 'shrine_wall'
  | 'tree_leaves'
  | 'tree_wood'
  | 'lantern'
  | 'ground_base'
  | 'ground_path'
  | 'water_pool';

export interface VoxelBlock {
  x: number;
  y: number; // Discrete vertical level (0, 1, 2, 3...)
  z: number;
  color: THREE.Color;
  role: VoxelRole;
  isDark: boolean;
  gridRow: number;
  gridCol: number;
  delay: number;
}

export function generateVoxelDiorama(
  matrix: QRMatrixResult,
  theme: VoxelTheme,
  heightMultiplier = 1.0
): {
  voxels: VoxelBlock[];
  gridSize: number;
  totalDark: number;
  totalLight: number;
} {
  const { size, modules, isFinderPattern } = matrix;
  const voxels: VoxelBlock[] = [];
  const center = (size - 1) / 2;
  const maxRadius = (size / 2) * 1.414;

  let totalDark = 0;
  let totalLight = 0;

  // Track 3D voxel occupancy to prevent duplicate blocks at same (x,y,z)
  const occupied = new Set<string>();

  const addVoxel = (
    x: number,
    y: number,
    z: number,
    colorHex: string,
    role: VoxelRole,
    isDark: boolean,
    gridRow: number,
    gridCol: number,
    delay: number
  ) => {
    const key = `${x},${y},${z}`;
    if (occupied.has(key)) return;
    occupied.add(key);

    voxels.push({
      x,
      y,
      z,
      color: new THREE.Color(colorHex),
      role,
      isDark,
      gridRow,
      gridCol,
      delay,
    });
  };

  // Color shortcuts
  const roofColor = theme.darkPalette.roof;
  const wallColor = theme.darkPalette.walls;
  const accentColor = theme.darkPalette.accents;
  const foliageColor = theme.darkPalette.foliage;
  const finderOuterColor = theme.finderAnchor.outer;
  const finderCenterColor = theme.finderAnchor.center;
  const finderInnerColor = theme.finderAnchor.inner;
  const groundColor = theme.lightPalette.ground;
  const pathColor = theme.lightPalette.pathway;
  const waterColor = theme.lightPalette.water;

  // Max Pagoda Height in discrete voxel floors based on heightMultiplier
  const baseTiers = 7;
  const totalTiers = Math.max(4, Math.round(baseTiers * heightMultiplier));
  const pagodaRadius = Math.floor(size * 0.28); // Footprint radius of main pagoda in center

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isDark = modules[r][c];
      const isFinder = isFinderPattern(r, c);

      const dx = c - center;
      const dz = r - center;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const delay = (dist / maxRadius) * 0.35;

      const worldX = dx;
      const worldZ = dz;

      // 1. THREE CORNER FINDER TOWERS (7x7 Corner Guardian Shrines)
      if (isFinder) {
        const isTopLeft = r <= 6 && c <= 6;
        const isTopRight = r <= 6 && c >= size - 7;
        const isBottomLeft = r >= size - 7 && c <= 6;

        let localR = r;
        let localC = c;
        if (isTopRight) localC = c - (size - 7);
        if (isBottomLeft) localR = r - (size - 7);

        if (isTopLeft || isTopRight || isBottomLeft) {
          // Inner 3x3 core -> 3-Tier Mini Shrine Tower
          if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) {
            const isShrineCenter = localR === 3 && localC === 3;

            // Ground base
            addVoxel(worldX, 0, worldZ, wallColor, 'shrine_wall', true, r, c, delay);
            addVoxel(worldX, 1, worldZ, wallColor, 'shrine_wall', true, r, c, delay);
            // Tier 1 Eave
            addVoxel(worldX, 2, worldZ, finderOuterColor, 'shrine_roof', true, r, c, delay);
            // Tier 2 Eave & Wall
            addVoxel(worldX, 3, worldZ, finderCenterColor, 'shrine_roof', true, r, c, delay);
            // Spire Peak
            if (isShrineCenter) {
              addVoxel(worldX, 4, worldZ, finderCenterColor, 'shrine_roof', true, r, c, delay);
              addVoxel(worldX, 5, worldZ, accentColor, 'pagoda_spire', true, r, c, delay);
            }
          }
          // 5x5 Courtyard Gap -> Clean light stone courtyard
          else if (localR >= 1 && localR <= 5 && localC >= 1 && localC <= 5) {
            addVoxel(worldX, 0, worldZ, finderInnerColor, 'ground_base', false, r, c, delay);
          }
          // Outer 7x7 Perimeter Wall & Torii Arch Eave
          else {
            addVoxel(worldX, 0, worldZ, finderOuterColor, 'shrine_wall', true, r, c, delay);
            addVoxel(worldX, 1, worldZ, finderOuterColor, 'shrine_wall', true, r, c, delay);
            addVoxel(worldX, 2, worldZ, finderOuterColor, 'shrine_roof', true, r, c, delay);
          }
        } else {
          // Separator path
          addVoxel(worldX, 0, worldZ, pathColor, 'ground_path', false, r, c, delay);
        }
      }
      // 2. DARK MODULES: MULTI-TIER PAGODA & SURROUNDING BONSAI GARDEN
      else if (isDark) {
        totalDark++;

        // A) CENTER PAGODA STRUCTURE (Authentic Tiered Tower with Cantilevered Eaves)
        if (dist <= pagodaRadius) {
          // Base foundation level
          addVoxel(worldX, 0, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);

          // Calculate how high this voxel reaches based on tiered concentric pagoda shape
          const normDist = dist / pagodaRadius; // 0 (center) to 1 (outer eave edge)

          // Each tier has walls and a cantilevered roof eave:
          // Tier 1: radius 1.0, Y = 1 to 2
          // Tier 2: radius 0.75, Y = 3 to 4
          // Tier 3: radius 0.55, Y = 5 to 6
          // Tier 4: radius 0.35, Y = 7 to 8
          // Tier 5 / Spire: radius 0.15, Y = 9 to 11

          // Tier 1 (Base Hall)
          if (normDist <= 1.0) {
            addVoxel(worldX, 1, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);
            // Tier 1 Eave Overhang
            addVoxel(worldX, 2, worldZ, roofColor, 'pagoda_roof', true, r, c, delay);
          }

          // Tier 2 (Mid-Lower Floor)
          if (normDist <= 0.8) {
            addVoxel(worldX, 3, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);
            addVoxel(worldX, 4, worldZ, roofColor, 'pagoda_roof', true, r, c, delay);
          }

          // Tier 3 (Middle Floor)
          if (normDist <= 0.6) {
            addVoxel(worldX, 5, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);
            addVoxel(worldX, 6, worldZ, roofColor, 'pagoda_roof', true, r, c, delay);
          }

          // Tier 4 (Upper Floor)
          if (normDist <= 0.42 && totalTiers >= 5) {
            addVoxel(worldX, 7, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);
            addVoxel(worldX, 8, worldZ, roofColor, 'pagoda_roof', true, r, c, delay);
          }

          // Tier 5 & Spire (Top Finial)
          if (normDist <= 0.25) {
            addVoxel(worldX, 9, worldZ, roofColor, 'pagoda_roof', true, r, c, delay);
            addVoxel(worldX, 10, worldZ, accentColor, 'pagoda_spire', true, r, c, delay);
            if (dist <= 1.2) {
              addVoxel(worldX, 11, worldZ, accentColor, 'pagoda_spire', true, r, c, delay);
              addVoxel(worldX, 12, worldZ, accentColor, 'pagoda_spire', true, r, c, delay);
            }
          }
        }
        // B) PERIMETER BONSAI TREES, TEMPLE WALLS & LANTERNS
        else {
          // Base
          addVoxel(worldX, 0, worldZ, wallColor, 'pagoda_wall', true, r, c, delay);

          // Check if part of a cluster (Tree Canopy)
          const isTreeCluster = (r + c) % 3 === 0;

          if (isTreeCluster) {
            // Tree Trunk
            addVoxel(worldX, 1, worldZ, wallColor, 'tree_wood', true, r, c, delay);
            // Volumetric Foliage
            addVoxel(worldX, 2, worldZ, foliageColor, 'tree_leaves', true, r, c, delay);
            addVoxel(worldX, 3, worldZ, foliageColor, 'tree_leaves', true, r, c, delay);
          } else {
            // Stone Lantern / Garden Wall
            addVoxel(worldX, 1, worldZ, wallColor, 'lantern', true, r, c, delay);
          }
        }
      }
      // 3. LIGHT MODULES: ZEN GROUND, PAVED PATHWAYS, SUNKEN WATER PONDS
      else {
        totalLight++;

        // Water basin / Koi pond at select positions
        const isWater = (r % 6 === 0 || c % 6 === 0) && dist > pagodaRadius && dist < maxRadius * 0.85;
        const isWalkway = Math.abs(dx) <= 1 || Math.abs(dz) <= 1 || (r + c) % 5 === 0;

        if (isWater) {
          // Slightly sunken water tile
          addVoxel(worldX, -0.2, worldZ, waterColor, 'water_pool', false, r, c, delay);
        } else if (isWalkway) {
          addVoxel(worldX, 0, worldZ, pathColor, 'ground_path', false, r, c, delay);
        } else {
          addVoxel(worldX, 0, worldZ, groundColor, 'ground_base', false, r, c, delay);
        }
      }
    }
  }

  return {
    voxels,
    gridSize: size,
    totalDark,
    totalLight,
  };
}
