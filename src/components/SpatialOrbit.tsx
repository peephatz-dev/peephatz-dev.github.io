'use client';

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Mouse, Github, Mail, Layers, User } from 'lucide-react';
import { useHorizontalGesture } from '@/hooks/useHorizontalGesture';
import { orbitLinks, type OrbitLink } from '@/lib/orbit-links';
import { orbitState, snapOrbit, TAU, wrap } from '@/lib/orbit-math';
import { orbitProjectDetails, type OrbitProjectDetail } from '@/lib/orbit-projects';
import ProjectDetailOverlay from './ProjectDetailOverlay';

const Scene=dynamic(()=>import('./SpatialOrbitScene'),{ssr:false});
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state={failed:false}; static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}
const icons={github:Github,contact:Mail,modhew:Layers,met:Layers,'sam-hao':User};
function LinkIcon({link}:{link:OrbitLink}){const Icon=icons[link.id as keyof typeof icons];return <Icon aria-hidden="true"/>;}
const STEP=TAU/orbitLinks.length;

/** Shared accessible controller; all visible 3D panels use this same angular value. */
export default function SpatialOrbit(){
  const reduced=useReducedMotion();
  const root=useRef<HTMLElement>(null);const surface=useRef<HTMLDivElement>(null);
  const progress=useRef<HTMLDivElement>(null);const percent=useRef<HTMLSpanElement>(null);const lap=useRef<HTMLSpanElement>(null);
  const rotation=useMotionValue(0);const dragStart=useRef(0);const activeRef=useRef(0);
  const animation=useRef<ReturnType<typeof animate>|null>(null);const target=useRef(0);const clickBlockedUntil=useRef(0);
  const [active,setActive]=useState(0);const [portrait,setPortrait]=useState(false);const [visible,setVisible]=useState(true);
  const [simple,setSimple]=useState(false);const [paused,setPaused]=useState(false);const [wheel,setWheel]=useState(false);const [failed,setFailed]=useState(false);const [ready,setReady]=useState(false);const [mounted,setMounted]=useState(false);
  const [selected,setSelected]=useState<OrbitProjectDetail|null>(null);
  const origin=useRef<HTMLElement|null>(null);
  const playing=!reduced&&!paused&&visible;
  const settle=useCallback((value:number,velocity=0)=>{
    animation.current?.stop(); target.current=snapOrbit(value,0,orbitLinks.length);
    if(reduced)rotation.set(target.current);
    else animation.current=animate(rotation,target.current,{type:'spring',stiffness:130,damping:25,mass:1,velocity,restDelta:.0001});
  },[reduced,rotation]);
  useMotionValueEvent(rotation,'change',value=>{
    const state=orbitState(value,orbitLinks.length);
    if(state.active!==activeRef.current){activeRef.current=state.active;setActive(state.active);}
    if(percent.current)percent.current.textContent=String(Math.floor(state.percent)).padStart(2,'0');
    if(lap.current)lap.current.textContent=String(state.revolution);
    if(progress.current){progress.current.style.setProperty('--cycle',`${state.percent}%`);progress.current.setAttribute('aria-valuenow',String(Math.floor(state.percent)));progress.current.setAttribute('aria-valuetext',`${Math.floor(state.percent)} percent of cycle, revolution ${state.revolution}`);}
  });
  const closeProject=useCallback((fromHistory=false)=>{
    setSelected(null);
    if(!fromHistory&&history.state?.orbitDetail)history.back();
    window.setTimeout(()=>origin.current?.focus({preventScroll:true}),30);
  },[]);
  const openProject=useCallback((index:number)=>{
    if(performance.now()<clickBlockedUntil.current)return;
    const detail=orbitProjectDetails[index];
    if(!detail)return;
    origin.current=document.activeElement as HTMLElement|null;
    setSelected(detail);
    if(history.state?.orbitDetail!==detail.id)history.pushState({orbitDetail:detail.id},'',`#project-${detail.id}`);
  },[]);
  useEffect(()=>{
    setMounted(true);
    const media=matchMedia('(max-width: 800px) and (orientation: portrait)');const resize=()=>setPortrait(media.matches);resize();media.addEventListener('change',resize);
    let inView=true;const update=()=>setVisible(inView&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();});if(root.current)observer.observe(root.current);
    document.addEventListener('visibilitychange',update);
    const handlePopState=()=>{if(selected)closeProject(true);};
    window.addEventListener('popstate',handlePopState);
    if(typeof WebGL2RenderingContext==='undefined')setFailed(true);
    return()=>{media.removeEventListener('change',resize);observer.disconnect();document.removeEventListener('visibilitychange',update);window.removeEventListener('popstate',handlePopState);animation.current?.stop();};
  },[selected,closeProject]);
  const gestures=useHorizontalGesture({
    onStart:()=>{animation.current?.stop();dragStart.current=rotation.get();clickBlockedUntil.current=Infinity;},
    onMove:({dx,width})=>rotation.set(dragStart.current-dx/width*(portrait?2.5:4.2)),
    onEnd:({velocity,width,cancelled})=>{
      clickBlockedUntil.current=performance.now()+400;
      const speed=-velocity/width*(portrait?2.5:4.2);
      settle(snapOrbit(rotation.get(),speed,orbitLinks.length,cancelled),cancelled?0:speed);
    },
  });
  // Opt-in, scene-scoped desktop wheel. No document wheel listener. Escape exits.
  useEffect(()=>{
    const element=surface.current;if(!wheel||portrait||!element)return;
    let timeout:ReturnType<typeof setTimeout>|undefined;
    const handler=(event:WheelEvent)=>{
      if(event.ctrlKey||event.metaKey||(event.target as Element).closest('a,button,input'))return;
      event.preventDefault();animation.current?.stop();
      const unit=event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1;
      rotation.set(rotation.get()+Math.max(-130,Math.min(130,(Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY)*unit))*.003);
      clearTimeout(timeout);timeout=setTimeout(()=>settle(rotation.get()),140);
    };
    element.addEventListener('wheel',handler,{passive:false});
    return()=>{element.removeEventListener('wheel',handler);clearTimeout(timeout);};
  },[wheel,portrait,rotation,settle]);
  const activate=useCallback((index:number)=>{
    if(performance.now()<clickBlockedUntil.current)return;
    openProject(index);
  },[openProject]);
  const onReady=useCallback(()=>setReady(true),[]);const onFailure=useCallback(()=>setFailed(true),[]);
  const current=orbitLinks[active];
  return <section className={`spatial-orbit ${playing?'':'spatial-paused'} ${ready&&!failed&&!simple?'spatial-ready':''}`} id="home" ref={root} aria-labelledby="spatial-name">
    <div className="spatial-sky" aria-hidden="true"/><div className="spatial-cloud spatial-cloud-back" aria-hidden="true"/>
    <header className="spatial-header"><a href="#home" className="spatial-wordmark">peeraphat<span>.link</span><i/></a><nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#about">About</a></nav><button className="spatial-motion" onClick={()=>setPaused(!paused)} aria-label={reduced?'Reduced motion enabled':paused?'Play background motion':'Pause background motion'} aria-pressed={paused||!!reduced} disabled={!!reduced}>{paused||reduced?<Play/>:<Pause/>}</button></header>
    <div className="spatial-title"><span>Welcome to my little universe</span><h1 id="spatial-name">PEERAPHAT</h1><p>Developer / Builder / Dreamer</p><span className="spatial-badge">KMUTT / DSI</span></div>
    <div ref={surface} className="spatial-surface" id="links" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Personal links. Drag horizontally, or use arrow keys. Vertical scrolling stays native." {...gestures}
      onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='Escape'){setWheel(false);return;}if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const cycle=Math.floor(target.current/TAU)*TAU;settle(event.key==='Home'?cycle:event.key==='End'?cycle+(orbitLinks.length-1)*STEP:target.current+(event.key==='ArrowRight'?STEP:-STEP));}}}>
      <StaticOrbitFallback active={active} onOpen={openProject}/>
      {mounted&&!failed&&!simple&&<div className={`spatial-webgl ${ready?'is-ready':''}`} aria-hidden={!ready}><SceneBoundary onFailure={onFailure}><Scene links={orbitLinks} rotation={rotation} portrait={portrait} playing={playing} onActivate={activate} onReady={onReady} onFailure={onFailure}/></SceneBoundary></div>}
    </div>
    <div className="spatial-cloud spatial-cloud-front" aria-hidden="true"/>
    <div className="spatial-dock">
      <div className="spatial-hints"><span>Drag to discover</span><a href="#work">Scroll to explore <ArrowDown aria-hidden="true"/></a></div>
      <div className="spatial-console">
        <button onClick={()=>settle(target.current-STEP)} aria-label="Previous link"><ArrowLeft aria-hidden="true"/></button>
        <div className="spatial-meter"><div><strong>{String(active+1).padStart(2,'0')}<small> / {String(orbitLinks.length).padStart(2,'0')}</small></strong><span><span ref={percent}>00</span>% cycle</span></div><div ref={progress} className="spatial-progress" role="progressbar" aria-label="Current orbit cycle" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}/></div>
        <button onClick={()=>settle(target.current+STEP)} aria-label="Next link"><ArrowRight aria-hidden="true"/></button>
      </div>
      <button className="spatial-active-link" type="button" onClick={()=>openProject(active)}>View {current.title}<ArrowUpRight aria-hidden="true"/></button>
      <div className="spatial-options"><span>Revolution <span ref={lap}>0</span></span><button className="spatial-wheel-toggle" onClick={()=>{setWheel(!wheel);settle(rotation.get());}} aria-pressed={wheel}><Mouse aria-hidden="true"/>Wheel {wheel?'on · Esc to exit':'off'}</button><button onClick={()=>setSimple(!simple)} aria-pressed={simple}>{simple?'Show 3D':'Simple view'}</button></div>
    </div>
    <nav className="spatial-link-list" aria-label="All orbit destinations">{orbitLinks.map((link,index)=><button key={link.id} type="button" aria-current={active===index?'true':undefined} onClick={()=>openProject(index)} onFocus={()=>{const currentStep=Math.round(rotation.get()/STEP);const diff=wrap(index-wrap(currentStep,orbitLinks.length)+orbitLinks.length/2,orbitLinks.length)-orbitLinks.length/2;settle((currentStep+diff)*STEP);}}><LinkIcon link={link}/><span>{link.title}</span></button>)}</nav>
    <p className="sr-only" role="status" aria-live="polite">Link {active+1} of {orbitLinks.length}: {current.title}</p>
    <ProjectDetailOverlay project={selected} onClose={closeProject}/>
  </section>;
}

function StaticOrbitFallback({ active, onOpen }: { active: number; onOpen: (index: number) => void }) {
  return <div className="spatial-static-orbit" aria-label="Project orbit preview">
    <span className="static-bubble-ring static-bubble-ring-one" aria-hidden="true" />
    <span className="static-bubble-ring static-bubble-ring-two" aria-hidden="true" />
    {orbitLinks.map((link, index) => {
      const raw=(index-active+orbitLinks.length)%orbitLinks.length;
      const offset=raw>orbitLinks.length/2?raw-orbitLinks.length:raw;
      return <button key={link.id} type="button" className={`static-orbit-card static-orbit-card-${offset}`} onClick={()=>onOpen(index)} aria-label={`View ${link.title} details`}>
        <span className="static-orbit-card-number">{String(index+1).padStart(2,'0')}</span>
        <span className={`static-orbit-card-art static-orbit-card-art-${link.id}`}>{link.image?<img src={link.image} alt="" />:<span aria-hidden="true">{link.id==='github'?'<>':link.id==='contact'?'@':'p'}</span>}</span>
        <span className="static-orbit-card-copy"><strong>{link.title}</strong><small>{link.subtitle}</small><em>{link.description}</em></span>
      </button>;
    })}
  </div>;
}
