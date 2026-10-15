'use client';

import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, MotionConfig, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Hand, MapPin, Pause, Play, Plus, Sparkles, X } from 'lucide-react';
import ProjectArtwork from './ProjectArtwork';
import { EMAIL, LINKEDIN, projects, type Category, type Project } from '@/lib/projects';

const OrbitScene = dynamic(() => import('./OrbitScene'), { ssr: false });
const featuredLinks = [
  { id: 'modhew', title: 'MODHEW', category: 'Campus food delivery', description: 'Hungry? I built a thing.', tag: 'My latest build', href: 'https://modhew.vercel.app/' },
  { id: 'met', title: 'MET Safety Day', category: 'Event check-in technology', description: 'Real people. Real-time.', tag: 'From code to check-in', project: 'met' },
  { id: 'cake', title: 'Crack The Cake', category: 'AI × LINE experience', description: 'One idea. 365 cakes.', tag: 'A sweeter experiment', project: 'cake' },
  { id: 'linkedin', title: 'LinkedIn', category: 'Professional profile', description: 'More than a connection.', tag: 'The professional side', href: LINKEDIN },
  { id: 'email', title: 'Say hello', category: 'Contact', description: 'Have something in mind?', tag: 'Good things start here', href: `mailto:${EMAIL}` },
];
type FeaturedLink = typeof featuredLinks[number];

