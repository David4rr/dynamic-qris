import type { VoxelBlock } from './types';

/**
 * Procedural Luxury Architectural Modern Villa Builder
 * Constructs an ultra-detailed Bauhaus/Tropical Modernist residence with:
 * - Sunken conversation lounge with glowing central fire table
 * - Infinity plunge pool with submerged Baja tanning shelf and stainless ladder
 * - Teak sun loungers and cantilevered sun umbrella
 * - Ground floor living pavilion with kitchen bar counter and warm pendant lighting
 * - Floating cantilevered concrete staircase with glass balustrade
 * - Cantilevered master bedroom suite with interior bed, warm reading lamps, and 3D teak privacy louvers
 * - Balcony planter box with cascading green vines hanging over the lower facade
 * - Rooftop sky lounge with black steel pergola, teak sunshade slats, and glass infinity hot tub
 */
export function buildModernVilla(heightMultiplier = 1.0): VoxelBlock[] {
  const list: VoxelBlock[] = [];
  const vW = 4.8;
  const vD = 4.6;

  // =========================================================================
  // 1. GROUND PODIUM, POOL TERRACE & SUNKEN FIRE LOUNGE (y: 0.0 -> 0.58)
  // =========================================================================
  // Basalt foundation plinth
  list.push({ x: 0, y: 0.22, z: 0, sx: vW * 1.1, sy: 0.44, sz: vD * 1.1, color: '#1e293b' });
  // Bleached travertine pool terrace deck
  list.push({ x: 0.15, y: 0.48, z: vD * 0.22, sx: vW * 0.72, sy: 0.08, sz: vD * 0.58, color: '#e2e8f0' });

  // A. Sunken Infinity Plunge Pool & Baja Lounging Shelf
  const poolX = -vW * 0.32;
  const poolZ = vD * 0.24;
  const poolW = vW * 0.38;
  const poolD = vD * 0.54;
  // Pool basin floor (deep ocean blue)
  list.push({ x: poolX, y: 0.36, z: poolZ, sx: poolW, sy: 0.16, sz: poolD, color: '#0369a1' });
  // Sparkling turquoise pool water
  list.push({ x: poolX, y: 0.46, z: poolZ, sx: poolW * 0.94, sy: 0.06, sz: poolD * 0.94, color: '#38bdf8' });
  // Submerged Baja shelf / tanning ledge
  list.push({ x: poolX + poolW * 0.28, y: 0.43, z: poolZ, sx: poolW * 0.38, sy: 0.06, sz: poolD * 0.84, color: '#7dd3fc' });
  // Pool coping rim (white marble border)
  list.push({ x: poolX, y: 0.49, z: poolZ + poolD / 2, sx: poolW, sy: 0.06, sz: 0.08, color: '#ffffff' });
  list.push({ x: poolX - poolW / 2, y: 0.49, z: poolZ, sx: 0.08, sy: 0.06, sz: poolD, color: '#ffffff' });
  // Stainless steel pool ladder
  list.push({ x: poolX + poolW * 0.42, y: 0.54, z: poolZ - poolD * 0.35, sx: 0.06, sy: 0.24, sz: 0.16, color: '#ffffff' });

  // B. Sunken Conversation Pit & Glowing Fire Table
  const pitX = vW * 0.24;
  const pitZ = vD * 0.38;
  // Pit recessed well
  list.push({ x: pitX, y: 0.44, z: pitZ, sx: 1.4, sy: 0.08, sz: 1.1, color: '#0f172a' });
  // L-shaped charcoal lounge bench
  list.push({ x: pitX, y: 0.52, z: pitZ + 0.38, sx: 1.35, sy: 0.12, sz: 0.34, color: '#1e293b' });
  list.push({ x: pitX + 0.5, y: 0.52, z: pitZ - 0.05, sx: 0.35, sy: 0.12, sz: 0.72, color: '#1e293b' });
  // White seat cushions
  list.push({ x: pitX - 0.12, y: 0.58, z: pitZ + 0.38, sx: 0.95, sy: 0.05, sz: 0.3, color: '#ffffff' });
  list.push({ x: pitX + 0.5, y: 0.58, z: pitZ - 0.05, sx: 0.3, sy: 0.05, sz: 0.68, color: '#ffffff' });
  // Central black steel fire table with glowing embers
  list.push({ x: pitX - 0.08, y: 0.54, z: pitZ - 0.05, sx: 0.46, sy: 0.12, sz: 0.46, color: '#09090b' });
  list.push({ x: pitX - 0.08, y: 0.61, z: pitZ - 0.05, sx: 0.24, sy: 0.04, sz: 0.24, color: '#ea580c' }); // Glowing fire pit core
  list.push({ x: pitX - 0.08, y: 0.64, z: pitZ - 0.05, sx: 0.12, sy: 0.04, sz: 0.12, color: '#fef08a' }); // Flame yellow tip

  // C. Teak Poolside Lounger & Cantilevered Umbrella
  list.push({ x: vW * 0.28, y: 0.54, z: vD * 0.06, sx: 0.55, sy: 0.08, sz: 1.0, color: '#b45309' });
  list.push({ x: vW * 0.28, y: 0.61, z: vD * 0.06, sx: 0.48, sy: 0.06, sz: 0.94, color: '#ffffff' }); // Cushion
  list.push({ x: vW * 0.28, y: 0.68, z: vD * 0.06 - 0.32, sx: 0.48, sy: 0.08, sz: 0.24, color: '#78350f' }); // Pillow
  // Cantilevered umbrella
  list.push({ x: vW * 0.42, y: 1.15 * heightMultiplier, z: vD * 0.06 - 0.4, sx: 0.06, sy: 1.3 * heightMultiplier, sz: 0.06, color: '#09090b' });
  list.push({ x: vW * 0.32, y: 1.8 * heightMultiplier, z: vD * 0.06 - 0.15, sx: 0.9, sy: 0.08, sz: 0.9, color: '#f8fafc' });

  // =========================================================================
  // 2. GROUND FLOOR LIVING PAVILION (y: 0.55 -> 2.1)
  // =========================================================================
  const f1H = 1.55 * heightMultiplier;
  const f1Y = 0.52;
  const pOffX = (vW * 0.86) / 2;
  const pOffZ = (vD * 0.86) / 2;

  // Architectural Matte Black Structural Steel Columns
  [
    [-pOffX, -pOffZ],
    [pOffX, -pOffZ],
    [-pOffX, pOffZ],
    [pOffX, pOffZ],
  ].forEach(([px, pz]) => {
    list.push({ x: px, y: f1Y + f1H / 2, z: pz, sx: 0.28, sy: f1H, sz: 0.28, color: '#09090b' });
  });

  // Honed Charcoal Concrete Shear Walls
  list.push({ x: -vW * 0.26, y: f1Y + f1H / 2, z: -vD * 0.14, sx: 0.42, sy: f1H, sz: vD * 0.65, color: '#0f172a' });
  list.push({ x: 0, y: f1Y + f1H / 2, z: -vD * 0.36, sx: vW * 0.74, sy: f1H, sz: 0.32, color: '#1e293b' });

  // Interior Living Pavilion Details (Visible through tinted glass)
  // Kitchen marble island bar & stools
  list.push({ x: -vW * 0.04, y: f1Y + 0.45 * heightMultiplier, z: -vD * 0.12, sx: 0.44, sy: 0.75 * heightMultiplier, sz: 1.1, color: '#0f172a' });
  list.push({ x: -vW * 0.04, y: f1Y + 0.85 * heightMultiplier, z: -vD * 0.12, sx: 0.48, sy: 0.08, sz: 1.15, color: '#ffffff' }); // White marble waterfall top
  list.push({ x: vW * 0.08, y: f1Y + 0.35 * heightMultiplier, z: -vD * 0.2, sx: 0.18, sy: 0.6 * heightMultiplier, sz: 0.18, color: '#b45309' }); // Bar stool 1
  list.push({ x: vW * 0.08, y: f1Y + 0.35 * heightMultiplier, z: -vD * 0.04, sx: 0.18, sy: 0.6 * heightMultiplier, sz: 0.18, color: '#b45309' }); // Bar stool 2
  // Warm pendant ceiling lights
  list.push({ x: -vW * 0.04, y: f1Y + f1H - 0.25 * heightMultiplier, z: -vD * 0.12, sx: 0.16, sy: 0.16, sz: 0.4, color: '#fef08a' });

  // Tinted Floor-to-Ceiling Structural Glass Panels
  list.push({ x: vW * 0.14, y: f1Y + f1H / 2, z: vD * 0.08, sx: vW * 0.5, sy: f1H - 0.08, sz: 0.14, color: '#0284c7' });
  list.push({ x: vW * 0.34, y: f1Y + f1H / 2, z: -vD * 0.12, sx: 0.14, sy: f1H - 0.08, sz: vD * 0.44, color: '#0284c7' });

  // Floating Cantilevered Exterior Concrete Staircase with Glass Railing
  for (let s = 0; s < 5; s++) {
    const sY = f1Y + 0.15 + s * 0.28 * heightMultiplier;
    const sZ = -vD * 0.25 + s * 0.22;
    list.push({ x: vW * 0.38, y: sY, z: sZ, sx: 0.45, sy: 0.08, sz: 0.24, color: '#ffffff' });
    // Glass railing step segment
    list.push({ x: vW * 0.46, y: sY + 0.22, z: sZ, sx: 0.04, sy: 0.36, sz: 0.24, color: '#38bdf8' });
  }

  // =========================================================================
  // 3. FLOOR 2: CANTILEVERED MASTER SUITE & BALCONY PLANTERS (y: 2.1 -> 3.7)
  // =========================================================================
  const f2Y = f1Y + f1H;
  const f2H = 1.55 * heightMultiplier;

  // Cantilevered reinforced architectural floor slab (projecting forward and left)
  list.push({ x: 0.06, y: f2Y + 0.08, z: 0.08, sx: vW * 0.96, sy: 0.16, sz: vD * 0.96, color: '#f8fafc' });
  // White stucco upper architectural volume
  list.push({ x: 0.06, y: f2Y + 0.16 + f2H / 2, z: 0.04, sx: vW * 0.86, sy: f2H, sz: vD * 0.8, color: '#ffffff' });

  // Interior Master Bedroom (Visible through panoramic corner glass)
  // Master king bed & headboard
  list.push({ x: 0.08, y: f2Y + 0.35 * heightMultiplier, z: -vD * 0.15, sx: 1.1, sy: 0.35 * heightMultiplier, sz: 0.8, color: '#ffffff' });
  list.push({ x: 0.08, y: f2Y + 0.48 * heightMultiplier, z: -vD * 0.24, sx: 1.1, sy: 0.5 * heightMultiplier, sz: 0.12, color: '#78350f' }); // Teak headboard
  list.push({ x: -0.32, y: f2Y + 0.45 * heightMultiplier, z: -vD * 0.22, sx: 0.14, sy: 0.14, sz: 0.14, color: '#fef08a' }); // Left reading light
  list.push({ x: 0.48, y: f2Y + 0.45 * heightMultiplier, z: -vD * 0.22, sx: 0.14, sy: 0.14, sz: 0.14, color: '#fef08a' }); // Right reading light

  // Vertical Teak Privacy Screen Louvers (8 individual 3D slats with depth gaps)
  for (let sl = -3; sl <= 4; sl++) {
    list.push({
      x: -vW * 0.28,
      y: f2Y + 0.16 + f2H / 2,
      z: vD * 0.26 + sl * 0.085,
      sx: 0.16,
      sy: f2H - 0.12,
      sz: 0.045,
      color: '#b45309',
    });
  }

  // Panoramic Corner Master Suite Tinted Glass
  list.push({ x: vW * 0.25, y: f2Y + 0.16 + f2H / 2, z: 0.1, sx: 0.12, sy: f2H - 0.18, sz: vD * 0.5, color: '#0369a1' });
  list.push({ x: 0.12, y: f2Y + 0.16 + f2H / 2, z: -vD * 0.26, sx: vW * 0.6, sy: f2H - 0.18, sz: 0.12, color: '#0369a1' });

  // Frameless Glass Balcony Railing with Black Handrail
  list.push({ x: 0.12, y: f2Y + 0.22, z: vD * 0.52, sx: vW * 0.64, sy: 0.36, sz: 0.06, color: '#38bdf8' });
  list.push({ x: 0.12, y: f2Y + 0.41, z: vD * 0.52, sx: vW * 0.66, sy: 0.05, sz: 0.08, color: '#09090b' }); // Steel handrail

  // Cascading Living Wall / Balcony Edge Planters with Hanging Vines
  const planterX = -vW * 0.05;
  const planterZ = vD * 0.48;
  list.push({ x: planterX, y: f2Y + 0.22, z: planterZ, sx: 0.8, sy: 0.24, sz: 0.18, color: '#09090b' }); // Planter box
  list.push({ x: planterX, y: f2Y + 0.36, z: planterZ, sx: 0.76, sy: 0.12, sz: 0.14, color: '#15803d' }); // Plant foliage
  // Hanging vines cascading over lower floor
  list.push({ x: planterX - 0.2, y: f2Y - 0.15 * heightMultiplier, z: planterZ + 0.08, sx: 0.18, sy: 0.45 * heightMultiplier, sz: 0.06, color: '#16a34a' });
  list.push({ x: planterX + 0.15, y: f2Y - 0.25 * heightMultiplier, z: planterZ + 0.08, sx: 0.18, sy: 0.65 * heightMultiplier, sz: 0.06, color: '#15803d' });

  // =========================================================================
  // 4. FLOOR 3: ROOFTOP SKY LOUNGE & PERGOLA (y: 3.7 -> 5.2)
  // =========================================================================
  const roofY = f2Y + 0.16 + f2H;

  // Rooftop deck slab
  list.push({ x: 0.06, y: roofY + 0.08, z: 0.04, sx: vW * 0.82, sy: 0.16, sz: vD * 0.76, color: '#ffffff' });

  // Modernist Architectural Pergola
  const pergX = vW * 0.18;
  const pergZ = -vD * 0.06;
  const pergH = 1.2 * heightMultiplier;

  // 4 Black steel pergola columns
  [
    [-0.75, -0.75],
    [0.75, -0.75],
    [-0.75, 0.75],
    [0.75, 0.75],
  ].forEach(([dx, dz]) => {
    list.push({ x: pergX + dx * 0.65, y: roofY + 0.16 + pergH / 2, z: pergZ + dz * 0.65, sx: 0.12, sy: pergH, sz: 0.12, color: '#09090b' });
  });

  // Teak pergola overhead sunshade slats (7 parallel beams)
  for (let b = -3; b <= 3; b++) {
    list.push({ x: pergX + b * 0.22, y: roofY + 0.16 + pergH + 0.04, z: pergZ, sx: 0.09, sy: 0.07, sz: 1.42, color: '#b45309' });
  }

  // Rooftop Infinity Hot Tub Jacuzzi (Bubbling Turquoise Water & Steps)
  const jaxX = -vW * 0.18;
  const jaxZ = vD * 0.1;
  list.push({ x: jaxX, y: roofY + 0.24, z: jaxZ, sx: vW * 0.28, sy: 0.28, sz: vD * 0.32, color: '#e2e8f0' });
  list.push({ x: jaxX, y: roofY + 0.36, z: jaxZ, sx: vW * 0.22, sy: 0.06, sz: vD * 0.26, color: '#38bdf8' }); // Bubbling water
  list.push({ x: jaxX + 0.4, y: roofY + 0.18, z: jaxZ, sx: 0.16, sy: 0.16, sz: 0.4, color: '#ffffff' }); // Jacuzzi steps

  // Rooftop Architectural Planter Box & Sculpted Bonsai Tree
  list.push({ x: -vW * 0.22, y: roofY + 0.24, z: -vD * 0.18, sx: 0.52, sy: 0.28, sz: 0.52, color: '#09090b' });
  list.push({ x: -vW * 0.22, y: roofY + 0.42, z: -vD * 0.18, sx: 0.16, sy: 0.24 * heightMultiplier, sz: 0.16, color: '#3e2723' }); // Trunk
  list.push({ x: -vW * 0.22, y: roofY + 0.58 * heightMultiplier, z: -vD * 0.18, sx: 0.48, sy: 0.22 * heightMultiplier, sz: 0.48, color: '#15803d' }); // Foliage

  return list;
}
