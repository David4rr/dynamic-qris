import type { QRMatrixResult } from '../qris';
import type { VoxelTheme } from '../themes';
import type { VoxelBlock } from './types';
import { buildJapanesePagoda } from './pagodaBuilder';
import { buildModernVilla } from './villaBuilder';
import { buildLighthouse } from './lighthouseBuilder';
import {
  buildFinderAnchorVoxels,
  buildGroundTileVoxels,
  buildDarkModuleVoxels,
} from './terrainBuilder';

/**
 * Procedural Master 3D Voxel Scene Generator
 * Assembles all architectural landmarks, ground tiles, botanical trees, and QR modules.
 */
export function generateSceneVoxels(
  matrix: QRMatrixResult,
  theme: VoxelTheme,
  heightMultiplier = 1.0
): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const { size, modules, isFinderPattern } = matrix;
  const center = (size - 1) / 2;
  const themeId = theme.id;
  const landmarkRadius = 3.2;

  // 1. Generate Per-Cell QR Modules & Terrain
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isDark = modules[r][c];
      const isFinder = isFinderPattern(r, c);
      const x = c - center;
      const z = r - center;
      const dist = Math.sqrt(x * x + z * z);

      // Deterministic pseudo-random hash for variety
      const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453);
      const rand = hash - Math.floor(hash);

      // A. Finder Patterns (3 Corners: NW, NE, SW)
      if (isFinder) {
        const finderBlocks = buildFinderAnchorVoxels(
          r,
          c,
          size,
          theme,
          heightMultiplier,
          x,
          z
        );
        list.push(...finderBlocks);
        continue;
      }

      // B. Central Zone: Skip cells handled by 3D Landmark
      if (dist <= landmarkRadius && themeId !== 'forest-cabin') {
        if (isDark) {
          list.push({
            x,
            y: 0.1,
            z,
            sx: 0.94,
            sy: 0.2,
            sz: 0.94,
            color: theme.darkPalette.roof || '#09090b',
          });
        }
        continue;
      }

      // C. Light Modules: Themed Ground Tiles
      if (!isDark) {
        const groundBlocks = buildGroundTileVoxels(
          r,
          c,
          size,
          themeId,
          rand,
          dist,
          landmarkRadius,
          x,
          z
        );
        list.push(...groundBlocks);
        continue;
      }

      // D. Dark Modules: Themed Botanical & Architectural Blocks
      const darkBlocks = buildDarkModuleVoxels(
        themeId,
        rand,
        heightMultiplier,
        x,
        z
      );
      list.push(...darkBlocks);
    }
  }

  // 2. Central 3D Architectural Landmark Masterpieces
  if (themeId === 'japanese-garden') {
    list.push(...buildJapanesePagoda(heightMultiplier));
  } else if (themeId === 'modern-villa') {
    list.push(...buildModernVilla(heightMultiplier));
  } else if (themeId === 'cyberpunk') {
    list.push(...buildLighthouse(heightMultiplier));
  }

  return list;
}
