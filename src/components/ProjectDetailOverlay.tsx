'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { OrbitProjectDetail } from '@/lib/orbit-projects';

type ProjectDetailOverlayProps = {
  project: OrbitProjectDetail | null;
  onClose: (fromHistory?: boolean) => void;
};

export default function ProjectDetailOverlay({ project, onClose }: ProjectDetailOverlayProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButton.current?.focus(), 30);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('button, a[href]')).filter((item) => !item.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;
  return createPortal(
    <div className="project-reveal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panel} className="project-reveal" role="dialog" aria-modal="true" aria-labelledby="project-reveal-title" aria-describedby="project-reveal-overview">
        <button ref={closeButton} className="project-reveal-close" type="button" onClick={() => onClose()} aria-label="Close project details"><X aria-hidden="true" /></button>
        <div className="project-reveal-grid">
          <div className="project-reveal-visual">
            <span className="project-reveal-number">{project.number} / ORBIT</span>
            {project.image ? <img src={project.image} alt="" /> : <div className={`project-reveal-symbol project-reveal-symbol-${project.id}`} aria-hidden="true">{project.id === 'github' ? '</>' : project.id === 'contact' ? '@' : 'p'}</div>}
            <span className="project-reveal-orbit-line" aria-hidden="true" />
          </div>
          <div className="project-reveal-copy">
            <span className="project-reveal-category">{project.category}</span>
            <h2 id="project-reveal-title">{project.title}</h2>
            <p id="project-reveal-overview" className="project-reveal-overview">{project.overview}</p>
            {project.problem && <DetailSection title="The challenge"><p>{project.problem}</p></DetailSection>}
            {project.contributions && <DetailSection title="Contribution"><ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>}
            {project.features && <DetailSection title="Inside the experience"><ul>{project.features.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>}
            {project.stack && <DetailSection title="Stack"><p>{project.stack}</p></DetailSection>}
            {project.metric && <div className="project-reveal-metric"><span>Verified result</span><strong>{project.metric}</strong></div>}
            {project.related && <div className="project-reveal-related"><span className="project-reveal-section-label">Related work</span>{project.related.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.description}</p>{item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">Open verified link <ArrowUpRight aria-hidden="true" /></a>}</div>)}</div>}
            {project.contactMethods && <div className="project-reveal-contact">{project.contactMethods.map((method) => <a key={method.label} href={method.href} target={method.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"><span>{method.label}</span><strong>{method.value}</strong><ArrowUpRight aria-hidden="true" /></a>)}</div>}
          </div>
        </div>
        {project.href && <a className="project-reveal-cta" href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel ?? 'Visit project'}<ExternalLink aria-hidden="true" /></a>}
      </div>
    </div>,
    document.body,
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="project-reveal-section"><span className="project-reveal-section-label">{title}</span>{children}</section>;
}
