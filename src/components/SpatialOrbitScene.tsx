'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, PerformanceMonitor } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { CanvasTexture, SRGBColorSpace, Group, MeshPhysicalMaterial, Shape, Path, ExtrudeGeometry, PerspectiveCamera, Vector3 } from 'three';
import { cardPosition } from '@/lib/orbit-math';
import type { OrbitLink } from '@/lib/orbit-links';

export type SpatialSceneProps = {
  links: OrbitLink[]; rotation: MotionValue<number>; portrait: boolean; playing: boolean;
  onActivate: (index: number) => void; onReady: () => void; onFailure: () => void; lowQuality?: boolean;
};

function roundedPath(path: Shape | Path, x: number, y: number, w: number, h: number, r: number) {
  path.moveTo(x+r,y); path.lineTo(x+w-r,y); path.quadraticCurveTo(x+w,y,x+w,y+r);
  path.lineTo(x+w,y+h-r); path.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  path.lineTo(x+r,y+h); path.quadraticCurveTo(x,y+h,x,y+h-r);
  path.lineTo(x,y+r); path.quadraticCurveTo(x,y,x+r,y);
}
function frameGeometry(w: number, h: number) {
  const shape = new Shape(); roundedPath(shape,-w/2,-h/2,w,h,.19);
  const hole = new Path(); roundedPath(hole,-w/2+.035,-h/2+.035,w-.07,h-.07,.16); shape.holes.push(hole);
  return new ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.014,curveSegments:8});
}
function drawSymbol(ctx: CanvasRenderingContext2D, icon: string) {
  ctx.strokeStyle='#1855da'; ctx.fillStyle='#1855da'; ctx.lineWidth=9; ctx.lineCap='round'; ctx.lineJoin='round';
  if(icon==='mail') {
    ctx.strokeRect(176,158,160,113); ctx.beginPath(); ctx.moveTo(176,160);ctx.lineTo(256,223);ctx.lineTo(336,160);ctx.stroke();
  } else if(icon==='projects') {
    [[185,145],[273,145],[185,233],[273,233]].forEach(([x,y])=>{ctx.beginPath();ctx.roundRect(x,y,58,58,12);ctx.stroke();});
  } else if(icon==='github') {
    // Recognizable code-host symbol, drawn locally; no external logo request.
    ctx.beginPath();ctx.arc(256,216,75,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#eff7ff';ctx.beginPath();ctx.moveTo(207,199);ctx.lineTo(205,164);ctx.lineTo(236,179);ctx.quadraticCurveTo(256,171,276,179);ctx.lineTo(307,164);ctx.lineTo(305,199);ctx.bezierCurveTo(331,246,291,263,269,262);ctx.lineTo(269,291);ctx.lineTo(243,291);ctx.lineTo(243,262);ctx.bezierCurveTo(204,260,181,240,207,199);ctx.fill();
  } else {
    ctx.font=icon==='in'?'700 124px Arial':'700 145px Syne, Arial';ctx.textAlign='center';ctx.fillText(icon,256,265);ctx.textAlign='left';
  }
}
function useCardTexture(link: OrbitLink, index: number) {
  const { invalidate } = useThree();
  const texture = useMemo(() => {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=620;
    const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;map.anisotropy=4;return map;
  },[]);
  useEffect(()=>{
    let alive=true;
    const canvas=texture.image as HTMLCanvasElement;const ctx=canvas.getContext('2d')!;
    function paint(img?: HTMLImageElement) {
      if(!alive)return;
      ctx.clearRect(0,0,512,620);
      ctx.fillStyle='#284c72';ctx.font='500 17px "DM Sans", Arial';ctx.fillText(`0${index+1} / PERSONAL ORBIT`,32,43);
      ctx.strokeStyle='#31587b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(451,26);ctx.lineTo(476,26);ctx.lineTo(476,51);ctx.moveTo(451,51);ctx.lineTo(476,26);ctx.stroke();
      if(img) { ctx.save();ctx.beginPath();ctx.roundRect(30,80,452,290,23);ctx.clip();ctx.fillStyle='#050505';ctx.fillRect(30,80,452,290);const ratio=Math.min(430/img.width,275/img.height);ctx.drawImage(img,256-img.width*ratio/2,225-img.height*ratio/2,img.width*ratio,img.height*ratio);ctx.restore(); }
      else { ctx.fillStyle='#f8fcffb8';ctx.beginPath();ctx.roundRect(30,80,452,290,23);ctx.fill();drawSymbol(ctx,link.icon); }
      ctx.fillStyle='#132e51';ctx.font=`700 ${link.title.length>14?31:44}px Syne, Arial`;ctx.fillText(link.title,30,429);
      ctx.font='600 20px "DM Sans", Arial';ctx.fillStyle='#244e77';ctx.fillText(link.subtitle,30,468);
      ctx.font='400 18px "DM Sans", Arial';ctx.fillStyle='#49657f';ctx.fillText(link.description.length>52?`${link.description.slice(0,51)}…`:link.description,30,499);
      ctx.strokeStyle='#8bacce66';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(30,518);ctx.lineTo(482,518);ctx.stroke();
      ctx.font='500 19px "DM Sans", Arial';ctx.fillStyle='#174dcc';ctx.fillText(link.href.startsWith('#')?'Explore this space':link.id==='contact'?'Start a conversation':'Open destination',30,566);
      ctx.strokeStyle='#174dcc';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(450,552);ctx.lineTo(473,552);ctx.lineTo(473,575);ctx.moveTo(450,575);ctx.lineTo(473,552);ctx.stroke();
      texture.needsUpdate=true;invalidate();
    }
    paint(); let img:HTMLImageElement|undefined;
    if(link.image){img=new Image();img.onload=()=>paint(img);img.src=link.image;}
    document.fonts.ready.then(()=>paint(img?.complete&&img.naturalWidth?img:undefined));
    return()=>{alive=false; if(img)img.onload=null;};
  },[texture,link,index,invalidate]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return texture;
}
function LinkPanel({link,index,rotation,portrait,count,bubble,frame,onActivate,lowQuality}: {link:OrbitLink;index:number;count:number;rotation:MotionValue<number>;portrait:boolean;bubble:MeshPhysicalMaterial;frame:ExtrudeGeometry;onActivate:(index:number)=>void;lowQuality:boolean}) {
  const group=useRef<Group>(null);
  const {invalidate}=useThree();
  const width=portrait?3.35:2.42;const height=portrait?3.65:2.92;
  const texture=useCardTexture(link,index);
  useEffect(()=>{
    const update=(value:number)=>{
      if(!group.current)return;
      const p=cardPosition(index,count,value,portrait?4.1:4.25,portrait?3.5:2.72);
      group.current.position.set(p.x,portrait?-.65:-.65,p.z);
      group.current.rotation.set(0,-Math.sin(p.angle)*.34,Math.sin(p.angle)*-.06);
      const emphasis=.92+.18*Math.max(0,Math.cos(p.angle)); group.current.scale.setScalar(emphasis);
      invalidate();
    };
    update(rotation.get());return rotation.on('change',update);
  },[rotation,portrait,index,count,invalidate]);
  return <group ref={group} onClick={e=>{e.stopPropagation();if(e.delta<8)onActivate(index);}} onPointerOver={e=>e.stopPropagation()}>
    <mesh geometry={frame} material={bubble} />
    <RoundedBox args={[width-.04,height-.04,.09]} radius={.17} smoothness={3} position={[0,0,.04]}>
      <meshPhysicalMaterial color="#e8fbff" metalness={0} roughness={lowQuality ? .16 : .08} clearcoat={.35} clearcoatRoughness={.08} transparent opacity={lowQuality ? .5 : .62} depthWrite={false} transmission={lowQuality ? 0 : .35} thickness={.04} ior={1.33} envMapIntensity={.3} iridescence={lowQuality ? 0 : .65} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 400]} />
    </RoundedBox>
    <mesh position={[0,0,.105]}><planeGeometry args={[width-.08,height-.08]}/><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false}/></mesh>
  </group>;
}
function World({links,rotation,portrait,playing,onActivate,onReady,onFailure,lowQuality=false}:SpatialSceneProps) {
  const {camera,size,invalidate,gl}=useThree();
  const rings=useRef<Group>(null);
  const satellite=useRef<Group>(null);
  const bubble=useMemo(()=>new MeshPhysicalMaterial({
    color:'#f5fdff', metalness:0, roughness:lowQuality ? .14 : .08,
    transmission:lowQuality ? 0 : .58, thickness:.05, ior:1.33,
    iridescence:lowQuality ? 0 : .72, iridescenceIOR:1.3,
    iridescenceThicknessRange:[100,400], clearcoat:.35, clearcoatRoughness:.08,
    envMapIntensity:.3, transparent:true, opacity:lowQuality ? .55 : .82,
  }),[lowQuality]);
  const target=useMemo(()=>new Vector3(),[]);
  const frame=useMemo(()=>frameGeometry(portrait?3.35:2.42,portrait?3.65:2.92),[portrait]);
  const timing=useRef({frames:0,seconds:0,slow:0});
  useEffect(()=>()=>frame.dispose(),[frame]);
  useEffect(()=>()=>bubble.dispose(),[bubble]);
  useEffect(()=>{
    const c=camera as PerspectiveCamera;
    c.position.set(0,portrait?2.15:2.25,portrait?11.5:10.15);c.fov=portrait?43:40;
    target.set(0,portrait?.2:.25,0);c.lookAt(target);c.updateProjectionMatrix();invalidate();
  },[portrait,camera,size.width,size.height,target,invalidate]);
  useEffect(()=>{
    const canvas=gl.domElement;
    const lost=(event:Event)=>{event.preventDefault();onFailure();};canvas.addEventListener('webglcontextlost',lost);
    // Ready after the renderer has had a frame; resources use local textures only.
    const id=requestAnimationFrame(onReady);
    return()=>{cancelAnimationFrame(id);canvas.removeEventListener('webglcontextlost',lost);};
  },[gl,onReady,onFailure]);
  useFrame((state,delta)=>{
    if(!playing)return;
    const sample=timing.current;sample.frames++;sample.seconds+=delta;if(delta>.05)sample.slow++;
    if(sample.seconds>3){
      gl.domElement.dataset.orbitFps=String(Math.round(sample.frames/sample.seconds));
      gl.domElement.dataset.orbitDrawCalls=String(gl.info.render.calls);
      gl.domElement.dataset.orbitTriangles=String(gl.info.render.triangles);
      gl.domElement.dataset.orbitDpr=String(gl.getPixelRatio());
      gl.domElement.dataset.orbitSlowFrames=String(sample.slow);
      sample.frames=0;sample.seconds=0;sample.slow=0;
    }
    if(rings.current)rings.current.rotation.y+=Math.min(delta,.05)*.045;
    if(satellite.current){satellite.current.position.y=Math.sin(state.clock.elapsedTime*.5)*.12;satellite.current.rotation.y+=delta*.15;}
  });
  return <>
    <Environment resolution={128} frames={1}>
      <color attach="background" args={['#eaf8ff']}/>
      <Lightformer intensity={2.2} color="#ffffff" position={[-5,5,4]} scale={[7,4,1]} rotation-y={.5}/>
      <Lightformer intensity={2} color="#d7f7ff" position={[5,1,3]} scale={[3,7,1]} rotation-y={-.7}/>
      <Lightformer intensity={1.6} color="#ffe5f7" position={[0,6,-3]} scale={[8,2,1]} rotation-x={Math.PI/2}/>
    </Environment>
    <fog attach="fog" args={['#d9f1fc',12,22]}/><ambientLight intensity={.85} color="#e8f9ff"/><directionalLight position={[-4,6,5]} intensity={1.5} color="#ffffff"/>
    <group position={[0,portrait?1.55:1.1,0]}>
      <mesh material={bubble} onClick={e=>e.stopPropagation()}><torusGeometry args={[portrait?1.04:1.17,.075,12,80]}/></mesh>
      <mesh position={[0,0,-.015]} onClick={e=>e.stopPropagation()}><circleGeometry args={[portrait?1.02:1.15,64]}/><meshPhysicalMaterial color="#e5faff" roughness={.08} metalness={0} clearcoat={.4} transparent opacity={.36} depthWrite={false} transmission={lowQuality ? 0 : .55} thickness={.04} ior={1.33} iridescence={lowQuality ? 0 : .7} iridescenceIOR={1.3} iridescenceThicknessRange={[100,400]} envMapIntensity={.3}/></mesh>
      <group position={[.07,-.02,.1]} scale={portrait?.75:.85}>
        <mesh material={bubble} position={[-.36,-.06,0]}><capsuleGeometry args={[.13,1.2,8,20]}/></mesh>
        <mesh material={bubble} position={[.03,.29,0]}><torusGeometry args={[.39,.13,12,48]}/></mesh>
      </group>
    </group>
    <group ref={rings} position={[0,.3,0]}>
      <mesh material={bubble} rotation={[1.25,.1,-.27]} scale={[1.2,1,1]}><torusGeometry args={[3.5,.035,8,112]}/></mesh>
      <mesh material={bubble} rotation={[.8,-.25,.48]} scale={[1.1,1,1]}><torusGeometry args={[3.4,.022,8,112]}/></mesh>
    </group>
    <group ref={satellite}>
      <mesh position={[-4.6,2.1,-1]} material={bubble}><sphereGeometry args={[.25,20,16]}/></mesh>
      <mesh position={[4.7,.7,-.5]} material={bubble} rotation={[.5,.4,.2]}><torusGeometry args={[.35,.09,12,32]}/></mesh>
    </group>
    {links.map((link,index)=><LinkPanel key={link.id} link={link} index={index} count={links.length} rotation={rotation} portrait={portrait} bubble={bubble} frame={frame} onActivate={onActivate} lowQuality={lowQuality}/>)}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.5,0]}><circleGeometry args={[7,64]}/><meshBasicMaterial color="#dff6ff" transparent opacity={.16} depthWrite={false}/></mesh>
  </>;
}
export default function SpatialOrbitScene(props:SpatialSceneProps) {
  const [dpr,setDpr]=useState(1.25);
  const [lowQuality,setLowQuality]=useState(false);
  return <Canvas camera={{position:[0,2.4,10.8],fov:40,near:.1,far:60}} dpr={props.portrait?Math.min(dpr,1.25):dpr} frameloop={props.playing?'always':'demand'} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} style={{touchAction:'pan-y'}} fallback={<span>3D unavailable. Use the links below.</span>}>
    <PerformanceMonitor onDecline={()=>setDpr(1)} onIncline={()=>setDpr(1.5)} flipflops={2} onFallback={()=>{setDpr(1);setLowQuality(true);}}/>
    <Suspense fallback={null}><World {...props} lowQuality={lowQuality}/></Suspense>
  </Canvas>;
}
