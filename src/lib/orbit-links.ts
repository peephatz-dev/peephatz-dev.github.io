import { EMAIL, projects } from './projects';
export type OrbitLink = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: string;
  image?: string;
};
export const orbitLinks: OrbitLink[] = [
  { id: 'modhew', title: 'MODHEW', subtitle: 'Campus Food Delivery', description: 'Made for the hungry ones.', href: projects[0].links[0][1], icon: 'M', image: projects[0].image },
  { id: 'met', title: 'MET Safety Day 2026', subtitle: 'Event Technology', description: 'LINE LIFF check-in, real-time tracking, and dashboards.', href: projects[1].links[0][1], icon: 'M', image: projects[1].image },
  { id: 'sam-hao', title: 'Sam Hao', subtitle: 'Community & Web Platform', description: 'Digital experiences for the Sam Hao community.', href: projects[3].links[0][1], icon: 'S', image: projects[3].image },
  { id: 'github', title: 'GitHub', subtitle: 'Code & Experiments', description: 'Explore my repositories.', href: 'https://github.com/peephatz-dev', icon: 'github' },
  { id: 'contact', title: 'Contact', subtitle: "Let's Connect", description: 'Get in touch or collaborate.', href: `mailto:${EMAIL}`, icon: 'mail' },
];
