import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { QRMatrixResult } from '../lib/qris';
import type { VoxelTheme } from '../lib/themes';

export type CameraViewMode = 'orbit' | 'scan';

interface VoxelSceneProps {
  matrix: QRMatrixResult;
  theme: VoxelTheme;
  cameraMode: CameraViewMode;
  heightMultiplier?: number;
  onFpsUpdate?: (fps: number) => void;
}

interface VoxelBlock {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  color: string;
}

const dummy = new THREE.Object3D();

export function VoxelScene({
  matrix,
  theme,
  cameraMode,
  heightMultiplier = 1.0,
  onFpsUpdate,
}: VoxelSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const { size, modules, isFinderPattern } = matrix;
  const center = (size - 1) / 2;

  // Build Master-Level 3D Architectural Dioramas with Seamless Pristine Floor
  const voxelInstances = useMemo(() => {
    const list: VoxelBlock[] = [];
    const themeId = theme.id;
    // Central landmark zone radius
    const landmarkRadius = 3.2;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isDark = modules[r][c];
        const isFinder = isFinderPattern(r, c);
        const x = c - center;
        const z = r - center;
        const dist = Math.sqrt(x * x + z * z);

        // Pseudorandom deterministic hash for rich botanical / architectural variety
        const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453);
        const rand = hash - Math.floor(hash);

        // =====================================================================
        // 1. FINDER PATTERNS (3 Corners: NW, NE, SW - 7x7 Anchors)
        // Strictly compliant 1:1:3:1:1 high-contrast ratio
        // =====================================================================
        if (isFinder) {
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
              // 3x3 Center Core: Solid high-contrast tiered core
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
              // 5x5 Inner Gap: Clean flush white courtyard
              list.push({ x, y: 0.02, z, sx: 0.98, sy: 0.04, sz: 0.98, color: '#ffffff' });
            } else if (isOuter) {
              // 7x7 Perimeter Wall: Deep dark lacquer wall & eave
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
          continue;
        }

        // =====================================================================
        // 2. CENTRAL ZONE: Skip per-cell voxels if handled by central 3D Landmark
        // =====================================================================
        if (dist <= landmarkRadius && themeId !== 'forest-cabin') {
          if (isDark) {
            list.push({
              x,
              y: 0.1,
              z,
              sx: 0.94,
              sy: 0.2,
              sz: 0.94,
              color: '#09090b',
            });
          }
          continue;
        }
        // =====================================================================
        // 3. THEME-TAILORED 3D VOXEL GROUND TILES (Light Modules)
        // Rich tactile voxel textures styled uniquely per theme
        // =====================================================================
        if (!isDark) {
          if (themeId === 'japanese-garden') {
            // Zen Garden: White Gravel, Stone Stepping Paths & Azure Koi Pond Basin
            const isKoiWater = (r % 6 === 0 || c % 6 === 0) && dist > landmarkRadius && dist < size * 0.42;
            const isStonePath = (r + c) % 4 === 0 || Math.abs(x) === 1 || Math.abs(z) === 1;

            if (isKoiWater) {
              // Sunken azure koi pond water tile
              list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#38bdf8' });
            } else if (isStonePath) {
              // Japanese granite garden stepping stone
              list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#e2e8f0' });
            } else {
              // Pure white raked zen gravel block with subtle height variance
              const h = 0.04 + (rand > 0.6 ? 0.02 : 0);
              list.push({ x, y: h / 2, z, sx: 0.96, sy: h, sz: 0.96, color: rand > 0.5 ? '#ffffff' : '#f8fafc' });
            }
          } else if (themeId === 'forest-cabin') {
            // Alpine Forest: Snow Clearing, Sandy Dirt Trails & Mountain Creek
            const isCreek = (r % 7 === 0 || c % 7 === 0) && dist > landmarkRadius;
            const isTrail = (r * 2 + c) % 5 === 0 || Math.abs(x - z) <= 1;

            if (isCreek) {
              // Mountain creek water
              list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#0284c7' });
            } else if (isTrail) {
              // Pine needle / hiking trail
              list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#fef3c7' });
            } else {
              // Crisp white snow clearing
              list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
            }
          } else if (themeId === 'modern-villa') {
            // Modern Villa: Polished Limestone, Teak Deck Walkways & Plunge Pool Channels
            const isPoolWater = (r % 5 === 0 || c % 5 === 0) && dist > landmarkRadius && dist < size * 0.4;
            const isTeakWalkway = (r + c * 2) % 6 === 0;

            if (isPoolWater) {
              // Turquoise water reflection tile
              list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#38bdf8' });
            } else if (isTeakWalkway) {
              // Warm teak outdoor decking
              list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#b45309' });
            } else {
              // White terrazzo / limestone terrace block
              list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
            }
          } else {
            // Coastal Lighthouse: Sand Dunes, Wooden Boardwalks & Ocean Surf
            const isOceanSurf = (r % 6 === 0 || c % 6 === 0) && dist > landmarkRadius;
            const isBoardwalk = (r - c) % 5 === 0;

            if (isOceanSurf) {
              // Azure ocean surf
              list.push({ x, y: 0.02, z, sx: 0.96, sy: 0.04, sz: 0.96, color: '#0284c7' });
            } else if (isBoardwalk) {
              // Weathered wooden dock pier
              list.push({ x, y: 0.06, z, sx: 0.94, sy: 0.08, sz: 0.94, color: '#92400e' });
            } else {
              // White beach sand dune block
              list.push({ x, y: 0.03, z, sx: 0.96, sy: 0.06, sz: 0.96, color: '#ffffff' });
            }
          }
          continue;
        }
        // 4. DARK MODULES: 3D Nature & Garden Architecture (By Theme)
        // Strictly constrained within cell boundary (sx, sz <= 0.94)
        // =====================================================================
        if (themeId === 'japanese-garden') {
          // --- THEME 1: JAPANESE PAGODA & ZEN BOTANICAL GARDEN ---
          if (rand < 0.45) {
            // 🌲 Matsu Pine Tree with layered needle canopy
            const treeH = (1.2 + rand * 1.3) * heightMultiplier;
            list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
            list.push({ x, y: treeH * 0.35, z, sx: 0.35, sy: treeH * 0.5, sz: 0.35, color: '#3e2723' });
            list.push({ x, y: treeH * 0.7, z, sx: 0.92, sy: treeH * 0.35, sz: 0.92, color: '#064e3b' });
            list.push({ x, y: treeH * 0.95, z, sx: 0.72, sy: treeH * 0.25, sz: 0.72, color: '#14532d' });
          } else if (rand < 0.75) {
            // 🌸 Sakura Bonsai with crimson blossom clusters
            const treeH = (1.0 + rand * 1.1) * heightMultiplier;
            list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
            list.push({ x, y: treeH * 0.35, z, sx: 0.35, sy: treeH * 0.5, sz: 0.35, color: '#3e2723' });
            list.push({ x, y: treeH * 0.7, z, sx: 0.92, sy: treeH * 0.35, sz: 0.92, color: '#be123c' });
            list.push({ x, y: treeH * 0.95, z, sx: 0.72, sy: treeH * 0.25, sz: 0.72, color: '#e11d48' });
          } else {
            // 🏮 Kasuga Stone Lantern / Torii Shrine Marker
            list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#09090b' });
            list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.55, sy: 0.45 * heightMultiplier, sz: 0.55, color: '#1e293b' });
            list.push({ x, y: 0.95 * heightMultiplier, z, sx: 0.88, sy: 0.25 * heightMultiplier, sz: 0.88, color: '#09090b' });
          }
        } else if (themeId === 'forest-cabin') {
          // --- THEME 2: ALPINE CONIFEROUS FOREST ---
          if (rand < 0.65) {
            // 🌲 Evergreen Spruce Tree
            const treeH = (1.3 + rand * 2.0) * heightMultiplier;
            list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#451a03' });
            list.push({ x, y: treeH * 0.3, z, sx: 0.32, sy: treeH * 0.45, sz: 0.32, color: '#3e2723' });
            list.push({ x, y: treeH * 0.6, z, sx: 0.92, sy: treeH * 0.32, sz: 0.92, color: '#064e3b' });
            list.push({ x, y: treeH * 0.82, z, sx: 0.74, sy: treeH * 0.26, sz: 0.74, color: '#14532d' });
            list.push({ x, y: treeH * 0.98, z, sx: 0.5, sy: treeH * 0.18, sz: 0.5, color: '#166534' });
          } else if (rand < 0.85) {
            // 🪵 Stacked Timber Log Pillar
            list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#451a03' });
            list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.86, sy: 0.45 * heightMultiplier, sz: 0.86, color: '#78350f' });
            list.push({ x, y: 0.95 * heightMultiplier, z, sx: 0.92, sy: 0.25 * heightMultiplier, sz: 0.92, color: '#451a03' });
          } else {
            // 🪨 Mountain Rock Boulder
            list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#1e293b' });
            list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.78, sy: 0.35 * heightMultiplier, sz: 0.78, color: '#064e3b' });
          }
        } else if (themeId === 'modern-villa') {
          // --- THEME 3: LUXURY MODERN VILLA PALMS & TERRAZZA ---
          if (rand < 0.60) {
            // 🌴 Tropical Coconut Palm with curved trunk & tiered fronds
            const palmH = (1.2 + rand * 1.3) * heightMultiplier;
            list.push({ x, y: 0.15, z, sx: 0.94, sy: 0.3, sz: 0.94, color: '#09090b' });
            // Wooden trunk
            list.push({ x, y: palmH * 0.35, z, sx: 0.28, sy: palmH * 0.6, sz: 0.28, color: '#78350f' });
            // Coconuts
            list.push({ x, y: palmH * 0.72, z, sx: 0.45, sy: 0.25, sz: 0.45, color: '#451a03' });
            // Main fronds
            list.push({ x, y: palmH * 0.85, z, sx: 0.94, sy: 0.26, sz: 0.94, color: '#15803d' });
            // Upper crown
            list.push({ x, y: palmH * 0.98, z, sx: 0.68, sy: 0.22, sz: 0.68, color: '#16a34a' });
          } else if (rand < 0.85) {
            // 🪑 Minimalist Teak Planter / Sun Lounger
            list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
            list.push({ x, y: 0.52 * heightMultiplier, z, sx: 0.88, sy: 0.28 * heightMultiplier, sz: 0.88, color: '#b45309' });
            list.push({ x, y: 0.75 * heightMultiplier, z, sx: 0.6, sy: 0.22 * heightMultiplier, sz: 0.6, color: '#15803d' });
          } else {
            // Charcoal Slate Garden Marker
            list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#1e293b' });
            list.push({ x, y: 0.65 * heightMultiplier, z, sx: 0.82, sy: 0.35 * heightMultiplier, sz: 0.82, color: '#09090b' });
          }
        } else {
          // --- THEME 4: LIGHTHOUSE ISLAND ---
          if (rand < 0.55) {
            // Coastal Palm Tree
            const palmH = (1.1 + rand * 1.1) * heightMultiplier;
            list.push({ x, y: 0.2, z, sx: 0.94, sy: 0.4, sz: 0.94, color: '#09090b' });
            list.push({ x, y: palmH * 0.35, z, sx: 0.3, sy: palmH * 0.55, sz: 0.3, color: '#78350f' });
            list.push({ x, y: palmH * 0.75, z, sx: 0.92, sy: palmH * 0.3, sz: 0.92, color: '#15803d' });
            list.push({ x, y: palmH * 0.95, z, sx: 0.7, sy: palmH * 0.2, sz: 0.7, color: '#16a34a' });
          } else {
            // Coastal Granite Rock
            list.push({ x, y: 0.25, z, sx: 0.94, sy: 0.5, sz: 0.94, color: '#1e293b' });
            list.push({ x, y: 0.6 * heightMultiplier, z, sx: 0.82, sy: 0.35 * heightMultiplier, sz: 0.82, color: '#334155' });
          }
        }
      }
    }

    // =========================================================================
    // 5. CENTRAL 3D ARCHITECTURAL MASTERPIECES (Pagoda / Villa / Lighthouse)
    // Footprint is strictly constrained to <= 5.2 modules wide in center
    // =========================================================================

    // --- A. GRAND 5-TIER JAPANESE PAGODA TEMPLE ---
    if (themeId === 'japanese-garden') {
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

    // --- B. COASTAL LIGHTHOUSE & KEEPER'S COTTAGE ---
    } else if (themeId === 'cyberpunk') {
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

    // --- C. MASTERPIECE LUXURY ARCHITECTURAL MODERN VILLA ---
    } else if (themeId === 'modern-villa') {
      const vW = 5.0;
      const vD = 4.8;

      // 1. GROUND PODIUM & POOL TERRACE (y: 0.0 -> 0.5)
      // Charcoal Travertine Foundation
      list.push({ x: 0, y: 0.25, z: 0, sx: vW * 1.12, sy: 0.5, sz: vD * 1.12, color: '#1e293b' });
      // Warm Teak Hardwood Deck (Front & Right)
      list.push({ x: 0.2, y: 0.52, z: vD * 0.24, sx: vW * 0.7, sy: 0.08, sz: vD * 0.56, color: '#b45309' });
      // Sunken Turquoise Lap Pool (Front Left)
      list.push({ x: -vW * 0.3, y: 0.51, z: vD * 0.24, sx: vW * 0.36, sy: 0.06, sz: vD * 0.52, color: '#38bdf8' });
      // White Marble Coping Trim around Pool
      list.push({ x: -vW * 0.3, y: 0.53, z: vD * 0.52, sx: vW * 0.38, sy: 0.08, sz: 0.08, color: '#ffffff' });

      // Minimalist Pool Daybed
      list.push({ x: vW * 0.28, y: 0.62, z: vD * 0.35, sx: 0.55, sy: 0.14, sz: 1.1, color: '#ffffff' });
      list.push({ x: vW * 0.28, y: 0.72, z: vD * 0.15, sx: 0.55, sy: 0.12, sz: 0.35, color: '#78350f' });

      // 2. GROUND FLOOR LIVING PAVILION (y: 0.5 -> 2.1)
      const f1H = 1.6 * heightMultiplier;
      const f1Y = 0.54;

      // 4 Solid Matte Black Steel Corner Structural Pillars
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

      // Slate Feature Wall (Rear & Side)
      list.push({ x: -vW * 0.28, y: f1Y + f1H / 2, z: -vD * 0.12, sx: 0.45, sy: f1H, sz: vD * 0.68, color: '#0f172a' });
      list.push({ x: 0, y: f1Y + f1H / 2, z: -vD * 0.38, sx: vW * 0.76, sy: f1H, sz: 0.35, color: '#1e293b' });

      // Floor-to-Ceiling Tinted Glass Facade
      list.push({ x: vW * 0.14, y: f1Y + f1H / 2, z: vD * 0.08, sx: vW * 0.52, sy: f1H - 0.1, sz: 0.18, color: '#0284c7' });
      list.push({ x: vW * 0.36, y: f1Y + f1H / 2, z: -vD * 0.12, sx: 0.18, sy: f1H - 0.1, sz: vD * 0.46, color: '#0284c7' });

      // Warm Interior Teak Core
      list.push({ x: -0.1, y: f1Y + f1H / 2, z: 0, sx: vW * 0.45, sy: f1H - 0.1, sz: vD * 0.4, color: '#78350f' });

      // 3. FLOOR 2: CANTILEVERED MASTER SUITE (y: 2.14 -> 3.8)
      const f2Y = f1Y + f1H;
      const f2H = 1.6 * heightMultiplier;

      // Floor 2 Concrete Inter-story Slab
      list.push({ x: 0.1, y: f2Y + 0.08, z: 0.1, sx: vW * 0.98, sy: 0.16, sz: vD * 0.98, color: '#f8fafc' });

      // Cantilevered White Concrete Master Suite Box
      list.push({ x: 0.08, y: f2Y + 0.16 + f2H / 2, z: 0.06, sx: vW * 0.88, sy: f2H, sz: vD * 0.82, color: '#ffffff' });

      // Vertical Teak Privacy Louver Slats (Front & Side Screens)
      list.push({ x: -vW * 0.28, y: f2Y + 0.16 + f2H / 2, z: vD * 0.28, sx: 0.18, sy: f2H - 0.15, sz: vD * 0.42, color: '#b45309' });
      list.push({ x: 0.16, y: f2Y + 0.16 + f2H / 2, z: vD * 0.46, sx: vW * 0.48, sy: f2H - 0.15, sz: 0.14, color: '#b45309' });

      // Panoramic Corner Master Bedroom Glass
      list.push({ x: vW * 0.26, y: f2Y + 0.16 + f2H / 2, z: 0.1, sx: 0.14, sy: f2H - 0.2, sz: vD * 0.52, color: '#0369a1' });
      list.push({ x: 0.12, y: f2Y + 0.16 + f2H / 2, z: -vD * 0.28, sx: vW * 0.62, sy: f2H - 0.2, sz: 0.14, color: '#0369a1' });

      // Cantilevered Master Glass Balcony (Front)
      list.push({ x: 0.12, y: f2Y + 0.22, z: vD * 0.54, sx: vW * 0.65, sy: 0.38, sz: 0.08, color: '#38bdf8' });
      list.push({ x: 0.12, y: f2Y + 0.42, z: vD * 0.54, sx: vW * 0.68, sy: 0.06, sz: 0.1, color: '#09090b' });

      // 4. FLOOR 3: ROOFTOP SKY LOUNGE, PERGOLA & SPA (y: 3.8 -> 5.2)
      const roofY = f2Y + 0.16 + f2H;

      // Rooftop White Parapet Rim
      list.push({ x: 0.08, y: roofY + 0.1, z: 0.06, sx: vW * 0.84, sy: 0.2, sz: vD * 0.78, color: '#ffffff' });

      // Slatted Teak Pergola (Right Half of Rooftop)
      const pergX = vW * 0.2;
      const pergZ = -vD * 0.06;
      const pergH = 1.2 * heightMultiplier;

      // 4 Pergola Steel Support Posts
      [
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
        [0.8, 0.8],
      ].forEach(([dx, dz]) => {
        list.push({ x: pergX + dx * 0.7, y: roofY + 0.2 + pergH / 2, z: pergZ + dz * 0.7, sx: 0.12, sy: pergH, sz: 0.12, color: '#09090b' });
      });

      // Horizontal Teak Pergola Louver Beams
      for (let b = -3; b <= 3; b++) {
        list.push({ x: pergX + b * 0.22, y: roofY + 0.2 + pergH + 0.05, z: pergZ, sx: 0.1, sy: 0.08, sz: 1.45, color: '#b45309' });
      }

      // Rooftop Glass Jacuzzi / Plunge Pool (Left Half)
      list.push({ x: -vW * 0.18, y: roofY + 0.26, z: vD * 0.1, sx: vW * 0.3, sy: 0.32, sz: vD * 0.34, color: '#38bdf8' });
      list.push({ x: -vW * 0.18, y: roofY + 0.42, z: vD * 0.27, sx: vW * 0.32, sy: 0.06, sz: 0.06, color: '#0284c7' });

      // Rooftop Greenery Planter Box
      list.push({ x: -vW * 0.22, y: roofY + 0.26, z: -vD * 0.18, sx: 0.55, sy: 0.3, sz: 0.55, color: '#ffffff' });
      list.push({ x: -vW * 0.22, y: roofY + 0.48, z: -vD * 0.18, sx: 0.45, sy: 0.25, sz: 0.45, color: '#15803d' });
    }

    return list;
  }, [size, modules, isFinderPattern, center, theme, heightMultiplier]);

  // Snappy transition state when switching camera modes
  const isTransitioningRef = useRef(false);
  const transitionStartRef = useRef(0);
  const startCamPosRef = useRef(new THREE.Vector3());
  const startCamUpRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());

  const targetCamPos = useMemo(() => {
    if (cameraMode === 'scan') {
      return new THREE.Vector3(0, size * 2.0, 0);
    } else {
      const dist = size * 0.95;
      return new THREE.Vector3(dist, dist * 0.95, dist);
    }
  }, [cameraMode, size]);

  const targetCamUp = useMemo(() => {
    return cameraMode === 'scan' ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);
  }, [cameraMode]);

  const targetLookAt = useMemo(() => {
    return cameraMode === 'scan' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 2.0, 0);
  }, [cameraMode]);

  // Trigger camera transition ONLY when cameraMode changes
  useEffect(() => {
    startCamPosRef.current.copy(camera.position);
    startCamUpRef.current.copy(camera.up);
    if (controlsRef.current) {
      startTargetRef.current.copy(controlsRef.current.target);
    }
    transitionStartRef.current = performance.now();
    isTransitioningRef.current = true;
  }, [cameraMode, camera, size]);

  // Frame Loop: Smooth transition during mode switch, and total free OrbitControls afterwards
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  useFrame(() => {
    const now = performance.now();

    // 1. Snappy Camera Transition during Mode Switch (350ms duration)
    if (isTransitioningRef.current) {
      const elapsed = now - transitionStartRef.current;
      const progress = Math.min(elapsed / 350, 1.0);
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startCamPosRef.current, targetCamPos, ease);
      camera.up.lerpVectors(startCamUpRef.current, targetCamUp, ease);

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(startTargetRef.current, targetLookAt, ease);
        controlsRef.current.update();
      }

      if (progress >= 1.0) {
        isTransitioningRef.current = false;
        camera.position.copy(targetCamPos);
        camera.up.copy(targetCamUp);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt);
          controlsRef.current.enableRotate = cameraMode !== 'scan';
          controlsRef.current.update();
        }
      }
    }

    // 2. Apply matrix updates to InstancedMesh
    if (meshRef.current) {
      const mesh = meshRef.current;
      for (let i = 0; i < voxelInstances.length; i++) {
        const v = voxelInstances[i];
        dummy.position.set(v.x, v.y, v.z);
        dummy.scale.set(v.sx, v.sy, v.sz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, new THREE.Color(v.color));
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // 3. FPS Counter
    frameCountRef.current++;
    if (now - lastFpsTimeRef.current >= 500) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      onFpsUpdate?.(fps);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }
  });

  // Seamless Diorama Baseplate Width
  const baseplateSize = size + 3.0;

  return (
    <>
      {/* Studio Background */}
      <color attach="background" args={[theme.environment.skyColor]} />

      {/* Balanced, Crisp Lighting */}
      <ambientLight color="#ffffff" intensity={cameraMode === 'scan' ? 1.1 : 0.85} />
      <directionalLight
        position={cameraMode === 'scan' ? [0, 50, 0] : [26, 42, 22]}
        intensity={cameraMode === 'scan' ? 1.2 : 1.35}
        color="#ffffff"
        castShadow={cameraMode !== 'scan'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      {cameraMode !== 'scan' && (
        <directionalLight position={[-20, 25, -20]} intensity={0.3} color="#ffffff" />
      )}

      {/* Free 360-degree Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        minDistance={4}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minPolarAngle={0.02}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
      />

      {/* Single 1-Draw-Call InstancedMesh with Matte Material */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, voxelInstances.length]}
        castShadow={cameraMode !== 'scan'}
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.65} metalness={0.05} />
      </instancedMesh>

      {/* Seamless Pristine White Diorama Floor (Smooth, zero waffle cracks) */}
      <mesh position={[0, -0.01, 0]} receiveShadow={false}>
        <boxGeometry args={[baseplateSize, 0.04, baseplateSize]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.0} />
      </mesh>

      {/* Architectural Floating Diorama Pedestal Base */}
      <group position={[0, -0.16, 0]}>
        {/* Recessed Dark Shadow Gap */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[baseplateSize - 0.3, 0.06, baseplateSize - 0.3]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} metalness={0.0} />
        </mesh>
        {/* Chamfered Hardwood/Slate Baseboard */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[baseplateSize + 0.5, 0.16, baseplateSize + 0.5]} />
          <meshStandardMaterial
            color={theme.id === 'forest-cabin' ? '#3e2723' : theme.id === 'japanese-garden' ? '#1e293b' : '#0f172a'}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        {/* Bottom Platform Rim */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[baseplateSize + 0.8, 0.06, baseplateSize + 0.8]} />
          <meshStandardMaterial color="#09090b" roughness={0.8} metalness={0.05} />
        </mesh>
      </group>
    </>
  );
}
