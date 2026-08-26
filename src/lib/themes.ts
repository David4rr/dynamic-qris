/**
 * Procedural Voxel Themes for 3D QRIS Diorama
 * Clean, modern color palettes designed for maximum top-down luminance contrast
 * and elegant isometric perspective architecture.
 */

export interface VoxelTheme {
  id: 'japanese-garden' | 'forest-cabin' | 'cyberpunk' | 'modern-villa';
  name: string;
  subtitle: string;
  iconName: 'Flower2' | 'TreePine' | 'Cpu' | 'Building2';
  // Colors for dark QR modules (solid buildings, trees, roofs)
  darkPalette: {
    roof: string;
    walls: string;
    foliage: string;
    accents: string;
  };
  // Colors for light QR modules (ground, pathways, water, sand)
  lightPalette: {
    ground: string;
    pathway: string;
    water: string;
    sand: string;
  };
  // 3 Corner Finder Pattern anchor styling (Gazebos / Torii / Towers)
  finderAnchor: {
    outer: string;
    inner: string;
    center: string;
  };
  // 3D Environment & Lighting for Clean Studio / Light Mode
  environment: {
    skyColor: string;
    fogColor: string;
    ambientColor: string;
    ambientIntensity: number;
    sunColor: string;
    sunIntensity: number;
    baseplateColor: string;
    rimColor: string;
  };
  // UI Accent Colors (Solid, no gradients)
  ui: {
    accentColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  };
}

export const VOXEL_THEMES: Record<VoxelTheme['id'], VoxelTheme> = {
  'japanese-garden': {
    id: 'japanese-garden',
    name: 'Pagoda',
    subtitle: '5-tier Japanese pagoda, cherry blossoms & zen garden',
    iconName: 'Flower2',
    darkPalette: {
      roof: '#991b1b', // Deep lacquered Japanese red
      walls: '#09090b', // Dark charred cedar (Yakisugi)
      foliage: '#e11d48', // Cherry blossom crimson
      accents: '#f59e0b', // Gold ornaments
    },
    lightPalette: {
      ground: '#ffffff', // Pure white zen gravel
      pathway: '#f1f5f9', // Pebble path
      water: '#0284c7', // Clear azure koi pond
      sand: '#ffffff',
    },
    finderAnchor: {
      outer: '#09090b',
      inner: '#ffffff',
      center: '#991b1b',
    },
    environment: {
      skyColor: '#f1f5f9',
      fogColor: '#f8fafc',
      ambientColor: '#ffffff',
      ambientIntensity: 0.8,
      sunColor: '#ffffff',
      sunIntensity: 1.4,
      baseplateColor: '#e2e8f0',
      rimColor: '#cbd5e1',
    },
    ui: {
      accentColor: '#991b1b',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecaca',
      badgeText: '#991b1b',
    },
  },

  'forest-cabin': {
    id: 'forest-cabin',
    name: 'Alpine Forest',
    subtitle: 'Dense evergreen spruce forest, rivers & trails',
    iconName: 'TreePine',
    darkPalette: {
      roof: '#14532d', // Deep pine green
      walls: '#451a03', // Dark cedar log
      foliage: '#064e3b', // Evergreen canopy
      accents: '#78350f', // Dark chestnut wood
    },
    lightPalette: {
      ground: '#ffffff', // Pure white clearing
      pathway: '#fef3c7', // Sandy trail
      water: '#0284c7', // Mountain river blue
      sand: '#ffffff',
    },
    finderAnchor: {
      outer: '#451a03',
      inner: '#ffffff',
      center: '#14532d',
    },
    environment: {
      skyColor: '#f1f5f9',
      fogColor: '#f8fafc',
      ambientColor: '#ffffff',
      ambientIntensity: 0.8,
      sunColor: '#ffffff',
      sunIntensity: 1.4,
      baseplateColor: '#e2e8f0',
      rimColor: '#cbd5e1',
    },
    ui: {
      accentColor: '#15803d',
      badgeBg: '#f0fdf4',
      badgeBorder: '#bbf7d0',
      badgeText: '#166534',
    },
  },

  'modern-villa': {
    id: 'modern-villa',
    name: 'Modern Villa',
    subtitle: 'Minimalist architecture, teak deck & infinity pool',
    iconName: 'Building2',
    darkPalette: {
      roof: '#09090b', // Slate black roof
      walls: '#1e293b', // Charcoal concrete
      foliage: '#15803d', // Tropical palms
      accents: '#b45309', // Teak wood slats
    },
    lightPalette: {
      ground: '#ffffff', // Pure white limestone
      pathway: '#f1f5f9', // Clean marble walkway
      water: '#38bdf8', // Vibrant turquoise pool
      sand: '#ffffff',
    },
    finderAnchor: {
      outer: '#09090b',
      inner: '#ffffff',
      center: '#0284c7',
    },
    environment: {
      skyColor: '#f8fafc',
      fogColor: '#f1f5f9',
      ambientColor: '#ffffff',
      ambientIntensity: 0.8,
      sunColor: '#ffffff',
      sunIntensity: 1.4,
      baseplateColor: '#e2e8f0',
      rimColor: '#cbd5e1',
    },
    ui: {
      accentColor: '#0f172a',
      badgeBg: '#f8fafc',
      badgeBorder: '#e2e8f0',
      badgeText: '#0f172a',
    },
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Lighthouse',
    subtitle: 'Coastal lighthouse, sandy beach, palm trees & ocean',
    iconName: 'Building2',
    darkPalette: {
      roof: '#dc2626', // Crimson red lighthouse stripe
      walls: '#09090b', // Obsidian granite cliff
      foliage: '#15803d', // Tropical coconut palms
      accents: '#fef08a', // Fresnel beacon light
    },
    lightPalette: {
      ground: '#ffffff', // Pure white beach sand
      pathway: '#fef3c7', // Sandy dune trail
      water: '#0284c7', // Crystal azure ocean
      sand: '#ffffff',
    },
    finderAnchor: {
      outer: '#09090b',
      inner: '#ffffff',
      center: '#dc2626',
    },
    environment: {
      skyColor: '#f0f9ff',
      fogColor: '#f8fafc',
      ambientColor: '#ffffff',
      ambientIntensity: 0.8,
      sunColor: '#ffffff',
      sunIntensity: 1.4,
      baseplateColor: '#e2e8f0',
      rimColor: '#cbd5e1',
    },
    ui: {
      accentColor: '#dc2626',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecaca',
      badgeText: '#dc2626',
    },
  },
};

export const THEME_LIST = Object.values(VOXEL_THEMES);
