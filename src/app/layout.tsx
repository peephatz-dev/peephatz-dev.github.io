import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://peephatz-dev.github.io'),
  title: 'Peeraphat Noiyaem — Curious mind. Builder at heart.',
  description: 'Products, AI experiments, and community projects by Peeraphat Noiyaem. A first-year Digital Service Innovation student at KMUTT.',
  alternates: { canonical: '/' },
  openGraph: { title: 'peeraphat.link — Personal orbit', description: 'Ideas into things people use.', url: '/', images: [{ url: '/assets/orbit-fallback.webp', width: 1536, height: 1024 }] },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;550;600;650;700&family=Syne:wght@500;600;650;700;800&family=Noto+Sans+Thai:wght@400;500;600&display=swap" rel="stylesheet" />
    <meta name="theme-color" content="#e9f1ff" />
  </head><body>{children}</body></html>;
}
