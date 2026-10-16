'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { Group, MeshPhysicalMaterial, MathUtils } from 'three';

function Sculpture({ playing, onReady, onFailure, rotation }: { playing: boolean; onReady: () => void; onFailure: () => void; rotation: MotionValue<number> }) {
  const sculpture = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const letter = useRef<Group>(null);
  const { invalidate, gl } = useThree();
  const bubble = useMemo(() => new MeshPhysicalMaterial({
    color: '#f8fdff',
    metalness: 0,
    roughness: .08,
    transmission: .72,
    thickness: .06,
    ior: 1.33,
    iridescence: .8,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    clearcoat: .4,
    clearcoatRoughness: .08,
    envMapIntensity: .35,
  }), []);
  useEffect(() => () => { bubble.dispose(); }, [bubble]);
  useEffect(() => rotation.on('change', value => {
    if (sculpture.current) sculpture.current.rotation.y = -.3 + value;
    invalidate();
  }), [rotation, invalidate]);
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
      <color attach="background" args={['#eaf8ff']} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" scale={[9, 4, 1]} position={[0, 3, 6]} />
      <Lightformer form="rect" intensity={2.5} color="#d9f7ff" scale={[7, 4, 1]} position={[-4, 4, 3]} rotation-y={.5} />
      <Lightformer form="rect" intensity={1.8} color="#ffe5f7" scale={[3, 7, 1]} position={[4, 1, -2]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={1.8} color="#ffffff" scale={5} position={[0, -3, 4]} rotation-x={.5} />
    </Environment>
    <group ref={sculpture} rotation={[.04, -.3, .02]}>
      <group ref={letter} position={[.1, 0, 0]}>
        <mesh position={[-.65, -.15, 0]} material={bubble}><capsuleGeometry args={[.28, 2.15, 12, 32]} /></mesh>
        <mesh position={[.06, .58, 0]} material={bubble}><torusGeometry args={[.71, .28, 24, 80]} /></mesh>
      </group>
      <mesh>
        <sphereGeometry args={[2.1, 56, 40]} />
        <meshPhysicalMaterial color="#eafaff" opacity={.22} transparent depthWrite={false} roughness={.08} metalness={0} transmission={.72} thickness={.05} ior={1.33} iridescence={.8} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 400]} envMapIntensity={.35} clearcoat={.4} clearcoatRoughness={.08} />
      </mesh>
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.108, 48, 32]} />
        <shaderMaterial transparent depthWrite={false} vertexShader={`
          varying vec3 vNormal; varying vec3 vView;
          void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p; }
        `} fragmentShader={`
          varying vec3 vNormal; varying vec3 vView;
          void main(){ vec3 n=normalize(vNormal); float f=pow(1.0-max(dot(n,normalize(vView)),0.0),3.0); float glint=pow(max(dot(n,normalize(vec3(-.5,.65,1.0))),0.0),75.0); gl_FragColor=vec4(mix(vec3(.52,.72,1.0),vec3(1.0),f+glint),.025+f*.46+glint*.55); }
        `}/>
      </mesh>
      <mesh material={bubble}><torusGeometry args={[2.1, .018, 8, 128]} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={bubble}><torusGeometry args={[2.115, .025, 10, 128]} /></mesh>
      <group ref={rings}>
        <mesh rotation={[1.1, .2, -.35]} material={bubble}><torusGeometry args={[2.68, .028, 10, 128]} /></mesh>
        <mesh rotation={[.55, -.45, .9]} material={bubble}><torusGeometry args={[2.5, .019, 8, 128]} /></mesh>
        <mesh position={[2.43, .92, .25]} material={bubble}><sphereGeometry args={[.095, 16, 12]} /></mesh>
      </group>
    </group>
    <ambientLight intensity={.8} color="#e7f8ff" />
    <directionalLight position={[-5, 7, 5]} intensity={1.6} color="#ffffff" />
  </>;
}

export default function OrbitScene({ playing, onReady, onFailure, rotation }: { playing: boolean; onReady: () => void; onFailure: () => void; rotation: MotionValue<number> }) {
  return <Canvas camera={{ position: [0, 0, 8.5], fov: 40 }} dpr={[1, 1.5]} frameloop={playing ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={null}>
    <Suspense fallback={null}><Sculpture playing={playing} onReady={onReady} onFailure={onFailure} rotation={rotation} /></Suspense>
  </Canvas>;
}
