import { EMAIL, LINKEDIN, projects } from './projects';

export type OrbitProjectDetail = {
  id: string;
  number: string;
  title: string;
  category: string;
  overview: string;
  image?: string;
  href?: string;
  hrefLabel?: string;
  problem?: string;
  contributions?: string[];
  features?: string[];
  stack?: string;
  metric?: string;
  related?: { title: string; description: string; href?: string }[];
  contactMethods?: { label: string; value: string; href: string }[];
};

export const orbitProjectDetails: OrbitProjectDetail[] = [
  {
    id: 'modhew',
    number: '01',
    title: 'MODHEW',
    category: 'Campus Food Delivery',
    overview: 'A campus food delivery service made for the hungry ones.',
    image: projects[0].image,
    href: projects[0].links[0][1],
    hrefLabel: 'Visit MODHEW',
    contributions: ['Built and launched the campus food delivery platform.', 'Iterated with users, riders, and real operational feedback.'],
    features: ['Ordering and payment workflows', 'LINE LIFF access', 'Rider workflows', 'Real-time service operations'],
    stack: projects[0].stack,
    metric: projects[0].metric,
  },
  {
    id: 'met',
    number: '02',
    title: 'MET Safety Day 2026',
    category: 'Event Technology',
    overview: 'A connected event experience for Mitsubishi Electric Safety Day.',
    image: projects[1].image,
    href: projects[1].links[0][1],
    hrefLabel: 'View event showcase',
    contributions: ['Planned and developed the event management platform in collaboration with Pakdee Organizer Co., Ltd.'],
    features: ['LINE LIFF authentication and check-ins', 'Activity tracking across 12 safety stations', 'Live dashboards and leaderboards', 'Reporting'],
    stack: projects[1].stack,
    metric: projects[1].metric,
  },
  {
    id: 'sam-hao',
    number: '03',
    title: 'Sam Hao',
    category: 'Community & Web Platform',
    overview: 'Digital experiences for the Sam Hao community, from a shared web portal to youth initiatives.',
    image: projects[3].image,
    href: projects[3].links[0][1],
    hrefLabel: 'Visit the community portal',
    contributions: ['Project Manager and Lead Developer for the Sam Hao Youth Community web portal.', 'Managed a regional youth initiative with partner organizations and community activities.'],
    features: ['Community web portal', 'Event operations support', 'Partner collaboration', 'Youth film and design initiatives'],
    stack: `${projects[3].stack} / ${projects[4].stack}`,
    metric: projects[4].metric,
    related: [
      { title: projects[3].name, description: projects[3].short, href: projects[3].links[0][1] },
      { title: projects[4].name, description: projects[4].short, href: projects[4].links[0][1] },
    ],
  },
  {
    id: 'github',
    number: '04',
    title: 'GitHub',
    category: 'Code & Experiments',
    overview: 'Explore my repositories, experiments, and open-source work.',
    href: 'https://github.com/peephatz-dev',
    hrefLabel: 'Open GitHub profile',
  },
  {
    id: 'contact',
    number: '05',
    title: 'Contact',
    category: "Let's Connect",
    overview: 'Get in touch or collaborate.',
    contactMethods: [
      { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
      { label: 'LinkedIn', value: 'Professional profile', href: LINKEDIN },
    ],
  },
];
