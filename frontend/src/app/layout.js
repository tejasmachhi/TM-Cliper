import AppShell from '@/components/AppShell';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.scss';
import '@/styles/layout.scss';

export const metadata = {
  metadataBase: new URL('https://tmcliper.ai'),
  title: {
    default: 'TM Cliper — #1 AI Long Video to Viral Shorts Generator',
    template: '%s | TM Cliper'
  },
  description: 'Turn any YouTube video, podcast, gaming stream, interview or vlog into viral 9:16 vertical Shorts, TikToks, and Reels 10x faster with TM Cliper. ClipAnything AI moments detection, ReframeAnything object tracking, auto captions, and 1-click publishing.',
  keywords: [
    'TM Cliper',
    'TM AI Clipper',
    'AI video clipper',
    'OpusClip alternative',
    'ClipAnything',
    'ReframeAnything',
    'long video to shorts',
    'YouTube to TikTok generator',
    'viral clip creator',
    'podcast clipper AI',
    'gaming clips AI',
    'AI shorts editor',
    'automatic video repurposing',
    '9:16 vertical crop',
    'dynamic animated captions',
    'YouTube Shorts generator'
  ],
  authors: [{ name: 'TM Cliper Team', url: 'https://tmcliper.ai' }],
  creator: 'TM Cliper Technologies',
  publisher: 'TM Cliper',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tmcliper.ai',
  },
  openGraph: {
    title: 'TM Cliper — #1 AI Video Editor and Clipping Tool',
    description: 'Paste any video link or drop a file. TM Cliper automatically extracts the top viral highlights, reframes to 9:16 vertical format, adds dynamic animated subtitles, and generates 6+ ready-to-publish viral clips in seconds.',
    url: 'https://tmcliper.ai',
    siteName: 'TM Cliper',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TM Cliper — Turn Any Footage into Viral Brand Presence 10x Faster',
    description: 'Transform long YouTube videos and podcasts into high-performing vertical Shorts with TM Cliper AI.',
    creator: '@tmcliper',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
