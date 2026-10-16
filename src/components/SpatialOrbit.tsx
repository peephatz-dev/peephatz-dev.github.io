'use client';

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Github, Mail, Layers, User } from 'lucide-react';
import { orbitLinks, type OrbitLink } from '@/lib/orbit-links';
import { finiteScrollActive, finiteScrollProgress, TAU } from '@/lib/orbit-math';
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

/** Shared accessible controller; all visible 3D panels use this same angular value. */
export default function SpatialOrbit(){
  const reduced=useReducedMotion();
  const root=useRef<HTMLDivElement>(null);const surface=useRef<HTMLDivElement>(null);const scrollSection=useRef<HTMLElement>(null);
  const progress=useRef<HTMLDivElement>(null);const percent=useRef<HTMLSpanElement>(null);
  const rotation=useMotionValue(0);
  const [active,setActive]=useState(0);const [portrait,setPortrait]=useState(false);const [visible,setVisible]=useState(true);
  const [simple,setSimple]=useState(false);const [paused,setPaused]=useState(false);const [failed,setFailed]=useState(false);const [ready,setReady]=useState(false);const [mounted,setMounted]=useState(false);
  const [selected,setSelected]=useState<OrbitProjectDetail|null>(null);
  const selectedRef=useRef<OrbitProjectDetail|null>(null);
  const origin=useRef<HTMLElement|null>(null);
  const playing=!reduced&&!paused&&visible;
  const closeProject=useCallback((fromHistory=false)=>{
    setSelected(null);
    selectedRef.current=null;
    if(!fromHistory&&history.state?.orbitDetail)history.back();
    else if(!fromHistory&&location.hash.startsWith('#project-'))history.replaceState(null,'',`${location.pathname}${location.search}`);
    window.setTimeout(()=>origin.current?.focus({preventScroll:true}),30);
  },[]);
  const openProject=useCallback((index:number, fromHash=false)=>{
    const detail=orbitProjectDetails[index];
    if(!detail)return;
    origin.current=document.activeElement as HTMLElement|null;
    selectedRef.current=detail;
    setSelected(detail);
    if(!fromHash&&history.state?.orbitDetail!==detail.id)history.pushState({orbitDetail:detail.id},'',`#project-${detail.id}`);
  },[]);
  useEffect(()=>{
    setMounted(true);
    const media=matchMedia('(max-width: 800px) and (orientation: portrait)');const resize=()=>setPortrait(media.matches);resize();media.addEventListener('change',resize);
    let inView=true;const update=()=>setVisible(inView&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();});if(root.current)observer.observe(root.current);
    document.addEventListener('visibilitychange',update);
    const hashProject=location.hash.match(/^#project-(.+)$/)?.[1];
    const hashIndex=hashProject?orbitProjectDetails.findIndex((project)=>project.id===hashProject):-1;
    if(hashIndex>=0)openProject(hashIndex,true);
    const handlePopState=()=>{
      const nextProject=location.hash.match(/^#project-(.+)$/)?.[1];
      const nextIndex=nextProject?orbitProjectDetails.findIndex((project)=>project.id===nextProject):-1;
      if(nextIndex>=0)openProject(nextIndex,true);
      else if(selectedRef.current)closeProject(true);
    };
    window.addEventListener('popstate',handlePopState);
    if(typeof WebGL2RenderingContext==='undefined')setFailed(true);
    return()=>{media.removeEventListener('change',resize);observer.disconnect();document.removeEventListener('visibilitychange',update);window.removeEventListener('popstate',handlePopState);};
  },[closeProject,openProject]);
  useEffect(()=>{
    const section=scrollSection.current;if(!section)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const value=finiteScrollProgress(window.scrollY,section.offsetTop,section.offsetHeight,window.innerHeight);
      rotation.set(value*TAU);
      const next=finiteScrollActive(value,orbitLinks.length);
      setActive(current=>current===next?current:next);
      const percentValue=Math.round(value*100);
      if(percent.current)percent.current.textContent=String(percentValue).padStart(2,'0');
      if(progress.current){progress.current.style.setProperty('--cycle',`${percentValue}%`);progress.current.setAttribute('aria-valuenow',String(percentValue));progress.current.setAttribute('aria-valuetext',`${percentValue} percent through the orbit`);}
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame);};
  },[rotation]);
  const scrollToProgress=useCallback((value:number)=>{
    const section=scrollSection.current;if(!section)return;
    const range=Math.max(1,section.offsetHeight-window.innerHeight);
    window.scrollTo({top:section.offsetTop+Math.max(0,Math.min(1,value))*range,behavior:reduced?'auto':'smooth'});
  },[reduced]);
  const activate=useCallback((index:number)=>openProject(index),[openProject]);
  const onReady=useCallback(()=>setReady(true),[]);const onFailure=useCallback(()=>setFailed(true),[]);
  const current=orbitLinks[active];
  return <section className="orbit-scroll-section" ref={scrollSection} id="home"><div className={`spatial-orbit ${playing?'':'spatial-paused'} ${ready&&!failed&&!simple?'spatial-ready':''}`} ref={root} aria-labelledby="spatial-name">
    <div className="spatial-sky" aria-hidden="true"/><div className="spatial-cloud spatial-cloud-back" aria-hidden="true"/>
    <header className="spatial-header"><a href="#home" className="spatial-wordmark">peeraphat<span>.link</span><i/></a><nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#about">About</a></nav><button className="spatial-motion" onClick={()=>setPaused(!paused)} aria-label={reduced?'Reduced motion enabled':paused?'Play background motion':'Pause background motion'} aria-pressed={paused||!!reduced} disabled={!!reduced}>{paused||reduced?<Play/>:<Pause/>}</button></header>
    <div className="spatial-title"><span>Welcome to my little universe</span><h1 id="spatial-name">PEERAPHAT</h1><p>Developer / Builder / Dreamer</p><span className="spatial-badge">KMUTT / DSI</span></div>
    <div ref={surface} className="spatial-surface" id="links" role="region" aria-roledescription="carousel" aria-label="Personal links. Scroll vertically to explore all five links.">
      <StaticOrbitFallback active={active} onOpen={openProject}/>
      {mounted&&!failed&&!simple&&<div className={`spatial-webgl ${ready?'is-ready':''}`} aria-hidden={!ready}><SceneBoundary onFailure={onFailure}><Scene links={orbitLinks} rotation={rotation} portrait={portrait} playing={playing} onActivate={activate} onReady={onReady} onFailure={onFailure}/></SceneBoundary></div>}
    </div>
    <div className="spatial-cloud spatial-cloud-front" aria-hidden="true"/>
    <div className="spatial-dock">
      <div className="spatial-console">
        <button onClick={()=>scrollToProgress((active-1)/4)} disabled={active===0} aria-label="Previous link"><ArrowLeft aria-hidden="true"/></button>
        <div className="spatial-meter"><div><strong>{String(active+1).padStart(2,'0')}<small> / {String(orbitLinks.length).padStart(2,'0')}</small></strong><span><span ref={percent}>00</span>% cycle</span></div><div ref={progress} className="spatial-progress" role="progressbar" aria-label="Current orbit cycle" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}/></div>
        <button onClick={()=>active===orbitLinks.length-1?scrollToProgress(1):scrollToProgress((active+1)/4)} aria-label={active===orbitLinks.length-1?'Continue to Projects':'Next link'}><ArrowRight aria-hidden="true"/></button>
      </div>
      <button className="spatial-active-link" type="button" onClick={()=>openProject(active)}>View {current.title}<ArrowUpRight aria-hidden="true"/></button>
      <div className="spatial-options"><span>Scroll journey</span><button onClick={()=>setSimple(!simple)} aria-pressed={simple}>{simple?'Show 3D':'Simple view'}</button></div>
    </div>
    <nav className="spatial-link-list" aria-label="All orbit destinations">{orbitLinks.map((link,index)=><button key={link.id} type="button" aria-current={active===index?'true':undefined} onClick={()=>openProject(index)} onFocus={()=>scrollToProgress(index/orbitLinks.length)}><LinkIcon link={link}/><span>{link.title}</span></button>)}</nav>
    <p className="sr-only" role="status" aria-live="polite">Link {active+1} of {orbitLinks.length}: {current.title}</p>
    <ProjectDetailOverlay project={selected} onClose={closeProject}/>
  </div></section>;
}

