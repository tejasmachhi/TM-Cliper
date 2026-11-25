'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Film,
  FolderKanban,
  Clock,
  Zap,
  ArrowRight,
  Play,
  Plus,
  Activity,
  Share2,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import YouTubeLogo from '@/components/YouTubeLogo';
import '@/styles/dashboard.scss';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recordings_count: 0,
    clips_count: 0,
    pending_review: 0,
    uploaded_count: 0,
    storage_used_gb: 0.2,
    credits_remaining: 60,
    subscription_plan: 'FREE'
  });
  const [projects, setProjects] = useState([]);
  const [recentClips, setRecentClips] = useState([]);
  const [activePreviewClip, setActivePreviewClip] = useState(null);
  const [quickUrl, setQuickUrl] = useState('');

  const loadData = () => {
    api.getSystemStatus().then(res => {
      if (res && res.stats) setStats(res.stats);
    }).catch(() => { });

    api.getProjects().then(res => {
      if (res && res.projects) setProjects(res.projects.slice(0, 5));
    }).catch(() => { });

    api.getClips({ limit: 4 }).then(res => {
      if (res && res.clips) setRecentClips(res.clips);
    }).catch(() => { });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    router.push(`/create?url=${encodeURIComponent(quickUrl.trim())}`);
  };

  const displayName = user
    ? (user.name ? user.name.replace('ClipGenius', 'TM Cliper') : user.email)
    : 'Creator';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Banner */}
      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1.5px solid var(--border-color)', 
        borderRadius: '20px', 
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'var(--pill-bg)', 
            border: '1.5px solid var(--border-color)', 
            padding: '3px 12px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: 700, 
            color: 'var(--text-primary)', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px'
          }}>
            <Sparkles size={12} color="var(--text-primary)" /> TM Cliper Studio
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
            Welcome back, {displayName}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', margin: '6px 0 0' }}>
            Your AI workspace is ready. Paste any video to auto-extract viral vertical Shorts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/create" className="btn btn-primary" style={{ padding: '10px 22px', fontWeight: 700, borderRadius: '9999px' }}>
            <Plus size={16} /> Create New Clips
          </Link>
          <Link href="/integrations/youtube" className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: 600, borderRadius: '9999px', border: '1.5px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
            <YouTubeLogo size={14} /> YouTube Integration
          </Link>
        </div>
      </div>

      {/* Quick Action Input Bar */}
      <form 
        onSubmit={handleQuickCreate} 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px', 
          background: 'var(--bg-card)', 
          padding: '8px 10px 8px 18px', 
          borderRadius: '9999px', 
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <YouTubeLogo size={20} />
          <input 
            type="url"
            placeholder="Paste YouTube Video URL for instant AI processing (e.g. https://www.youtube.com/watch?v=...)"
            value={quickUrl}
            onChange={(e) => setQuickUrl(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)', 
              fontSize: '14px',
              outline: 'none',
              fontWeight: 500
            }}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary btn-sm" 
          style={{ padding: '9px 20px', fontWeight: 700, borderRadius: '9999px', flexShrink: 0 }}
        >
          <Sparkles size={14} /> Clip Video
        </button>
      </form>

      {/* 4 Metric Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <FolderKanban size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{stats.recordings_count}</div>
            <div className="stat-label">Videos Processed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(219, 39, 119, 0.12)', color: '#db2777' }}>
            <Film size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{stats.clips_count}</div>
            <div className="stat-label">Clips Generated</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}>
            <Sparkles size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: 'var(--text-primary)' }}>6+ Clips</div>
            <div className="stat-label">Per Video Guaranteed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#16a34a', fontSize: '20px' }}>100% Free</div>
            <div className="stat-label">Beta Unlimited Access</div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="dashboard-sections">
        {/* Left Column: Recent Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={18} color="#2563eb" />
                <span>Recent Projects & Processing Queue</span>
              </div>
              <Link href="/projects" className="btn btn-secondary btn-sm" style={{ borderRadius: '9999px' }}>
                View All Projects <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {projects.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No video projects yet</p>
                  <p style={{ fontSize: '13px', marginBottom: '14px' }}>Paste a YouTube URL above to generate your first clip batch.</p>
                  <Link href="/create" className="btn btn-primary btn-sm" style={{ borderRadius: '9999px' }}>
                    Create Clips
                  </Link>
                </div>
              ) : (
                <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table className="queue-table">
                    <thead>
                      <tr>
                        <th>Project / Title</th>
                        <th>Source</th>
                        <th>Stage & Progress</th>
                        <th>Clips</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Link href="/projects" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                              {p.project_name}
                            </Link>
                          </td>
                          <td><span className="badge cyan">{p.source_type.toUpperCase()}</span></td>
                          <td style={{ minWidth: '150px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              {p.current_stage || (p.status === 'completed' ? 'Extraction Complete' : 'Queued')}
                            </div>
                            <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${p.status === 'completed' ? 100 : (p.progress || 20)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #2563eb, #a855f7)'
                              }} />
                            </div>
                          </td>
                          <td><strong style={{ color: 'var(--text-primary)' }}>{p.clip_count}</strong></td>
                          <td>
                            {p.status === 'completed' ? (
                              <Link href="/clip-library" className="badge green" style={{ textDecoration: 'none' }}>
                                Ready ↗
                              </Link>
                            ) : (
                              <span className="badge amber">Processing</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent AI Highlights Showcase */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Film size={18} color="#db2777" />
                <span>Recent AI Highlights (9:16 Vertical)</span>
              </div>
              <Link href="/clip-library" className="btn btn-secondary btn-sm" style={{ borderRadius: '9999px' }}>
                Open Clip Library <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: '16px' }}>
              {recentClips.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No clips generated yet. Paste a video above to see instant results.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                  {recentClips.map(clip => {
                    const thumbUrl = clip.thumbnail_url?.startsWith('http')
                      ? clip.thumbnail_url
                      : `http://127.0.0.1:8000${clip.thumbnail_url || `/api/clips/${clip.id}/thumbnail`}`;

                    return (
                      <div 
                        key={clip.id} 
                        style={{ 
                          background: 'var(--bg-card)',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          border: '1.5px solid var(--border-color)',
                          boxShadow: 'var(--card-shadow)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActivePreviewClip(clip)}
                      >
                        <div style={{ position: 'relative', height: '120px', background: '#070b12', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={thumbUrl} 
                            alt={clip.title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                            <Play size={16} fill="#0f172a" color="#0f172a" style={{ marginLeft: '2px' }} />
                          </div>
                          <span className="badge green" style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 3, fontWeight: 800, fontSize: '10px' }}>
                            AI {clip.score || clip.engagement_score}%
                          </span>
                          <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', zIndex: 3 }}>
                            {clip.duration}s
                          </span>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {clip.title}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>{clip.category || 'Highlights'}</span>
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>Watch ↗</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Status & YouTube Channel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <YouTubeLogo size={16} />
                <span>YouTube Channel Status</span>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--pill-bg)', border: '1.5px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FF0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                  YT
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Official Shorts Channel</div>
                  <div style={{ fontSize: '11px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> Connected via Google OAuth
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '2', margin: 0 }}>
                Publish rendered 9:16 vertical clips directly to YouTube Shorts with custom titles, descriptions, and privacy controls.
              </p>

              <Link href="/integrations/youtube" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', borderRadius: '9999px', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)' }}>
                Configure Publishing Preferences
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={16} color="#2563eb" />
                <span>Why Creators Use TM Cliper</span>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Automatic 9:16 Smart Vertical Crop</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fills mobile screens with HD resolution tailored for TikTok, Shorts, and Reels.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>At Least 6 Highlights Guaranteed</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Extracts high-retention scenes from gaming, podcasts, interviews, and vlogs.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Explainable Engagement Scoring</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Multi-modal AI scores speech emotion, speaker dynamics, and visual energy.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>1-Click ZIP & Individual MP4s</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Download all your clips in one bundled ZIP archive or individually.</div>
                </div>
              </div>

              <Link href="/create" className="btn btn-primary btn-sm" style={{ justifyContent: 'center', marginTop: '6px', borderRadius: '9999px', padding: '10px' }}>
                <Sparkles size={14} /> Launch Clipper Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activePreviewClip && (
        <VideoPlayerModal
          clip={activePreviewClip}
          onClose={() => setActivePreviewClip(null)}
          onDelete={() => { }}
        />
      )}
    </div>
  );
}
