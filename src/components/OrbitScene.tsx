'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Group, MeshStandardMaterial, MathUtils } from 'three';

function Sculpture({ playing, onReady, onFailure }: { playing: boolean; onReady: () => void; onFailure: () => void }) {
  const rings = useRef<Group>(null);
  const letter = useRef<Group>(null);
  const font = useLoader(FontLoader, '/assets/helvetiker_regular.typeface.json');
  const { invalidate, gl } = useThree();
  const geometry = useMemo(() => {
    const shape = new TextGeometry('p', { font, size: 2.35, depth: .4, curveSegments: 18, bevelEnabled: true, bevelThickness: .2, bevelSize: .17, bevelSegments: 8 });
    shape.center();
    return shape;
  }, [font]);
  const chrome = useMemo(() => new MeshStandardMaterial({ color: '#f0f5ff', metalness: 1, roughness: .12, envMapIntensity: 1.5 }), []);
  useEffect(() => () => { geometry.dispose(); chrome.dispose(); }, [geometry, chrome]);
  useEffect(() => {
    const timer = setTimeout(onReady, 250);
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    invalidate();
    return () => { clearTimeout(timer); canvas.removeEventListener('webglcontextlost', lost); };
  }, [onReady, onFailure, invalidate, gl]);
  useFrame((state, delta) => {
    if (!playing) return;
    if (rings.current) {
      rings.current.rotation.y += delta * .18;
      rings.current.rotation.z = Math.sin(state.clock.elapsedTime * .16) * .11;
    }
    if (letter.current) {
      letter.current.rotation.y = MathUtils.damp(letter.current.rotation.y, state.pointer.x * .2 + Math.sin(state.clock.elapsedTime * .22) * .13, 3, delta);
      letter.current.rotation.x = MathUtils.damp(letter.current.rotation.x, -state.pointer.y * .1, 3, delta);
      letter.current.position.y = Math.sin(state.clock.elapsedTime * .7) * .055;
    }
  });
  return <>
    <Environment resolution={128} frames={1} background={false}>
      <color attach="background" args={['#a7bdd9']} />
      <Lightformer form="rect" intensity={3} color="white" scale={[9, 2.5, 1]} position={[0, 1.5, 6]} />
      <Lightformer form="rect" intensity={5} color="white" scale={[8, 3, 1]} position={[-4, 4, 4]} rotation-y={.5} />
      <Lightformer form="rect" intensity={2} color="#d9eeff" scale={[3, 8, 1]} position={[4, 1, -2]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={3} color="white" scale={5} position={[0, -3, 4]} rotation-x={.5} />
      <Lightformer form="rect" intensity={3} color="#f1f7ff" scale={[1, 8, 1]} position={[-3, 0, 5]} rotation-z={-.35} />
      <Lightformer form="rect" intensity={.1} color="#132039" scale={[10, 1.5, 1]} position={[0, -1.5, 5]} />
    </Environment>
    <group rotation={[.04, -.3, .02]}>
      <group ref={letter}><mesh geometry={geometry} material={chrome} position={[0, .1, 0]} /></group>
      <mesh>
        <sphereGeometry args={[2.1, 56, 40]} />
        <meshPhysicalMaterial color="#e7f4ff" opacity={.1} transparent depthWrite={false} roughness={.025} metalness={.1} ior={1.5} envMapIntensity={2} clearcoat={1} clearcoatRoughness={.02} />
      </mesh>
      <mesh material={chrome}><torusGeometry args={[2.1, .014, 8, 128]} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={chrome}><torusGeometry args={[2.115, .025, 10, 128]} /></mesh>
      <group ref={rings}>
        <mesh rotation={[1.1, .2, -.35]} material={chrome}><torusGeometry args={[2.68, .028, 10, 128]} /></mesh>
        <mesh rotation={[.55, -.45, .9]} material={chrome}><torusGeometry args={[2.5, .019, 8, 128]} /></mesh>
        <mesh position={[2.43, .92, .25]} material={chrome}><sphereGeometry args={[.095, 16, 12]} /></mesh>
      </group>
    </group>
    <ambientLight intensity={.5} />
    <directionalLight position={[-5, 7, 5]} intensity={3} color="#ffffff" />
    <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={.07} rotateSpeed={.4} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI * .7} />
  </>;
}

export default function OrbitScene({ playing, onReady, onFailure }: { playing: boolean; onReady: () => void; onFailure: () => void }) {
  return <Canvas camera={{ position: [0, 0, 8.5], fov: 40 }} dpr={[1, 1.5]} frameloop={playing ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={null}>
    <Suspense fallback={null}><Sculpture playing={playing} onReady={onReady} onFailure={onFailure} /></Suspense>
  </Canvas>;
}