function StaticOrbitFallback({ active, onOpen }: { active: number; onOpen: (index: number) => void }) {
  return <div className="spatial-static-orbit" aria-label="Project orbit preview">
    <span className="static-bubble-ring static-bubble-ring-one" aria-hidden="true" />
    <span className="static-bubble-ring static-bubble-ring-two" aria-hidden="true" />
    {orbitLinks.map((link, index) => {
      const raw=(index-active+orbitLinks.length)%orbitLinks.length;
      const offset=raw>orbitLinks.length/2?raw-orbitLinks.length:raw;
      return <button key={link.id} type="button" data-orbit-card="true" className={`static-orbit-card static-orbit-card-${offset}`} onClick={()=>onOpen(index)} aria-label={`View ${link.title} details`}>
        <span className="static-orbit-card-number">{String(index+1).padStart(2,'0')}</span>
        <span className={`static-orbit-card-art static-orbit-card-art-${link.id}`}>{link.image?<img src={link.image} alt="" />:<span aria-hidden="true">{link.id==='github'?'<>':link.id==='contact'?'@':'p'}</span>}</span>
        <span className="static-orbit-card-copy"><strong>{link.title}</strong><small>{link.subtitle}</small><em>{link.description}</em></span>
      </button>;
    })}
  </div>;
}
