import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { QRMatrixResult } from '../lib/qris';
import type { VoxelTheme } from '../lib/themes';
import { generateSceneVoxels } from '../lib/voxel/sceneVoxelGenerator';

export type CameraViewMode = 'orbit' | 'scan';

interface VoxelSceneProps {
  matrix: QRMatrixResult;
  theme: VoxelTheme;
  cameraMode: CameraViewMode;
  heightMultiplier?: number;
  onFpsUpdate?: (fps: number) => void;
}

const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();

export function VoxelScene({
  matrix,
  theme,
  cameraMode,
  heightMultiplier = 1.0,
  onFpsUpdate,
}: VoxelSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera, size: viewportSize } = useThree();
  const { size } = matrix;
  const isPortrait = viewportSize.width < viewportSize.height;
  const aspect = viewportSize.width / Math.max(viewportSize.height, 1);

  // Procedural Master 3D Voxel Construction (Modular Architecture & Terrain)
  const voxelInstances = useMemo(() => {
    return generateSceneVoxels(matrix, theme, heightMultiplier);
  }, [matrix, theme, heightMultiplier]);

  // Send matrix and color transformations to GPU ONCE when voxelInstances change (0 overhead in useFrame)
  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      for (let i = 0; i < voxelInstances.length; i++) {
        const v = voxelInstances[i];
        dummy.position.set(v.x, v.y, v.z);
        dummy.scale.set(v.sx, v.sy, v.sz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        tempColor.set(v.color);
        mesh.setColorAt(i, tempColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [voxelInstances]);

  // Camera transition state
  const isTransitioningRef = useRef(false);
  const transitionStartRef = useRef(0);
  const startCamPosRef = useRef(new THREE.Vector3());
  const startCamUpRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());
  const prevCameraModeRef = useRef(cameraMode);

  const targetCamPos = useMemo(() => {
    const tanHalfFov = Math.tan((38 / 2) * (Math.PI / 180));
    const effectiveAspect = Math.max(aspect, 0.35);

    if (cameraMode === 'scan') {
      const requiredSpan = (size + 3.2) * 1.2;
      const heightForWidth = requiredSpan / (2 * tanHalfFov * effectiveAspect);
      const heightForHeight = requiredSpan / (2 * tanHalfFov);
      const scanHeight = Math.max(heightForWidth, heightForHeight);
      return new THREE.Vector3(0, scanHeight, 0);
    }

    const requiredSpan = (size + 3.5) * 1.16;
    const distForWidth = requiredSpan / (2 * tanHalfFov * effectiveAspect);
    const distForHeight = requiredSpan / (2 * tanHalfFov);
    const baseDist = Math.max(distForWidth, distForHeight) * 0.72;
    return new THREE.Vector3(baseDist, baseDist * 0.95, baseDist);
  }, [cameraMode, size, aspect]);

  const targetCamUp = useMemo(() => {
    return cameraMode === 'scan' ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);
  }, [cameraMode]);

  const targetLookAt = useMemo(() => {
    if (cameraMode === 'scan') {
      const offsetZ = isPortrait ? size * 0.08 : 0;
      return new THREE.Vector3(0, 0, offsetZ);
    }
    const offsetY = isPortrait ? 1.0 : 2.0;
    return new THREE.Vector3(0, offsetY, 0);
  }, [cameraMode, isPortrait, size]);

  // Trigger camera transition ONLY when cameraMode actually switches (Scan <-> Orbit)
  useEffect(() => {
    if (prevCameraModeRef.current !== cameraMode) {
      prevCameraModeRef.current = cameraMode;
      startCamPosRef.current.copy(camera.position);
      startCamUpRef.current.copy(camera.up);
      if (controlsRef.current) {
        startTargetRef.current.copy(controlsRef.current.target);
      }
      transitionStartRef.current = performance.now();
      isTransitioningRef.current = true;
    }
  }, [cameraMode, camera]);

  // Cancel any active camera transition immediately when user touches/drags with OrbitControls
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserInteraction = () => {
      isTransitioningRef.current = false;
    };

    controls.addEventListener('start', handleUserInteraction);
    return () => {
      controls.removeEventListener('start', handleUserInteraction);
    };
  }, []);
  // Ultra-Lightweight Frame Loop: 0 voxel loops when idle, smooth camera transitions
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(0);

  useFrame(() => {
    // 1. Camera Transition during Mode Switch (350ms duration)
    if (isTransitioningRef.current) {
      const now = performance.now();
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

    // 2. Throttled FPS Counter (0% GC overhead)
    if (onFpsUpdate) {
      const now = performance.now();
      if (lastFpsTimeRef.current === 0) {
        lastFpsTimeRef.current = now;
      }
      frameCountRef.current++;
      if (now - lastFpsTimeRef.current >= 500) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
        onFpsUpdate(fps);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }
    }
  });
  const baseplateSize = size + 2.6;

  return (
    <>
      {/* Studio Background */}
      <color attach="background" args={[theme.environment.skyColor]} />

      {/* Balanced Lighting */}
      <ambientLight color="#ffffff" intensity={cameraMode === 'scan' ? 1.1 : 0.85} />
      <directionalLight
        position={cameraMode === 'scan' ? [0, 50, 0] : [26, 42, 22]}
        intensity={cameraMode === 'scan' ? 1.2 : 1.35}
        color="#ffffff"
        castShadow={cameraMode !== 'scan'}
        shadow-mapSize-width={isPortrait ? 512 : 1024}
        shadow-mapSize-height={isPortrait ? 512 : 1024}
        shadow-bias={-0.0002}
      />
      {cameraMode !== 'scan' && (
        <directionalLight position={[-20, 25, -20]} intensity={0.3} color="#ffffff" />
      )}

      {/* Coastal Lighthouse Glowing Fresnel Beacon Light (3D Orbit Mode) */}
      {theme.id === 'cyberpunk' && cameraMode !== 'scan' && (
        <>
          <pointLight
            position={[0.55, 11.2 * heightMultiplier, -0.3]}
            color="#fef08a"
            intensity={3.2}
            distance={28}
            decay={1.6}
          />
          <spotLight
            position={[0.55, 11.2 * heightMultiplier, -0.3]}
            target-position={[12, 4, -10]}
            color="#fef9c3"
            intensity={4.5}
            angle={Math.PI / 5}
            penumbra={0.5}
            distance={40}
          />
        </>
      )}

      {/* 360-degree Orbit Controls with Mobile Touch Support */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        minDistance={4}
        maxDistance={400}
        maxPolarAngle={Math.PI / 2 - 0.02}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.75}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />

      {/* 1-Draw-Call InstancedMesh */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, voxelInstances.length]}
        castShadow={cameraMode !== 'scan'}
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.65} metalness={0.05} />
      </instancedMesh>

      {/* 1. Seamless Pristine White Baseplate (Top flush at y = 0 to eliminate Z-fighting) */}
      <mesh position={[0, -0.04, 0]} receiveShadow={false}>
        <boxGeometry args={[baseplateSize, 0.08, baseplateSize]} />
        <meshStandardMaterial
          color={theme.plinth?.topColor || '#ffffff'}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Themed Architectural Pedestal Base */}
      <group position={[0, -0.08, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[baseplateSize + 0.12, 0.03, baseplateSize + 0.12]} />
          <meshStandardMaterial
            color={theme.plinth?.accentColor || '#991b1b'}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        <mesh receiveShadow position={[0, -0.06, 0]}>
          <boxGeometry args={[baseplateSize + 0.28, 0.14, baseplateSize + 0.28]} />
          <meshStandardMaterial
            color={theme.plinth?.frameColor || '#241711'}
            roughness={theme.plinth?.roughness || 0.6}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[baseplateSize + 0.24, 0.2, baseplateSize + 0.24]} />
          <meshStandardMaterial
            color={theme.plinth?.bodyColor || '#140d0a'}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, -0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[baseplateSize + 3.0, baseplateSize + 3.0]} />
          <meshBasicMaterial color="#000000" opacity={0.08} transparent />
        </mesh>
      </group>
    </>
  );
}
