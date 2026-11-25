'use client';

import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Youtube,
  Layers,
  Sliders,
  Film,
  Download,
  FileArchive,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Zap
} from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
      {/* Documentation Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.12) 0%, rgba(157, 78, 221, 0.12) 100%)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        borderRadius: '16px',
        padding: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid #00e5ff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#00e5ff', marginBottom: '10px' }}>
            <BookOpen size={14} /> Official Documentation & User Guide
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            ClipGenius AI Official User Guide
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px', lineHeight: '1.6' }}>
            Learn how to turn any authorized long-form video or live stream into high-scoring, viral-ready clips in minutes.
          </p>
        </div>

        <Link href="/create" className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 700 }}>
          <Sparkles size={16} /> Open Clipper Wizard
        </Link>
      </div>

      {/* Section 1: Quick Start Guide */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Zap size={18} color="#00e5ff" />
            <span>1. Quick Start Workflow (5 Simple Steps)</span>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            {
              step: 'Step 1: Paste Video Link or Upload',
              desc: 'Go to Create Clips and paste any valid YouTube URL (Watch URLs, Live streams, VODs, or Shorts) or upload a local MP4/MKV recording.',
              badge: 'Input'
            },
            {
              step: 'Step 2: Verify Metadata & Authorization',
              desc: 'Inspect the live video title, channel, duration, views, and likes. Check the content rights authorization box to proceed.',
              badge: 'Verify'
            },
            {
              step: 'Step 3: Configure Output & Clip Targets',
              desc: 'Select how many clips you want (6, 8, 10, or 15 clips), output aspect ratio (9:16 vertical Shorts vs 16:9 landscape), and target length (15s - 60s).',
              badge: 'Configure'
            },
            {
              step: 'Step 4: Real-time AI Highlight Analysis',
              desc: 'The engine processes audio spikes, speech transcripts, sentence boundaries, and visual scene motion with live progress tracking.',
              badge: 'AI Engine'
            },
            {
              step: 'Step 5: Preview, Download MP4 or Export ZIP',
              desc: 'Watch instant video previews with visual image thumbnails, download individual MP4 clips, or download the full project package as a ZIP archive.',
              badge: 'Export'
            }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #00e5ff, #9d4edd)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.step}</h4>
                  <span className="badge cyan">{item.badge}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '2' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Explainable Engagement Scoring */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={18} color="#9d4edd" />
            <span>2. Explainable AI Engagement Scoring Formula (0–100)</span>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Unlike generic clippers that randomly slice video, TM AI Long Video Clipper calculates an explainable engagement score between 0 and 100 based on six empirical weighted signals:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#00e5ff', fontWeight: 700 }}>25% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Content Interest</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Detects climaxes, turning points, revelations, and story twists.</p>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#9d4edd', fontWeight: 700 }}>20% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Transcript Importance</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Identifies high-density statements, controversial takes, and epiphanies.</p>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>15% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Visual Activity</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Measures rapid scene changes, camera movement, and on-screen action.</p>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#ff3366', fontWeight: 700 }}>15% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Audio & Speech Intensity</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Detects shout spikes, laughing, gasps, and excited vocal inflection.</p>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>15% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Context Completeness</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Ensures clips never start or cut off mid-sentence.</p>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>10% WEIGHT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Audience Feedback</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Analyzes real comment timestamps, viewer quotes, and reaction points.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Supported Video Formats */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Film size={18} color="#22c55e" />
            <span>3. Supported Video Sources & Aspect Ratios</span>
          </div>
        </div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Supported Video Links
            </h4>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>YouTube Live Streams</strong>: <code>https://youtube.com/live/...</code></li>
              <li><strong>Standard Videos</strong>: <code>https://youtube.com/watch?v=...</code></li>
              <li><strong>Short Links</strong>: <code>https://youtu.be/...</code></li>
              <li><strong>YouTube Shorts</strong>: <code>https://youtube.com/shorts/...</code></li>
              <li><strong>Authorized Uploads</strong>: MP4, MKV, MOV, AVI files.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Export Formats
            </h4>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>9:16 Vertical Cropped (1080x1920)</strong>: Ideal for YouTube Shorts, Instagram Reels, and TikTok.</li>
              <li><strong>16:9 Landscape (1920x1080)</strong>: Ideal for standard video embeds, Twitter/X, and compilations.</li>
              <li><strong>H.264 + AAC Audio</strong>: Maximum browser compatibility with web-optimized faststart.</li>
              <li><strong>One-Click ZIP Export</strong>: All clips packaged into a single download.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 4: Modern Fancy UI & Dark/Light Mode */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sun size={18} color="#ffaa00" />
            <span>4. Fancy Glassmorphism & Theme Switching</span>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>
            TM AI Long Video Clipper features a custom design with glassmorphic cards, ambient glow borders, and real-time image previews for video clips.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 170, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun size={20} color="#ffaa00" />
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Dark / Light Mode Toggle:</strong>
              <div>Click the Sun/Moon button at the top-right header anytime to seamlessly switch between the dark studio theme and the crisp light theme. Your choice is automatically remembered.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
