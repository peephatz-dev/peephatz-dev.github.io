'use client';

import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Plus, Sparkles, X } from 'lucide-react';
import ProjectArtwork from './ProjectArtwork';
import SpatialOrbit from './SpatialOrbit';
import { EMAIL, LINKEDIN, projects, type Category, type Project } from '@/lib/projects';

export default function Portfolio() {
  const [filter,setFilter]=useState<Category|'all'>('all');
  const [selected,setSelected]=useState<Project|null>(null);
  const [toast,setToast]=useState('');
  const [copied,setCopied]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const lastFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(timer);},[toast]);
  useEffect(()=>{if(selected){dialog.current?.showModal();if(dialog.current)dialog.current.scrollTop=0;dialog.current?.querySelector<HTMLButtonElement>('.dialog-close')?.focus({preventScroll:true});}else if(dialog.current?.open)dialog.current.close();},[selected]);
  function openProject(id:string){const project=projects.find(item=>item.id===id);if(project){lastFocus.current=document.activeElement as HTMLElement;setSelected(project);}}
  function closeProject(){setSelected(null);lastFocus.current?.focus({preventScroll:true});}
  async function copyEmail(){try{await navigator.clipboard.writeText(EMAIL);setCopied(true);setToast('Email copied. Good things start with hello.');}catch{setToast('Please copy the email address below, or use Say hello.');}}
  const featuredOrder=['modhew','met','portal','community'];
  const filtered=projects.filter(item=>filter==='all'||item.category===filter).sort((a,b)=>{
    const aIndex=featuredOrder.indexOf(a.id);const bIndex=featuredOrder.indexOf(b.id);
    if(aIndex===-1&&bIndex===-1)return 0;
    if(aIndex===-1)return 1;
    if(bIndex===-1)return -1;
    return aIndex-bIndex;
  });
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#links">Skip to links</a>
    <SpatialOrbit/>
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
