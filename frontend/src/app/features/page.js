'use client';

import Link from 'next/link';
import {
  Sparkles,
  Scissors,
  Film,
  Share2,
  Zap,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sliders,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Multimodal AI Highlight Detection',
      desc: 'TM Cliper analyzes audio pitch and energy, visual motion vectors, speech semantics, and audience engagement signals to find the exact moments people rewatch.',
      icon: Sparkles,
      color: '#2563eb',
      bg: '#eff6ff'
    },
    {
      title: 'Smart 9:16 Vertical Reframing',
      desc: 'Automatically transforms horizontal 16:9 widescreen footage into mobile-native 9:16 vertical Shorts, keeping the subject centered with smart crop algorithms.',
      icon: Film,
      color: '#7c3aed',
      bg: '#f5f3ff'
    },
    {
      title: 'Guaranteed At Least 6 Viral Clips',
      desc: 'Never receive a single clip. For any video with sufficient footage, TM Cliper automatically delivers at least 6 non-overlapping, high-retention highlight candidates.',
      icon: Scissors,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      title: 'Direct YouTube Shorts Publishing',
      desc: 'Connect your YouTube channel using official Google OAuth. Set custom titles, descriptions, tags, and publish straight to YouTube Shorts with 1 click.',
      icon: Share2,
      color: '#dc2626',
      bg: '#fef2f2',
      isYt: true
    },
    {
      title: 'Auto Subtitles & Animated Captions',
      desc: 'Automatic transcription with high-accuracy speech-to-text models that generate punchy, color-highlighted subtitles optimized for viewer retention.',
      icon: Zap,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      title: 'Automated 3-Day Cloud Storage Lifecycle',
      desc: 'Configurable automated retention policy deletes raw footage and rendered media after 3 days to eliminate cloud storage costs while preserving your project history.',
      icon: HardDrive,
      color: '#0284c7',
      bg: '#f0f9ff'
    }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '4px 16px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1d4ed8',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px'
        }}>
          <Sparkles size={13} color="#2563eb" /> Powerful AI Video Engine
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '14px', lineHeight: '1.2' }}>
          Production-Ready Features for Modern Content Creators
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          Everything built into TM Cliper is engineered to turn hours of long video content into viral vertical clips with maximum efficiency.
        </p>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '20px',
                padding: '30px 26px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                background: f.bg, 
                border: `1px solid ${f.color}25`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {f.isYt ? <YouTubeLogo size={22} /> : <Icon size={22} color={f.color} />}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div style={{ 
        textAlign: 'center', 
        background: 'var(--bg-card)', 
        padding: '50px 32px', 
        borderRadius: '24px', 
        border: '1.5px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          Start Repurposing Your Videos Today
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '26px' }}>
          Create an account in 30 seconds and test with any YouTube link.
        </p>
        <Link
          href="/register"
          className="btn btn-primary"
          style={{ padding: '13px 34px', fontWeight: 700, borderRadius: '9999px', fontSize: '15px' }}
        >
          Create Free Account ➔
        </Link>
      </div>
    </div>
  );
}
