import { useMemo } from 'react';
import type { QRMatrixResult } from '../lib/qris';
import type { VoxelTheme } from '../lib/themes';

interface ArchitecturalModelProps {
  matrix: QRMatrixResult;
  theme: VoxelTheme;
  heightMultiplier?: number;
}

export function ArchitecturalModel({
  matrix,
  theme,
  heightMultiplier = 1.0,
}: ArchitecturalModelProps) {
  const { size, modules, isFinderPattern } = matrix;
  const centerOffset = (size - 1) / 2;

  // Master Color Palette - Expert Japanese Temple Craftsmanship
  const lacquerCrimson = theme.darkPalette.roof || '#991b1b'; // Traditional temple vermilion lacquer
  const roofDarkCrimson = '#7f1d1d'; // Roof tile dark red
  const goldOrnament = theme.darkPalette.accents || '#f59e0b'; // Gilded bronze / gold leaf
  const goldBright = '#fbbf24';
  const yakisugiCharcoal = theme.darkPalette.walls || '#1c1917'; // Charred cedar timber
  const yakisugiDark = '#292524';
  const cedarAmber = '#78350f'; // Warm cedar wood pillars
  const cedarLight = '#92400e';
  const shojiWarmWhite = '#fefce8'; // Glowing warm shōji paper
  const graniteLight = '#cbd5e1'; // Carved stone granite
  const graniteDark = '#64748b'; // Aged temple slate


  // Nature & Garden Palette
  const sakuraDeep = '#e11d48'; // Sakura petals
  const sakuraMid = '#f43f5e';
  const sakuraSoft = '#fda4af';
  const pineDeep = '#14532d'; // Japanese pine needles
  const pineMid = '#16a34a';
  const mapleAutumn = '#ea580c'; // Autumn momiji maple
  const mossKyoto = '#86efac'; // Velvet garden moss
  const gravelSand = '#f5f5f4'; // Raked Shirakawa white gravel
  const stonePavement = '#e2e8f0'; // Temple walkway cobblestone
  const pondWater = '#38bdf8'; // Clear koi pond water
  const woodBridge = '#dc2626'; // Vermilion arched bridge

  // ===========================================================================
  // 1. ADVANCED PROCEDURAL 5-TIER PAGODA WITH CURVED SWEEPING EAVES & BRACKETS
  // ===========================================================================
  const pagodaTiers = useMemo(() => {
    // 5 Slender, authentic Japanese temple pagoda tiers (like Yasaka / Hōryū-ji)
    const baseW = Math.min(10.5, size * 0.35);

    return [
      { tier: 1, bodyW: baseW * 0.64, eaveW: baseW * 1.06, eaveH: 0.45, bodyH: 1.8 * heightMultiplier },
      { tier: 2, bodyW: baseW * 0.54, eaveW: baseW * 0.92, eaveH: 0.42, bodyH: 1.6 * heightMultiplier },
      { tier: 3, bodyW: baseW * 0.44, eaveW: baseW * 0.78, eaveH: 0.38, bodyH: 1.5 * heightMultiplier },
      { tier: 4, bodyW: baseW * 0.34, eaveW: baseW * 0.64, eaveH: 0.35, bodyH: 1.4 * heightMultiplier },
      { tier: 5, bodyW: baseW * 0.25, eaveW: baseW * 0.50, eaveH: 0.32, bodyH: 1.3 * heightMultiplier },
    ];
  }, [size, heightMultiplier]);

  // ===========================================================================
  // 2. DENSE LUSH JAPANESE GARDEN WITH ORGANIC TREES, BRIDGES & LANTERNS
  // ===========================================================================
  const gardenElements = useMemo(() => {
    const floorTiles: { x: number; y: number; z: number; sizeX: number; sizeY: number; sizeZ: number; color: string; roughness?: number; metalness?: number }[] = [];
    const organicTrees: { type: 'sakura' | 'pine' | 'maple'; x: number; z: number; scale: number; rotY: number }[] = [];
    const stoneLanterns: { x: number; z: number }[] = [];
    const bridges: { x: number; z: number; rotY: number }[] = [];
    const rockFormations: { x: number; z: number; size: number }[] = [];

    const pagodaExclusionRadius = Math.max(4.6, size * 0.18);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isDark = modules[r][c];
        const isFinder = isFinderPattern(r, c);
        const x = c - centerOffset;
        const z = r - centerOffset;
        const dist = Math.sqrt(x * x + z * z);

        if (isFinder) continue; // 3 Corner Shrines handled separately

        if (dist > pagodaExclusionRadius) {
          if (isDark) {
            // DARK QR MODULES -> Lush 3D trees, lanterns, stone boulders, bridges, and yakisugi decks
            const seed = (r * 11 + c * 17) % 12;

            if (seed === 0 || seed === 1) {
              // 🌸 Sakura Cherry Blossom Tree
              floorTiles.push({ x, y: 0.1, z, sizeX: 0.94, sizeY: 0.2, sizeZ: 0.94, color: '#3f2e22' });
              organicTrees.push({ type: 'sakura', x, z, scale: 0.9 + (seed % 3) * 0.15, rotY: (r + c) * 0.5 });
            } else if (seed === 2 || seed === 3) {
              // 🌲 Japanese Black Pine (Matsu)
              floorTiles.push({ x, y: 0.1, z, sizeX: 0.94, sizeY: 0.2, sizeZ: 0.94, color: '#27272a' });
              organicTrees.push({ type: 'pine', x, z, scale: 0.85 + (seed % 3) * 0.15, rotY: (r * c) * 0.3 });
            } else if (seed === 4) {
              // 🍁 Autumn Red Momiji Maple
              floorTiles.push({ x, y: 0.1, z, sizeX: 0.94, sizeY: 0.2, sizeZ: 0.94, color: '#3f2e22' });
              organicTrees.push({ type: 'maple', x, z, scale: 0.9, rotY: (r + c) * 0.7 });
            } else if (seed === 5) {
              // 🏮 Kasuga Stone Lantern
              floorTiles.push({ x, y: 0.1, z, sizeX: 0.94, sizeY: 0.2, sizeZ: 0.94, color: yakisugiDark });
              stoneLanterns.push({ x, z });
            } else if (seed === 6) {
              // 🪨 Zen Rock Boulder (Iwagumi)
              floorTiles.push({ x, y: 0.1, z, sizeX: 0.94, sizeY: 0.2, sizeZ: 0.94, color: graniteDark });
              rockFormations.push({ x, z, size: 0.7 + ((r + c) % 3) * 0.2 });
            } else {
              // 🪵 Yakisugi Charred Cedar Decking
              floorTiles.push({ x, y: 0.12, z, sizeX: 0.94, sizeY: 0.24, sizeZ: 0.94, color: yakisugiCharcoal, roughness: 0.7 });
            }
          } else {
            // LIGHT QR MODULES -> Sunken Koi Ponds with Bridges, Kyoto Moss, Paved Flagstones, Raked Sand
            const isPond = ((r % 6 === 0 || c % 6 === 0) && (r + c) % 2 === 0) && dist > pagodaExclusionRadius * 1.25;
            const isWalkway = Math.abs(x) <= 1.5 || Math.abs(z) <= 1.5 || (r + c) % 6 === 0;
            const isMoss = (r + c) % 3 === 0 && !isPond && !isWalkway;

            if (isPond) {
              // Sunken clear koi pond
              floorTiles.push({ x, y: -0.06, z, sizeX: 0.94, sizeY: 0.1, sizeZ: 0.94, color: pondWater, roughness: 0.1, metalness: 0.3 });
              // Occasional Arched Moon Bridge spanning pond
              if (r % 12 === 0 && c % 6 === 0) {
                bridges.push({ x, z, rotY: (r % 2 === 0 ? 0 : Math.PI / 2) });
              }
            } else if (isMoss) {
              // Velvet Kyoto Moss
              floorTiles.push({ x, y: 0.06, z, sizeX: 0.94, sizeY: 0.12, sizeZ: 0.94, color: mossKyoto, roughness: 0.85 });
            } else if (isWalkway) {
              // Flagstone Pathway
              floorTiles.push({ x, y: 0.05, z, sizeX: 0.94, sizeY: 0.1, sizeZ: 0.94, color: stonePavement, roughness: 0.6 });
            } else {
              // Raked White Shirakawa Sand
              floorTiles.push({ x, y: 0.04, z, sizeX: 0.94, sizeY: 0.08, sizeZ: 0.94, color: gravelSand, roughness: 0.75 });
            }
          }
        }
      }
    }

    return { floorTiles, organicTrees, stoneLanterns, bridges, rockFormations };
  }, [matrix, size, centerOffset, yakisugiCharcoal, yakisugiDark, graniteDark, pondWater, mossKyoto, stonePavement, gravelSand]);

  // 3 Corner Bell Towers / Torii Pavilions
  const cornerShrines = useMemo(() => {
    const finderOffset = (size - 7) / 2;
    return [
      { x: -finderOffset, z: -finderOffset, label: 'North-West Bell Tower' },
      { x: finderOffset, z: -finderOffset, label: 'North-East Torii Pavilion' },
      { x: -finderOffset, z: finderOffset, label: 'South-West Tea Pavilion' },
    ];
  }, [size]);

  // Base platform width
  const basePlatformWidth = Math.min(11, size * 0.38);

  return (
    <group position={[0, 0, 0]}>
      {/* ======================================================================= */}
      {/* 1. COURTYARD FLOOR TILES (Raked Sand, Moss, Water, Yakisugi Boardwalks) */}
      {/* ======================================================================= */}
      {gardenElements.floorTiles.map((tile, i) => (
        <mesh key={`tile-${i}`} position={[tile.x, tile.y, tile.z]} receiveShadow castShadow>
          <boxGeometry args={[tile.sizeX, tile.sizeY, tile.sizeZ]} />
          <meshStandardMaterial
            color={tile.color}
            roughness={tile.roughness ?? 0.65}
            metalness={tile.metalness ?? 0.05}
          />
        </mesh>
      ))}

      {/* ======================================================================= */}
      {/* 2. SCULPTED ORGANIC SAKURA, PINE & MAPLE TREES (Handcrafted Voxel Art) */}
      {/* ======================================================================= */}
      {gardenElements.organicTrees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0, tree.z]} rotation={[0, tree.rotY, 0]} scale={tree.scale}>
          {/* Trunk & Lateral Branches */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.5, 6]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          <mesh position={[0.3, 1.3, 0.1]} rotation={[0.4, 0, 0.6]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.8, 5]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          <mesh position={[-0.25, 1.4, -0.1]} rotation={[-0.3, 0, -0.5]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.7, 5]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>

          {/* Volumetric Cloud Foliage (Type-specific) */}
          {tree.type === 'sakura' && (
            <group position={[0, 1.7, 0]}>
              <mesh position={[0, 0.4, 0]} castShadow>
                <sphereGeometry args={[0.85, 8, 8]} />
                <meshStandardMaterial color={sakuraMid} roughness={0.6} />
              </mesh>
              <mesh position={[0.45, 0.1, 0.2]} castShadow>
                <sphereGeometry args={[0.6, 7, 7]} />
                <meshStandardMaterial color={sakuraDeep} roughness={0.6} />
              </mesh>
              <mesh position={[-0.4, 0.15, -0.2]} castShadow>
                <sphereGeometry args={[0.55, 7, 7]} />
                <meshStandardMaterial color={sakuraSoft} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.85, 0]} castShadow>
                <sphereGeometry args={[0.5, 6, 6]} />
                <meshStandardMaterial color={sakuraSoft} roughness={0.5} />
              </mesh>
            </group>
          )}

          {tree.type === 'pine' && (
            <group position={[0, 1.4, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <coneGeometry args={[1.05, 0.8, 6]} />
                <meshStandardMaterial color={pineDeep} roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.55, 0]} castShadow>
                <coneGeometry args={[0.8, 0.7, 6]} />
                <meshStandardMaterial color={pineMid} roughness={0.7} />
              </mesh>
              <mesh position={[0, 1.05, 0]} castShadow>
                <coneGeometry args={[0.55, 0.6, 6]} />
                <meshStandardMaterial color={pineDeep} roughness={0.7} />
              </mesh>
            </group>
          )}

          {tree.type === 'maple' && (
            <group position={[0, 1.6, 0]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <sphereGeometry args={[0.8, 8, 8]} />
                <meshStandardMaterial color={mapleAutumn} roughness={0.6} />
              </mesh>
              <mesh position={[0.35, 0.1, 0]} castShadow>
                <sphereGeometry args={[0.55, 6, 6]} />
                <meshStandardMaterial color="#c2410c" roughness={0.6} />
              </mesh>
              <mesh position={[-0.3, 0.55, 0.1]} castShadow>
                <sphereGeometry args={[0.45, 6, 6]} />
                <meshStandardMaterial color="#f97316" roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* ======================================================================= */}
      {/* 3. SCULPTED KASUGA STONE LANTERNS (Tōrō with Warm Glowing Core)         */}
      {/* ======================================================================= */}
      {gardenElements.stoneLanterns.map((l, i) => (
        <group key={`lantern-${i}`} position={[l.x, 0, l.z]}>
          {/* Stepped Pedestal Base */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.3, 0.55]} />
            <meshStandardMaterial color={graniteLight} roughness={0.7} />
          </mesh>
          {/* Carved Post */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.18, 0.55, 6]} />
            <meshStandardMaterial color={graniteDark} roughness={0.6} />
          </mesh>
          {/* Mid Platform (Chudai) */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.5, 0.15, 0.5]} />
            <meshStandardMaterial color={graniteLight} roughness={0.7} />
          </mesh>
          {/* Glowing Light Box (Hibukuro) */}
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
          {/* Peaked Hexagonal Stone Roof (Kasa) */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <coneGeometry args={[0.55, 0.3, 6]} />
            <meshStandardMaterial color={graniteLight} roughness={0.7} />
          </mesh>
          {/* Jewel Top (Hōju) */}
          <mesh position={[0, 1.68, 0]} castShadow>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color={graniteDark} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ======================================================================= */}
      {/* 4. ARCHED VERMILION MOON BRIDGES (Taiko-bashi) Over Koi Ponds           */}
      {/* ======================================================================= */}
      {gardenElements.bridges.map((b, i) => (
        <group key={`bridge-${i}`} position={[b.x, 0, b.z]} rotation={[0, b.rotY, 0]}>
          {/* Curved Bridge Deck */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.14, 2.2]} />
            <meshStandardMaterial color={woodBridge} roughness={0.4} />
          </mesh>
          {/* Railings with Giboshi posts */}
          {[-0.55, 0.55].map((rx) => (
            <group key={`rail-${rx}`}>
              <mesh position={[rx, 0.65, 0]} castShadow>
                <boxGeometry args={[0.08, 0.1, 2.2]} />
                <meshStandardMaterial color={woodBridge} roughness={0.4} />
              </mesh>
              {[-0.9, 0, 0.9].map((rz) => (
                <mesh key={`post-${rz}`} position={[rx, 0.5, rz]} castShadow>
                  <cylinderGeometry args={[0.05, 0.05, 0.45, 6]} />
                  <meshStandardMaterial color={woodBridge} roughness={0.4} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* ======================================================================= */}
      {/* 5. ZEN ROCK FORMATIONS (Iwagumi Natural Stones with Moss)              */}
      {/* ======================================================================= */}
      {gardenElements.rockFormations.map((rock, i) => (
        <group key={`rock-${i}`} position={[rock.x, 0, rock.z]} scale={rock.size}>
          <mesh position={[0, 0.35, 0]} rotation={[0.2, 0.4, 0.1]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={graniteDark} roughness={0.8} />
          </mesh>
          <mesh position={[0.3, 0.2, -0.15]} rotation={[-0.3, 0.2, 0.4]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.32, 0]} />
            <meshStandardMaterial color={graniteLight} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ======================================================================= */}
      {/* 6. THE MASTERPIECE 5-TIER JAPANESE PAGODA (Authentic Architecture)      */}
      {/* ======================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Granite Foundation Terrace (2-tier Kidan with steps) */}
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <boxGeometry args={[basePlatformWidth, 0.6, basePlatformWidth]} />
          <meshStandardMaterial color={graniteLight} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
          <boxGeometry args={[basePlatformWidth - 1.4, 0.3, basePlatformWidth - 1.4]} />
          <meshStandardMaterial color={graniteDark} roughness={0.7} metalness={0.1} />
        </mesh>

        {/* 5 Architectural Floors with Cantilevered Flared Curved Roofs */}
        {(() => {
          let currentFloorY = 0.85;

          return pagodaTiers.map((tierData) => {
            const thisFloorY = currentFloorY;
            const bodyHalfH = tierData.bodyH / 2;
            const eaveBaseY = thisFloorY + tierData.bodyH;

            // Increment Y for next tier
            currentFloorY += tierData.bodyH + tierData.eaveH + 0.35;

            const pillarDist = tierData.bodyW / 2 - 0.22;
            const pillarRadius = 0.22;

            return (
              <group key={`pagoda-floor-${tierData.tier}`}>
                {/* 1. Yakisugi Charred Timber Chamber Core */}
                <mesh position={[0, thisFloorY + bodyHalfH, 0]} castShadow receiveShadow>
                  <boxGeometry args={[tierData.bodyW, tierData.bodyH, tierData.bodyW]} />
                  <meshStandardMaterial color={yakisugiCharcoal} roughness={0.7} metalness={0.05} />
                </mesh>

                {/* 2. 4 Robust Corner Pillars with Granite Bases */}
                {[
                  [-pillarDist, -pillarDist],
                  [pillarDist, -pillarDist],
                  [-pillarDist, pillarDist],
                  [pillarDist, pillarDist],
                ].map(([px, pz], pIdx) => (
                  <group key={`pillar-${pIdx}`} position={[px, thisFloorY + bodyHalfH, pz]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[pillarRadius, pillarRadius, tierData.bodyH, 8]} />
                      <meshStandardMaterial color={cedarAmber} roughness={0.5} metalness={0.1} />
                    </mesh>
                    {/* Pillar Base Stone */}
                    <mesh position={[0, -bodyHalfH + 0.1, 0]} castShadow>
                      <cylinderGeometry args={[pillarRadius * 1.3, pillarRadius * 1.3, 0.2, 8]} />
                      <meshStandardMaterial color={graniteLight} roughness={0.6} />
                    </mesh>
                  </group>
                ))}

                {/* 3. Shōji Screen Lattice Panels with Warm Interior Radiance */}
                {[
                  { pos: [0, thisFloorY + bodyHalfH, tierData.bodyW / 2 + 0.02], rot: [0, 0, 0] },
                  { pos: [0, thisFloorY + bodyHalfH, -tierData.bodyW / 2 - 0.02], rot: [0, Math.PI, 0] },
                  { pos: [tierData.bodyW / 2 + 0.02, thisFloorY + bodyHalfH, 0], rot: [0, Math.PI / 2, 0] },
                  { pos: [-tierData.bodyW / 2 - 0.02, thisFloorY + bodyHalfH, 0], rot: [0, -Math.PI / 2, 0] },
                ].map((shoji, sIdx) => (
                  <group key={`shoji-${sIdx}`} position={shoji.pos as [number, number, number]} rotation={shoji.rot as [number, number, number]}>
                    {/* Outer Shōji Paper Surface */}
                    <mesh>
                      <boxGeometry args={[tierData.bodyW * 0.55, tierData.bodyH * 0.6, 0.04]} />
                      <meshStandardMaterial color={shojiWarmWhite} emissive="#fef08a" emissiveIntensity={0.25} roughness={0.9} />
                    </mesh>
                    {/* Wooden Window Grid Lattice */}
                    <mesh position={[0, 0, 0.02]}>
                      <boxGeometry args={[tierData.bodyW * 0.58, tierData.bodyH * 0.64, 0.02]} />
                      <meshStandardMaterial color={cedarLight} roughness={0.5} />
                    </mesh>
                  </group>
                ))}

                {/* 4. Surrounding Balcony with Vermilion Balustrade (Kōran) */}
                <group position={[0, thisFloorY + 0.2, 0]}>
                  {/* Balcony Floor Deck */}
                  <mesh receiveShadow castShadow>
                    <boxGeometry args={[tierData.bodyW * 1.25, 0.16, tierData.bodyW * 1.25]} />
                    <meshStandardMaterial color={cedarAmber} roughness={0.6} />
                  </mesh>
                  {/* Vermilion Railing Rim */}
                  <mesh position={[0, 0.22, 0]} castShadow>
                    <boxGeometry args={[tierData.bodyW * 1.28, 0.28, tierData.bodyW * 1.28]} />
                    <meshStandardMaterial color={lacquerCrimson} roughness={0.35} metalness={0.1} />
                  </mesh>
                </group>

                {/* 5. Stepped Cantilevered Rafter Brackets (Tokyō / Masugumi) Under Eaves */}
                <group position={[0, eaveBaseY - 0.12, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[tierData.bodyW * 1.15, 0.18, tierData.bodyW * 1.15]} />
                    <meshStandardMaterial color={cedarAmber} roughness={0.5} />
                  </mesh>
                  <mesh position={[0, 0.1, 0]} castShadow>
                    <boxGeometry args={[tierData.bodyW * 1.3, 0.14, tierData.bodyW * 1.3]} />
                    <meshStandardMaterial color={cedarAmber} roughness={0.5} />
                  </mesh>
                </group>

                {/* 6. Grand Flared Curved Japanese Pagoda Roof Eave */}
                <group position={[0, eaveBaseY, 0]}>
                  {/* Lower Flared Eave Overhang */}
                  <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
                    <boxGeometry args={[tierData.eaveW, 0.24, tierData.eaveW]} />
                    <meshStandardMaterial color={lacquerCrimson} roughness={0.25} metalness={0.1} />
                  </mesh>

                  {/* Sloped Truncated Hipped Roof Layer */}
                  <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
                    <boxGeometry args={[tierData.eaveW * 0.82, 0.2, tierData.eaveW * 0.82]} />
                    <meshStandardMaterial color={roofDarkCrimson} roughness={0.3} metalness={0.05} />
                  </mesh>

                  {/* Upper Ridge Step */}
                  <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
                    <boxGeometry args={[tierData.eaveW * 0.65, 0.15, tierData.eaveW * 0.65]} />
                    <meshStandardMaterial color={lacquerCrimson} roughness={0.25} metalness={0.1} />
                  </mesh>

                  {/* 4 Sweeping Upturned Eave Corners with Gilded Bronze Tips */}
                  {[
                    [-tierData.eaveW / 2 + 0.18, -tierData.eaveW / 2 + 0.18],
                    [tierData.eaveW / 2 - 0.18, -tierData.eaveW / 2 + 0.18],
                    [-tierData.eaveW / 2 + 0.18, tierData.eaveW / 2 - 0.18],
                    [tierData.eaveW / 2 - 0.18, tierData.eaveW / 2 - 0.18],
                  ].map(([cx, cz], cIdx) => (
                    <group key={`corner-${cIdx}`} position={[cx, 0.28, cz]}>
                      {/* Upturned Eave Tip */}
                      <mesh rotation={[0.4, 0, 0.4]} castShadow>
                        <boxGeometry args={[0.42, 0.35, 0.42]} />
                        <meshStandardMaterial color={goldOrnament} roughness={0.2} metalness={0.8} />
                      </mesh>
                    </group>
                  ))}
                </group>
              </group>
            );
          });
        })()}

        {/* 7. Towering Sacred Gilded Bronze Spire (Sōrin) */}
        {(() => {
          // Calculate top apex Y
          let topApexY = 0.85;
          pagodaTiers.forEach((t) => {
            topApexY += t.bodyH + t.eaveH + 0.35;
          });

          const spireH = 5.2 * heightMultiplier;

          return (
            <group position={[0, topApexY, 0]}>
              {/* Roban: Sacred Lotus Pedestal Box */}
              <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.4, 0.6, 1.4]} />
                <meshStandardMaterial color={yakisugiCharcoal} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.65, 0]} castShadow>
                <boxGeometry args={[1.0, 0.25, 1.0]} />
                <meshStandardMaterial color={goldOrnament} roughness={0.25} metalness={0.85} />
              </mesh>

              {/* Central Bronze Mast (Hashira) */}
              <mesh position={[0, 0.7 + spireH / 2, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.25, spireH, 12]} />
                <meshStandardMaterial color={goldOrnament} roughness={0.2} metalness={0.9} />
              </mesh>

              {/* 9 Sacred Bronze Rings (Kurin) */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((ringIdx) => {
                const ringY = 1.1 + ringIdx * 0.42 * heightMultiplier;
                const ringRadius = 0.62 - ringIdx * 0.025;
                return (
                  <mesh key={`kurin-${ringIdx}`} position={[0, ringY, 0]} castShadow>
                    <torusGeometry args={[ringRadius, 0.08, 8, 20]} />
                    <meshStandardMaterial color={goldBright} roughness={0.15} metalness={0.95} />
                  </mesh>
                );
              })}

              {/* Sacred Water Flame Ornament (Suien) */}
              <group position={[0, 0.7 + spireH - 0.6, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.7, 0.8, 0.08]} />
                  <meshStandardMaterial color={goldBright} roughness={0.15} metalness={0.95} />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                  <boxGeometry args={[0.7, 0.8, 0.08]} />
                  <meshStandardMaterial color={goldBright} roughness={0.15} metalness={0.95} />
                </mesh>
              </group>

              {/* Sacred Flaming Celestial Jewel (Hōju) at Pinnacle */}
              <mesh position={[0, 0.7 + spireH + 0.3, 0]} castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
              </mesh>
            </group>
          );
        })()}
      </group>

      {/* ======================================================================= */}
      {/* 7. THREE CORNER SHINTO BELL TOWERS (Shōrō / Torii Pavilions at Finders)*/}
      {/* ======================================================================= */}
      {cornerShrines.map((shrine, idx) => (
        <group key={`corner-shrine-${idx}`} position={[shrine.x, 0, shrine.z]}>
          {/* Granite Podium */}
          <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[6.4, 0.6, 6.4]} />
            <meshStandardMaterial color={graniteLight} roughness={0.6} />
          </mesh>

          {/* 4 Robust Lacquered Red Pillars */}
          {[-2.1, 2.1].map((px) =>
            [-2.1, 2.1].map((pz) => (
              <mesh key={`col-${px}-${pz}`} position={[px, 1.4, pz]} castShadow>
                <cylinderGeometry args={[0.26, 0.3, 2.2, 8]} />
                <meshStandardMaterial color={lacquerCrimson} roughness={0.35} />
              </mesh>
            ))
          )}

          {/* Sacred Bronze Temple Bell (Bonshō) Suspended in Center */}
          <group position={[0, 1.7, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.55, 0.75, 1.2, 12]} />
              <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={goldOrnament} roughness={0.2} metalness={0.9} />
            </mesh>
          </group>

          {/* 2-Tier Flared Pavilion Roof */}
          <group position={[0, 2.6, 0]}>
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <boxGeometry args={[5.8, 0.36, 5.8]} />
              <meshStandardMaterial color={lacquerCrimson} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.36, 4.2]} />
              <meshStandardMaterial color={roofDarkCrimson} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 0.36, 2.5]} />
              <meshStandardMaterial color={lacquerCrimson} roughness={0.25} />
            </mesh>
            {/* Gilded Roof Cap */}
            <mesh position={[0, 1.25, 0]} castShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              <meshStandardMaterial color={goldBright} roughness={0.15} metalness={0.95} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
