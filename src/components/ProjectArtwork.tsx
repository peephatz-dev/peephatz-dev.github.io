import Image from 'next/image';
import { Cpu, Linkedin, Mail, Sparkles } from 'lucide-react';

export default function ProjectArtwork({ id, hero = false }: { id: string; hero?: boolean }) {
  const artwork: Record<string, {src:string;alt:string}> = {
    modhew: { src: '/assets/modhew.webp', alt: 'MODHEW campus food delivery' },
    met: { src: '/assets/met-logo.png', alt: 'Mitsubishi Electric' },
    cake: { src: '/assets/sp-logo.png', alt: 'S&P' },
    portal: { src: '/assets/sam-hao.webp', alt: 'Sam Hao Youth Community' },
    community: { src: '/assets/sam-hao.webp', alt: 'Sam Hao Youth Community' },
    powerguard: { src: '/assets/powerguard-preview.png', alt: 'PowerGuard illustrated coastal community with houses, a pier, and fish cages' },
  };
  const asset = artwork[id];
  return <div className={`project-art art-${id} ${hero ? 'art-hero' : ''}`}>
    {asset ? <Image src={asset.src} alt={asset.alt} fill sizes={hero ? '(max-width: 700px) 45vw, 220px' : '(max-width: 700px) 90vw, 420px'} className="project-logo" loading={hero ? 'eager' : 'lazy'} /> : id === 'linkedin' ? <div className="linkedin-block"><Linkedin aria-hidden="true" /></div> : id === 'email' ? <div className="envelope-block"><Mail aria-hidden="true" /></div> : <div className="ai-chip"><Cpu aria-hidden="true" /><span>AI</span></div>}
    {!hero && <Sparkles className="art-spark" aria-hidden="true" />}
  </div>;
}