class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function OrbitCard({ item, slot, moving, onProject }: {item:FeaturedLink;slot:number;moving:boolean;onProject:(id:string)=>void}) {
  const tiltX = useSpring(0, { stiffness: 220, damping: 22 });
  const tiltY = useSpring(0, { stiffness: 220, damping: 22 });
  function tilt(event: PointerEvent<HTMLElement>) {
    if (!moving || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    tiltX.set(-((event.clientY - box.top) / box.height - .5) * 14);
    tiltY.set(((event.clientX - box.left) / box.width - .5) * 18);
  }
  const inner = <>
    <ProjectArtwork id={item.id} hero />
    <div className="orbit-card-copy"><span className="card-tag">{item.tag}</span><div className="card-title"><h2>{item.title}</h2>{item.project ? <Plus aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</div><p>{item.description}</p><span className="card-category">{item.category}</span></div>
  </>;
  return <motion.div className={`orbit-slot slot-${slot + 2}`} initial={false} animate={{ x: slot * 224, y: (4 - slot * slot) * 11, rotateZ: slot * 7, rotateY: slot * -4 }} transition={{type:'spring',stiffness:90,damping:22}}>
    <motion.div className="card-float" animate={moving ? { y: [0, -7, 0] } : {y:0}} transition={{duration:5.5,repeat:moving?Infinity:0,ease:'easeInOut',delay:(slot+2)*.33}}>
      {item.href ? <motion.a className={`orbit-card orbit-${item.id}`} href={item.href} target={item.href.startsWith('https')?'_blank':undefined} rel={item.href.startsWith('https')?'noopener noreferrer':undefined} onPointerMove={tilt} onPointerLeave={()=>{tiltX.set(0);tiltY.set(0);}} style={{rotateX:tiltX,rotateY:tiltY}} whileHover={moving?{z:35,scale:1.035}:undefined}>{inner}</motion.a> : <motion.button className={`orbit-card orbit-${item.id}`} onClick={()=>onProject(item.project!)} onPointerMove={tilt} onPointerLeave={()=>{tiltX.set(0);tiltY.set(0);}} style={{rotateX:tiltX,rotateY:tiltY}} whileHover={moving?{z:35,scale:1.035}:undefined} aria-haspopup="dialog">{inner}</motion.button>}
    </motion.div>
  </motion.div>;
}

function Clock() {
  const [time, setTime] = useState('—');
  useEffect(()=>{
    const update=()=>setTime(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()));
    update();const timer=setInterval(update,30000);return ()=>clearInterval(timer);
  },[]);
  return <span className="local-time"><i className="live-dot" />Bangkok <time>{time}</time></span>;
}

export default function Portfolio() {
  const prefersReducedMotion = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const heroVisible = useInView(hero,{amount:.08});
  const [pageVisible,setPageVisible]=useState(true);
  const [paused,setPaused]=useState(false);
  const [canRender3D,setCanRender3D]=useState(false);
  const [sceneReady,setSceneReady]=useState(false);
  const [sceneFailed,setSceneFailed]=useState(false);
  const [orbitStep,setOrbitStep]=useState(0);
  const [filter,setFilter]=useState<Category|'all'>('all');
  const [selected,setSelected]=useState<Project|null>(null);
  const [toast,setToast]=useState('');
  const [copied,setCopied]=useState(false);
  const [activeSection,setActiveSection]=useState('links');
  const dialog=useRef<HTMLDialogElement>(null);
  const lastFocus=useRef<HTMLElement|null>(null);
  const px=useSpring(0,{stiffness:65,damping:24});
  const py=useSpring(0,{stiffness:65,damping:24});
  const skyX=useTransform(px,value=>value*-.35);
  const skyY=useTransform(py,value=>value*-.35);
  const moving=!paused&&!prefersReducedMotion&&heroVisible&&pageVisible;
  const ready=useCallback(()=>setSceneReady(true),[]);
  const failed=useCallback(()=>setSceneFailed(true),[]);

  useEffect(()=>{
    const visibility=()=>setPageVisible(!document.hidden);
    visibility();document.addEventListener('visibilitychange',visibility);
    setCanRender3D(typeof WebGL2RenderingContext!=='undefined');
    return ()=>document.removeEventListener('visibilitychange',visibility);
  },[]);
  useEffect(()=>{
    if(!moving){px.set(0);py.set(0);}
  },[moving,px,py]);
  useEffect(()=>{
    if(!toast)return;
    const timer=setTimeout(()=>setToast(''),3500);return ()=>clearTimeout(timer);
  },[toast]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)setActiveSection(entry.target.id==='home'?'links':entry.target.id);});
    },{rootMargin:'-15% 0px -55% 0px'});
    document.querySelectorAll('#home,#work,#about').forEach(section=>observer.observe(section));
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(selected){dialog.current?.showModal();if(dialog.current)dialog.current.scrollTop=0;dialog.current?.querySelector<HTMLButtonElement>('.dialog-close')?.focus({preventScroll:true});}
    else if(dialog.current?.open)dialog.current.close();
  },[selected]);

  function openProject(id:string){
    const project=projects.find(item=>item.id===id);
    if(project){lastFocus.current=document.activeElement as HTMLElement;setSelected(project);}
  }
  function closeProject(){setSelected(null);lastFocus.current?.focus({preventScroll:true});}
  function parallax(event:PointerEvent<HTMLElement>){
    if(!moving||event.pointerType!=='mouse')return;
    const box=event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX-box.left)/box.width-.5)*22);
    py.set(((event.clientY-box.top)/box.height-.5)*16);
  }
  async function copyEmail(){
    try{await navigator.clipboard.writeText(EMAIL);setCopied(true);setToast('Email copied. Good things start with hello.');}
    catch{setToast('Please copy the email address below, or use Say hello.');}
  }
  const filtered=projects.filter(item=>filter==='all'||item.category===filter);
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#links">Skip to links</a>
    <section className={`hero ${paused?'motion-paused':''}`} id="home" ref={hero} onPointerMove={parallax} onPointerLeave={()=>{px.set(0);py.set(0);}} aria-labelledby="hero-heading">
      <motion.div className="sky-background" style={{x:skyX,y:skyY}}><Image src="/assets/sky.webp" alt="" fill priority sizes="100vw" /></motion.div>
      <div className="hero-scrim" />
      <header className="site-header">
        <a href="#home" className="wordmark" aria-label="Peeraphat home">peeraphat<span>.link<i /></span></a>
        <nav className="main-nav" aria-label="Main navigation">{[['links','My orbit'],['work','Selected work'],['about','About me']].map(([id,label])=><a href={`#${id}`} key={id} className={activeSection===id?'active':''} aria-current={activeSection===id?'location':undefined}>{label}</a>)}</nav>
        <div className="header-actions"><a className="contact-pill" href={`mailto:${EMAIL}`}>Let's talk<ArrowUpRight aria-hidden="true" /></a><button className="motion-control" onClick={()=>setPaused(!paused)} disabled={!!prefersReducedMotion} aria-pressed={paused||!!prefersReducedMotion} aria-label={prefersReducedMotion?'Animation disabled by reduced motion preference':paused?'Play animation':'Pause animation'} title={prefersReducedMotion?'Reduced motion is enabled':paused?'Play animation':'Pause animation'}>{paused||prefersReducedMotion?<Play aria-hidden="true"/>:<Pause aria-hidden="true"/>}</button></div>
      </header>
      <div className="hero-intro"><p className="intro-label"><i className="live-dot" />A little corner of my internet</p><h1 id="hero-heading">Curious mind.<br/>Builder at heart.</h1><p className="intro-description">Hi, I'm Peeraphat.<br/>I turn ideas into things people use.</p><a href="#work" className="text-link">Explore what I build<ArrowDownRight aria-hidden="true" /></a></div>
      <div className="location-tag"><MapPin aria-hidden="true"/><div>Bangkok, Thailand<span>KMUTT / Digital Service Innovation</span></div></div>
      <motion.div className={`scene-frame ${sceneReady&&!sceneFailed&&!prefersReducedMotion?'scene-ready':''}`} style={{x:px,y:py}} aria-hidden="true">
        <div className="scene-poster"><Image src="/assets/orbit-fallback.webp" alt="" fill priority sizes="(max-width:700px) 100vw, 70vw" /></div>
        {canRender3D&&!sceneFailed&&!prefersReducedMotion&&<div className="live-scene"><SceneBoundary onFailure={failed}><OrbitScene playing={moving} onReady={ready} onFailure={failed}/></SceneBoundary></div>}
      </motion.div>
      <div className="identity-tag"><i className="live-dot"/><div><strong>Peeraphat Noiyaem</strong><span>Developer / Builder / Curious human</span></div><Sparkles aria-hidden="true"/></div>
      <div className="scene-hint"><Hand aria-hidden="true"/>Drag the sphere. Follow your curiosity.</div>

      <div className="orbit-links" id="links" aria-label="Featured links"><div className="orbit-track">{featuredLinks.map((item,index)=>{
        const slot=((index-orbitStep+10)%5)-2;
        return <OrbitCard key={item.id} item={item} slot={slot} moving={moving} onProject={openProject}/>;
      })}</div></div>
      <div className="hero-bottom"><span>Small experiments. Real-world impact.</span><div className="orbit-controls"><button onClick={()=>setOrbitStep(value=>(value+4)%5)} aria-label="Rotate links left"><ArrowLeft aria-hidden="true"/></button><motion.div className="orbit-drag" drag={prefersReducedMotion?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.22} onDragEnd={(_,info)=>{if(Math.abs(info.offset.x)>30)setOrbitStep(value=>(value+(info.offset.x>0?4:1))%5);}}><span className="orbit-dots" aria-hidden="true">{featuredLinks.map((item,i)=><i key={item.id} className={i===orbitStep?'active':''}/>)}</span><span>Drag to orbit</span></motion.div><button onClick={()=>setOrbitStep(value=>(value+1)%5)} aria-label="Rotate links right"><ArrowRight aria-hidden="true"/></button><span className="sr-only" role="status">Link order rotated {orbitStep+1} of 5</span></div><Clock/></div>
    </section>

    <main>
      <section className="work-section section-shell" id="work" aria-labelledby="work-heading"><div className="section-top"><div><p className="section-kicker">Things I've put into the world</p><h2 id="work-heading">Built with a little curiosity.<br/>And a lot of care.</h2></div><p className="section-intro">From a campus craving to community connections.<br/>Some shipped. Some explored. All hands-on.</p></div>
        <div className="work-toolbar"><div className="filters" role="group" aria-label="Filter projects">{([['all','Everything'],['product','Products'],['ai','AI & learning'],['community','Community']] as const).map(([id,label])=><button key={id} className={filter===id?'filter active':'filter'} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}{id==='all'&&<span>{projects.length}</span>}</button>)}</div><span className="result-count" aria-live="polite">{filtered.length} things to explore</span></div>
        <div className="project-grid">{filtered.map(project=><article className={`project-card ${project.id==='powerguard'?'community-feature':''}`} key={project.id} data-project-card={project.id}><ProjectArtwork id={project.id}/><div className="project-body"><span className="project-type">{project.type}</span><h3>{project.name}</h3><p>{project.short}</p><div className="project-metric">{project.metric}</div><div className="project-bottom"><span>{project.stack}</span><button onClick={()=>openProject(project.id)} aria-label={`View ${project.name} details`} aria-haspopup="dialog">Explore<Plus aria-hidden="true"/></button></div>{project.id==='powerguard'&&<a className="community-direct" href={project.links[0][1]} target="_blank" rel="noopener noreferrer">Explore the 3D community<ArrowUpRight aria-hidden="true"/></a>}</div></article>)}</div>
        <p className="source-note">Project details and reported impact are based on my LinkedIn posts. Prototypes and simulated data are identified in each project.</p>
      </section>
      <section className="about-section section-shell" id="about" aria-labelledby="about-heading"><div className="about-monogram" aria-hidden="true">p<span>*</span><i/></div><div className="about-copy"><p className="section-kicker">The human behind the links</p><h2 id="about-heading">Still learning.<br/>Always making.</h2><p>I'm Peeraphat Noiyaem, a first-year Digital Service Innovation student at King Mongkut's University of Technology Thonburi.</p><p>I build software, explore AI, and bring people together through community projects. My favorite part? Taking an idea out of my head and seeing someone actually use it.</p><div className="about-tags"><span>KMUTT / DSI</span><span>Full-stack development</span><span>AI experiments</span></div></div></section>
      <section className="connect-section section-shell" aria-labelledby="connect-heading"><div><p className="section-kicker">New ideas welcome</p><h2 id="connect-heading">Let's make<br/>something happen.<Sparkles aria-hidden="true"/></h2></div><div className="contact-actions"><a href={`mailto:${EMAIL}`} className="big-contact">Say hello<ArrowUpRight aria-hidden="true"/></a><button onClick={copyEmail} className="copy-email" aria-label="Copy email address"><span>{EMAIL}</span>{copied?<Check aria-hidden="true"/>:<Copy aria-hidden="true"/>}</button><a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="linkedin-contact">Or find me on LinkedIn<ArrowUpRight aria-hidden="true"/></a></div></section>
    </main>
    <footer className="site-footer section-shell"><a href="#home">peeraphat.link</a><span>Made of ideas, code & a little curiosity.</span><a href="#home">Back to the clouds ↑</a></footer>
    <dialog ref={dialog} className="project-dialog" aria-labelledby="dialog-title" onClose={closeProject} onClick={event=>{if(event.target!==event.currentTarget)return;const box=event.currentTarget.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeProject();}}>
      <button className="dialog-close" onClick={closeProject} aria-label="Close project details"><X aria-hidden="true"/></button>
      {selected&&<><ProjectArtwork id={selected.id}/><span className="project-type">{selected.type}</span><h2 id="dialog-title">{selected.name}</h2><p className="dialog-description">{selected.description}</p><div className="project-metric">{selected.metric}</div><div className="dialog-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="dialog-links">{selected.links.map(([label,href])=><a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight aria-hidden="true"/></a>)}</div><p className="dialog-note">{selected.note}</p></>}
    </dialog>
    <div role="status" aria-live="polite" className={`toast ${toast?'visible':''}`}>{toast}</div>
  </MotionConfig>;
}
