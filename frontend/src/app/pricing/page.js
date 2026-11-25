'use client';

import Link from 'next/link';
import { Check, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Community Creator',
      price: '$0',
      period: 'forever free',
      desc: 'Ideal for trying out AI clipping on your first long-form videos.',
      minutes: 'Unlimited processing during beta',
      clips: '6+ clips per video guaranteed',
      features: [
        '6+ clips per processed video',
        'Auto 9:16 vertical reframe',
        'Automatic karaoke subtitles',
        '720p HD exports',
        'Single MP4 downloads',
        'Community support'
      ],
      cta: 'Start Free Now',
      href: '/create',
      highlighted: false
    },
    {
      name: 'Pro Creator (Unlocked)',
      price: '$0',
      period: 'beta special ($0/mo)',
      desc: 'Designed for active YouTubers, streamers, podcasters & growth creators.',
      minutes: 'Unlimited minutes & projects',
      clips: 'All viral highlights extracted',
      features: [
        'At least 6 highlights guaranteed',
        '1080p Full HD vertical exports',
        'Direct YouTube Shorts publishing',
        'Bundled ZIP batch downloads',
        'High-speed AI processing',
        'Custom multi-modal scoring'
      ],
      cta: 'Launch Clipper Free',
      href: '/create',
      highlighted: true
    },
    {
      name: 'Studio & Agency',
      price: '$0',
      period: 'free beta preview',
      desc: 'High-volume production for multi-channel video creators.',
      minutes: 'Unlimited parallel exports',
      clips: 'Bulk highlight generation',
      features: [
        'Multi-speaker face tracking',
        'Multi-channel YouTube publishing',
        'Dynamic animated captions',
        'Auto 3-day storage cleanup',
        'Unlimited downloads',
        'Direct MP4 streaming'
      ],
      cta: 'Create Clips Free',
      href: '/create',
      highlighted: false
    }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '4px 16px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#065f46',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px'
        }}>
          <CheckCircle2 size={13} color="#16a34a" /> 100% Free During Beta
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '14px', lineHeight: '1.2' }}>
          All AI Features Unlocked & 100% Free
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
          No credit cards, no paywalls, and no subscription limits. Paste any long video to automatically generate viral vertical Shorts.
        </p>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {plans.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-card)',
              border: p.highlighted ? '2px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: p.highlighted ? '0 12px 35px -5px rgba(37, 99, 235, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
              border: p.highlighted ? '2px solid #2563eb' : '2px solid var(--border-color)'
            }}
          >
            {p.highlighted && (
              <div style={{
                position: 'absolute',
                top: '-13px',
                right: '24px',
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
              }}>
                100% Free Beta
              </div>
            )}

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              {p.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', minHeight: '36px' }}>
              {p.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
              <span style={{ fontSize: '42px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                $0
              </span>
              <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700 }}>
                / {p.period}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '14px 0', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginBottom: '2px' }}>
                {p.minutes}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                {p.clips}
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1, padding: 0 }}>
              {p.features.map((feat, fIdx) => (
                <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className={p.highlighted ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontWeight: 700,
                borderRadius: '9999px',
                fontSize: '14px',
                background: p.highlighted ? '#2563eb' : 'var(--bg-card)',
                color: p.highlighted ? '#ffffff' : 'var(--text-primary)',
                border: p.highlighted ? 'none' : '1.5px solid var(--border-color)'
              }}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
