'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Film,
  Zap,
  Scissors,
  Share2,
  ShieldCheck,
  Clock,
  Layers,
  Video,
  Sliders,
  Tv,
  Check,
  TrendingUp,
  Award,
  MessageSquare,
  Calendar,
  ChevronRight,
  Star,
  Volume2,
  Maximize2,
  Cpu,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [activeModelTab, setActiveModelTab] = useState('clip');
  const [activePrompt, setActivePrompt] = useState('Moment most likely to go viral on social media');

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (isAuthenticated) {
      router.push(`/create?url=${encodeURIComponent(urlInput.trim())}`);
    } else {
      router.push(`/register?redirect=/create?url=${encodeURIComponent(urlInput.trim())}`);
    }
  };

  const handleAutoEditClick = () => {
    if (isAuthenticated) {
      router.push('/create');
    } else {
      router.push('/register?redirect=/create');
    }
  };

  const quickPrompts = [
    'Moment most likely to go viral on social media',
    'Funniest punchline or unexpected reaction',
    'Best tactical gaming play & clutch victory',
    'Key actionable lesson or interview insight'
  ];

  const pillFeatures = [
    { name: 'AI clipping', active: true },
    { name: 'AI captioning', active: false },
    { name: 'AI reframe (9:16)', active: false },
    { name: 'AI B-Roll', active: false },
    { name: 'AI audio enhance', active: false },
    { name: 'AI voice-over', active: false }
  ];

  const creators = [
    { name: 'Armchair Historian', subs: '2.2M', tag: 'Documentary', bg: '#e0e7ff', color: '#4338ca', initials: 'AH' },
    { name: 'SaaStr', subs: '54.4K', tag: 'Business', bg: '#fef3c7', color: '#b45309', initials: 'SS' },
    { name: 'Sebastien Jefferies', subs: '422K', tag: 'Tech & Lifestyle', bg: '#dcfce7', color: '#15803d', initials: 'SJ' },
    { name: 'FLAGRANT', subs: '2M', tag: 'Comedy & Podcast', bg: '#fee2e2', color: '#b91c1c', initials: 'FL' },
    { name: 'Mai Pham', subs: '3.3M', tag: 'Vlogs & Lifestyle', bg: '#f3e8ff', color: '#7e22ce', initials: 'MP' },
    { name: 'Valuetainment', subs: '5.3M', tag: 'Interviews & Growth', bg: '#ffedd5', color: '#c2410c', initials: 'VT' },
    { name: 'Jubilee Media', subs: '9.79M', tag: 'Social Experiments', bg: '#e0f2fe', color: '#0369a1', initials: 'JM' },
    { name: 'Tom Bilyeu', subs: '4.5M', tag: 'Mindset & Health', bg: '#f1f5f9', color: '#334155', initials: 'TB' }
  ];

  const brandLogos = [
    'iHeart MEDIA', 'VISA', 'Audacy', 'Univision', 'CHILI PIPER', 'Memphis Grizzlies', 'ZoomInfo', 'Telefónica', 'NVIDIA', 'GitHub'
  ];

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '90px', paddingBottom: '90px' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '60px 24px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Top Product Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.8px',
          color: '#475569',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          textTransform: 'uppercase'
        }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ff0000' }}></span>
          <span>#1 AI VIDEO EDITOR AND CLIPPING TOOL</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 64px)',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-1.8px',
          lineHeight: '1.12',
          maxWidth: '920px',
          margin: 0
        }}>
          Turn any footage into{' '}
          <span style={{
            display: 'inline-block',
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #cbd5e1',
            borderRadius: '9999px',
            padding: '2px 24px',
            color: '#0f172a',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            whiteSpace: 'nowrap'
          }}>
            brand presence
          </span>{' '}
          10x faster
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#475569',
          maxWidth: '720px',
          lineHeight: '1.6',
          margin: 0,
          fontWeight: 450
        }}>
          Paste a link or drop a raw take, and <strong>TM Cliper</strong> clips, edits, sizes and publishes them to all social platforms in one click.
        </p>

        {/* Rounded Input Capsule Box */}
        <form
          onSubmit={handleHeroSubmit}
          style={{
            width: '100%',
            maxWidth: '760px',
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '7px 8px 7px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            marginTop: '10px'
          }}
        >
          {/* Official YouTube Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <YouTubeLogo size={24} />
          </div>
          <input
            type="url"
            placeholder="Drop a video link or upload a file (e.g. https://www.youtube.com/watch?v=...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '15px',
              padding: '10px 4px',
              fontWeight: 500
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 26px',
              fontSize: '14px',
              fontWeight: 700,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
          >
            <span>Get free clips</span>
          </button>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, padding: '0 4px' }}>or</span>
          <button
            type="button"
            onClick={handleAutoEditClick}
            style={{
              padding: '11px 22px',
              fontSize: '14px',
              fontWeight: 600,
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
          >
            <span>Auto-edit</span>
          </button>
        </form>

        {/* Supported Social Platform Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
          <span>Ready for 1-click publishing:</span>
          <span style={{ color: '#ff0000', fontWeight: 700 }}>• YouTube Shorts</span>
          <span style={{ color: '#000000', fontWeight: 700 }}>• TikTok</span>
          <span style={{ color: '#e1306c', fontWeight: 700 }}>• Instagram Reels</span>
          <span style={{ color: '#0a66c2', fontWeight: 700 }}>• LinkedIn</span>
        </div>

        {/* Interactive Visual Transformation Frame */}
        <div style={{
          marginTop: '30px',
          width: '100%',
          maxWidth: '1040px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.07)',
          overflow: 'hidden'
        }}>
          {/* Mock Browser Header */}
          <div style={{
            height: '44px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: '8px'
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
            <div style={{ marginLeft: '12px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              TM Cliper Studio — Multi-Modal AI Engine (Universal Categorization)
            </div>
          </div>

          {/* Transformation Stage Visual */}
          <div style={{
            padding: '36px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Left: Original 16:9 Long Video */}
            <div style={{
              background: '#0f172a',
              borderRadius: '16px',
              padding: '16px',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>ORIGINAL FOOTAGE (16:9)</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>
                  1:40:35 Long Video
                </span>
              </div>

              {/* Video Mock Screen */}
              <div style={{
                height: '210px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Simulated subject bounding box */}
                <div style={{
                  position: 'absolute',
                  width: '100px',
                  height: '140px',
                  border: '2px dashed #38bdf8',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '4px'
                }}>
                  <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>
                    ACTIVE SPEAKER
                  </span>
                </div>

                <Tv size={36} color="#64748b" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Multi-Speaker Discussion / Stream</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Detecting vocal peaks, visual action & laughs...</span>
              </div>

              {/* Scanned Timeline */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                  <span>AI Highlight Scanner</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>6 Viral Moments Found</span>
                </div>
                <div style={{ height: '8px', background: '#334155', borderRadius: '9999px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: '15%', width: '12%', height: '100%', background: '#22c55e', borderRadius: '9999px' }}></div>
                  <div style={{ position: 'absolute', left: '38%', width: '15%', height: '100%', background: '#38bdf8', borderRadius: '9999px' }}></div>
                  <div style={{ position: 'absolute', left: '62%', width: '10%', height: '100%', background: '#f59e0b', borderRadius: '9999px' }}></div>
                  <div style={{ position: 'absolute', left: '80%', width: '14%', height: '100%', background: '#a855f7', borderRadius: '9999px' }}></div>
                </div>
              </div>
            </div>

            {/* Right: Rendered 9:16 Vertical Short */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '240px',
                height: '380px',
                background: '#0f172a',
                borderRadius: '28px',
                border: '4px solid #0f172a',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px 14px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Phone Top Speaker & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <span style={{ background: '#22c55e', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                    AI 98/100
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px' }}>
                    9:16 Auto-Crop
                  </span>
                </div>

                {/* Simulated Center Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <Play size={20} fill="#0f172a" color="#0f172a" style={{ marginLeft: '3px' }} />
                  </div>

                  {/* Dynamic Animated Subtitle Mockup */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    border: '2px solid #38bdf8',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      "THIS CHANGED EVERYTHING!"
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                      Karaoke auto-captions synchronized
                    </div>
                  </div>
                </div>

                {/* Phone Bottom Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ fontSize: '11px', color: '#ffffff', fontWeight: 700 }}>
                    Clip 01 • Peak Moment
                  </div>
                  <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600 }}>
                    1080x1920 HD
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Auto-Cut • Smart 9:16 Reframe • Animated Subtitles
                </span>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                  Guaranteed at least 6 distinct highlight clips ready for direct download.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PILL CAPABILITIES & SOCIAL PROOF (Reference Screenshot 2) */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%', textAlign: 'center' }}>
        {/* Capability Pill Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '50px' }}>
          {pillFeatures.map((pill, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: pill.active ? '#0f172a' : '#ffffff',
                color: pill.active ? '#ffffff' : '#475569',
                border: pill.active ? '1px solid #0f172a' : '1px solid #e2e8f0',
                boxShadow: pill.active ? '0 4px 12px rgba(15, 23, 42, 0.15)' : '0 2px 5px rgba(0,0,0,0.03)',
                cursor: 'pointer'
              }}
            >
              {pill.name}
            </div>
          ))}
        </div>

        {/* Social Proof Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            CREATOR ADOPTION
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Used by 20,000+ creators and leading media businesses
          </h2>
        </div>

        {/* Creator Avatars & Subscriber Counts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {creators.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '2px solid var(--border-color)',
                padding: '16px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: c.bg,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px'
              }}>
                {c.initials}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                {c.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ff0000', background: 'rgba(255,0,0,0.06)', padding: '2px 8px', borderRadius: '9999px' }}>
                {c.subs}
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logos Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          opacity: 0.75,
          padding: '16px 0',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {brandLogos.map((brand, bIdx) => (
            <span key={bIdx} style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 3. AI EDITING MODELS (Reference Screenshot 3: ClipAnything & ReframeAnything) */}
      <section id="models" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <Cpu size={14} color="#0f172a" />
            <span>AI EDITING MODELS</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', maxWidth: '700px', margin: '0 auto 10px' }}>
            AI that understands every pixel of creative flexibility
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '580px', margin: '0 auto' }}>
            Proprietary computer vision and multi-modal speech intelligence calibrated for all video types — not just static podcasts.
          </p>
        </div>

        {/* 2 Big Feature Cards: ClipAnything vs ReframeAnything */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>

          {/* Card 1: ClipAnything */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #e2e8f0',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Visual Demo Frame */}
            <div style={{
              background: '#f1f5f9',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Prompt-Guided Discovery
              </div>

              {/* Simulated Interactive Prompt Box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0f172a',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                marginBottom: '14px'
              }}>
                "{activePrompt}"
              </div>

              {/* Tag Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {quickPrompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setActivePrompt(p)}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: activePrompt === p ? '#0f172a' : '#ffffff',
                      color: activePrompt === p ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    {p.split(' ')[0]} {p.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Video Timeline Preview */}
              <div style={{
                height: '110px',
                background: '#0f172a',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '8px', left: '10px', background: '#22c55e', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  MATCH 98%
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <Play size={20} fill="#fff" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Identified High-Energy Climax</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                ClipAnything™
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Every other AI clipping tool only works with video podcasts. <strong>ClipAnything</strong> is the only AI clipping model that turns <em>any genre</em> — vlogs, gaming, sports, interviews, explainer videos — into viral clips in 1 click.
              </p>
            </div>
          </div>

          {/* Card 2: ReframeAnything */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #e2e8f0',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Visual Demo Frame */}
            <div style={{
              background: '#f1f5f9',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '235px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                {/* 16:9 Wide with multiple tracked subjects */}
                <div style={{
                  flex: '1 1 180px',
                  height: '130px',
                  background: '#0f172a',
                  borderRadius: '10px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #334155'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '45px',
                    height: '65px',
                    border: '2px solid #22c55e',
                    borderRadius: '4px',
                    left: '25%'
                  }}>
                    <span style={{ position: 'absolute', top: '-14px', left: 0, fontSize: '8px', color: '#22c55e', fontWeight: 800 }}>SPEAKER 1</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    width: '45px',
                    height: '65px',
                    border: '2px solid #38bdf8',
                    borderRadius: '4px',
                    right: '25%'
                  }}>
                    <span style={{ position: 'absolute', top: '-14px', left: 0, fontSize: '8px', color: '#38bdf8', fontWeight: 800 }}>SPEAKER 2</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>16:9 Wide Tracking</span>
                </div>

                <div style={{ fontSize: '18px', color: '#94a3b8' }}>➔</div>

                {/* 9:16 Cropped Subject */}
                <div style={{
                  flex: '0 0 95px',
                  height: '160px',
                  background: '#0f172a',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 800, fontSize: '12px' }}>
                    S1
                  </div>
                  <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: 800, marginTop: '8px' }}>9:16 CENTERED</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>Object Tracking</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                ReframeAnything™
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                The only AI reframe model that resizes any video for any platform and keeps moving subjects centered with AI object tracking. If you want more control, use manual tracking to instruct AI exactly what to follow.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WORKFLOW AUTOMATION (Reference Screenshot 4: Video Creation on Autopilot) */}
      <section id="workflow" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <Zap size={14} color="#f59e0b" />
            <span>WORKFLOW AUTOMATION</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', maxWidth: '700px', margin: '0 auto 10px' }}>
            Video creation on autopilot
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '580px', margin: '0 auto' }}>
            From raw input to multi-platform published clips in 3 friction-free steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

          {/* Step 1 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Auto Import
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '2', margin: 0 }}>
              Connect your YouTube channel, drop an authorized YouTube URL, or import high-bitrate MP4 and MOV files directly.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#22c55e', fontWeight: 600, marginTop: 'auto' }}>
              <CheckCircle2 size={16} /> Instant metadata & transcript sync
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI Auto-Editing
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '2', margin: 0 }}>
              TM Cliper trims silent pauses, generates at least 6 non-overlapping viral moments, tracks moving speakers, and renders animated karaoke subtitles.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#22c55e', fontWeight: 600, marginTop: 'auto' }}>
              <CheckCircle2 size={16} /> Multi-factor virality score 0-100
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Auto Scheduling
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '2', margin: 0 }}>
              Download individual MP4s, export all in a single ZIP, or publish straight to YouTube Shorts with optimized SEO titles and tags.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#22c55e', fontWeight: 600, marginTop: 'auto' }}>
              <CheckCircle2 size={16} /> Official Google OAuth integration
            </div>
          </div>

        </div>
      </section>

      {/* 5. CREATOR GROWTH METRICS & TESTIMONIALS (Reference Screenshot 5) */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        {/* Metric Cards Banner */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '2px solid #e2e8f0',
          padding: '40px 32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>10x</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Faster Production</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Save 50+ hours monthly</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#ff0000', letterSpacing: '-1px' }}>6+</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Guaranteed Clips</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Per processed long video</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>+320%</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Reach Expansion</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Across Shorts, Reels & TikTok</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#22c55e', letterSpacing: '-1px' }}>100%</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Automated AI Flow</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Reframe, captions & scores</div>
            </div>
          </div>
        </div>

        {/* Creator Testimonial Quotes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '12px' }}>
              <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
            </div>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }}>
              "TM Cliper replaced our entire freelance clipping queue. What used to take our editor 6 hours now happens in under 4 minutes. The 9:16 speaker tracking is uncanny."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                FL
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Flagrant Media Team</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>2M Subscribers • Comedy & Podcasts</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '12px' }}>
              <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
            </div>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }}>
              "Most clipping tools hallucinate or miss the punchline entirely when processing gaming footage. ClipAnything actually detected our clutches and victory screams accurately."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                GT
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Apex & GTA Creators Hub</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Gaming Network • 850K Followers</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '12px' }}>
              <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
            </div>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }}>
              "We republish our 2-hour founder interviews into 12 distinct TikToks every single week. Our impressions jumped 3x in the first month using TM Cliper."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                SS
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>SaaStr Media Network</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>B2B SaaS Community & Podcast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONTAINER */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%', textAlign: 'center' }}>
        <div style={{
          background: '#0f172a',
          borderRadius: '28px',
          padding: '60px 36px',
          color: '#ffffff',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 12px' }}>
            Ready to turn one video into a month of viral content?
          </h2>
          <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '580px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Try TM Cliper free. No credit card required. Ingest your first video and preview 6+ AI-crafted viral clips in seconds.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '14px 34px',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)'
              }}
            >
              <Sparkles size={16} />
              <span>Get started free (60 min included)</span>
            </Link>
            <Link
              href="/pricing"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '14px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '15px'
              }}
            >
              View pricing plans
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CLEAN LIGHT SAAS FOOTER (Reference Screenshot 6) */}
      <footer style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px 0',
        width: '100%',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        {/* Footer Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>

          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0f172a', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                TM
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                TM Cliper
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', maxWidth: '300px', margin: 0 }}>
              The #1 AI video editor and clipping platform. Turn long YouTube footage into viral presence across Shorts, TikTok, and Reels 10x faster.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <YouTubeLogo size={20} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Official YouTube API Partner Architecture</span>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
              Product
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#64748b' }}>
              <li><Link href="#models" style={{ hover: { color: '#0f172a' } }}>ClipAnything™</Link></li>
              <li><Link href="#models">ReframeAnything™</Link></li>
              <li><Link href="/create">AI Highlights Generator</Link></li>
              <li><Link href="/create">Dynamic Subtitles</Link></li>
              <li><Link href="/scheduled-uploads">YouTube Scheduler</Link></li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
              Solutions
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#64748b' }}>
              <li><Link href="/features">For Podcasters</Link></li>
              <li><Link href="/features">For Gaming Creators</Link></li>
              <li><Link href="/features">For Media Agencies</Link></li>
              <li><Link href="/features">For Educators & Tech</Link></li>
              <li><Link href="/pricing">Enterprise SaaS</Link></li>
            </ul>
          </div>

          {/* Resources & Legal Col */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
              Resources & Trust
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#64748b' }}>
              <li><Link href="/docs">User Documentation</Link></li>
              <li><Link href="/pricing">Pricing Plans</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/integrations/youtube">YouTube API Disclosure</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            © 2026 TM Cliper. All rights reserved. Built for professional content creators.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Compliant with YouTube Developer Policies</span>
            <span>•</span>
            <span>GDPR & SOC2 Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
