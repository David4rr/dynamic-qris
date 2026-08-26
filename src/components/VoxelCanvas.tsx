import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  MousePointer,
  Sparkles,
} from 'lucide-react';
import type { QRMatrixResult } from '../lib/qris';
import type { VoxelTheme } from '../lib/themes';
import { VoxelScene, type CameraViewMode } from './VoxelScene';
import { NeoBadge } from './ui/neobrutalism';

export type CameraPreset = CameraViewMode;
export type { CameraViewMode };

interface VoxelCanvasProps {
  matrix: QRMatrixResult;
  theme: VoxelTheme;
  cameraMode: CameraViewMode;
  heightMultiplier?: number;
}

export function VoxelCanvas({
  matrix,
  theme,
  cameraMode,
  heightMultiplier = 1.0,
}: VoxelCanvasProps) {
  const [fps, setFps] = useState<number>(60);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FDFBF7] font-mono select-none">
      {/* 3D WebGL Canvas filling full viewport */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          logarithmicDepthBuffer: true,
        }}
        camera={{
          position: [26, 28, 26],
          fov: 38,
          near: 0.1,
          far: 200,
        }}
      >
        <VoxelScene
          matrix={matrix}
          theme={theme}
          cameraMode={cameraMode}
          heightMultiplier={heightMultiplier}
          onFpsUpdate={setFps}
        />
      </Canvas>


      {/* Subtle Bottom FPS / Helper Badge */}
      <div className="absolute top-16 right-4 z-30 hidden sm:flex items-center gap-2 pointer-events-none">
        <NeoBadge variant="white" className="text-[10px] py-0.5 px-2">
          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
          <span>{fps} FPS</span>
          <span className="text-slate-300">|</span>
          <MousePointer className="w-2.5 h-2.5 text-slate-500" />
          <span>{cameraMode === 'orbit' ? 'ROTATE 360°' : 'QR READY'}</span>
        </NeoBadge>
      </div>
    </div>
  );
}
