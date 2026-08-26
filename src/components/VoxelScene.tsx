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
  const { size } = matrix;

  // Procedural Master 3D Voxel Construction (Modular Architecture & Terrain)
  const voxelInstances = useMemo(() => {
    return generateSceneVoxels(matrix, theme, heightMultiplier);
  }, [matrix, theme, heightMultiplier]);

  // Snappy transition state when switching camera modes
  const isTransitioningRef = useRef(false);
  const transitionStartRef = useRef(0);
  const startCamPosRef = useRef(new THREE.Vector3());
  const startCamUpRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());

  const targetCamPos = useMemo(() => {
    if (cameraMode === 'scan') {
      return new THREE.Vector3(0, size * 2.0, 0);
    }
    const dist = size * 0.95;
    return new THREE.Vector3(dist, dist * 0.95, dist);
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

  // Frame Loop: Camera choreography & 1-draw-call matrix updates
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(0);

  useFrame(() => {
    const now = performance.now();
    if (lastFpsTimeRef.current === 0) {
      lastFpsTimeRef.current = now;
    }
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

    // 2. Apply matrix & color updates to InstancedMesh
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
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      {cameraMode !== 'scan' && (
        <directionalLight position={[-20, 25, -20]} intensity={0.3} color="#ffffff" />
      )}

      {/* 360-degree Orbit Controls */}
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

      {/* Seamless Pristine White Baseplate */}
      <mesh position={[0, -0.01, 0]} receiveShadow={false}>
        <boxGeometry args={[baseplateSize, 0.04, baseplateSize]} />
        <meshStandardMaterial
          color={theme.plinth?.topColor || '#ffffff'}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>

      {/* Themed Architectural Pedestal Base */}
      <group position={[0, -0.05, 0]}>
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
