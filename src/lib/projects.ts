export type Category = 'product' | 'ai' | 'community';
export interface Project { id:string; category:Category; type:string; name:string; short:string; description:string; metric:string; stack:string; tags:string[]; links:[string,string][]; note:string; label:string; visual:string; image?:string; }

export const EMAIL = 'peeraphat.noiy@mail.kmutt.ac.th';
export const LINKEDIN = 'https://www.linkedin.com/in/peeraphat-noiyaem-68a03038b';
export const projects: Project[] = [
  {
    "id": "modhew",
    "category": "product",
    "type": "Live product",
    "name": "MODHEW",
    "short": "Campus food delivery, built at Bangmod. From a one-day first build to a service shaped by real users and riders.",
    "description": "Built and launched a campus food delivery platform at KMUTT Bangmod. The first usable version came together in approximately one day, followed by iterations with users, riders, and real operational feedback. The platform handles orders, rider workflows, payment processes, and real-time service operations.",
    "metric": "300+ users & 30 orders on launch day",
    "stack": "Next.js / Supabase / LINE LIFF",
    "tags": [
      "Full-stack development",
      "Campus startup",
      "Payment integration"
    ],
    "links": [
      [
        "Open live application",
        "https://modhew.vercel.app/"
      ],
      [
        "Read more on LinkedIn",
        "https://www.linkedin.com/in/peeraphat-noiyaem-68a03038b"
      ]
    ],
    "note": "Launch metrics are reported in my LinkedIn post.",
    "label": "Built for Bangmod",
    "visual": "modhew",
    "image": "/assets/modhew.webp"
  },
  {
    "id": "met",
    "category": "product",
    "type": "Event technology",
    "name": "MET Safety Day 2026",
    "short": "A connected event experience, from LINE check-ins to activity tracking, live leaderboards, and reporting.",
    "description": "Planned and developed an event management platform in collaboration with Pakdee Organizer Co., Ltd. It connects LINE LIFF authentication, real-time check-ins, activity tracking across 12 safety stations, live dashboards, leaderboards, and reporting.",
    "metric": "377 registered / 91.5% check-in rate",
    "stack": "LINE LIFF / Real-time analytics",
    "tags": [
      "12 safety stations",
      "Live dashboards",
      "Event operations"
    ],
    "links": [
      [
        "View event showcase",
        "https://lnkd.in/gdSatK6p"
      ],
      [
        "Open live application",
        "https://lnkd.in/g5ZWdnUX"
      ],
      [
        "Explore statistics dashboard",
        "https://lnkd.in/gGUHH4FJ"
      ]
    ],
    "note": "Participation figures are reported in my LinkedIn post. These links use LinkedIn short URLs.",
    "label": "Connected experiences",
    "visual": "met",
    "image": "/assets/met-logo.png"
  },
  {
    "id": "cake",
    "category": "ai",
    "type": "Competition prototype",
    "name": "S&P Crack The Cake",
    "short": "An AI-powered LINE Bot exploring a more playful loyalty experience. The idea: “365 cakes in one day.”",
    "description": "Created an AI-powered LINE Bot concept and working prototype for the S&P Crack The Cake competition. “I Will Eat 365 Cakes in One Day” explores turning a loyalty channel into an interactive celebration experience.",
    "metric": "AI × LINE / A working experiment",
    "stack": "AI agent / LINE chatbot",
    "tags": [
      "AI agent",
      "Working prototype",
      "Product concept"
    ],
    "links": [
      [
        "Try the working prototype",
        "https://lnkd.in/e6kx-w4C"
      ],
      [
        "Explore the project",
        "https://lnkd.in/eUUYhp5f"
      ]
    ],
    "note": "A competition prototype, not an S&P production service. These links use LinkedIn short URLs.",
    "label": "A sweeter interaction",
    "visual": "cake",
    "image": "/assets/sp-logo.png"
  },
  {
    "id": "portal",
    "category": "community",
    "type": "Community platform",
    "name": "Sam Hao Web Portal",
    "short": "A digital home for the Sam Hao Youth Community, built to support the people behind the events.",
    "description": "Served as Project Manager and Lead Developer for the Sam Hao Youth Community web portal. The platform was built to support community event operations and bring the initiative into a shared online space.",
    "metric": "Project Manager & Lead Developer",
    "stack": "Web development / Community",
    "tags": [
      "Web portal",
      "Project management",
      "Event operations"
    ],
    "links": [
      [
        "Visit the community portal",
        "https://lnkd.in/eyDCwuZ7"
      ]
    ],
    "note": "The portal link is reproduced as shared on LinkedIn.",
    "label": "Built for connection",
    "visual": "portal",
    "image": "/assets/sam-hao.webp"
  },
  {
    "id": "community",
    "category": "community",
    "type": "Social impact",
    "name": "Sam Hao Youth Community",
    "short": "Bringing young people and partners together through film, design, and a shared community initiative.",
    "description": "Managed a regional youth initiative with partner organizations and community activities. The project included 19 short-film contest teams and 15 design submissions. A subsequent Season 2 initiative involved sponsor onboarding and event execution.",
    "metric": "233 attendees / 200K+ digital views",
    "stack": "Project management / Social impact",
    "tags": [
      "Youth community",
      "Partner collaboration",
      "Season 2"
    ],
    "links": [
      [
        "Explore the project & event",
        "https://lnkd.in/e7aGFwbD"
      ]
    ],
    "note": "Attendance, submissions, and view counts are reported in my LinkedIn post.",
    "label": "People make it possible",
    "visual": "community",
    "image": "/assets/sam-hao.webp"
  },
  {
    "id": "superai",
    "category": "ai",
    "type": "Learning & participation",
    "name": "Super AI Engineer · S6",
    "short": "Learning by doing, through AI courses, workshops, and hands-on hackathon activities.",
    "description": "Participated in Super AI Engineer Season 6 through AI courses, workshops, and practical hackathon activities. A space to keep learning, experiment with ideas, and build hands-on experience in AI.",
    "metric": "Courses + workshops + hackathons",
    "stack": "AI learning / Hands-on experience",
    "tags": [
      "Season 6",
      "Workshops",
      "Hackathon participation"
    ],
    "links": [
      [
        "Read the public write-up on LinkedIn",
        "https://www.linkedin.com/in/peeraphat-noiyaem-68a03038b"
      ]
    ],
    "note": "This is a training and participation experience rather than a separately shipped software product.",
    "label": "Keep the curiosity going",
    "visual": "superai"
  },
  {
    "id": "powerguard",
    "category": "community",
    "type": "Interactive 3D prototype",
    "name": "Sala Hum PowerGuard",
    "short": "A 3D community scene exploring electricity, essential devices, and backup power for Ban Sala Hum.",
    "description": "An interactive community energy prototype for Ban Sala Hum, connecting homes, a pier, and fish cages with simulated electricity and equipment states. Explore the scene from resident, caretaker, and engineer perspectives, including power status, alerts, and backup-power scenarios.",
    "metric": "3D community explorer / Simulated energy scenarios",
    "stack": "3D visualization / Community energy",
    "tags": [
      "Ban Sala Hum",
      "3D exploration",
      "Simulated data"
    ],
    "links": [
      [
        "Explore the 3D community",
        "https://peephatz-dev.github.io/community-field-notes/energy-platform/community/"
      ]
    ],
    "note": "This is a prototype using simulated data. The community scene is illustrative, not a surveyed map or a live monitoring service.",
    "label": "Technology for everyday lives",
    "visual": "powerguard",
    "image": "/assets/powerguard-preview.png"
  }
];
