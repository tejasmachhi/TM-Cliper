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
  Zap,
  Video,
  Globe,
  Lock,
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

  // Format selection: 'shorts' or 'video'
  const [uploadType, setUploadType] = useState('shorts');

  const baseTitle = clip.title ? clip.title.replace(/#shorts/gi, '').trim() : 'Viral Highlight';

  const [formData, setFormData] = useState({
    title: `${baseTitle} #Shorts`,
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

  // When user switches format (Shorts vs Video), adjust title and description automatically
  const handleFormatChange = (type) => {
    setUploadType(type);
    if (type === 'shorts') {
      const clean = formData.title.replace(/#shorts/gi, '').trim();
      setFormData(prev => ({
        ...prev,
        title: `${clean} #Shorts`,
        description: prev.description.includes('#Shorts')
          ? prev.description
          : `${prev.description}\n\n#Shorts #viral`
      }));
    } else {
      const clean = formData.title.replace(/#shorts/gi, '').trim();
      setFormData(prev => ({
        ...prev,
        title: clean,
        description: prev.description.replace(/#shorts/gi, '').trim()
      }));
    }
  };

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
        privacy_status: formData.privacy_status,
        upload_type: uploadType
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
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '94%',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <YouTubeLogo size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Publish to YouTube
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loadingStatus ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={22} className="spin" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '13px' }}>Verifying YouTube channel connection...</div>
            </div>
          ) : !account ? (
            /* ================= NOT CONNECTED ================= */
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '1px solid rgba(255,0,0,0.2)' }}>
                <YouTubeLogo size={26} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                No Connected YouTube Channel
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: '1.5' }}>
                You must connect your authorized YouTube channel before publishing clips.
              </p>
              <Link
                href="/settings?tab=accounts"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px', padding: '9px 20px', background: '#FF0000', borderColor: '#FF0000' }}
                onClick={onClose}
              >
                Connect YouTube Channel →
              </Link>
            </div>
          ) : uploadResult ? (
            /* ================= SUCCESS STATE ================= */
            <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <CheckCircle2 size={28} />
              </div>

              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  Successfully Published to YouTube!
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Published as a <strong>{uploadType === 'shorts' ? 'YouTube Short' : 'Standard Video'}</strong> to <strong>{account.channel_title}</strong>.
                </p>
              </div>

              <a
                href={uploadResult.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '9px 22px', borderRadius: '8px', background: '#FF0000', borderColor: '#FF0000', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <YouTubeLogo size={15} />
                <span>{uploadType === 'shorts' ? 'View on YouTube Shorts' : 'Watch on YouTube'}</span>
                <ExternalLink size={13} />
              </a>

              <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px', marginTop: '4px' }}>
                Done
              </button>
            </div>
          ) : (
            /* ================= UPLOAD FORM ================= */
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Target Channel Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--pill-bg)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#22c55e" />
                  <span style={{ color: 'var(--text-secondary)' }}>Target Channel:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{account.channel_title}</strong>
                </div>
                <span className="badge green" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px' }}>Ready</span>
              </div>

              {/* Clip Thumbnail Preview Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)'
              }}>
                <img
                  src={thumbUrl}
                  alt={clip.title}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, background: '#000' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {clip.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <span>{clip.duration ? `${clip.duration}s` : '30s'}</span>
                    <span>•</span>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>AI Score {clip.score || clip.engagement_score || 90}%</span>
                  </div>
                </div>
              </div>

              {/* Upload Format Question: Shorts vs Regular Video */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>
                  Select Upload Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Option 1: YouTube Short */}
                  <div
                    onClick={() => handleFormatChange('shorts')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: uploadType === 'shorts' ? '1.5px solid #FF0000' : '1px solid var(--border-color)',
                      background: uploadType === 'shorts' ? 'rgba(255, 0, 0, 0.05)' : 'var(--bg-primary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Zap size={15} color={uploadType === 'shorts' ? '#FF0000' : 'var(--text-secondary)'} />
                      <strong style={{ fontSize: '13px', color: uploadType === 'shorts' ? '#FF0000' : 'var(--text-primary)' }}>
                        YouTube Short
                      </strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                      Vertical 9:16 format with #Shorts. Appears in the mobile Shorts feed.
                    </div>
                  </div>

                  {/* Option 2: Standard Video */}
                  <div
                    onClick={() => handleFormatChange('video')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: uploadType === 'video' ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                      background: uploadType === 'video' ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-primary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Video size={15} color={uploadType === 'video' ? '#2563eb' : 'var(--text-secondary)'} />
                      <strong style={{ fontSize: '13px', color: uploadType === 'video' ? '#2563eb' : 'var(--text-primary)' }}>
                        Standard Video
                      </strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                      Regular video upload. Appears in standard channel Videos tab.
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Title input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Video Title</label>
                <input
                  type="text"
                  maxLength={100}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Privacy Setting */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Privacy Setting</label>
                <select
                  value={formData.privacy_status}
                  onChange={(e) => setFormData({ ...formData, privacy_status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="public">Public (Visible to everyone)</option>
                  <option value="unlisted">Unlisted (Visible to anyone with the link)</option>
                  <option value="private">Private (Only visible to you)</option>
                </select>
              </div>

              {/* Description textarea */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  disabled={uploading}
                  style={{ borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: '#FF0000',
                    borderColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700
                  }}
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      <span>Uploading to YouTube...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>{uploadType === 'shorts' ? 'Publish Short' : 'Publish Video'}</span>
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
