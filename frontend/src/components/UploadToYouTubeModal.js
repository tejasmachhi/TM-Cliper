'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Film,
  Lock,
  Globe,
  EyeOff
} from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';
import { api } from '@/utils/api';

export default function UploadToYouTubeModal({ clip, onClose, onSuccess }) {
  if (!clip) return null;

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [account, setAccount] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const [formData, setFormData] = useState({
    title: clip.title ? `${clip.title} #Shorts` : 'Viral Moment #Shorts',
    description: `Extracted from full-length footage with TM Cliper AI.\n\n#Shorts #viral #trending #video`,
    tags: 'shorts, viral, tmcliper, highlights',
    privacy_status: 'public'
  });

  useEffect(() => {
    api.getYouTubeStatus()
      .then(res => {
        if (res && res.connected && res.account) {
          setAccount(res.account);
          if (res.account.default_privacy) {
            setFormData(prev => ({
              ...prev,
              privacy_status: res.account.default_privacy,
              tags: res.account.default_tags || prev.tags
            }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStatus(false));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadClipToYouTube({
        clip_id: clip.id,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        privacy_status: formData.privacy_status
      });

      if (res && res.status === 'success') {
        setUploadResult(res);
        onSuccess && onSuccess(res);
      } else {
        throw new Error(res.detail || 'Upload failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload video to YouTube.');
    } finally {
      setUploading(false);
    }
  };

  const thumbUrl = api.getMediaUrl(clip.thumbnail_url || `/api/clips/${clip.id}/thumbnail`);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', width: '92%' }}>
        {/* Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <YouTubeLogo size={22} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Publish to YouTube Shorts
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Check / Connect Required */}
          {loadingStatus ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={22} className="spin" style={{ marginBottom: '8px' }} />
              <div>Checking YouTube connection...</div>
            </div>
          ) : !account ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <YouTubeLogo size={28} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                YouTube Account Not Connected
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
                You must connect your authorized YouTube channel first to upload clips directly.
              </p>
              <Link
                href="/settings?tab=accounts"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '9999px', padding: '9px 20px', background: '#FF0000', borderColor: '#FF0000' }}
                onClick={onClose}
              >
                Go to Connected Accounts →
              </Link>
            </div>
          ) : uploadResult ? (
            /* ================= SUCCESS STATE ================= */
            <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  Successfully Published!
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Your 9:16 vertical Short is now live on your connected channel: <strong>{account.channel_title}</strong>.
                </p>
              </div>

              <a
                href={uploadResult.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '10px 24px', borderRadius: '9999px', background: '#FF0000', borderColor: '#FF0000', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <YouTubeLogo size={16} />
                <span>View on YouTube Shorts</span>
                <ExternalLink size={14} />
              </a>

              <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ borderRadius: '9999px', marginTop: '6px' }}>
                Done
              </button>
            </div>
          ) : (
            /* ================= UPLOAD FORM ================= */
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Channel badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--pill-bg)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#22c55e" />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Target Channel:</span>
                  <strong style={{ color: '#FF0000' }}>{account.channel_title}</strong>
                </div>
                <span className="badge green" style={{ fontSize: '10px' }}>Ready</span>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Title input */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Video Title (Max 100 chars)</label>
                <input
                  type="text"
                  maxLength={100}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              {/* Privacy Setting */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Privacy Setting</label>
                <select
                  value={formData.privacy_status}
                  onChange={(e) => setFormData({ ...formData, privacy_status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  <option value="public">Public (Visible to everyone on Shorts feed)</option>
                  <option value="unlisted">Unlisted (Visible to anyone with the link)</option>
                  <option value="private">Private (Only visible to you)</option>
                </select>
              </div>

              {/* Description textarea */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '12px', resize: 'vertical' }}
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="shorts, viral, podcast, tmcliper"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary btn-sm" disabled={uploading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 22px', borderRadius: '9999px', background: '#FF0000', borderColor: '#FF0000', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      <span>Uploading to YouTube...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
