'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Compass, MoveHorizontal, Pause, Play, Plus } from 'lucide-react';
import ProjectArtwork from './ProjectArtwork';
import { EMAIL, projects, type Project } from '@/lib/projects';
import { useHorizontalGesture } from '@/hooks/useHorizontalGesture';
import { projectedSnap } from '@/lib/gesture-intent';

// A 200vw circle projected into the sky plane. Only translation and scale are
// applied to cards, so their text stays upright at every angular position.
const STEP = 46;
const END = (projects.length - 1) * STEP;
const clamp = (value: number, max = END) => Math.min(max, Math.max(0, value));
const radians = (degrees: number) => degrees * Math.PI / 180;

function CloudCard({ project, index, angle, active, onProject }: {
  project: Project; index: number; angle: MotionValue<number>; active: boolean; onProject: (id: string) => void;
}) {
  const transform = useTransform(angle, value => {
    const distance = index * STEP - value;
    const theta = radians(distance);
    const scale = 1 - Math.min(Math.abs(distance) / STEP, 2) * .12;
    return `translate(calc(-50% + ${Math.sin(theta) * 100}vw), calc(var(--orbit-rise) * ${1 - Math.cos(theta)})) scale(${scale})`;
  });
  const opacity = useTransform(angle, value => clamp(2 - Math.abs(index * STEP - value) / STEP, 1));
  return <motion.article className={`cloud-card ${active ? 'is-active' : ''}`} style={{ transform, opacity, zIndex: active ? 3 : 1 }}
    aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.name}`} aria-hidden={!active} inert={!active}>
    <div className="cloud-card-art"><ProjectArtwork id={project.id} /><span className="cloud-card-number">{String(index + 1).padStart(2, '0')}</span></div>
    <div className="cloud-card-body">
      <span className="cloud-card-type">{project.type}</span>
      <h2>{project.name}</h2>
      <p>{project.short}</p>
      <div className="cloud-card-impact">{project.metric}</div>
      <div className="cloud-card-actions">
        <a href={project.links[0][1]} target="_blank" rel="noopener noreferrer" aria-label={`Explore project: ${project.name}. ${project.links[0][0]}`}>Explore project<ArrowUpRight aria-hidden="true" /></a>
        <button onClick={() => onProject(project.id)} aria-label={`View ${project.name} details`} aria-haspopup="dialog"><Plus aria-hidden="true" /></button>
      </div>
    </div>
  </motion.article>;
}

type OrientationWithPermission = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };

export default function MobileCloudOrbit({ onProject }: { onProject: (id: string) => void }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [tilt, setTilt] = useState<'off' | 'on' | 'unavailable'>('off');
  const root = useRef<HTMLElement>(null);
  const percentage = useRef<HTMLSpanElement>(null);
  const dragStart = useRef(0);
  const activeRef = useRef(0);
  const screenReaderProgress = useRef<HTMLDivElement>(null);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const orientationCleanup = useRef<(() => void) | null>(null);
  const angle = useMotionValue(0);
  const progress = useTransform(angle, value => clamp(value) / END);
  const parallaxX = useSpring(0, { stiffness: 55, damping: 24 });
  const parallaxY = useSpring(0, { stiffness: 55, damping: 24 });
  const foregroundX = useTransform(parallaxX, value => value * -1.6);
  const moving = !reduced && !paused && visible;

  useMotionValueEvent(angle, 'change', value => {
    const position = clamp(value);
    const index = Math.round(position / STEP);
    if (index !== activeRef.current) { activeRef.current = index; setActive(index); }
    if (screenReaderProgress.current) {
      screenReaderProgress.current.setAttribute('aria-valuenow', String(Math.round(position / END * 100)));
      screenReaderProgress.current.setAttribute('aria-valuetext', `${Math.round(position / END * 100)}% explored, project ${index + 1} of ${projects.length}`);
    }
    if (percentage.current) percentage.current.textContent = String(Math.round(position / END * 100)).padStart(2, '0');
  });

  useEffect(() => {
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; setVisible(inView && !document.hidden); });
    if (root.current) observer.observe(root.current);
    const visibility = () => setVisible(inView && !document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); animation.current?.stop(); orientationCleanup.current?.(); };
  }, []);
  useEffect(() => {
    if (!moving) { parallaxX.set(0); parallaxY.set(0); }
  }, [moving, parallaxX, parallaxY]);

  function settle(value: number, velocity = 0) {
    animation.current?.stop();
    const target = projectedSnap(value, 0, STEP, END);
    if (reduced) angle.set(target);
    else animation.current = animate(angle, target, { type: 'spring', stiffness: 175, damping: 29, mass: .9, velocity, restDelta: .005, restSpeed: .01 });
  }
  const gestures = useHorizontalGesture({
    onStart: () => { animation.current?.stop(); dragStart.current = angle.get(); },
    onMove: ({ dx, width, x, y }) => {
      // Horizontal travel maps to angle regardless of where on the card it starts.
      angle.set(clamp(dragStart.current - dx / width * 92));
      if (moving) { parallaxX.set((x / window.innerWidth - .5) * 14); parallaxY.set((y / window.innerHeight - .5) * 9); }
    },
    onEnd: ({ velocity, width, cancelled }) => {
      const angularVelocity = -velocity / width * 92;
      settle(projectedSnap(angle.get(), angularVelocity, STEP, END, cancelled), cancelled ? 0 : angularVelocity);
      parallaxX.set(0); parallaxY.set(0);
    },
  });
  async function toggleTilt() {
    if (tilt === 'on') { orientationCleanup.current?.(); setTilt('off'); parallaxX.set(0); parallaxY.set(0); return; }
    try {
      if (typeof DeviceOrientationEvent === 'undefined') { setTilt('unavailable'); return; }
      const api = DeviceOrientationEvent as OrientationWithPermission;
      if (api.requestPermission && await api.requestPermission() !== 'granted') { setTilt('unavailable'); return; }
      const origin: { beta: number | null; gamma: number | null } = { beta: null, gamma: null };
      const handler = (event: DeviceOrientationEvent) => {
        if (!moving || document.hidden || event.beta === null || event.gamma === null) return;
        origin.beta ??= event.beta; origin.gamma ??= event.gamma;
        parallaxX.set(Math.max(-12, Math.min(12, (event.gamma - origin.gamma) * .5)));
        parallaxY.set(Math.max(-9, Math.min(9, (event.beta - origin.beta) * .3)));
      };
      window.addEventListener('deviceorientation', handler, { passive: true });
      orientationCleanup.current = () => window.removeEventListener('deviceorientation', handler);
      setTilt('on');
    } catch { setTilt('unavailable'); }
  }
  // Rebind the sensor when playback changes so its callback uses current state.
  useEffect(() => { if (!moving) { orientationCleanup.current?.(); orientationCleanup.current = null; setTilt(value => value === 'on' ? 'off' : value); } }, [moving]);

  return <section ref={root} className={`mobile-cloud-orbit ${moving ? '' : 'clouds-paused'}`} id="mobile-orbit" aria-label="Peeraphat's floating project orbit">
    <motion.div className="cloud-atmosphere" style={{ x: parallaxX, y: parallaxY }} aria-hidden="true">
      <div className="cloud-sky" /><div className="cloud-sunlight" /><div className="cloud-bank cloud-bank-far" /><div className="cloud-bank cloud-bank-middle" />
    </motion.div>
    <header className="cloud-header">
      <a href="#mobile-orbit" className="cloud-wordmark" aria-label="Peeraphat home">peeraphat<span>.link</span><i /></a>
      <div className="cloud-header-actions"><button onClick={() => setPaused(value => !value)} disabled={!!reduced} aria-label={reduced ? 'Reduced motion enabled' : paused ? 'Play cloud motion' : 'Pause cloud motion'} aria-pressed={paused || !!reduced}>{paused || reduced ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button><a href={`mailto:${EMAIL}`} aria-label="Email Peeraphat"><ArrowUpRight aria-hidden="true" /></a></div>
    </header>
    <div className="cloud-intro">
      <p><span className="cloud-intro-dot" />Peeraphat Noiyaem <span className="cloud-intro-location">Bangkok, TH</span></p>
      <h1>A little above<br/>the ordinary.</h1>
      <span className="cloud-chrome-orbit" aria-hidden="true"><i /><b /></span>
      <div className="cloud-intro-caption"><span>Ideas, made real.</span><span>{String(projects.length).padStart(2, '0')} projects in orbit</span></div>
    </div>
    <div className="cloud-wheel" id="mobile-projects" role="region" aria-roledescription="carousel" aria-label="Selected projects. Swipe horizontally or use previous and next. Scroll vertically to continue."
      tabIndex={0} {...gestures}
      onKeyDown={event => { if (event.target !== event.currentTarget) return; if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); settle(event.key === 'Home' ? 0 : event.key === 'End' ? END : (active + (event.key === 'ArrowRight' ? 1 : -1)) * STEP); } }}>
      <div className="cloud-orbit-guide" aria-hidden="true" />
      {projects.map((project, index) => <CloudCard key={project.id} project={project} index={index} active={active === index} angle={angle} onProject={onProject} />)}
    </div>
    <motion.div className="cloud-foreground" style={{ x: foregroundX }} aria-hidden="true"><div className="cloud-bank cloud-bank-near" /></motion.div>
    <div className="cloud-navigation">
      <div className="cloud-gesture"><span><MoveHorizontal aria-hidden="true" />Swipe for projects</span><a href="#work">Scroll down<ArrowDown aria-hidden="true" /></a></div>
      <div className="cloud-progress-panel">
        <button className="cloud-step" onClick={() => settle((active - 1) * STEP)} disabled={active === 0} aria-label="Previous project"><ArrowLeft aria-hidden="true" /></button>
        <div className="cloud-progress-copy"><div><span className="cloud-index" aria-hidden="true" key={active}>{String(active + 1).padStart(2, '0')}<span> / {String(projects.length).padStart(2, '0')}</span></span><span className="cloud-percentage"><span ref={percentage}>00</span>% explored</span></div><div ref={screenReaderProgress} className="cloud-progress-track" role="progressbar" aria-label="Project exploration" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} aria-valuetext={`0% explored, project 1 of ${projects.length}`}><motion.div style={{ scaleX: progress }} /></div></div>
        <button className="cloud-step" onClick={() => settle((active + 1) * STEP)} disabled={active === projects.length - 1} aria-label="Next project"><ArrowRight aria-hidden="true" /></button>
      </div>
      <div className="cloud-bottom"><a href="#work">All projects<ArrowDown aria-hidden="true" /></a><button onClick={toggleTilt} aria-pressed={tilt === 'on'} disabled={!!reduced || tilt === 'unavailable'}><Compass aria-hidden="true" />{tilt === 'on' ? 'Tilt on' : tilt === 'unavailable' ? 'Tilt unavailable' : 'Enable tilt'}</button><a href="#about">About me</a></div>
    </div>
    <span className="sr-only" role="status" aria-live="polite">Project {active + 1} of {projects.length}: {projects[active].name}</span>
  </section>;
}
