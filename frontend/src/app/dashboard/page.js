'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Film,
  FolderKanban,
  ArrowRight,
  Play,
  Activity,
  CheckCircle2
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* 1. Clean, Unified Action Box */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: 'var(--card-shadow)'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.4px' }}>
          Turn Any Video Into Viral Shorts
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 auto 22px auto', maxWidth: '520px' }}>
          Paste a YouTube URL to automatically extract 6+ high-retention 9:16 vertical clips with animated captions.
        </p>

        <form
          onSubmit={handleQuickCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '640px',
            margin: '0 auto',
            background: 'var(--bg-primary)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '9999px',
            padding: '6px 6px 6px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <YouTubeLogo size={22} />
          <input
            type="url"
            placeholder="Paste YouTube video link (e.g. https://www.youtube.com/watch?v=...)"
            value={quickUrl}
            onChange={(e) => setQuickUrl(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              borderRadius: '9999px',
              padding: '10px 22px',
              fontWeight: 700,
              flexShrink: 0,
              fontSize: '14px'
            }}
          >
            <Sparkles size={15} /> Generate Clips
          </button>
        </form>
      </div>

      {/* 2. Compact Minimal Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(37, 99, 235, 0.1)',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FolderKanban size={18} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.recordings_count}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Videos Processed</div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(219, 39, 119, 0.1)',
            color: '#db2777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Film size={18} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.clips_count}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Clips Generated</div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(22, 163, 74, 0.1)',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>100% Free</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Unlimited Access</div>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Clean Projects Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Activity size={18} color="#2563eb" />
            <span>Recent Projects</span>
          </div>
          <Link href="/projects" className="btn btn-secondary btn-sm" style={{ borderRadius: '9999px' }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {projects.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No video projects yet</p>
              <p style={{ fontSize: '13px', margin: 0 }}>Paste a YouTube link above to generate clips.</p>
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Source</th>
                    <th>Stage & Progress</th>
                    <th>Clips</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link href="/projects" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {p.project_name}
                        </Link>
                      </td>
                      <td><span className="badge cyan">{p.source_type.toUpperCase()}</span></td>
                      <td style={{ minWidth: '160px' }}>
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

      {/* 4. Recent AI Clips Grid */}
      {recentClips.length > 0 && (
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {recentClips.map(clip => {
                const thumbUrl = clip.thumbnail_url?.startsWith('http')
                  ? clip.thumbnail_url
                  : `http://127.0.0.1:8000${clip.thumbnail_url || `/api/clips/${clip.id}/thumbnail`}`;

                return (
                  <div
                    key={clip.id}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--card-shadow)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActivePreviewClip(clip)}
                  >
                    <div style={{ position: 'relative', height: '130px', background: '#070b12', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img
                        src={thumbUrl}
                        alt={clip.title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <Play size={16} fill="#0f172a" color="#0f172a" style={{ marginLeft: '2px' }} />
                      </div>
                      <span className="badge green" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 3, fontWeight: 800, fontSize: '10px' }}>
                        AI {clip.score || clip.engagement_score}%
                      </span>
                      <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', zIndex: 3 }}>
                        {clip.duration}s
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {clip.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>{clip.category || 'Highlight'}</span>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>Watch ↗</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
